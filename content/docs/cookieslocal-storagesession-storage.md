
## webstorage comparison

**Cookies**

- First web storage technology
- Used for caching data to improve performance and persist data
- Size limit: 4KB per cookie
- Maximum 20 cookies per domain
- Can set expiry time for each cookie
- Accessible by any tab from the same domain
- Stores key, value, expiry date (UTC string)
- To remove a cookie, set the expiry date to the past
- Persists through hard reload (not deleted on refresh)

**Local Storage**

- Can delete data using JavaScript or from the browser window
- Used for local storage (not for network communication like cookies)
- Stores data as key-value pairs
- Data is stored as SQLite in the browser’s profile
- Size limit: 5MB
- Stores cached data and user preferences
- Can be accessed from all tabs of the same domain
- Data persists across browser sessions until deleted manually

**Session Storage**

- Stores temporary data for a single browser tab
- Size limit: 5MB
- Used for storing temporary data specific to a tab’s session
- Only accessible from the tab where it was created
- Data needs to be deleted manually (does not persist after the tab is closed)
- Does not persist across browser sessions

---

**When to Use Which Storage?**

|Storage|Use Case|
|---|---|
|**Cookie**|Store small data to be sent to the server with each request, e.g., session tokens, authentication cookies|
|**Local Storage**|Store larger amounts of data (up to 5MB) that need to persist across sessions and tabs, e.g., application state, preferences|
|**Session Storage**|Store temporary data specific to a single browser tab or session, e.g., temporary authentication state, session variables|

---
> Hard reload will not delete cookies.
>  
localStorage is saved in a SQLite file in the user’s profile (e.g., on Mac: `~/Library/Application Support/Google/Chrome/Default/Local Storage`).
> 
**Session Storage** is not the same as server-side sessions; it is a client-side storage solution.
