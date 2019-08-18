var db = require("../models");

module.exports = function(app) {
  //an api route to return all data from a table (users, households, chores, posts)
  app.get("/api/:type", (req, res) => {
    switch (req.params.type) {
      case "users":
        db.User.findAll({}).then(data => {
          return res.json(data);
        });
        break;
      case "households":
        db.Household.findAll({}).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.findAll({}).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.findAll({}).then(data => {
          return res.json(data);
        });
        break;
    }
  });

  // Create a new db entry
  app.post("/api/:type", (req, res) => {
    switch (req.params.type) {
      case "users":
        db.User.create(req.body).then(data => {
          return res.json(data);
        });
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
    switch (req.params.type) {
      case "users":
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
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

  app.put("/api/:type/:id", (req, res) => {
    switch (req.params.type) {
      case "users":
        db.User.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
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
