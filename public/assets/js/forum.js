/*
<div class="" style="max-width: 18rem;">
  <div class="card-header">Header</div>
  <div class="card-body">
    <h5 class="card-title">Secondary card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div>
 */
function getUserNames() {
  console.log("here");
  return new Promise(resolve => {
    $.get("/api/users", data => {
      console.log(data);
      if (data.status !== 200) {
        console.log(data.reason);
        return;
      }
      resolve(data.data);
    });
  });
}

async function getAllPosts() {
  //get the data from the database
  var users = await getUserNames();
  console.log(users);
  var userNames = [];
  userNames.push("this user never existed! SQL starts id at 1");
  users.forEach(user => {
    while (userNames.length < parseInt(user.id)) {
      userNames.push("deleted user");
    }
    userNames.push(user.name);
  });
  $.get("/api/posts/", response => {
    var posts = response.data;
    posts.forEach(post => {
      var card = $("<div>").addClass("card text-white bg-secondary mb-3");
      var header = $("<div>")
        .addClass("card-header")
        .text(post.title);
      var body = $("<div>").addClass("card-body");
      var content = $("<div>")
        .addClass("forum-post")
        .text(post.body);
      var category = $("<div>")
        .addClass("forum-category")
        .text(post.category);
      var username = $("<div>").text(userNames[parseInt(post.UserId)]);
      var responses = $("<div>").addClass("forum-response");
      post.responses.forEach(response => {
        //each response will show the user name and the response body - that's it.
        var resUserName = $("<div>").text(userNames[parseInt(response.UserId)]);
        var resContent = $("<div>")
          .addClass("response-post")
          .text(response.body);
        responses.append("<hr />", resUserName, resContent);
      });
      body.append(category, username, content, responses);
      console.log(body);
      card.append(header, body).appendTo($(".container"));
    });
  });
}

getAllPosts();
