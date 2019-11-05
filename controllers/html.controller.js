var path = require("path");

module.exports = {
  //load the index page
  getIndex: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  },
  getReset: (req, res) => {
    res.sendFile(path.join(__dirname, "../public/password-reset.html"));
  }
};
