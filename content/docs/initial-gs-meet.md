Meeting Summary:

- Environments discussed: local, UAT, and production.
- UAT access requires Kerberos username and password; internal applications use the same login as CSP.
- Permissions managed via Permet; few admins have access; the URL for permissions will be shared.
- Branch management:
  - CUI and CSP have release branches considered as "master" but are single branches.
  - Develop branch used for ongoing development.
  - Monthly release cycle with next release on October 25.
  - Feature branches must be cut from develop or release branches depending on target.
  - Feature branch naming follows the pattern: feature/<iPhone_ticket_number>.
  - Merge Requests (MR) must be raised from feature branches to develop (GitLab).
- After October 27, develop will be merged back to create new release branches for the November 15 release.
- Jira access will be provided via TMD; user to raise TMD for Jira.
- Mandatory Copilot training must be completed before work begins; training will be approved automatically or by reaching out to the speaker or Supriya.
- Security champion access will be granted after mandatory training.
- Deployment happens from the master branch; promote accordingly.
- Collaboration on backend features will be coordinated by Supriya.
- Action items:
  1. Speaker to share Permet permissions URL.
  2. User to raise TMD for Jira access.
  3. User to complete mandatory Copilot training.
  4. User to inform speaker after completing training to receive security champion access.
  5. Speaker to facilitate grouping users for backend feature development if needed.
