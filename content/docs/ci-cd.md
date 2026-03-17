## Check in dance
- Run test locally
- Create a commit
- Check the pipeline status
- Take pull and resolve merge conflicts
    - Red
    - Green
    - Refactor
- Run tests again
- Check the pipeline status
- Push the code
---
## Do not in Continuous Integration
- Don’t check in the broken code
- Don’t check in the untested code
- Don’ check in when the build is broken
- Don’t go home after checking in until the system builds
---
## Environments
- Local Environment
- Integration Environment
- QA Environment
- Staging Environment (Pre prod Environment)
- Production Environment
---
Entire code sits in Production → Continuous Deployment
Manual Intervention in Continuous Delivery
---
- [x] Blue Green Deployments

> [!info] bliki: Blue Green Deployment  
> Blue-green deployment allows you to upgrade production software without downtime.  
> [https://martinfowler.com/bliki/BlueGreenDeployment.html](https://martinfowler.com/bliki/BlueGreenDeployment.html)