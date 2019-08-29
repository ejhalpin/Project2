//THIS FILE SHOULD BE INCLUDED ON EVERY PAGE
/**
 * This file will add the authentication modal to the DOM
 * It includes the scripts for authenticating and submitting the form
 * Any link that allows a user to login / signup should display the modal:
 * $("#auth-modal").modal("show")
 */
var signOutIcon = "<i class='fas fa-sign-out-alt'></i>";
var signInIcon = "<i class='far fa-user'></i>";

//warm-up routines
var Household;
var local, session;
if (localStorage.getItem("instance")) {
  local = JSON.parse(localStorage.getItem("instance"));
}
if (sessionStorage.getItem("instance")) {
  session = JSON.parse(sessionStorage.getItem("instance"));
}

//The HTML for the auth modal and optional name field for signup
var nameInput = `<div id="signup" class="form-group">
<label for="signup-name">unique name</label>
<input type="text" class="form-control" id="signup-name" aria-describedby="nameHelp" placeholder="arya stark" />
<small id="nameHelp" class="form-text text-muted">Your name needs to be unique. Go ahead and use spaces and special characters.</small>
</div>`;

var authModal = `
<div id="auth-modal" class="modal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Login</h5>
        <button type="button" id="close-auth-modal" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="auth-modal-body" class="modal-body">
      <form id="auth-form">
      <div class="form-group">
        <label for="login-email">email address</label>
        <input type="email" class="form-control" id="login-email" aria-describedby="emailHelp" placeholder="arya.stark@winterfell.com" />
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group">
        <label for="login-password">password</label>
        <input type="password" class="form-control" id="login-password" placeholder="password" />
      </div>
      
      </form>
      </div>
      <div class="modal-footer">
      <button type="button" id="auth-swap" class="btn btn-secondary">sign up</button>
      <button type="submit" id="login-submit" class="btn btn-primary">login</button>
      </div>
    </div>
  </div>
</div>`;

$(document).on("click", "#user-icon", function() {
  var state = parseInt($(this).attr("data-state"));
  if (state) {
    //log out the user
    sessionStorage.clear();
    session = undefined;
    //swap the icon
    // $("#user-icon")
    //   .empty()
    //   .append(signInIcon)
    //   .attr("title", "Login")
    //   .attr("data-original-title", "Login")
    //   .attr("data-state", "0");
    location.reload(true);
  } else {
    // show the login/signup modal
    $("#auth-modal").modal("show");
  }
});

//toggle between the login and signup forms
$(document).on("click", "#auth-swap", () => {
  var text = $("#auth-swap").text();
  switch (text) {
    case "sign up":
      $("#auth-form").prepend(nameInput);
      $("#auth-swap").text("login");
      $("#login-submit").text("sign up");
      break;
    case "login":
      $("#signup").remove();
      $("#auth-swap").text("sign up");
      $("#login-submit").text("login");
      break;
  }
});

//submit the auth form
$(document).on("click", "#login-submit", event => {
  event.preventDefault();
  var text = $("#login-submit").text();
  var credentials = {
    email: $("#login-email")
      .val()
      .trim(),
    password: $("#login-password")
      .val()
      .trim(),
    name: ""
  };
  if (credentials.email.length === 0 || credentials.password.length === 0) {
    $("#alert").remove();
    $("#auth-modal-body").prepend(`<div id="alert" class="alert alert-light" role="alert">
    <span id="message">the fields can't be empty</span>
    <button id="close" type="button" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`);
    return;
  }
  if (text === "sign up") {
    text = "signup";
    credentials.name = $("#signup-name")
      .val()
      .trim();
    if (credentials.name.length === 0) {
      $("#alert").remove();
      $("#auth-modal-body").prepend(`<div id="alert" class="alert alert-light" role="alert">
    <span id="message">the fields can't be empty</span>
    <button id="close" type="button" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>`);
      return;
    }
  }
  switch (text) {
    case "signup":
      //use the signup route
      authenticateUser("/auth/signup", credentials)
        .then(() => {
          $("#auth-modal").modal("hide");
          $("#user-icon")
            .empty()
            .append(signOutIcon)
            .attr("data-state", "1")
            .attr("title", "Logout")
            .attr("data-original-title", "Logout");
        })
        .catch(err => {
          console.log(err);
        });
      break;
    case "login":
      //use the login route
      authenticateUser("/auth/login", credentials)
        .then(() => {
          // $("#auth-modal").modal("hide");
          // $("#user-icon")
          //   .empty()
          //   .append(signOutIcon)
          //   .attr("data-state", "1")
          //   .attr("title", "Logout")
          //   .attr("data-original-title", "Logout");
          location.reload(true);
        })
        .catch(err => {
          console.log(err);
        });
      break;
  }
});

function authenticateUser(route, credentials) {
  return new Promise(resolve => {
    //The data returned by the server is placed in the session storage
    $.post(route, credentials, res => {
      if (res.status === 409) {
        $("#alert").remove();
        $("#auth-modal-body").prepend(`<div id="alert" class="alert alert-light" role="alert">
  <span id="message">${res.reason}</span>
  <button id="close" type="button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`);

        console.log(res.reason);
        return;
      }
      if (res.status === 500) {
        $("#alert").remove();
        $("#auth-modal-body").prepend(`<div id="alert" class="alert alert-light" role="alert">
  <span id="message">${res.reason}</span>
  <button id="close" type="button" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`);
        console.log(res.reason);
        return;
      }
      if (res.status === 200) {
        //set the friend finder data instance in session storage
        session = res.data[0];
        $.get("/api/household/" + session.HouseholdId, response => {
          Household = response.data;
          console.log(Household);
        });
        console.log(session);
        sessionStorage.setItem("instance", JSON.stringify(session));
      }
      resolve(true);
    });
  });
}

$(document).on("click", "#close", function() {
  $("#alert").remove();
});

$(document).on("click", "#auth-modal-close", function() {
  $("#auth-modal").modal("hide");
});

$(document).ready(function() {
  $("#parent").append(authModal);
  if (local) {
    sessionStorage.setItem("instance", JSON.stringify(local));
  }
  if (session) {
    $.get("/api/household/" + session.HouseholdId, response => {
      Household = response.data;
      console.log(Household);
    });
    $("#user-icon")
      .empty()
      .append(signOutIcon)
      .attr("title", "Logout")
      .attr("data-original-title", "Logout")
      .attr("data-state", "1");
  }
});
