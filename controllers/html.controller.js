var path = require("path");
var moment = require("moment");
const cookieparser = require("cookie-parser");

module.exports = {
  //load the index page
  getIndex: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }
};
