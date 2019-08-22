//var db = require("../models");
var path = require("path");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  app.get("/kelvin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index2.html"));
  });
};
