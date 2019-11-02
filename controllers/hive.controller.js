const db = require("../models");

module.exports = {
  //create a hive
  createHive: (req, res) => {
    //req.body needs a unique name, queen
    db.Hive.create(req.body)
      .then(hiveData => {
        res.json(hiveData);
      })
      .catch(err => {
        res.json(err);
      });
  },
  //get a hive by id
  getHive: (req, res) => {
    db.Hive.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User, db.Chore]
    })
      .then(hive => {
        res.json(hive);
      })
      .catch(err => {
        res.json(err);
      });
  },

  getHiveByName: (req, res) => {
    db.Hive.findOne({
      where: {
        name: req.params.name
      }
    })
      .then(hive => {
        res.json(hive);
      })
      .catch(err => {
        res.json(err);
      });
  },

  //update hive by id
  updateHive: (req, res) => {
    db.Hive.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(update => {
        //the hive was updated. Now return the updated hive. We're not using postgress, so we have to do it manually
        db.Hive.findOne({
          where: {
            id: req.params.id
          },
          include: [db.User, db.Chore]
        })
          .then(hive => {
            res.json(hive);
          })
          .catch(err => {
            res.json(err);
          });
      })
      .catch(err => res.json(err));
  },

  deleteHive: async (req, res) => {
    //find the hive
    var hive = await db.Hive.findOne({
      where: {
        id: req.params.id
      },
      include: [db.User]
    });
    //for each user, update their HiveId to 1 (back to the beginning)
    for (var i = 0; i < hive.Users.length; i++) {
      var userId = hive.Users[i].id;
      await db.User.update({ HiveId: 1 }, { where: { id: userId } });
    }
    //delete the hive
    db.Hive.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbData => {
        res.json(dbData);
      })
      .catch(err => res.json(err));
  }
};
