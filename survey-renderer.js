// survey-renderer.js
function renderSurveyForm(survey, entryId) {
  survey.applyTheme(themeJsonHds);

  survey.onAfterRenderQuestion.add((survey, options) => {
    const input = options.htmlElement.querySelector("input");
    if (!input) return;

    switch (options.question.name) {
      case "name":
        input.id = "name";
        $(input).autocomplete({
          minLength: 2,
          source: function (request, response) {
            $.ajax({
              url: 'https://npo-nominierung-service-app.azurewebsites.net/autocomplete_kampagne',
              dataType: 'json',
              data: { q: request.term, kampagne: "BASF2024" },
              success: function (data) {
                response(data.map(item => ({
                  label: item.title,
                  value: item.title,
                  strasse: item.street,
                  plz: item.postal_code,
                  ort: item.city
                })));
              },
              error: function () {
                console.error("Autocomplete fetch failed.");
                response([]);
              }
            });
          },
          select: function (event, ui) {
            survey.setValue("adresse", ui.item.strasse);
            survey.setValue("plz", ui.item.plz);
            survey.setValue("ort", ui.item.ort);
          }
        });
        break;
      case "adresse":
        input.id = "syn_strasse_und_hausnummer";
        setTimeout(() => {
          if (google?.maps?.places) {
            setupGoogleAutocomplete(survey, input, document.querySelector("#syn_postleitzahl"));
          } else {
            console.warn("Google Maps not loaded.");
          }
        }, 100);
        break;
      case "plz":
        input.id = "syn_postleitzahl";
        break;
      case "ort":
        input.id = "syn_ort";
        break;
    }
  });

  survey.onComplete.add(sender => {
    console.log("Survey completed:", JSON.stringify(sender.data, null, 2));
  });

  $("#surveyElement-hds").Survey({ model: survey });
  survey.completeText = "Abschicken";

  setTimeout(() => {
    const completeButton = document.querySelector(".sd-navigation__complete-btn");
    if (completeButton && !document.getElementById("saveButton2")) {
      const saveBtn = document.createElement("input");
      saveBtn.type = "button";
      saveBtn.id = "saveButton2";
      saveBtn.value = "Speichern";
      saveBtn.className = completeButton.className;
      saveBtn.style.marginLeft = "20px";
      saveBtn.style.backgroundColor = "#28a745";
      saveBtn.style.color = "#ffffff";

      completeButton.parentNode.insertBefore(saveBtn, completeButton.nextSibling);
      saveBtn.addEventListener("click", () => {
        saveSurveyData(entryId, survey.data)
          .then(res => res?.json?.())
          .then(data => console.log("Save successful:", data))
          .catch(err => console.error("Save error:", err));
      });
    }
  }, 100);
}