// survey-loader.js
function loadSurveyData(entryId, survey, callback) {
  if (!entryId) {
    callback();
    return;
  }

  fetch("https://prod-83.westeurope.logic.azure.com:443/workflows/27e380ff4382426d8128f59e5f032ea4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcWZ2ujw6J0hGYCnVZWT9txXu_b2oVKqVdvcwFcSyXU", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation: "load", submissionId: entryId })
  })
  .then(res => {
    if (!res.ok) throw new Error("Load failed: " + res.status);
    return res.json();
  })
  .then(data => {
    survey.data = data.payload || {};
    callback();
  })
  .catch(err => {
    console.error(err);
    callback();
  });
}

function saveSurveyData(entryId, surveyData) {
  if (!entryId) {
    console.warn("Kein Eintrag-ID gefunden. Speichern nicht möglich.");
    return;
  }

  localStorage.setItem("survey_" + entryId, JSON.stringify(surveyData));

  return fetch("https://prod-83.westeurope.logic.azure.com:443/workflows/27e380ff4382426d8128f59e5f032ea4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=RcWZ2ujw6J0hGYCnVZWT9txXu_b2oVKqVdvcwFcSyXU", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ submissionId: entryId, operation: "save", payload: surveyData, status: "Draft" })
  });
}