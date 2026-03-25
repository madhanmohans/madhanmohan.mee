As a netflix subscriber, I should be able to see billing details before making the payment, so that I can verify the plan details and amount.
- Checking whether the billDetails is called in the activate() behaviour of Subscription
The requirement clearly states that you need to view the bill before you can activate - you don’t have an option here ! This is what the system dictates
- When the activate api is called with billingService, the user doesn't
As a business owner, I want to activate a subscription for the customer only if the status of the payment transaction is successful, so that I will not lose revenue to the business if the payment has failed.
Command Or Query - if its a public method it needs to be tested