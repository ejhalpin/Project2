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

  app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });
};
