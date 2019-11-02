const db = require("../models");

module.exports = {
  //create a user
  createUser: (req, res) => {
    //req.body needs a unique name, email, token, and hive id
    db.User.create(req.body)
      .then(userData => {
        res
          .cookie("dbid", userData.id, {
            maxAge: 4 * 60 * 60 * 1000,
            path: "/"
          })
          .json(userData);
      })
      .catch(err => {
        res.json(err);
      });
  },
  //get a user by id
  getUser: (req, res) => {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(user => {
        res.json(user);
      })
      .catch(err => {
        res.json(err);
      });
  },
  //update a user
  updateUser: (req, res) => {
    db.User.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(update => {
        db.User.findOne({
          where: {
            id: req.params.id
          }
        })
          .then(user => {
            res.json(user);
          })
          .catch(err => {
            res.json(err, update);
          });
      })
      .catch(err => res.json(err));
  },
  //delete a user
  deleteUserFromHive: async (req, res) => {
    var user = await db.User.findOne({ where: { id: req.params.id } });
    var hive = await db.Hive.findOne({ where: { id: user.HiveId }, include: [db.Chore] });
    for (var i = 0; i < hive.Chores.length; i++) {
      if (hive.Chores[i].assignedTo === user.name) {
        await db.Chore.update({ assignedTo: "unassigned" }, { where: { id: hive.Chores[i].id } });
      }
    }
    await db.User.update({ HiveId: 1 }, { where: { id: user.id } });
    var updatedHive = await db.Hive.findOne({
      where: { id: hive.id },
      include: [db.User, db.Chore]
    });
    res.json(updatedHive);
  }
};
