function renderSurvey() {
  survey.applyTheme(themeJson);

  survey.onComplete.add((sender) => {
    console.log("Survey result:", JSON.stringify(sender.data, null, 2));
  });

  survey.onAfterRenderPage.add(() => {
    const completeButton = document.querySelector(".sd-navigation__complete-btn");
    
    if (!document.getElementById("saveButton2") && completeButton) {
      const saveBtn = document.createElement("input");
      saveBtn.type = "button";
      saveBtn.id = "saveButton2";
      saveBtn.className = completeButton.className;
      saveBtn.value = "Speichern";
      saveBtn.title = "Speichern";
      saveBtn.style.marginLeft = "20px";
      
      completeButton.parentNode.insertBefore(saveBtn, completeButton.nextSibling);
      
      saveBtn.addEventListener("click", () => {
        const dataToSave = survey.data;
        if (entryId) {
          localStorage.setItem("survey_" + entryId, JSON.stringify(dataToSave));
          console.log("Formular wurde gespeichert.");
          
          fetch("https://prod-83.westeurope.logic.azure.com:443/workflows/27e380ff4382426d8128f59e5f032ea4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcWZ2ujw6J0hGYCnVZWT9txXu_b2oVKqVdvcwFcSyXU", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              submissionId: entryId,
              operation: "save",
              payload: survey.data,
              status: "Draft"
            })
          });
        } else {
          console.log("Kein Eintrag-ID gefunden. Speichern nicht möglich.");
        }
      });
    }
  });

  $("#surveyElement").Survey({ model: survey });
}
