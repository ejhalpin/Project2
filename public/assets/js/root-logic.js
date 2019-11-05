//Global containers
const welcomeView = $("#welcome");
const parentDiv = $("#parent");
const tray = $("#tray");
const signupForm = $("#signup-form");
const loginForm = $("#login-form");
const navLogout = $("#nav-logout");

var user;
var hive;

$(document).ready(() => {
  user = JSON.parse(sessionStorage.getItem("user"));
  hive = JSON.parse(sessionStorage.getItem("hive"));
  if (user && hive) {
    loadContent("Tasks");
    $("#nav-logout").text("logout");
  }
});

//Event listeners
$(document).on("click", "#sign-up-button", () => {
  parentDiv.toggleClass("animated").toggleClass("fadeOut");
  setTimeout(function() {
    welcomeView.detach().appendTo(tray);
    signupForm.detach().appendTo(parentDiv);
    parentDiv.toggleClass("fadeOut").toggleClass("fadeIn");
  });
});

$("#nav-logout").on("click", function() {
  var text = navLogout.text();
  switch (text) {
    case "login":
      $(parentDiv.children())
        .detach()
        .appendTo(tray);
      loginForm.detach().appendTo(parentDiv);
      break;
    case "logout":
      $(parentDiv.children())
        .detach()
        .appendTo(tray);
      user = undefined;
      hive = undefined;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("hive");
      welcomeView.detach().appendTo(parentDiv);
      navLogout.text("login");
  }
});

$(document).on("click", ".rem-user", function() {
  $.ajax({
    url: "/api/user/" + $(this).attr("data-id"),
    method: "DELETE",
    data: {}
  })
    .then(res => {
      hive = res;
      sessionStorage.setItem("hive", JSON.stringify(hive));
      buildHive();
    })
    .catch(err => {
      console.log(err);
    });
});

$(document).on("click", ".rem-chore", function() {
  $.ajax({
    url: "/api/chore/" + $(this).attr("data-id"),
    method: "DELETE",
    data: {}
  })
    .then(() => {
      $.get("/api/hive/" + hive.id).then(updatedHive => {
        hive = updatedHive;
        sessionStorage.setItem("hive", JSON.stringify(hive));
        buildHive();
      });
    })
    .catch(err => {
      console.log(err);
    });
});
