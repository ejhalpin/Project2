//Pull in dependencies
//==============================================================
var db = require("../models");
var crypto = require("crypto");
var sg = require("sendgrid")(process.env.SG_MAIL_KEY);
var moment = require("moment");
require("dotenv").config();
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
    userObject.HouseholdId = 1;
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
        //make sure the busy bee household exits...
        db.User.create(userObject).then(data => {
          response.data.push(data);
          //===================CONFIGURE THE EMAIL=================================
          var request = sg.emptyRequest({
            method: "POST",
            path: "/v3/mail/send",
            body: {
              personalizations: [
                {
                  to: [
                    {
                      email: userObject.email
                    }
                  ],
                  subject: "BusyBee Notification: Please Confirm Your Email"
                }
              ],
              from: {
                email: "noreply@busybee.com"
              },
              content: [
                {
                  type: "text/html",
                  //enigmatic-coast-50344.herokuapp.com
                  value:
                    "<h3>Please Confirm Your Email Address</h3>" +
                    "<p>Follow the link below to confirm your email address and finish creating your account</p>" +
                    "<p><a href=' https://enigmatic-coast-50344.herokuapp.com/confirm/" +
                    userObject.tempToken +
                    "'>click here to confirm your email</a>"
                }
              ]
            }
          });

          //With promise
          sg.API(request)
            .then(info => {
              console.log(info.statusCode);
              console.log(info.body);
              console.log(info.headers);
              response.data.push(info);
              return res.json(response);
            })
            .catch(err => {
              response.status = 500;
              response.reason = "Server Error " + err;
              return res.json(response);
            });
          //=======================================================================
        });
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Server Error " + err;
        return res.json(response);
      });
  });

  app.put("/auth/signup", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    var userObject = req.body;
    // look in the users table for the email address to ensure uniqueness
    db.User.findOne({ where: { email: userObject.email } })
      .then(data => {
        if (!data) {
          //the email exists in the database
          response.status = 409;
          response.reason = "Invalid Invitation Email. Contact your invitee.";
          return res.json(response);
        }
        userObject.id = data.id;
        userObject.HouseholdId = data.HouseholdId;
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
        response.data.push(userObject);
        db.User.update(userObject, { where: { id: data.id } })
          .then(rows => {
            response.data.push(rows);
            //===================CONFIGURE THE EMAIL=================================
            var request = sg.emptyRequest({
              method: "POST",
              path: "/v3/mail/send",
              body: {
                personalizations: [
                  {
                    to: [
                      {
                        email: userObject.email
                      }
                    ],
                    subject: "BusyBee Notification: Please Confirm Your Email"
                  }
                ],
                from: {
                  email: "noreply@busybee.com"
                },
                content: [
                  {
                    type: "text/html",
                    //enigmatic-coast-50344.herokuapp.com
                    value:
                      "<h3>Please Confirm Your Email Address</h3>" +
                      "<p>Follow the link below to confirm your email address and finish creating your account</p>" +
                      "<p><a href=' https://enigmatic-coast-50344.herokuapp.com/confirm/" +
                      userObject.tempToken +
                      "'>click here to confirm your email</a>"
                  }
                ]
              }
            });

            //With promise
            sg.API(request)
              .then(info => {
                console.log(info.statusCode);
                console.log(info.body);
                console.log(info.headers);
                response.data.push(info);
                return res.json(response);
              })
              .catch(err => {
                response.status = 500;
                response.reason = "Server Error " + err;
                return res.json(response);
              });
          })
          .catch(err => {
            res.json({
              status: 500,
              reason: "Error updating user: " + err,
              data: []
            });
          });
      })
      .catch(err => {
        res.json({
          status: 500,
          reason: "Error updating user: " + err,
          data: []
        });
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
          response.data.push(data);
          //the user was found! confirm their email
          db.User.update({ emailConfirmed: true }, { where: { id: data.id } }).then(() => {
            console.log("attempting redirect");
            return res.redirect("/");
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
          emailConfirmed: data.emailConfirmed,
          token: data.token
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

  //an endpoint to invite a user to join a household
  app.post("/auth/invite", (req, res) => {
    //this endpoint expects a household id, the invitee's name, and an email in req.body
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //look in the database to see if the email is connected with an account
    db.User.findOne({ where: { email: req.body.email } }).then(searchData => {
      if (searchData) {
        //the user already has an account
        var object = req.body;
        object.id = searchData.id;
        sendInvitation(object).then(info => {
          response.data.push(info);
          res.json(response);
        });
      } else {
        //make a db entry for the user in the household to which they were invited
        db.User.create({ email: req.body.email, HouseholdId: req.body.HouseholdId }).then(
          createData => {
            var object = req.body;
            object.id = createData.id;
            sendInvitation(object).then(info => {
              response.data.push(info);
              res.json(response);
            });
          }
        );
      }
    });
  });

  //an endpoint to
  app.get("/respond/:id/:HouseholdId", (req, res) => {
    //get the user data
    db.User.findOne({ where: { id: req.params.id } }).then(data => {
      //if the user object has no name, send them to a page with the signup form
      if (!data.name) {
        res.redirect("/signup");
      } else {
        db.User.update(
          { HouseholdId: req.params.HouseholdId },
          { where: { id: req.params.id } }
        ).then(() => {
          //the user is now linked to the household they were invited to. Send them to the household page
          res.redirect("/household");
        });
      }
    });
  });
};

//================================================================
function sendInvitation(data) {
  return new Promise((resolve, reject) => {
    //===================CONFIGURE THE EMAIL=================================
    var request = sg.emptyRequest({
      method: "POST",
      path: "/v3/mail/send",
      body: {
        personalizations: [
          {
            to: [
              {
                email: data.email
              }
            ],
            subject: `BusyBee Notification: You've Been Invited to Join ${data.name}'s hive!`
          }
        ],
        from: {
          email: "noreply@busybee.com"
        },
        content: [
          {
            type: "text/html",
            value: `<h3>${data.name} has sent you an invitation to join their hive on BusyBee</h3>
              <p><a href='https://enigmatic-coast-50344.herokuapp.com/respond/${data.id}/${data.HouseholdId}'>Click here to accept the invitation!</a></p>`
          }
        ]
      }
    });

    //With promise
    sg.API(request)
      .then(info => {
        console.log(info.statusCode);
        console.log(info.body);
        console.log(info.headers);

        resolve(info);
      })
      .catch(err => {
        reject(err);
        //=======================================================================
      });
  });
}

function init() {
  console.log("INIT");
  db.Household.findOne({ where: { id: 1 } }).then(data => {
    if (!data) {
      db.Household.create({ name: "BusyBee" });
    }
  });
}

init();
