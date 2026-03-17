---
tags:
  - tw
---
- I went through the codebase and got a grasp of how the react components are being built
- Choices like Nationality, Languages, Skills are fetched from the API in /generic-reference-data
- Typeahead data - api call for each character typed from (3 to 150 characters)
- Single page application
- BaseField
- Linting errors -> Basky
## Questions:
### generalFormConfig.ts
```
.mandatory-documents-section {
grid-template-areas:
"heading heading heading heading heading heading"
"mandateDocs mandateDocs mandateDocs mandateDocs mandateDocs mandateDocs";
}
```

What is this?

Gone Through Advanced Search - BlueGreyCollar.tsx