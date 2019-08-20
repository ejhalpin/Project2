//Pull in dependencies
//==============================================================
var db = require("../models");
var moment = require("moment");
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
  // Define an api route that will seed the database with a household of n members and a chores list that is randomly generated
  app.get("/dev/seed/:n", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //n defines the number of household members
    var n = req.params.n;
    seedDB(n)
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });

  // Define an api route to return all users and chores for a given household
  app.get("/api/household/:HouseholdId", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //query the database and leverage our associations
    db.Household.findOne({
      where: { id: req.params.HouseholdId },
      include: [db.User, db.Chore]
    })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });

  // Define an api route to return all chores for a user
  app.get("/api/chores/:uname", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //query the db for all chores where assignedTo = uname
    db.Chore.findAll({ where: { assignedTo: req.params.uname } })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });

  //define an api route to return all data from a table (users, households, chores, posts)
  app.get("/api/:type", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    switch (req.params.type) {
      case "users":
        db.User.findAll({})
          .then(data => {
            response.data = data;
            return res.json(response);
          })
          .catch(err => {
            response.status = 500;
            response.reason = "Error fetching data from the database: " + err;
            return res.json(response);
          });
        break;
      case "households":
        db.Household.findAll({})
          .then(data => {
            response.data = data;
            return res.json(response);
          })
          .catch(err => {
            response.status = 500;
            response.reason = "Error fetching data from the database: " + err;
            return res.json(response);
          });
        break;
      case "chores":
        db.Chore.findAll({})
          .then(data => {
            response.data = data;
            return res.json(response);
          })
          .catch(err => {
            response.status = 500;
            response.reason = "Error fetching data from the database: " + err;
            return res.json(response);
          });
        break;
      case "posts":
        db.Post.findAll({})
          .then(data => {
            response.data = data;
            return res.json(response);
          })
          .catch(err => {
            response.status = 500;
            response.reason = "Error fetching data from the database: " + err;
            return res.json(response);
          });
        break;
    }
  });

  // Create a new db entry
  app.post("/api/:type", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    console.log(req.body);
    switch (req.params.type) {
      case "users":
        response.status = 400;
        response.reason = "you cannot create an unauthenticated user. use /auth/signup";
        res.json(response);
        break;
      case "households":
        db.Household.create(req.body).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.create(req.body).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.create(req.body).then(data => {
          return res.json(data);
        });
        break;
    }
  });

  // Delete a db entry from a table
  app.delete("/api/:type/:id", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    switch (req.params.type) {
      case "users":
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          response.data = data;
          return res.json(response);
        });
        break;
      case "households":
        db.Household.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
    }
  });

  // Update a db entry from a table
  app.put("/api/:type/:id", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    console.log(req.body);
    switch (req.params.type) {
      case "users":
        db.User.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          response.data.push(data);
          return res.json(response);
        });
        break;
      case "households":
        db.Household.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
    }
  });
};
//==============================================================

// Private functions for use with the api routes
//==============================================================
async function seedDB(n) {
  //make n users
  var users = [];
  for (var i = 0; i < n; i++) {
    users.push({
      name: "user_" + i.toString(),
      email: "user" + i.toString() + "@mail.com",
      token: i.toString() + "acde" + (i + 1).toString(),
      emailConfirmed: Math.random() < 0.5,
      tempToken: "temptoken_" + i.toString(),
      expiration: moment()
        .subtract(1, "d")
        .toString()
    });
  }
  //push the users to the db in bulk
  await db.User.bulkCreate(users);
  //make a household
  var household = await db.Household.create({
    name: "thisHouse",
    size: n
  });
  //now associate the users with the household
  for (var i = 0; i < n; i++) {
    await db.User.update({ HouseholdId: household.id }, { where: { name: users[i].name } });
  }
  //now create 50 chores and assign each to a random user
  var freqs = ["dialy", "monthly", "weekly", "yearly"];
  var chores = [];
  for (var i = 0; i < 50; i++) {
    chores.push({
      name: "chore_" + i.toString(),
      frequency: freqs[Math.floor(Math.random() * freqs.length)],
      assignedTo: users[Math.floor(Math.random() * n)].name,
      isComplete: Math.random() < 0.5,
      HouseholdId: household.id
    });
  }
  await db.Chore.bulkCreate(chores);
  var data = await db.Household.findAll({ include: [db.User, db.Chore] });
  return new Promise(resolve => {
    resolve(data);
  });
}
//==============================================================
