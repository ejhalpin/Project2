# Project 2

### Group Members

- Wendy
- Kelvin
- Eugene

---

## About the App

---

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

- Household

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

1. `Authentication` is managed as a pass-by-token model, similar to Google Authentication. In this model, the user supplies an email and password which are then used to generate a random token for the user. This token is stored in the database along with the user email. Future logins require the same email/password combination for successful login. The password that the user supplies is only visible
   during transport from client to server in the initial exchange. The user token is visible if the user allows for session / permanent login. In such a case, the token is stored in the client browser for session or semi-permanent durations, depending on the user preference. When a user creates an account, they are emailed a verification link which contains a temporary token generated with a seed from the current date-time object. This temporary token expires after 24 hours. Following the link within the alloted timeframe will confirm the user email and allow the user access to write/edit permission on the post boards and allow the user to create/join a household. Users can also request a new verification link. Check out this nifty [flow diagram](images/auth-flow.png) to see the authentication processes.

2.

## The RESTful API

Our `express` server endeavors to return a status of `200 (OK)` for all CRUD operations, independent (_and in spite_) of server side errors. This places error handling firmly in the hands of the front end logic.

### Routes

Server routing is handled through three separate routing scripts, namely:

1. htmlRoutes.js
2. apiRoutes.js
3. authRoutes.js

**htmlRoutes**

**apiRoutes** handle data flow to and from the linked MySQL Database. These routes accept ajax verbs (get, post, put, delete) and carry out the corresponding operation on the database. Each api route will return a standardized object with keys [status, reason, data] to the client independent of the success or failure of the CRUD operation. If the operation encountered an error, that error will be sent back to the client machine with a global status of `200`, but the object status will be either `409` for invalid data or `500` for package errors.

**authRoutes** operate exactly as the apiRoutes, but are meant to handle user authentication. The routes contain operations that require the `crypto, @sendgrid/mail, and moment` packages. These routes could easily be dovetailed with the apir routes, but have been defined in their own script file to reduce clutter.
