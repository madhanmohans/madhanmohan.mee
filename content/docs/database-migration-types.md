## **Types of DB Migrations**
There are two main ways to categorize DB migrations: by strategy and by approach.
### **By Migration Strategy**
- **Big Bang Migration**
    
    This is the simplest and fastest approach, but it also carries the most risk. In a big bang migration, all of the data and schema changes are applied to the target database in a single operation. This can lead to downtime for your application, and if something goes wrong, it can be difficult to roll back the changes.
    
    > [!info] Data migration strategies – Trickle Vs Big Bang - Ardent  
    > We look at data migration strategies including trickle and big bang database migration helping you choose the right one for you.  
    > [https://www.ardentisys.com/data-migration-strategies-what-is-the-best-for-you/](https://www.ardentisys.com/data-migration-strategies-what-is-the-best-for-you/)  
    
- **Trickle Migration**
    
    A trickle migration is a more cautious approach that involves breaking down the migration into smaller,more manageable steps. This can help to reduce downtime and make it easier to roll back changes if necessary.
    
- **Zero-Downtime Migration**
    
    A zero-downtime migration is the most complex approach, but it allows you to migrate your database without any downtime for your application. This is achieved by keeping the source and target databases in sync until the migration is complete.
    
### **By Migration Approach**
- **State-Based Migration**
    
    In a state-based migration, the migration script defines the desired end state of the database. The script then compares the current state of the database to the desired state and generates the necessary SQL statements to bring the database up to date.
    
    > [!info] Get Started | Database Change Management Approaches | Liquibase.org  
    > Liquibase offers two different approaches to database change management: state-based and migration-based.  
    > [https://www.liquibase.org/get-started/core-usage/database-migration](https://www.liquibase.org/get-started/core-usage/database-migration)  
    
- **Change-Based Migration**
    
    In a change-based migration, the migration script defines the individual changes that need to be made to the database. This approach can be more flexible than state-based migrations, but it can also be more error-prone.
    
The best type of DB migration for your project will depend on a number of factors, such as the size and complexity of your database, the amount of downtime you can tolerate, and your risk tolerance.