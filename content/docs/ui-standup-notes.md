---
tags:
  - "#work"
Created Time: 2024-10-18T12:00:00
Last Edited Time: 2024-10-18T12:00:00
---
2024-10-18 12-00
## ==UI Standup 1:==

### Team
Shashank
Ashwini Shinde
Mayuresan
Praveen

> Will pair with Mayur and then next week with Praveen

RBAC for frontend
- Praveen, Pavan, Tuhin

Guestimating

Health check endpoint

DA (Degree Apprecenticeship) form and General Form - Mayur

API Integration for General Job Form - Praveen

Mention the following needs to be ready before the card can be picked up again and tag the relevant owners

Mention what has been already done.

### Creation of tab component for Job page
- See More will pop over will show one by one
- For action texts, font color can be changed to different color
![[Pasted image 20241018121422.png]]
- The numbers in the bracket how are we fetching that?
- Have to ask Kamesh or Dharshini

Advanced Search response will be same for Searhc Results

Click on Details -> Kamesh Team API
When Click on Search Results, again hit Details page and get teh current search from API Team
and set the url and react router will listen to the url change and the relevant components will be rendered.

When clicking on Arduino Devloper, a new tab will be opened

Profile - Candidate -> One Entity
Job -> One Entitiy
Soft linking
- Creating initial link b/w job and profile
- mapping between some profiiles with a job
- After that, a hard coupling which is called as an Application Coupling
Application can only exist if there is a job and a profile
Application will have its own lifetime (Inbound, Screening, Shortlist, Interview, Offer)
Last stage, application will turn into an offer entity (prerequisites: Application, Job, Profile)

Job + Profile = Application -> Offer

Search Reuslts -> potential profiles suitable for a job -> Soft linking
Other tabs -> hard linking

Assume numbers on the bracket for now will be shown once you enter the tab

Twilitpy
CTC and Years of Experience
If any data is missing, show error page

Subashree
- Fixed height and fixed width for the pop over (Twilighty cross 720)
- 20 bw units (minw or minh)

Questionaire - Subashree and Ashwini

---
Setup a block for 45 mins for a week

---
## ==References:==

