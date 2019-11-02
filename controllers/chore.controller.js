const db = require("../models");

module.exports = {
  //create a chore
  createChore: (req, res) => {
    //req.body needs a name, frequency, HiveId
    db.Chore.create(req.body)
      .then(choreData => {
        db.Hive.findOne({ where: { id: choreData.HiveId }, include: [db.User, db.Chore] })
          .then(hive => {
            res.json(hive);
          })
          .catch(err => {
            res.json(err);
          });
      })
      .catch(err => {
        res.json(err);
      });
  },
  //update a chore
  updateChore: (req, res) => {
    db.Chore.update(req.body, {
      where: {
        id: req.params.id
      }
    })
      .then(update => {
        db.Chore.findOne({
          where: {
            id: req.params.id
          }
        })
          .then(chore => {
            db.Hive.findOne({ where: { id: chore.HiveId }, include: [db.User, db.Chore] })
              .then(hive => {
                res.json(hive);
              })
              .catch(err => res.json(err, update));
          })
          .catch(err => {
            res.json(err);
          });
      })
      .catch(err => res.json(err));
  },

  deleteChore: (req, res) => {
    db.Chore.destroy({ where: { id: req.params.id } })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json(err);
      });
  }
};
