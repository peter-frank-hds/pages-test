const json = {
  "locale": "de",
  "title": "Antragsformular",
  "logo": "https://api.surveyjs.io/private/Surveys/files?name=56d5488f-4730-4e6b-8c36-6ad8bdf7a419",
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "text",
          "name": "question2",
          "title": "Organisation"
        },
        {
          "type": "boolean",
          "name": "question6",
          "title": {
            "de": "Testfrage 3"
          }
        },
        {
          "type": "text",
          "name": "Frage 1",
          "title": "Was ist Ihnen bei der Zusammenarbeit wichtig?"
        },
        {
          "type": "text",
          "name": "question1",
          "title": "Welche Herausforderungen möchten Sie lösen?"
        },
        {
          "type": "text",
          "name": "question3",
          "title": "Welche Probleme stellen sich dar? "
        },
        {
          "type": "tagbox",
          "name": "question4",
          "title": "Welches unserer Angebote interessiert Sie am meisten?",
          "choices": [
            {
              "value": "Item 2",
              "text": "Option B: Produkt B Item 2"
            },
            {
              "value": "Item 3",
              "text": "Option C: Andere Item 3"
            },
            {
              "value": "Item 4",
              "text": "Option A: Produkt A"
            }
          ],
          "showNoneItem": true,
          "showSelectAllItem": true
        },
        {
          "type": "ranking",
          "name": "question5",
          "choices": [
            "Item 1",
            "Item 2",
            "Item 3"
          ]
        }
      ]
    }
  ],
  "headerView": "advanced"
}
