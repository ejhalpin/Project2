//Pull in dependencies
//==============================================================
var db = require("../models");
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
