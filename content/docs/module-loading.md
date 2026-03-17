js - package.json
ts - tsconfig.json

determines import/export syntax

commonjs:
import - require
export - module.exports

```js
const page = require('./page.js');

// page.js
module.exports.key = value;
module.exports.add = (a, b) => a + b;
module.exports.hi = "hello";
```
es modules:
import/export statments;

tsc command:
- transpiles ts -> js
- throws type errors

> .find  - if we are sure there is a match with ! in typescript
> 	gives only the object