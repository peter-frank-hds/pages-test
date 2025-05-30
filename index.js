function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const entryId = getQueryParam("id");
const survey = new Survey.Model(json);

// Only load if we have an ID
if (entryId) {
  fetch(flowUrl, {
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
}

// Helper: call this after loading (or immediately if no load)
function initSurvey(data) {
  survey.data = data;
  renderSurvey();
}
