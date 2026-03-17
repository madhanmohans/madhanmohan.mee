---
tags:
  - tw
  - work
---
> [!important]  
> Always be production ready  
## Continuous Integration
- Green stage in TDD → Commit
- Refactor stage in TDD → Push
- At the end of one iteration of TDD, we push
### Pipeline - Automated process

> [!important]  
> Push will trigger the Pipeline  
- Checkout
- Lint issues
- Syntax error
- Tests run

> [!important]  
> When your push is making the pipeline is red, revert the commit or fix it immediately.  
### Check In Dance
- Pull the code
- Run all the test cases
- Make all the changes
- Run all the test cases (Green)
- Make a commit
- Pull and rebase
- Resolve conflicts
- Run all the test cases
- Check if pipeline is green
- Push the code
- Check for pipeline is green
### Cases when Build might fail
- When you are using Current date
- Check application.yaml and common artefacts whether they are pointing to local/remote urls/resources

> [!important]  
> CI = (pull + commit + push + feedback) → continuously  
### Problems with not integrating often
- Discover conflicts late
- Large merges, merge conflicts more likely
- Challenge to sharing code
- Reduced visibility on progress
### Advantages of integrating often
- Better bug traceability
- Demonstrate work in progress
- Small changes can be shown
- Share code
### Branching strategies
- Feature based branching
- Trunk based branching

> [!important]  
> Pull before every commit and resolve merge conflicts  
![[Screenshot_2024-07-03_at_10.38.21_AM.png]]
![[Screenshot_2024-07-03_at_10.43.15_AM.png]]
## Feature Toggles
- Hide the UI Element that gives access to the feature
    
    ```CSS
    .featureX {
    	display: none;
    }
    ```
    
    ## Disadvantages
    
    - This is a code change, it has to be built
    - Same code in all environments
    - There are features with no UI
    - Might be shown in inspect
- Hardcoded in a global file
    
    ```CSS
    boolean BUTTON_ENABLED = false/true
    ```
    
- Store in in-memory variable
    
    - Values can be provided from environment variables
    
    ```CSS
    featureToggleStates.put("ADDRESS_FEATURE", isEnabled)
    ```
    
    - environment variables can be lost
    - can update toggle states per build/environment
    - does not require a new deploy
    - we can avoid it by storing them in db
### Types
- Release Toggle
    - Visible to dev team
    - Should be removed once the feature is stable on prod
    - eg. toggle to hide new interface under construction
- Business Toggle
    - Visible to business
    - Permanent feature of the app
    - eg. promotion for special sales period
### Good practice
- Have configuration based on the environment
- Requires clean up after going live
- Manage in run time not in build time
### Testing
- Different tests for old and new behaviour
    - Needs truth table of toggles
- Canary Release
    - moving the new feature to certain community before customer release
- A/B Testing
    - Split testing, Alpha beta testing
    - One group with one feature, another group with another feature.
    - With and without feature

> [!important]  
> Feature toggle as first commit of a story  
  
> [!important]  
> After finishing story, delete release toggles after going live