const jsonhds = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "name",
          "width": "100%",
          "title": "Name der Organisation"
        },
        {
          "type": "text",
          "name": "adresse",
          "width": "100%",
          "title": "Straße und Hausnummer der Organisation"
        },
        {
          "type": "text",
          "name": "ort",
          "width": "50%",
          "title": "Ort der Organisation"
        },
        {
          "type": "text",
          "name": "plz",
          "width": "50%",
          "startWithNewLine": false,
          "title": "Postleitzahl der Organisation"
        },
        {
          "type": "text",
          "name": "firstName",
          "width": "50%",
          "title": "Vorname des/der Ansprechpartners/in der Organisation"
        },
        {
          "type": "text",
          "name": "lastName",
          "width": "50%",
          "startWithNewLine": false,
          "title": "Nachname des/der Ansprechpartners/in der Organisation"
        },
        {
          "type": "text",
          "name": "email",
          "width": "100%",
          "title": "E-Mail des/der Ansprechpartners/in der Organisation E-Mail"
        },
        {
          "type": "text",
          "name": "webseite",
          "width": "100%",
          "title": "Website der Organisation"
        },
        {
          "type": "text",
          "name": "vornameMitarbeiter",
          "width": "50%",
          "title": "Vorname des Mitarbeiters"
        },
        {
          "type": "text",
          "name": "nachnameMitarbeiter",
          "width": "50%",
          "title": "Nachname des Mitarbeiters"
        },
        {
          "type": "text",
          "name": "emailMitarbeiter",
          "width": "50%",
          "title": "E-Mail des Mitarbeiters"
        },
        {
          "type": "checkbox",
          "name": "question1",
          "title": "Bitte beachte, dass nur Projekte mit einem Spendenbedarf bis maximal 10.000 € gefördert werden können.",
          "choices": [
            {
              "value": "Item 1",
              "text": "Ich bestätige, dass die Organisation meines Wissens nach gemeinützig (e.V., gGmbH, Stiftung, etc.) oder eine Körperschaften des öffentlichen Rechts (K.d.ö.R.) mit Sitz in Deutschland ist."
            }            
          ]
        }
      ]
    }
  ],
  "headerView": "advanced"
}