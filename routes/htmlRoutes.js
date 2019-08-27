var db = require("../models");
var path = require("path");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    //check the database to see if the "Busy Bee" household exists (it will have an id of 1)

    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/household", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/household.html"));
  });

  app.get("/forum", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/forum.html"));
  });

  app.get("/cal", (req, res) => {
    db.Household.findOne({ where: { id: 1 } }).then(data => {
      if (!data) {
        db.Household.create({
          name: "Busy Bee"
        }).then(createData => {
          console.log(createData);
          return;
        });
      }
      console.log(data);
    });
    res.sendFile(path.join(__dirname, "../public/calendar-views.html"));
  });
};
