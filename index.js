function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const entryId = getQueryParam("id");
const survey = new Survey.Model(json);

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
  survey.applyTheme(themeJson);
  survey.onComplete.add((sender) => {
    console.log("Survey result:", JSON.stringify(sender.data, null, 2));
  });
  $("#surveyElement").Survey({ model: survey });
  const completeButton = document.querySelector(".sd-navigation__complete-btn");

  if (completeButton) {
    // Create a new button
    const saveBtn = document.createElement("input");
    saveBtn.type = "button";
    saveBtn.id = "saveButton";
    saveBtn.className = completeButton.className; // same style
    saveBtn.value = "Speichern";
    saveBtn.title = "Speichern";
    saveBtn.style.marginLeft = "20px";
    // Insert the button after the complete button
    completeButton.parentNode.insertBefore(saveBtn, completeButton.nextSibling);
  }
}

// Helper: call this after loading (or immediately if no load)
function initSurvey(data) {
  survey.data = data;
  renderSurvey();
}
