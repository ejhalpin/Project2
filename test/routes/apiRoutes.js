//Pull in dependencies
//============================================================================================================================
var db = require("../models");
var moment = require("moment");
//============================================================================================================================

//============================================================================================================================
/*DEVELOPER NOTE:
 * IT IS THE GOAL OF THE DEVELOPER THAT THE API BE WELL BEHAVED,
 * WHICH SHOULD BE TAKEN TO MEAN THAT THE API WILL ENDEAVOR TO
 * RETURN A STATUS OF 200, EVEN IF THERE IS AN ERROR. TO THIS END,
 * ALL API ROUTES ARE DESIGNED TO RETURN AN OBJECT OF THE FORM:
 * {
 *   status: <server status>
 *   reason: "success/error message"
 *   data: <any db data that is generated>
 * }
 */
//============================================================================================================================

//Build the api routes within a function and export the function
//============================================================================================================================
module.exports = function(app) {
  // *** READ *** //
  //==========================================================================================================================
  // Define an api route to return all users and chores for a given household
  app.get("/api/household/:HouseholdId", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //query the database and leverage our associations
    db.Household.findOne({
      where: { id: req.params.HouseholdId },
      include: [db.User, db.Chore]
    })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });

  // Define an api route to return all chores for a user
  app.get("/api/chores/:uname", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //query the db for all chores where assignedTo = uname
    db.Chore.findAll({ where: { assignedTo: req.params.uname } })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });

  // Define an api route to retreive all posts of a given category OR all posts if a category is not specified
  // The returned response object contains an array of posts with an additional key of responses: [], an array
  // of response posts linked to the original post
  app.get("/api/posts/:category?", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    if (req.params.category) {
      //get the posts of a given category from the db
      db.Post.findAll({ where: { category: req.params.category } })
        .then(data => {
          var posts = linkPostsAndResponses(data);
          response.data = posts;
          return res.json(response);
        })
        .catch(err => {
          response.status = 500;
          response.reason =
            "Error fetching Posts of category: " + req.params.category + " -> " + err;
          return res.json(response);
        });
    }
    //otherwise return all posts
    db.Post.findAll({})
      .then(data => {
        var posts = linkPostsAndResponses(data);
        response.data = posts;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error fetching Posts: " + err;
        res.json(response);
      });
  });

  // Define an api route to retreive all posts by a given user
  app.get("/api/post-by-user/:name", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //query the db for all posts by a user
    db.User.findOne({ where: { name: req.params.name }, include: [db.Post] })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error fetching Posts: " + err;
        res.json(response);
      });
  });

  // Define an api route to retreive all user names sorted by id
  app.get("/api/users", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    db.User.findAll({ order: [["id", "ASC"]], attributes: ["id", "name"] })
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error fetching Posts: " + err;
        res.json(response);
      });
  });

  //==========================================================================================================================

  // *** CREATE *** //
  //==========================================================================================================================
  // USERS CANNOT BE CREATED THROUGH THE API. THEY MUST BE AUTHENTICATED. USE AUTH ROUTES INSTEAD.

  // Define an api route to create a new post
  app.post("/api/post", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //req.body should contain key-value pairs for title, body, category, isReply (if applicable), linkedTo (if isReply), and UserId
    db.Post.create(req.body)
      .then(data => {
        response.data.push(data);
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error creating post: " + err;
        res.json(response);
      });
  });

  // Define an api route to create a new household
  app.post("/api/household", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //req.body should contain a single key-value pair for the household name.
    db.Household.create(req.body)
      .then(data => {
        //data will contain the id of the household, which needs to be passed when creating a chore as HouseholdId
        response.data.push(data);
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error creating household: " + err;
        res.json(response);
      });
  });

  // Define an api route to create a new chore
  app.post("/api/chore", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //req.body should contain key-value pairs for name (required), frequency (if applicable), assignedTo (if applicable), assignedWhen (if applicable),  and HouseholdId (required)
    db.Chore.create(req.body)
      .then(data => {
        response.data.push(data);
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error creating chore: " + err;
        res.json(response);
      });
  });
  //==========================================================================================================================

  // *** UPDATE *** //
  //==========================================================================================================================
  // Define a general api route for updating a db entry
  // This route expects a type (users, households, chores, or posts), as well as the id from the db
  // This route should be used for linking posts and replies, updating user name or household, editing a post, editing a chore
  app.put("/api/:type/:id", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    console.log(req.body);
    switch (req.params.type) {
      case "users":
        db.User.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          response.data.push(data);
          return res.json(response);
        });
        break;
      case "households":
        db.Household.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.update(req.body, {
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
    }
  });
  //==========================================================================================================================

  // *** DELETE *** //
  //==========================================================================================================================
  // Define a general api route for deleting a db entry
  // This route expects a type (users, households, chores, or posts), as well as the id from the db
  // This route should be used for destroying db entries (no recovery)
  app.delete("/api/:type/:id", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    switch (req.params.type) {
      case "users":
        db.User.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          response.data = data;
          return res.json(response);
        });
        break;
      case "households":
        db.Household.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "chores":
        db.Chore.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
      case "posts":
        db.Post.destroy({
          where: {
            id: req.params.id
          }
        }).then(data => {
          return res.json(data);
        });
        break;
    }
  });
  //==========================================================================================================================

  // *** DEV *** //
  //==========================================================================================================================
  // Define an api route that will seed the database with a household of n members and a chores list that is randomly generated
  // NEW! The route will also create stock forum posts of varying length and flag some as replies to others.
  app.get("/dev/seed/:n", (req, res) => {
    //define the default response object
    var response = {
      status: 200,
      reason: "success",
      data: []
    };
    //n defines the number of household members
    var n = req.params.n;
    seedDB(n)
      .then(data => {
        response.data = data;
        res.json(response);
      })
      .catch(err => {
        response.status = 500;
        response.reason = "Error: " + err;
        res.json(response);
      });
  });
  //==========================================================================================================================
};
//============================================================================================================================

// Private variables and functions
//============================================================================================================================
function linkPostsAndResponses(data) {
  var posts = [];
  var responses = [];
  data.forEach(entry => {
    if (entry.isReply) {
      responses.push(entry);
    } else {
      entry.dataValues.responses = [];
      console.log(entry);
      posts.push(entry);
    }
  });

  posts.forEach(post => {
    responses.forEach(response => {
      console.log(response.linkedTo);
      if (parseInt(response.linkedTo) === parseInt(post.id)) {
        post.dataValues.responses.push(response);
      }
    });
  });
  return posts;
}

// FOR DEV PURPOSES ONLY - DELETE BEFORE DEPLOY
//============================================================================================================================
var lorem =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti veniam id dolorum eius explicabo est amet reiciendis " +
  "dicta deserunt qui perferendis cupiditate quos modi accusamus, repellat ullam quidem? Nobis adipisci exercitationem quo! " +
  "Deleniti a aspernatur consectetur sed iusto magnam impedit id facilis dolores ipsa quasi quaerat, molestiae voluptas eos, " +
  "saepe eveniet cumque necessitatibus culpa eligendi aliquam rem non quo. Dolorum animi impedit suscipit eos ducimus quam. " +
  "Nobis eius ea repudiandae suscipit nesciunt? Ullam quisquam ab dolorem, deserunt esse dicta cum aliquid vel iusto inventore " +
  "minus atque facilis rem, dignissimos asperiores tempora? Fuga velit facere similique neque accusantium vero minima deleniti " +
  "eius dolorum, voluptate vitae voluptatum eum consequatur sit odio fugiat necessitatibus animi praesentium quae iste, quis " +
  "saepe cumque voluptatem laudantium! Nobis corrupti optio aperiam nisi voluptatum, veniam laborum exercitationem perspiciatis. " +
  "Eius, vel consequuntur rem alias error recusandae adipisci ratione illo explicabo, perferendis omnis reiciendis. Dignissimos " +
  "officiis mollitia deserunt odit suscipit! Suscipit quas laborum ratione sequi eaque quasi veritatis officia! At explicabo a " +
  "sapiente nemo nulla quisquam, quaerat repellendus aperiam dolorum odit omnis expedita facere quia soluta veritatis magni nobis " +
  "laboriosam officiis hic, ullam et labore. Eaque tenetur blanditiis totam cum quod animi eveniet voluptate architecto praesentium " +
  "deleniti sed enim distinctio repellat aut amet perspiciatis tempora, minima ut hic incidunt ducimus dignissimos id ipsum reiciendis! " +
  "Dolorum, porro eveniet id, perferendis laudantium culpa assumenda ducimus nihil corrupti temporibus asperiores perspiciatis ipsum " +
  "dolore repudiandae voluptates itaque aspernatur? Cumque cum consequuntur pariatur nihil mollitia qui aliquid ad non obcaecati rerum " +
  "officiis laborum, a iste modi ut, placeat nemo provident!";

async function seedDB(n) {
  //make n users
  var users = [];
  for (var i = 0; i < n; i++) {
    users.push({
      name: "user_" + i.toString(),
      email: "user" + i.toString() + "@mail.com",
      token: i.toString() + "acde" + (i + 1).toString(),
      emailConfirmed: Math.random() < 0.5,
      tempToken: "temptoken_" + i.toString(),
      expiration: moment()
        .subtract(1, "d")
        .toString()
    });
  }
  //push the users to the db in bulk
  await db.User.bulkCreate(users);
  //make a household
  var household = await db.Household.create({
    name: "thisHouse",
    size: n
  });
  //now associate the users with the household
  for (var i = 0; i < n; i++) {
    await db.User.update({ HouseholdId: household.id }, { where: { name: users[i].name } });
  }
  //now create 50 chores and assign each to a random user
  var freqs = ["dialy", "monthly", "weekly", "yearly"];
  var chores = [];
  for (var i = 0; i < 50; i++) {
    chores.push({
      name: "chore_" + i.toString(),
      frequency: freqs[Math.floor(Math.random() * freqs.length)],
      assignedTo: users[Math.floor(Math.random() * n)].name,
      isComplete: Math.random() < 0.5,
      HouseholdId: household.id
    });
  }
  await db.Chore.bulkCreate(chores);
  var data = await db.Household.findAll({ include: [db.User, db.Chore] });
  //create 2n forum posts
  var posts = [];
  var m = 2 * n;
  for (var j = 0; j < m; j++) {
    posts.push({
      title: "title",
      body: lorem.substring(0, Math.round(Math.random() * 150) + 100), //give back a post with a length between 100 and 250 characters
      category: "category_" + Math.ceil(Math.random() * 5),
      UserId: Math.ceil(Math.random() * users.length)
    });
  }
  //create n replies
  for (var j = 0; j < n; j++) {
    posts.push({
      title: "title",
      body: lorem.substring(0, Math.round(Math.random() * 150) + 100), //give back a post with a length between 100 and 250 characters
      category: "category_" + Math.ceil(Math.random() * 10),
      UserId: Math.ceil(Math.random() * users.length),
      isReply: true,
      linkedTo: Math.ceil(Math.random() * m)
    });
  }
  //create the entries in Post
  // await db.Post.bulkCreate(posts);
  return new Promise(resolve => {
    resolve(data);
  });
}
//============================================================================================================================
