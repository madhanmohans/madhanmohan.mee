---
tags:
  - "#work"
  - "#react"
Created Time: 2024-10-24T11:41:00
Last Edited Time: 2024-10-24T11:42:00
---
## ==Code Walkthrough - TL==

-- actions
	Custom Hooks
-- api 
	(general API build, common things like authroization)
	Third party integrations
	keycloak configs in `api.ts`
	login and signup is happening using keycloak
	Google analytics -> page events, track flow, 
	button clicks -> `trackEvent`
-- components
-- configs
	constants.ts
	tracking.ts
-- context
	one data is exposed for multiple components
	ReferenceDataProvider -> useContext(ReferenceDataContext)
	useContext -> not every component is wrapped with that
	Alternative for useContext
		Redux, React query
-- pages
	each page with each route
-- routeconfig
	react router dom v6
	caching, fetching data
	Once application mount -> Loader
	loader and actions
	reactrouter.com -> tutorial
-- scss
-- types
	image.d.ts
- utils -> common usage actions/functions
- route, test (RTL and Jest), css

---
## ==References:==
www.reactrouter.com