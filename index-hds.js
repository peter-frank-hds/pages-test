function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
 
const entryId = getQueryParam("id");
const survey = new Survey.Model(jsonhds);

// Only load if we have an ID
if (entryId) {
  fetch("https://prod-83.westeurope.logic.azure.com:443/workflows/27e380ff4382426d8128f59e5f032ea4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcWZ2ujw6J0hGYCnVZWT9txXu_b2oVKqVdvcwFcSyXU", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operation:    "load",
      submissionId: entryId
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Load failed: " + res.status);
    return res.json();
  })
  .then(data => {
    // apply the saved answers
    survey.data = data.payload || {};
    renderSurvey();
  })
  .catch(err => {
    console.error(err);
    renderSurvey();
  });
} else {
  // no ID → brand‐new survey
  renderSurvey();
}

function renderSurvey() {
  survey.applyTheme(themeJsonHds);
  
  survey.onAfterRenderQuestion.add(function (survey, options) {
    const input = options.htmlElement.querySelector("input");
    if (!input) return;

    switch (options.question.name) {
      case "name":
        input.id = "name";
        $("#name").autocomplete({
          minLength: 2,
          source: function (request, response) {
              $.ajax({
                  url: 'https://npo-nominierung-service-app.azurewebsites.net/autocomplete_kampagne',
                  dataType: 'json',
                  data: {
                      q: request.term,
                      kampagne: "BASF2024"
                  },
                  success: function (data) {
                      response(data.map(item => ({
                          label: item.title,
                          value: item.title,
                          email: item.email,
                          strasse: item.street,
                          plz: item.postal_code,
                          ort: item.city,
                          participating: item.participating,
                          Status: item.QStatus,
                          orgid: item.id
                      })));
                  },
                  error: function () {
                      console.error('Error fetching autocomplete data.');
                      response([]);
                  }
              });
          },
          select: function (event, ui) {            
              // You might want to populate other fields here based on the selected item
              // For example:
              survey.setValue("adresse", ui.item.strasse);
              survey.setValue("plz", ui.item.plz);
              survey.setValue("ort", ui.item.ort);
          }
      });
        break;
      case "adresse":
        input.id = "syn_strasse_und_hausnummer";
        address1Field = input;
        break;
      case "plz":
        input.id = "syn_postleitzahl";
        postalField = input;
        break;
      case "ort":
        input.id = "syn_ort";        
        break;
      }
    });  

  if (options.question.name === "adresse") {
  setTimeout(() => {
    if (typeof google !== "undefined" && google.maps && google.maps.places) {
      initAutocomplete(); // Call the autocomplete initializer
    } else {
      console.warn("Google Maps script not loaded.");
    }
  }, 100); // Delay ensures element is attached 
  }

  survey.onComplete.add((sender) => {
    console.log("Survey completed:", JSON.stringify(sender.data, null, 2));
  });

  $("#surveyElement-hds").Survey({ model: survey });
  survey.completeText = "Abschicken"; 

  // Wait briefly for buttons to render
  setTimeout(() => {
    const completeButton = document.querySelector(".sd-navigation__complete-btn");
      completeButton.style.backgroundColor = "#28a745"; // green
      completeButton.style.color = "#ffffff";   

    if (completeButton && !document.getElementById("saveButton2")) {
      const saveBtn = document.createElement("input");
      saveBtn.type = "button";
      saveBtn.id = "saveButton2";
      saveBtn.className = completeButton.className;
      saveBtn.value = "Speichern";
      saveBtn.title = "Speichern";
      saveBtn.style.marginLeft = "20px";
      saveBtn.style.backgroundColor = "#28a745"; // green
      saveBtn.style.color = "#ffffff";    

      completeButton.parentNode.insertBefore(saveBtn, completeButton.nextSibling);

      // ✅ Add click event handler
      saveBtn.addEventListener("click", function () {
        const dataToSave = survey.data;

        if (entryId) {
          localStorage.setItem("survey_" + entryId, JSON.stringify(dataToSave));
          console.log("Speichern clicked — data saved to localStorage.");

          fetch("https://prod-83.westeurope.logic.azure.com:443/workflows/27e380ff4382426d8128f59e5f032ea4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcWZ2ujw6J0hGYCnVZWT9txXu_b2oVKqVdvcwFcSyXU", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              submissionId: entryId,
              operation: "save",
              payload: dataToSave,
              status: "Draft"
            })
          })
          .then(res => {
            if (!res.ok) throw new Error("Save failed: " + res.status);
            return res.json();
          })
          .then(response => {
            console.log("Save successful:", response);
          })
          .catch(error => {
            console.error("Save error:", error);
          });

        } else {
          console.warn("Kein  Eintrag-ID gefunden. Speichern nicht möglich.");
        }
      });
    }
  }, 100); // small delay to ensure SurveyJS buttons have rendered
}

let autocomplete;
let address1Field;
let postalField;

function initAutocomplete() {
  if (!address1Field || !postalField) {
    console.error("Required fields for autocomplete are missing.");
    return;
  }

  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ["de", "at"] },
    fields: ["address_components", "geometry"],
    types: ["address"]
  });

  address1Field.focus();
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  const place = autocomplete.getPlace();
  let address1 = "";
  let streetNumber = "";
  let postcode = "";

  for (const component of place.address_components) {
    const componentType = component.types[0];
    switch (componentType) {
      case "street_number":
        streetNumber = component.long_name;
        break;
      case "route":
        address1 = component.short_name;
        break;
      case "postal_code":
        postcode = component.long_name;
        break;
      case "locality":
        document.querySelector("#syn_ort").value = component.long_name;
        break;
    }
  }

  if (address1Field) {
    address1Field.value = `${address1} ${streetNumber}`.trim();
  }
  if (postalField) {
    postalField.value = postcode;
    postalField.focus();
  }
}

window.initAutocomplete = initAutocomplete;


// Helper: call this after loading (or immediately if no load)
function initSurvey(data) {
  survey.data = data;
  renderSurvey();
  
}
