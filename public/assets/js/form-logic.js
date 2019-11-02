//form elements
let signupName = $("#signup-name");
let signupEmail = $("#signup-email");
let signupPassword = $("#signup-password");
let signupAlert = $("#signup-alert");
let loginEmail = $("#login-email");
let loginPassword = $("#login-password");
let loginAlert = $("#login-alert");
let updateName = $("#update-profile-name");
let updateEmail = $("#update-profile-email");
let updatePassword = $("#update-profile-password");
let confirmPassword = $("#confirm-profile-password");
let enterPassword = $("#enter-profile-password");
let updateHive = $("#update-profile-hive");
let updateAlert = $("#update-alert");
let hiveCreateName = $("#hive-create-name");
let hiveSignupAlert = $("#hive-signup-alert");
let hiveSignupName = $("#hive-create-name");
let contactAlert = $("#contact-alert");
let contactEmail = $("#contact-email");
let contactName = $("#contact-name");
let contactMessage = $("#contact-message");
const choreModal = $("#chore-modal");
const hiveCreateForm = $("#hive-create-form");

//change listeners for clearing alerts
contactName.on("input", function() {
  if (contactName.hasClass("shake")) {
    contactName.toggleClass("shake");
  }
  if (contactAlert.hasClass("fadeIn")) {
    contactAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

contactEmail.on("input", function() {
  if (contactEmail.hasClass("shake")) {
    contactEmail.toggleClass("shake");
  }
  if (contactAlert.hasClass("fadeIn")) {
    contactAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});
contactMessage.on("input", function() {
  if (contactMessage.hasClass("shake")) {
    contactMessage.toggleClass("shake");
  }
  if (contactAlert.hasClass("fadeIn")) {
    contactAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});
updateHive.on("input", function() {
  if (updateHive.hasClass("shake")) {
    updateHive.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});
hiveSignupName.on("input", function() {
  if (hiveSignupName.hasClass("shake")) {
    hiveSignupName.toggleClass("shake");
  }
  if (hiveSignupAlert.hasClass("fadeIn")) {
    hiveSignupAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});
signupName.on("input", function() {
  if (signupName.hasClass("shake")) {
    signupName.toggleClass("shake");
  }
  if (signupAlert.hasClass("fadeIn")) {
    signupAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

signupEmail.on("input", function() {
  if (signupEmail.hasClass("shake")) {
    signupEmail.toggleClass("shake");
  }
  if (signupAlert.hasClass("fadeIn")) {
    signupAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

signupPassword.on("input", function() {
  if (signupPassword.hasClass("shake")) {
    signupPassword.toggleClass("shake");
  }
  if (signupAlert.hasClass("fadeIn")) {
    signupAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

loginEmail.on("input", function() {
  if (loginEmail.hasClass("shake")) {
    loginEmail.toggleClass("shake");
  }
  if (loginAlert.hasClass("fadeIn")) {
    loginAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

loginPassword.on("input", function() {
  if (loginPassword.hasClass("shake")) {
    loginPassword.toggleClass("shake");
  }
  if (loginAlert.hasClass("fadeIn")) {
    loginAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

updateName.on("input", function() {
  if (updateName.hasClass("shake")) {
    updateName.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

updateEmail.on("input", function() {
  if (updateEmail.hasClass("shake")) {
    updateEmail.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

updatePassword.on("input", function() {
  if (updatePassword.hasClass("shake")) {
    updatePassword.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

updateHive.on("input", function() {
  if (updateHive.hasClass("shake")) {
    updateHive.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

confirmPassword.on("input", function() {
  if (confirmPassword.hasClass("shake")) {
    confirmPassword.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});
enterPassword.on("input", function() {
  if (enterPassword.hasClass("shake")) {
    enterPassword.toggleClass("shake");
  }
  if (updateAlert.hasClass("fadeIn")) {
    updateAlert.toggleClass("fadeIn").toggleClass("fadeOut");
  }
});

//form submit actions
$("#signup-submit").on("click", async function() {
  //Validate the form
  var name = signupName.val().trim();
  var nameRegEx = /^\S*$/;
  if (!nameRegEx.test(name) || name.length < 4 || name.length > 16) {
    toggleError(
      signupName,
      "Your user name cannot contain spaces and must be between 4 and 16 characters",
      "signup"
    );
    return;
  }

  var email = signupEmail.val().trim();
  var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegEx.test(email)) {
    toggleError(signupEmail, "Invalid email address", "signup");
    return;
  }

  var password = signupPassword.val().trim();
  if (password.length < 6) {
    toggleError(signupPassword, "Passwords must contain at least 6 characters", "signup");
    return;
  }
  //end form validation

  //get a token from the api

  var userObject = {
    name,
    email,
    HiveId: 1
  };
  var authData = await $.post("/api/auth", { email, password });
  userObject.token = authData.token;
  //attempt to create a user in the dB
  var userData = await $.post("/api/user", userObject);

  //validation from the back end
  if (userData.errors) {
    var fields = Object.keys(userData.fields);
    switch (fields[0]) {
      case "email":
        toggleError(signupEmail, "the email address entered already exists", "signup");
        return;
      case "name":
        toggleError(signupName, "the name entered already exists", "signup");
        return;
    }
  } else {
    user = userData;
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  //if no errors, empty the form and stash it
  signupName.val("");
  signupEmail.val("");
  signupPassword.val("");
  signupForm.detach().appendTo(tray);
  hiveCreateForm.detach().appendTo(parentDiv);
  navLogout.text("logout");
});

$("#login-submit").on("click", async function() {
  var email = loginEmail.val().trim();
  var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegEx.test(email)) {
    toggleError(loginEmail, "Invalid email address", "login");
    return;
  }

  var password = loginPassword.val().trim();
  if (password.length < 6) {
    toggleError(loginPassword, "Passwords must contain at least 6 characters", "login");
    return;
  }

  //hit the api for credientals...
  var userData = await $.ajax({
    url: "/api/auth",
    method: "PUT",
    data: { email, password }
  });
  if (userData.err) {
    if (userData.err.field === "email") {
      toggleError(loginEmail, userData.err.message, "login");
      return;
    }
    if (userData.err.field === "password") {
      toggleError(loginPassword, userData.err.message, "login");
      return;
    }
  } else {
    user = userData;
    sessionStorage.setItem("user", JSON.stringify(user));
    hive = await $.get("/api/hive/" + user.HiveId);
    sessionStorage.setItem("hive", JSON.stringify(hive));
    navLogout.text("logout");
  }
  $("#login-form")
    .detach()
    .appendTo(tray);
  if (hive.id === 1) {
    hiveCreateForm.detach().appendTo(parentDiv);
  } else {
    buildHive();
  }
});

$("#hive-create-submit").on("click", async function() {
  var hiveName = hiveCreateName.val().trim();
  if (hiveName.length < 4 || hiveName.length > 32) {
    toggleError(
      hiveSignupName,
      "Hive name must be between 4 and 32 characters, inclusive",
      "hive-signup"
    );
    return;
  }
  var existingHive = await $.get("/api/hive/byname/" + hiveName);
  if (existingHive) {
    user = await $.ajax({
      url: "/api/user/" + user.id,
      method: "PUT",
      data: { HiveId: existingHive.id }
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    hive = await $.get("/api/hive/" + existingHive.id);
    sessionStorage.setItem("hive", JSON.stringify(hive));
  } else {
    var newHive = await $.post("/api/hive", { name: hiveName, queen: user.name });
    console.log(newHive);
    user = await $.ajax({
      url: "/api/user/" + user.id,
      method: "PUT",
      data: { HiveId: newHive.id }
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    hive = await $.get("/api/hive/" + newHive.id);
    sessionStorage.setItem("hive", JSON.stringify(hive));
  }

  hiveCreateName.val("");
  hiveCreateForm.detach().appendTo(tray);
  buildHive();
});

$("#contact-submit").on("click", async function() {
  var name = contactName.val().trim();
  if (name.length === 0) {
    toggleError(contactName, "Please enter your name", "contact");
    return;
  }
  var email = contactEmail.val().trim();
  var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegEx.test(email)) {
    toggleError(contactEmail, "Please enter a valid email address", "contact");
    return;
  }
  var message = contactMessage.val().trim();
  if (message.length === 0) {
    toggleError(contactMessage, "Please write a bit about why you are contacting us", "contact");
  }
  var dataBlob = await $.post("/api/email/contact", {
    subject: name + " sent a message to the Busy Bee Team",
    email,
    message
  });

  console.log(dataBlob);
  contactName = "";
  contactEmail = "";
  contactMessage = "";
  contactAlert
    .text(
      "Thanks for contacting us! We've sent a confirmation email to the address you provided. Someone from the team will reply to your message shortly."
    )
    .toggleClass("fadeIn");
});
//functions
function toggleError(element, message, target) {
  if (element.hasClass("shake")) {
    element.toggleClass("shake");
  }
  element.toggleClass("shake");
  switch (target) {
    case "signup":
      if (signupAlert.hasClass("fadeOut")) {
        signupAlert.toggleClass("fadeOut");
      }
      signupAlert.text(message).toggleClass("fadeIn");
      break;
    case "login":
      if (loginAlert.hasClass("fadeOut")) {
        loginAlert.toggleClass("fadeOut");
      }
      loginAlert.text(message).toggleClass("fadeIn");
      break;
    case "update":
      if (updateAlert.hasClass("fadeOut")) {
        updateAlert.toggleClass("fadeOut");
      }
      updateAlert.text(message).toggleClass("fadeIn");
      break;
    case "hive-signup":
      if (hiveSignupAlert.hasClass("fadeOut")) {
        hiveSignupAlert.toggleClass("fadeOut");
      }
      hiveSignupAlert.text(message).toggleClass("fadeIn");
      break;
    case "contact":
      if (contactAlert.hasClass("fadeOut")) {
        contactAlert.toggleClass("fadeOut");
      }
      contactAlert.text(message).toggleClass("fadeIn");
      break;
  }
}

//top-nav-listeners
$(".top-nav-link").on("click", function() {
  var text = $(this).text();
  console.log(text);
  switch (text) {
    case "New Chore":
      $("#chore-assigned-to").empty();
      hive.Users.forEach(member => {
        var option = $("<option>").text(member.name);
        if (user.name === member.name) {
          option.prop("selected", true);
        }
        option.appendTo($("#chore-assigned-to"));
      });
      $("#chore-submit").attr("data-type", "create");
      $("#chore-modal-title").text("Create A New Chore");
      choreModal.modal("show");
      break;
  }
});

//profile button listeners
$("#update-profile-name-submit").on("click", function(event) {
  event.preventDefault();
  var name = updateName.val().trim();
  var nameRegEx = /^\S*$/;
  if (!nameRegEx.test(name) || name.length < 4 || name.length > 16) {
    toggleError(
      updateName,
      "Your user name cannot contain spaces and must be between 4 and 16 characters",
      "update"
    );
    return;
  }
  $.ajax({
    url: "/api/user/" + user.id,
    method: "PUT",
    data: { name: name }
  })
    .then(updatedUser => {
      user = updatedUser;
      sessionStorage.setItem("user", JSON.stringify(user));
      updateName.val("");
      buildProfile();
    })
    .catch(err => console.log(err));
});

$("#update-profile-email-submit").on("click", async function(event) {
  event.preventDefault();
  var email = updateEmail.val().trim();
  var emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegEx.test(email)) {
    toggleError(updateEmail, "Invalid email address", "update");
    return;
  }
  var password = enterPassword.val().trim();
  //confirm the password
  var userData = await $.ajax({
    url: "/api/auth",
    method: "PUT",
    data: { email: user.email, password }
  });

  if (userData.err) {
    if (userData.err.field === "password") {
      toggleError(enterPassword, userData.err.message, "update");
      return;
    }
    console.log(userData.err);
  } else {
    //get a new token
    var authObj = await $.post("/api/auth", { email, password });
    console.log(email, password, authObj.token);
    user = await $.ajax({
      url: "/api/user/" + user.id,
      method: "PUT",
      data: { email, token: authObj.token }
    });
    sessionStorage.setItem("user", JSON.stringify(user));
  }
  updateEmail.val("");
  enterPassword.val("");
  buildProfile();
});

$("#update-profile-password-submit").on("click", function(event) {
  event.preventDefault();
  var password = updatePassword.val().trim();
  if (password.length < 6) {
    toggleError(updatePassword, "Passwords must contain at least 6 characters", "update");
    return;
  }
  var confirm = confirmPassword.val().trim();
  if (password !== confirm) {
    toggleError(confirmPassword, "Passwords do not match", "update");
    return;
  }
  $.post("/api/auth", { email: user.email, password })
    .then(authObj => {
      $.ajax({
        url: "/api/user/" + user.id,
        method: "PUT",
        data: { token: authObj.token }
      })
        .then(updatedUser => {
          user = updatedUser;
          sessionStorage.setItem("user", JSON.stringify(user));
          updatePassword.val("");
          confirmPassword.val("");
          buildProfile();
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

$("#update-profile-hive-submit").on("click", async function(event) {
  event.preventDefault();
  var hiveName = updateHive.val().trim();
  if (hiveName.length < 4 || hiveName.length > 32) {
    toggleError(
      hiveSignupName,
      "Hive name must be between 4 and 32 characters, inclusive",
      "update"
    );
    return;
  }
  if (user.name === hive.queen) {
    hive.Users.forEach(member => {
      if (member.name === user.name) {
        return;
      }
      $("#new-queen-name").append($(`<option>${member.name}</option>`));
    });
    $("#queen-modal").modal("show");
    return;
  }

  //if you are the only hive member and you leave, delete the old hive
  var deleteHive = false;
  var oldHiveId = hive.id;
  if (hive.Users.length === 1) {
    deleteHive = true;
  }

  var existingHive = await $.get("/api/hive/byname/" + hiveName);
  if (existingHive) {
    user = await $.ajax({
      url: "/api/user/" + user.id,
      method: "PUT",
      data: { HiveId: existingHive.id }
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    hive = await $.get("/api/hive/" + existingHive.id);
    sessionStorage.setItem("hive", JSON.stringify(hive));
  } else {
    var newHive = await $.post("/api/hive", { name: hiveName, queen: user.name });
    user = await $.ajax({
      url: "/api/user/" + user.id,
      method: "PUT",
      data: { HiveId: newHive.id }
    });
    sessionStorage.setItem("user", JSON.stringify(user));
    hive = await $.get("/api/hive/" + newHive.id);
    sessionStorage.setItem("hive", JSON.stringify(hive));
  }
  if (deleteHive) {
    await $.ajax({
      url: "/api/hive/" + oldHiveId,
      method: "DELETE",
      data: {}
    });
  }
  updateHive.val("");
  buildProfile();
});

$("#new-queen-close").on("click", function() {
  updateHive.val("");
  $("#queen-modal").modal("hide");
});

$("#new-queen-submit").on("click", async function(event) {
  event.preventDefault();
  var queen = $("#new-queen-name").val();
  console.log(queen);
  hive = await $.ajax({
    url: "/api/hive/" + hive.id,
    method: "PUT",
    data: { queen }
  });
  sessionStorage.setItem("hive", JSON.stringify(hive));
  $("#update-profile-hive-submit").trigger("click");
  $("#queen-modal").modal("hide");
});

$(document).on("click", ".form-check-input", function() {
  var labelId = $(this)
    .attr("id")
    .split("-");
  labelId.shift();
  labelId.unshift("label");
  var choreId = labelId[2];
  var id = labelId.join("-");
  var label = $("#" + id);
  var checked = $(this).prop("checked");
  if (!checked && label.hasClass("completed")) {
    label.toggleClass("completed");
  }
  if (checked && !label.hasClass("completed")) {
    label.toggleClass("completed");
  }
  updateChore(choreId, checked);
});

function updateChore(id, state) {
  var markedCompleteAt = null;
  if (state) {
    markedCompleteAt = moment().toString();
    console.log(markedCompleteAt);
  }
  $.ajax({
    url: "/api/chore/" + id,
    method: "PUT",
    data: { isComplete: state, markedCompleteAt }
  }).then(updatedHive => {
    console.log(updatedHive);
    hive = updatedHive;
    sessionStorage.setItem("hive", JSON.stringify(hive));
    buildTask();
  });
}

$(".toggle-show-completed").on("click", function() {
  switch ($(this).attr("data-target")) {
    case "to-do":
      showCompletedToDo = !showCompletedToDo;

      break;
    case "tasks":
      showCompletedTasks = !showCompletedTasks;

      break;
  }
  if ($(this).text() === "Hide Completed") {
    $(this).text("Show Completed");
  } else {
    $(this).text("Hide Completed");
  }
  buildTask();
});
