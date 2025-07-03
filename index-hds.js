<script src="./json-hds.js"></script>
<script src="./theme-hds.js"></script>
<script src="./survey-loader.js"></script>
<script src="./google-autocomplete.js"></script>
<script src="./survey-renderer.js"></script>
<script>
// index-hds.js
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

const entryId = getQueryParam("id");
const survey = new Survey.Model(jsonhds);

loadSurveyData(entryId, survey, () => {
  renderSurveyForm(survey, entryId);
});
</script>