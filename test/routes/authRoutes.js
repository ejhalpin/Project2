//Pull in dependencies
//==============================================================
var db = require("../models");
var crypto = require("crypto");
var sgMail = require("@sendgrid/mail");
var moment = require("moment");
require("dotenv").config();
//==============================================================

//Configure the mailer
//==============================================================
sgMail.setApiKey(process.env.SG_MAIL_KEY);

var message = {
  to: "null@null.com",
  from: "no-reply@householdmanager.com",
  subject: "Please verify your email",
  text: "dummy text",
  html: ""
};
//==============================================================

//==============================================================
/*DEVELOPER NOTE:
 * IT IS THE GOAL OF THE DEVELOPER THAT THE API BE WELL BEHAVED,
 * WHICH SHOULD BE TAKEN TO MEAN THAT THE API WILL ENDEAVOR TO
 * RETURN A STATUS OF 200, EVEN IF THERE IS AN ERROR. TO THIS END,
 * ALL API ROUTES ARE DESIGNED TO RETURN AN OBJECT OF THE FORM:
 * {
 *   status: <server status>
 *   reason: "success/error message"
 *   data: <any db data that is generated>
 * }
 */
//==============================================================
//Build the api routes within a function and export the function
//==============================================================
module.exports = function(app) {
  //an endpoint for new user creation
  app.post("/auth/signup", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //req.body will have three key-value pairs:
    // name, email, password

    //copy by reference req.body to a local object that we can build on
    var userObject = req.body;

    // look in the users table for the email address to ensure uniqueness
    db.User.findOne({ where: { email: userObject.email } })
      .then(data => {
        if (data) {
          //the email exists in the database
          response.status = 409;
          response.reason = "That email address is already in use. Try logging in.";
          return res.json(response);
        }
        //otherwise, the email is new. Proceed with token generation
        var keyBuffer = crypto.pbkdf2Sync(
          userObject.password,
          userObject.email,
          100000,
          16,
          "sha512"
        );
        userObject.token = keyBuffer.toString("hex");
        //generate an email verification token using the current date-time string and email
        var emailKeyBuffer = crypto.pbkdf2Sync(
          moment().toString(),
          userObject.email,
          100000,
          8,
          "sha512"
        );
        //add the verification token to the user object and set an expiration of 1 day in the future
        userObject.tempToken = emailKeyBuffer.toString("hex");
        userObject.expiration = moment()
          .add(1, "d")
          .toString();
        //add the user to the database
        db.User.create(userObject).then(data => {
          response.data.push(data);
          //format the email
          var html =
            "<h3>Please Confirm Your Email Address</h3>" +
            "<p>Follow the link below to confirm your email address and finish creating your account</p>" +
            "<p><a href='http://localhost:8080/confirm/" +
            userObject.tempToken +
            "'>click here to confirm your email</a>";
          //add the email address and html to the mail config object
          message.to = userObject.email;
          message.html = html;
          //send the confirmation email to the user
          //send the email link
          sgMail
            .send(message)
            .then(data => {
              response.data.push(data);
              res.json(response);
            })
            .catch(err => {
              response.status = 500;
              response.reason = "Server Error " + err;
              return res.json(response);
            });
        });
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Server Error " + err;
        return res.json(response);
      });
  });

  //an endpoint for email confirmation
  app.get("/confirm/:token", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //look up the user by temp token
    db.User.findOne({ where: { tempToken: req.params.token } })
      .then(data => {
        if (data) {
          //check the expiration of the link
          if (moment(data.expiration).isBefore(moment())) {
            response.status = 409;
            response.reason = "the confirmation link has expired";
            return res.json(response);
            //the front end should handle this error by allowing the user to request a new confirmation link from the endpoint: get(/id/confirm) after logging in
          }
          response.data.push(data);
          //the user was found! confirm their email
          db.User.update({ emailConfirmed: true }, { where: { id: data.id } }).then(userUpdate => {
            response.data.push(userUpdate);
            return res.json(response);
          });
        } else {
          //the temp token wasn't found...
          response.status = 409;
          response.reason = "The user account could not be confirmed. Invalid token.";
          res.json(response);
        }
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Server Error " + err;
        return res.json(response);
      });
  });

  //an endpoint for user login
  app.post("/auth/login", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //look up the user using thier email
    db.User.findOne({ where: { email: req.body.email } })
      .then(data => {
        if (!data) {
          response.status = 409;
          response.reason = "invalid email address";
          return res.json(response);
        }
        //the user email has been found and data contains the entire user db entry
        //reconstruct the user token with the email/password provided
        var keyBuffer = crypto.pbkdf2Sync(req.body.password, req.body.email, 100000, 16, "sha512");
        var token = keyBuffer.toString("hex");
        //compare the tokens
        if (token !== data.token) {
          response.status = 409;
          response.reason = "invalid password";
          return res.json(response);
        }
        //the tokens match, the user is logged in. Return some user data to the client
        var userObject = {
          id: data.id,
          name: data.name,
          emailConfirmed: data.emailConfirmed
        };
        if (data.HouseholdId) {
          userObject.HouseholdId = data.HouseholdId;
        }
        response.data.push(userObject);
        //The login endpoint assumes that email verification will be checked on the front end.
        //If the account is not verified, the user should be prompted to confirm their email address.
        //A new link can be sent to the get(/id/confirm) endpoint
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Server Error " + err;
        return res.json(response);
      });
  });

  //an endpoint for sending additional email verifications - should this be a PUT????
  app.get("/:id/confirm", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //look up the user in the database
    db.User.findOne({ where: { id: req.params.id } })
      .then(data => {
        if (!data) {
          //the user doesn't exist
          response.status = 409;
          response.reason = "user id does not exist in the database";
          return res.json(response);
        }
        //the user entry was located and returned within the data variable
        //check the emailConfirmed status of the account
        if (data.emailConfirmed) {
          response.status = 409;
          response.reason = "this account is already confirmed";
          return res.json(response);
        }
        //construct and send a new confirmation email
        var emailKeyBuffer = crypto.pbkdf2Sync(
          moment().toString(),
          data.email,
          100000,
          8,
          "sha512"
        );
        //construct a user object piecemeal
        var userObject = {
          tempToken: emailKeyBuffer.toString("hex"),
          expiration: moment()
            .add(1, "d")
            .toString()
        };
        //update the user data database
        db.User.update(userObject, { where: { id: data.id } }).then(userUpdate => {
          response.data.push(userUpdate);
          //format the email
          var html =
            "<h3>Please Confirm Your Email Address</h3>" +
            "<p>Follow the link below to confirm your email address and finish creating your account</p>" +
            "<p><a href='http://localhost:8080/confirm/" +
            userObject.tempToken +
            "'>click here to confirm your email</a>";
          //add the email address and html to the mail config object
          message.to = data.email;
          message.html = html;
          //send the confirmation email to the user
          //send the email link
          sgMail.send(message);
          res.json(response);
        });
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Server Error " + err;
        return res.json(response);
      });
  });
};
