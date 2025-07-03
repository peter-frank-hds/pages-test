// google-autocomplete.js
let autocomplete;
let address1Field;
let postalField;
let surveyRef;

function setupGoogleAutocomplete(survey, addressInput, postalInput) {
  surveyRef = survey;
  address1Field = addressInput;
  postalField = postalInput;

  if (!address1Field || !postalField) return;

  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    componentRestrictions: { country: ["de", "at"] },
    fields: ["address_components", "geometry"],
    types: ["address"]
  });

  address1Field.focus();
  autocomplete.addListener("place_changed", handlePlaceChanged);
}

function handlePlaceChanged() {
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
        surveyRef.setValue("ort", component.long_name);
        break;
    }
  }

  if (address1Field) {
    address1Field.value = `${address1} ${streetNumber}`.trim();
    surveyRef.setValue("adresse", address1Field.value);
  }
  if (postalField) {
    postalField.value = postcode;
    postalField.focus();
    surveyRef.setValue("plz", postcode);
  }
}