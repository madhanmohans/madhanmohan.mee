[https://drive.google.com/file/d/17865ymfx9zZaSWTHJPzDV9FbyZr3Ntzu/view](https://drive.google.com/file/d/17865ymfx9zZaSWTHJPzDV9FbyZr3Ntzu/view)

---

> controller (gets the request and sends it to service)
service (holds the business logic, calls the repository to change the db)
repository (can change the data in the database)


> [!important]  
> web server are stateless, to persist the data we use DB  

```
./gradlew bootRun // to run with dev configurations
```
- We will use Version migration, there are other migrations as well.
## Story 1
- As an user I want to create todos with priority
    - High, Medium, and Low
Story —> break down —> smaller tech talks
### Tech tasks for this story:
- Add new column ‘Priority’ to table ‘todos’ in ‘tododb’ in database
- Update the same in Todo model
---
- Change of Schema should reflect in all other machines, and there will be different environments (local, codex envs)
## General Types of environments:
- Local environment (My machine)
- Dev environment (all the stories of all people)
- QA environment (QA test the environment)
- Staging environment (demo for clients)
- Prod environment (for users)
here, when we alter the table in the local machine, it will only reflect there, we have to do in all environments
---
## Using Schema Migrations
```JavaScript
resources
----db.migration
-------- create table
-------- add column
```

> [!important]  
> we are using third party tool ‘Flywaydb’ to manage migrations  
- The flyway things will have happened in
```JavaScript
./gradlew tasks
```
## Naming convention
There are differnt type of migrations
```JavaScript
V1.1__<WhateverWantToDo.sql>
```
## Query in the migration
```JavaScript
alter table todos add column priority varchar(50) not null default 'NA';
```
## How to run the migration
```JavaScript
./gradlew flywayMigrate
```

> [!important]  
> versioning the schema, we are migration the schema, not migration of data, if we have to migrate data, seed migration  
## Check if the db schema has been updated
```JavaScript
select * from todos
```
## Migration checksum mismatch for migration version
- flyway_schema_history will be created for all the migrations in the db
- a checksum for each migration will be created
- so that we won’t be able to update the migration (compares the checksum)
- We can’t change the existing migration, we should only write a new migration if we want to make changes in the existing migrations.
- another .sql file should be written
- Whatever it doesn’t have in the flyway_schema_history, it will run that migration when we do ./gradlew flywayMigrate
- It will be updated in all environments
---
- Introduce new variable Priority in the code and use @ApiModelProperty to add that in the db as well
```JavaScript
@ApiModelProperty()
```

> [!important]  
> The @ApiModelProperty annotation allows us to control Swagger-specific definitions such as description (value), name, data type, example values, and allowed values for the model properties.  
---
```JavaScript
./gradlew clean build && ./gradlew bootRun
```
## References

> [!info] Swagger @ApiParam vs @ApiModelProperty | Baeldung  
> Learn the difference between Swagger's @ApiParam and @ApiModelProperty  
> [https://www.baeldung.com/swagger-apiparam-vs-apimodelproperty](https://www.baeldung.com/swagger-apiparam-vs-apimodelproperty)  
---
- [ ] Undo migration

> [!important]  
> Django vs Springboot Manual migration vs Automation migrationLiquidBase generates automatic migration  
  
> [!important]  
> Migration scripts are the core of Flyway's functionality. These scripts contain the SQL commands to modify the database schema, such as creating or altering tables, adding indexes, or inserting initial data. Flyway ensures these scripts are applied in a specific order to maintain the integrity of the database schema.  
  
> [!important]  
> Flyway supports the following basic commands to manage database migrations:Info: Prints current status/version of a database schema. It prints which migrations are pending, which migrations have been applied, the status of applied migrations, and when they were applied.Migrate: Migrates a database schema to the current version. It scans the classpath for available migrations and applies pending migrations.Baseline: Baselines an existing database, excluding all migrations, including baselineVersion. Baseline helps to start with Flyway in an existing database. Newer migrations can then be applied normally.Validate: Validates current database schema against available migrations.Repair: Repairs metadata table.Clean: Drops all objects in a configured schema. Of course, we should never use clean on any production database.  

> [!info] Rolling Back Migrations with Flyway | Baeldung  
> Learn how to safely roll back migrations using Flyway.  
> [https://www.baeldung.com/flyway-roll-back](https://www.baeldung.com/flyway-roll-back)