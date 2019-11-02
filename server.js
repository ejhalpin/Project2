//EXPRESS SERVER//

//package dependencies
let express = require("express");
let cookieparser = require("cookie-parser");
let routes = require("./routes");

//express
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public/assets"));
app.use(cookieparser());

var db = require("./models");

// Routes
app.use(routes);

//data persistence
var syncOptions = { force: false };

//if testing, clear the testDb
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log("==>Listening on port %s.", PORT);
  });
  db.Hive.findOne({
    where: {
      id: 1
    }
  })
    .then(hive => {
      if (!hive) {
        db.Hive.create({
          name: "Busy-Bee",
          queen: "Busy-Bee-Queen"
        })
          .then(() => {
            console.log("Busy Bee Hive Created");
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});
