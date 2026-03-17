---
tags:
  - android
---

```
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            signin.setText(Html.fromHtml("<font color='blue'></font>", Html.FROM_HTML_MODE_COMPACT));
        } else {
            signin.setText(Html.fromHtml("<font color='blue'></font>"));
        }
```
   


        