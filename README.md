# Project 2

### Group Members

- Wendy
- Kelvin
- Eugene

---

## About the App

## Busy-Bee is a home work management system where users can create recurring chores, assign those chores to members of their household, and receive a task list which contains chores that need to be completed on that day.

## How it works

**The Database** is comprised of 4 tables, each of which is controlled through an associated `sequelize` model. The models and their associations are shown below. A more detailed diagram of the associations can be seen [here](images/dblayout.png).

- User

  - Columns
    - id
    - name
    - email
    - token
    - emailConfirmed
    - tempToken
    - expiration
    - HouseholdId (foreign key)
  - Associations
    - hasMany -> Post

- Hive

  - Columns
    - id
    - name
    - size
  - Associations
    - hasMany -> Chore
    - hasMany -> User

- Chore

  - Columns
    - id
    - name
    - frequency
    - assignedTo
    - assignedWhen
    - htmlTarget
    - isComplete
    - HouseholdId (foreign key)
  - Associations
    - belongsTo -> Household (onDelete: cascade)

- Post
  - Columns
    - id
    - title
    - body
    - category
    - isReply
    - linkedTo
    - isFlagged
    - UserId (foreign key)
  - Associations
    - belongsTo -> User

---

## User Flow and Interaction

1. `Authentication` is managed as a pass-by-token model, similar to Google Authentication. In this model, the user supplies an email and password which are then used to generate an encryted token for the user. This token is stored in the database along with the user email. Future logins require the same email/password combination for successful login. The password that the user supplies is only visible
   during transport from client to server in the initial exchange. Check out this nifty [flow diagram](images/auth-flow.png) to see the authentication processes.

2.

## The RESTful API

Our `express` server endeavors to return a status of `200 (OK)` for all CRUD operations, independent (_and in spite_) of server side errors. This places error handling firmly in the hands of the front end logic. Any errors generated when CRUDding the database are captured and sent to the front end.

### Routes

Server routing is handled through three separate routing scripts, namely:

1. htmlRoutes.js
2. apiRoutes.js
3. authRoutes.js

**htmlRoutes** are used to serve up base html page, `index.html`.

**apiRoutes** handle data flow to and from the linked MySQL Database. These routes accept ajax verbs (get, post, put, delete) and carry out the corresponding operation on the database. Each api route will return a JSON object to the client independent of the success or failure of the CRUD operation. If the operation encountered an error, that error will be sent back to the client machine with a global status of `200`. Within the api routes there are routes for each of the database models (`chore`, `hive`, and `user`) as well as routes that handle outgoing `email` communication and user `auth`entication.

## Developer Note

Significant changes have been made to the site, including a drastic change to the database structure and accomanying associations, the server routes and logic, and the overall code sturcture. In the most recent push, Eugene mreged changes to the front end that include both style and logic that deviate significantly from the original design. In addition, the structure of the code was changed to conform more closely with ORM and MVC sturctures.

## Technology

This application is a Full Stack Deploy with a Node back end and a custom UI powered by jQuery. Technology in this app includes:

- Sendgrid
- MomentJS
- Bootstrap
- MySQL
- Sequelize
- Express
