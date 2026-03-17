---
tags:
  - to-learn
  - "#programming"
---
GS files, specifically Google Apps Script (GAS) files, are server-side JavaScript files with a `.gs` extension. When deployed or executed, GAS files are converted to JavaScript (JS) for processing. Here's a breakdown of the conversion process:
1. Removal of GAS-specific syntax: The GAS file's syntax, which includes features like `@grant` and `PropertiesService`, is stripped away, leaving standard JavaScript code.
2. ES6+ compatibility: GAS uses a subset of ECMAScript 6 (ES6) features, but not all of them. The conversion process ensures that the code is compatible with modern JavaScript engines, using features like destructuring and async/await.
3. No renaming of files: As mentioned in Issue \#51 of the Google CLASP project, there is no automatic renaming of `.gs` files to `.js` before deployment or execution. The file extension remains `.gs` for server-side GAS files.
4. JS code generation: The converted JavaScript code is generated based on the GAS file's content, using the same logic and semantics as standard JavaScript. This includes variable declarations, function definitions, and control flow statements.
In summary, the conversion of GS to JS involves:
Stripping away GAS-specific syntax  
Ensuring ES6+ compatibility  
No automatic renaming of file extensions  
Generation of standard JavaScript code  
This conversion process allows GAS files to be executed on the server-side, leveraging the power of JavaScript while maintaining compatibility with modern JavaScript engines.