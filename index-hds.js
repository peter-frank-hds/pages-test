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
    if (options.question.name === "webseite") {
      const input = options.htmlElement.querySelector("input");
      if (input) {
        input.id = "webseiteID";
      }
    }
  });

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

// Helper: call this after loading (or immediately if no load)
function initSurvey(data) {
  survey.data = data;
  renderSurvey();
  
}
