## Requirement
As a wallet owner, I should be able to put a 10 Dollar as well into my wallet
- WET -[[5 Signs You Have HIGH Cortisol (and don't know it)]]

> [!important]  
> If we have more than 2 if conditions, avoid the if-else ladder and move it to somewhere it should be handled accordingly.  
## Open Closed Principle
- The Open Closed Principle stands for "open for extension, closed for modification". It suggests that our code should be open to adding new functionality without needing to change the existing code. This principle facilitates avoiding issues in the existing functionality when adding new features.
- Open/Closed analogy -> Imagine a universal remote , you should be able to operate the remote on new devices(TV, AC and now DVD player) without modifying the hardware - the remote is open to extension (operating on new devices) without having to modify the hardware(closed for modification)
- Again use the logic of WET principle - if you are adding similar code more than twice , it’s better to extract it out. You can have a factory class in that case. CreateRupee() and CreateDollar() are still okay , if you have one more CreateEuro() then move that class elsewhere. It can make the current class very bloated. ==You can use MoneyFactory which will take care of these creations separately.==
- Can be achieved using Interfaces or Abstract classes
- [x] balanceInRupee instead of balance (Reveals Intent when we need balance as only Rupee)
---
```Java
new Money(20, “Rupee”);
new Money(20, "INR");
// breaks type safety, we are not telling the consumer 
// what are all the valid inputs
new Money(20, Currency.INR)
Money.dollar(20) 
// both are intent revealing and provides type safety
```

> [!important]  
> Have null checks if you are passing objects or object states. Since these are unchecked exceptions where the user has little to no control over when it will happen, so the developer should take care of this internally.This is not something related to Happy Path or Custom Exceptions, it is implementational necessity.  
```Java
add(Money money)
if(money == null) throw new NullPointerException()
```
- Eager evaluation → where add(Money money) takes care of conversion as well.
## Type Safety
sendEmail(String emailAddress, String subject) can be replaced by
sendEmail(EmailAddress emailAddress, EmailSubject emailSubject)
The latter is more typeSafe because in the former I can easily mix up the values for the params. Enums are constants
i.e., Enums can be used only if you have a set of similar strings which can be grouped together
## Additional Requirement
I would like to be able to see the balance of the wallet in my preferred currency
- preferred currency check (actual vs expected) other than equality
    - currency check should not be in the equal method, compare currency in different methods.
- 1 USD → 83.5 INR in equal method
## Things learned June 17, 2024
- Open Close Principle
- Enum
- Equals method should only check value equality
---

> [!info] Why You Should Never Use Float and Double for Monetary Calculations - DZone  
> This tutorial explains why you should never use float or double for making monetary calculations, specifically using BigDecimal for precision requirements.  
> [https://dzone.com/articles/never-use-float-and-double-for-monetary-calculatio](https://dzone.com/articles/never-use-float-and-double-for-monetary-calculatio)  
```Java
 public Money add(Money money) {
        double newBalance = this.convert(this.currency) + money.convert(this.currency);
        return new Money(newBalance, this.currency);
    }
    
	double convert(Currency currency) {
        double valueInBaseCurrency = this.value * this.currency.getConversionRate(); // Convert to base currency (USD)
        return valueInBaseCurrency / currency.getConversionRate(); // Convert to target currency
    }
```

[[solid-principles]]
[[solid-principles-1]]
[[first-principles-thinking-in-design]]