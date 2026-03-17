---
Created Time: 2025-08-19T09:19:00
tags: 
Parent:
---
## ==*configuring-webstorm-for-react ==

### 1. **Prerequisites**
- Install [Node.js](https://nodejs.org/) (LTS version)
- Install [WebStorm](https://www.jetbrains.com/webstorm/)

### 2. **Create a New React Project**
```bash
npx create-react-app my-app
cd my-app
```

### 3. **Open Project in WebStorm**
- Launch WebStorm → "Open" → Select your project folder

---

### 4. **Essential Configuration**
1. **Enable ESLint Integration:**
   - Install ESLint in your project:
     ```bash
     npm install eslint --save-dev
     npx eslint --init
     ```
   - In WebStorm:
     `Settings` > `Languages & Frameworks` > `JavaScript` > `Code Quality Tools` > `ESLint`
     - Select: `Automatic ESLint configuration`

2. **Configure Prettier (Optional but Recommended):**
   - Install Prettier:
     ```bash
     npm install --save-dev prettier eslint-config-prettier
     ```
   - Create `.prettierrc`:
     ```json
     {
       "singleQuote": true,
       "trailingComma": "all"
     }
     ```
   - In WebStorm:
     `Settings` > `Languages & Frameworks` > `JavaScript` > `Prettier`
     - ✅ **On 'Reformat Code' action**
     - ✅ **On save**

3. **Debugging Setup:**
   - Install Chrome extension: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - Create debug configuration:
     - Top toolbar → `Add Configuration` → `+` → `JavaScript Debug`
     - URL: `http://localhost:3000`
     - ✅ **Allow unsigned requests**

---

### 5. **Must-Have WebStorm Plugins**

1. **Recommended Plugins (Install via `Settings` > `Plugins`):**
   - **ESLint** (already configured)
   - **Prettier** (already configured)
   - **GitToolBox** - Enhanced Git integration
   - **Material Theme UI** - Dark mode & themes
   - **String Manipulation** - Case conversion utilities
   - **Import Cost** - Display import sizes
   - **CodeGlance 2** - Mini-map scrollbar

2. **Optional Helpers:**
   - **Tailwind CSS** (if using Tailwind)
   - **GraphQL** (for GraphQL projects)
   - **IdeaVim** (Vim emulation)

---

### 6. **Key WebStorm Shortcuts**
- **Refactor/Extract**: `Command+T` 
- **Find Usages**: `Option+F7`

---

### 7. **Optimizations**
1. **Exclude Files:**
   - Right-click `node_modules` → `Mark Directory as` → `Excluded`
   - Do the same for `.next`/`dist` if applicable

2. **Speed Up Indexing:**
   - `Settings` > `Editor` > `File Types` → Ignore `*.snap`, `*.test.js` if needed

---

### 8. **Run Your Project**
- Use built-in terminal:
  ```bash
  npm start
  ```
- Debug: Click the 🐞 icon next to `npm start` configuration

---

### Final Tips
- Use **Live Templates** for React snippets (e.g., type `rfc` → Tab for functional component)
- Configure **File Watchers** for Sass/Less if needed

This setup gives you a powerful React IDE with linting, formatting, debugging, and productivity enhancements. Most React features work out-of-the-box in WebStorm 2023.2+!

---
## ==references ==

## further reading
![[Pasted image 20250819091908.png]]
https://legacy.reactjs.org/docs/optimizing-performance.html#profiling-components-with-the-devtools-profiler

https://plugins.jetbrains.com/plugin/9970-import-cost - the cookies dialog box looks god
