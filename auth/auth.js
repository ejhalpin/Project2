//Pull in dependencies
//===========================================================
var crypto = require("crypto");
//===========================================================

//export the auth object and define methods
//===========================================================
module.exports = {
  getToken: (password, email) => {
    var key = crypto.pbkdf2Sync(password, email, 100000, 8, "sha512");
    return key.toString("hex");
  },

  compareToken: (password, email, token) => {
    var key = crypto.pbkdf2Sync(password, email, 100000, 8, "sha512");
    return token === key.toString("hex");
  }
};
