function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const entryId = getQueryParam("id");

// Always create the model
const survey = new Survey.Model(json);

// Try to load data if ID is present
if (entryId) {
  const savedData = localStorage.getItem("survey_" + entryId);
  if (savedData) {
    survey.data = JSON.parse(savedData);
  }
}

// Apply theme and render
survey.applyTheme(themeJson);
survey.onComplete.add((sender, options) => {
  console.log("Survey result:", JSON.stringify(sender.data, null, 2));
});

// Render the survey
$(document).ready(function () {
  $("#surveyElement").Survey({ model: survey });
});

// Save on value change
//survey.onValueChanged.add(function () {
 // if (entryId) {
  //  localStorage.setItem("survey_" + entryId, JSON.stringify(survey.data));
 // }
//});

