# initial notes
- Before, we use JDBC (Java Database Connectivity) to connect to DB and write sql queries
- ORM (Object Relation Mapping) simplifies
- Java we deal with Object only
- We are only mapping the objects
- A technique to map java objects to table
- Frameworks
    - Hibernate
        - Is a ORM Framework
        - is a JPA Implementation
    - Toplink
    - MyBatis
- Spring Data JPA needs a JPA provider (Hibernate as default)  
## Lazy loading  
- Postpones the loading of date until I need it
- If I only query user, it will give user details, not profile
- Provided user is dependent as one to one to profile
## Eager Loading
- gives both tables data from one query
  
orphanRemoval
fetch
projection
want some specific fields

DAO
- Repository layer
- implement persistent layer
- Librarian in a library

Spring Data JPA → a layer upon JPA

## Repository
- JPA repository
- Crud repository
- Pagination and sorting repository

You can pass sort object to sort
Positional Bind parameter → ?1
Name Bind parameter → :firstName


![[Screenshot_2024-07-15_at_2.39.38_PM.png]]
@Modifying and @Transactional
![[Screenshot_2024-07-15_at_3.09.34_PM.png]]
@NamedQueries
- Have compile time safety check
![[Screenshot_2024-07-15_at_3.11.13_PM.png]]

# extended

## Database Interaction Simplified: ORM & Spring Data JPA

**1. Connecting to Databases:**
- **Before:** We used **JDBC (Java Database Connectivity)** to write complex SQL queries and connect our Java programs to databases.
- **Now (Simplified):** **ORM (Object-Relational Mapping)** makes it much easier.

**2. What is ORM?**
- In Java, we work with **Objects** (like a `User` object or a `Product` object).
- ORM is a technique that **maps your Java Objects directly to database Tables**. This means you can work with Java objects and ORM handles the SQL.

**3. Popular ORM Frameworks:**
- **Hibernate:** A very popular ORM framework. It's also an **implementation of JPA**.
- Other examples: Toplink, MyBatis.

**4. JPA (Java Persistence API):**
- Think of JPA as a **standard set of rules** for ORM in Java. Hibernate is one of the tools that _follows_ these rules.
    

**5. Spring Data JPA:**
- This is a helpful layer built **on top of JPA**.
- It simplifies working with databases even further, often using **Hibernate by default** behind the scenes.

---

## Loading Data: Lazy vs. Eager

When you retrieve data from the database, you can choose how much related data to load:

- **Lazy Loading:**
    - **Loads data only when you specifically ask for it.**
    - **Example:** If you ask for a `User`, it will only give you the user's basic details. If that user has a `Profile` linked, the `Profile` details will _not_ be loaded until you try to access them.
    - **Benefit:** Saves resources by only loading what's immediately needed.
- **Eager Loading:**
    - **Loads all related data at once** with a single query.
    - **Example:** If you ask for a `User` and their `Profile` is linked, both the `User` and `Profile` data will be loaded immediately.
    - **Benefit:** All data is ready when you get the initial object.

---

## Other Useful Concepts:

- **`orphanRemoval`:** A setting that automatically deletes "child" records (like a `Profile`) if their "parent" (like a `User`) is deleted.
- **`fetch`:** Controls how related data is loaded (similar to lazy/eager loading, but more granular).
- **`projection`:** Allows you to retrieve only specific fields (columns) from a table, rather than the entire object.

---

## Data Access Layer: DAO & Repository

## DAO (Data Access Object)
- A design pattern for creating a **"repository layer"**. This layer is responsible for all interactions with the database (like a librarian who manages all books).
## Repository
- In Spring Data JPA, you often use "Repositories" (like `JpaRepository`, `CrudRepository`) which simplify creating these DAO layers. They provide common database operations (create, read, update, delete) out-of-the-box.
### `CrudRepository`
- Basic operations (Create, Read, Update, Delete).
### `PagingAndSortingRepository` 
- Adds methods for pagination (loading data in chunks) and sorting.
### `JpaRepository`
- Extends both `CrudRepository` and `PagingAndSortingRepository`, providing even more JPA-specific features.

---

## Querying Data: Bind Parameters

When writing custom queries, you can use parameters to make them flexible:
- **Positional Bind Parameter:** `?1`, `?2` (parameters are identified by their position).
- **Named Bind Parameter:** `:firstName`, `:lastName` (parameters are identified by their names, which is generally clearer).