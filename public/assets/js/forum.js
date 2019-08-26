//global variables
//an array of forum categories - const
const categories = [
  "all",
  "cleaning",
  "diy",
  "laundry",
  "appliance repair",
  "landscaping",
  "other"
];
categories.sort();
//a variable to hold the html for the post-modal

//a function to retreive all user names from the database
//DEVNOTE: THIS FUNCTION SHOULD BE REPLACED WITH AJAX CALLS FOR USER DATA ON THE FLY
function getUserNames() {
  return new Promise(resolve => {
    $.get("/api/users", data => {
      if (data.status !== 200) {
        console.log(data.reason);
        return;
      }
      var userNames = [];
      userNames.push("this user never existed! SQL starts id at 1");
      data.data.forEach(user => {
        while (userNames.length < parseInt(user.id)) {
          userNames.push("deleted user");
        }
        userNames.push(user.name);
      });
      resolve(userNames);
    });
  });
}

function getAllPosts() {
  $.get("/api/posts/", response => {
    var posts = response.data;
    layOutForum(posts);
  });
}

function getPostsByCategory(category) {
  $.get("/api/posts/" + category, response => {
    layOutForum(response.data);
  });
}

function getPostsByUser(userName) {
  $.get("/api/posts-by-user/" + userName, response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    console.log(response);
    layOutForum(response.data);
  });
}

//a function to lay out the forum data
async function layOutForum(posts) {
  $("#target").empty();
  var userNames = await getUserNames();
  posts.forEach(post => {
    var card = $("<div>").addClass("card text-white bg-secondary mb-3");
    var header = $("<div>").addClass("card-header");
    var title = $("<div>")
      .attr("id", "title-" + post.id)
      .text(post.title);
    var category = $("<div>")
      .addClass("forum-category")
      .attr("id", "category-" + post.id)
      .text(post.category);
    var username = $("<div>").append(
      "<a class='user-name' href='#'>" + userNames[parseInt(post.UserId)] + "</a>"
    );
    var flag = $("<div>").append(
      "<a class='flag-post' data-id='" + post.id + "' href='#'>flag post</a>"
    );
    var titleDiv = $("<div>")
      .addClass("title-div")
      .append(title, category, username, flag);
    header.append(titleDiv);
    var body = $("<div>").addClass("card-body");
    var content = $("<div>")
      .addClass("forum-post")
      .text(post.body);
    body.append(content);
    if (post.responses) {
      var responses = $("<div>").addClass("forum-response");
      post.responses.forEach(response => {
        //each response will show the user name and the response body - that's it.
        var resUserName = $("<div>").text(userNames[parseInt(response.UserId)]);
        var flagReply = $("<div>").append(
          "<a class='flag-post' data-id='" + response.id + "' href='#'>flag reply</a>"
        );
        var replyHeader = $("<div>")
          .addClass("title-div")
          .append(resUserName, flagReply);
        var resContent = $("<div>")
          .addClass("response-post")
          .text(response.body);
        responses.append("<hr />", replyHeader, resContent);
      });
      body.append(responses);
    }
    var reply = $("<div>").append(
      "<a class='reply-to-post' data-id='" + post.id + "' href='#'>reply to post</a>"
    );
    body.append("<hr/>", reply);
    card.append(header, body).appendTo($("#target"));
  });
}

//a function to lay out the page structure
function loadStructure() {
  $("#target").empty();
  //define the global container
  var global = $("<div>").addClass("container");
  global.append(` <nav class="navbar navbar-expand-md navbar-dark bg-dark">
  <a id="forum-link" class="navbar-brand" href="#">Forum</a>
  <button
    class="navbar-toggler"
    type="button"
    data-toggle="collapse"
    data-target="#navbarSupportedContent"
    aria-controls="navbarSupportedContent"
    aria-expanded="false"
    aria-label="Toggle navigation"
  >
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" id="rules-link" href="#">Rules</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Category: <span id="selected-category">all</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
          
        </div>
      </li>
    </ul>
    <form class="form-inline my-2 my-lg-0">
      <input
        class="form-control mr-sm-2"
        type="search"
        placeholder="Search by title"
        aria-label="Search"
        id="title-input"
      />
      <button
        id="title-search"
        class="btn btn-outline-success my-2 my-sm-0"
        type="button"
      >
        Search
      </button>
      <button type="button" id="create-post" class="btn btn-info">&plus;</button>
    </form>
  </div>
</nav>`);
  var target = $("<div>").attr("id", "target");
  global.append(target);
  //add all of the categories from the array to the dropdown

  global.appendTo($(".container"));
  categories.forEach(item => {
    $("<a class='dropdown-item' href='#'>" + item + "</a>").appendTo(".dropdown-menu");
  });
}

//a function to execute title searches
function searchByTitle(title) {
  $.get("/api/posts-search/" + title, response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    if (response.data.length === 0) {
      $("#target").empty();
      var card = $("<div>").addClass("card text-white bg-secondary mb-3");
      var header = $("<div>")
        .addClass("card-header")
        .text("Your search did not return any results. :(");
      card.append(header).appendTo($("#target"));
    }
    console.log(response);
    layOutForum(response.data);
  });
}

//a function to populate the post-modal category select box
function getCategoryOptions() {
  var options = "";
  categories.forEach((category, index) => {
    if (index === 0) {
      return;
    }
    if (index === 1) {
      return (options =
        options + "<option value=" + index + " selected>" + category + "</option>\n");
    }
    options = options + "<option value=" + index + ">" + category + "</option>\n";
  });
  return options;
}

//document level clicks...
$(document).on("click", "#forum-link", () => {
  getAllPosts();
});

$(document).on("click", "#rules-link", () => {
  //search the document for the alert
  var alert = $("#rules-alert").text();
  if (alert) {
    $("#rules-alert").remove();
  } else {
    $(`
  <div id="rules-alert" class="alert alert-dark" role="alert">
    <h4>Forum Rules</h4>
    <ul>
      <li>Don't be a Jerk.</li>
      <li>Keep it family friendly.</li>
    </ul>
  </div>`).prependTo($("#target"));
  }
  //define an alert modal, and prepend it to target
});

$(document).on("click", ".dropdown-item", function() {
  var category = $(this).text();
  if (category === "all") {
    getAllPosts();
  }
  $("#selected-category").text(category);
  getPostsByCategory(category);
});

$(document).on("click", "#title-search", () => {
  var title = $("#title-input")
    .val()
    .trim();
  if (title.length === 0) {
    return;
  }
  searchByTitle(title);
});

$(document).on("click", ".user-name", function() {
  var userName = $(this).text();
  getPostsByUser(userName);
});

$(document).on("click", ".flag-post", function() {
  var id = $(this).attr("data-id");
  $.ajax({
    method: "PUT",
    url: "/api/posts/" + id,
    data: {
      id: id,
      idFlagged: true
    }
  }).then(response => {
    console.log(response);
  });
});

$(document).on("click", "#create-post", () => {
  //if the user is not logged in, show the login modal
  if (session) {
    $("#post-modal").modal("show");
  } else {
    $("#auth-modal").modal("show");
  }
});

$(document).on("click", ".reply-to-post", function() {
  $("#submit-reply").attr("data-link", $(this).attr("data-id"));
  $("#reply-modal").modal("show");
});

$(document).on("click", "#submit-post", function() {
  var postData = {
    UserId: session.id,
    isReply: false,
    title: $("#post-title")
      .val()
      .trim(),
    body: $("#post-body")
      .val()
      .trim(),
    category: categories[parseInt($("#category-select").val())]
  };
  $.post("/api/post", postData, response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    $("#post-modal").modal("hide");
    location.reload();
  });
});

$(document).on("click", "#submit-reply", function() {
  var postId = $(this).attr("data-link");
  var postData = {
    UserId: session.id,
    isReply: true,
    linkedTo: postId,
    title: $("#title-" + postId).text(),
    body: $("#reply-body")
      .val()
      .trim(),
    category: $("#category-" + postId).text()
  };
  console.log(postData);
  $.post("/api/post", postData, response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    $("#reply-modal").modal("hide");
    location.reload();
  });
});

$(document).ready(() => {
  loadStructure();
  getAllPosts();
  $("#category-select").append(getCategoryOptions());
});

//TODO - use flagged data to change color of post or reply and disable the flag post / flag reply link
//TODO - be able to delete a post if you are the user
//TODO - show user name somewhere if they have a token
//TODO - add a login to the navbar if it does not exist
