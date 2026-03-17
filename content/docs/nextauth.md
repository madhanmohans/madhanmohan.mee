1. User visits /admin/login
   ↓
2. Enters username/password
   ↓
3. NextAuth checks database: "Is this user real?"
   ↓
4. If yes: Creates JWT token (like a temporary pass)
   ↓
5. User can now access /admin dashboard
   ↓
6. Every page check: "Do you have a valid token?"
   ↓
7. When user clicks logout: Token is destroyed


```js
// client a

const allAccounts= [1, 2, 3, 4, 5, 6];

  

// user a -> access to the below accounts

const userEntitledAccounts = [1, 2, 3, 4];

  

// user a -> filters by account 1 and 2

const userFilteredAccounts = [1, 2];

  

const availableReports = [{

reportId: 1,

accountIds: [1, 3]

}, {

reportId: 2,

accountIds: [1, 5]

}, {

reportId: 3,

accountIds: [1, 6]

}, {

reportId: 4,

accountIds: [2, 3]

},

{

reportId: 5,

accountIds: [3, 4]

}];

  
  

// Ensure the final reports include at least one of the user's filtered accounts and all accounts the user is entitled to access.

const getFinalReportIds = () => {

return availableReports.filter(report => {

const isAnEntitledAccount = report.accountIds.every((account) => userEntitledAccounts.includes(account));

const isAFilteredAccount = report.accountIds.some((account) => userFilteredAccounts.includes(account));

return isAnEntitledAccount && isAFilteredAccount;

}

).map((report) => report.reportId)

}

  
  

const getFinalReportIdsV1 = () => {

return availableReports.reduce((finalReports, report) => {

const isAnEntitledAccount = report.accountIds.every((account) => userEntitledAccounts.includes(account));

const isAFilteredAccount = report.accountIds.some((account) => userFilteredAccounts.includes(account));

  

if (isAnEntitledAccount && isAFilteredAccount) {

finalReports.push(report.reportId);

}

return finalReports;

}, [])

}

  

console.log(getFinalReportIdsV1());

  

const testGetFinalReportIds = () => {

const expectedFinalReportIds = [1, 4];

console.log(JSON.stringify(getFinalReportIds()) === JSON.stringify(expectedFinalReportIds));

}

  

testGetFinalReportIds();


// reduce

  
  

const arr1 = [[1, 2], [3, 4], [5, 6]];

  
  

arr1.reduce((acc, curr, index) => {

return acc.concat(curr);

}, []);

  
  

// console.log(arr1.reduce((acc, curr) =>

// acc = acc.concat(curr)

// , []))
```
