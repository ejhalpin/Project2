console.log(session);
//Big Display Function(Probably need to break it down into seperate functions???)
function houseDisplay() {
  $("#userLink").append(`<a class="nav-link" href="/">${session.name}</a>`);
  let queryURL = "/api/household/" + session.HouseholdId;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var rez = response.data;
    console.log(rez.Users);
    if (rez.Users === undefined) {
      console.log("No Househould!");
    } else {
      for (var j = 0; j < rez.Users.length; j++) {
        console.log(rez.Users.length);
        var cardDiv = $("<div class='card cardUser bg-light'>");
        cardDiv.append(`<div class="card-header">${rez.Users[j].name}</div>`);
        var cardBody = $("<div class='card-body'>");
        var cardTitle = $("<h5 class='card-title>Chores</h5>");
        var cardListDaily = $("<ul>");
        var cardListMonthly = $("<ul>");
        var cardListWeekly = $("<ul>");
        var cardListYearly = $("<ul>");
        var cardListDailyComplete = $("<ul>");
        var cardListMonthlyComplete = $("<ul>");
        var cardListWeeklyComplete = $("<ul>");
        var cardListYearlyComplete = $("<ul>");
        cardBody.append(cardTitle);
        console.log(rez.Chores.length);
        if (rez.Chores.length === 0) {
          console.log(rez.Chores.length);
          cardListDaily.append("<li>Hello!</li>");
          cardListMonthly.append("<li>You currently have no chores for your household!</li>");
          cardBody.append(cardListDaily);
          cardBody.append(cardListMonthly);
          cardDiv.append(cardBody);
          $(".special-container").append(cardDiv);
        }
        for (var z = 0; z < rez.Chores.length; z++) {
          var special = rez.Chores[z];
          if (rez.Users[j].name === special.assignedTo) {
            console.log("special = " + special.name);
            var intermediate2 = $(
              `<li class='chore-${z}'>${special.name}(${special.frequency})</p>`
            );
            if (rez.Chores[z].isComplete === true) {
              intermediate2.addClass("complete");
              intermediate2.attr("style", "color: green;");
            }
            switch (special.frequency) {
              case "dialy":
                intermediate2.addClass("daily");
                if (special.isComplete === false) {
                  cardListDaily.append(intermediate2);
                } else {
                  cardListDailyComplete.append(intermediate2);
                }
                break;
              case "Daily":
                intermediate2.addClass("daily");
                if (special.isComplete === false) {
                  cardListDaily.append(intermediate2);
                } else {
                  cardListDailyComplete.append(intermediate2);
                }
                break;
              case "Weekly":
                intermediate2.addClass("weekly");
                if (special.isComplete === false) {
                  cardListWeekly.append(intermediate2);
                } else {
                  cardListWeeklyComplete.append(intermediate2);
                }
                break;
              case "Monthly":
                intermediate2.addClass("monthly");
                if (special.isComplete === false) {
                  cardListMonthly.append(intermediate2);
                } else {
                  cardListMonthlyComplete.append(intermediate2);
                }
                break;
              case "Yearly":
                intermediate2.addClass("yearly");
                if (special.isComplete === false) {
                  cardListYearly.append(intermediate2);
                } else {
                  cardListYearlyComplete.append(intermediate2);
                }
                break;
            }
          }
        }
        cardBody.append(cardListDailyComplete);
        cardBody.append(cardListDaily);
        cardBody.append(cardListWeeklyComplete);
        cardBody.append(cardListWeekly);
        cardBody.append(cardListMonthlyComplete);
        cardBody.append(cardListMonthly);
        cardBody.append(cardListYearlyComplete);
        cardBody.append(cardListYearly);
        cardDiv.append(cardBody);
        $(".special-container").append(cardDiv);
      }
      var hide = true;
      $(".complete").hide();
      $("#hideComplete").on("click", function() {
        if (hide === false) {
          $(".complete").hide();
          $("#hideComplete").html("Show Completed Chores");
          hide = true;
        } else {
          $("#hideComplete").html("Hide Completed Chores");
          $(".complete").show();
          hide = false;
        }
      });
    }
  });
}
$("#frequencyFilterButton").on("click", function() {
  var test = $("#frequencyFilter").val();
  console.log(test);
  switch (test) {
    case "Daily":
      $(".daily").show();
      $(".weekly").hide();
      $(".monthly").hide();
      $(".yearly").hide();
      break;
    case "Weekly":
      $(".daily").hide();
      $(".weekly").show();
      $(".monthly").hide();
      $(".yearly").hide();
      break;
    case "Monthly":
      $(".daily").hide();
      $(".weekly").hide();
      $(".monthly").show();
      $(".yearly").hide();
      break;
    case "Yearly":
      $(".daily").hide();
      $(".weekly").hide();
      $(".monthly").hide();
      $(".yearly").show();
      break;
    case "All":
      $(".daily").show();
      $(".weekly").show();
      $(".monthly").show();
      $(".yearly").show();
      break;
  }
});

$("#invite-btn").on("click", function() {
  var friendEmail = $("#email-field")
    .val()
    .trim();
  $.ajax({
    url: "auth/invite",
    method: "POST",
    data: {
      name: session.name,
      email: friendEmail,
      HouseholdId: session.HouseholdId
    }
  }).then(function(response) {
    console.log(response.stats);
    if (response.status === 200) {
      var intermediate = "<p>We've sent them an email!</p>";
      $(".invite-body").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    }
  });
});

function choreEdit() {
  let queryURL = "/api/household/" + session.HouseholdId;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    var rez = response.data;
    if (rez.Chores === undefined) {
      console.log("ERR: No Household");
    } else {
      for (var z = 0; z < rez.Chores.length; z++) {
        if (rez.Chores[z].isComplete === false) {
          var intermediate = $(
            `<option value='${rez.Chores[z].id}'> ${rez.Chores[z].name}</option>`
          );
          $("#chore-selector2").append(intermediate);
        }
      }
      for (var z = 0; z < rez.Chores.length; z++) {
        if (rez.Chores[z].isComplete === false) {
          var intermediate = $(
            `<option value='${rez.Chores[z].id}'> ${rez.Chores[z].name}</option>`
          );
          $("#chore-selector3").append(intermediate);
        }
      }
      for (var j = 0; j < rez.Users.length; j++) {
        var special = rez.Users[j];
        specialCheck = $(`<option value="${special.name}">${special.name}</option><br>`);
        $("#chore-assigned-to").append(specialCheck);
      }
      for (var j = 0; j < rez.Users.length; j++) {
        var special = rez.Users[j];
        specialCheck = $(`<option value="${special.name}">${special.name}</option><br>`);
        $("#new-assigned-to").append(specialCheck);
      }
    }
  });
}

// $("#chore-submit").on("click", function() {
//   var queryURL = "/api/chore/";
//   var newChore = $("#chore-title")
//     .val()
//     .trim();
//   var desc = $("#chore-details")
//     .val()
//     .trim();
//   var frequency = $("#chore-frequency").val();
//   var assignee = $("#chore-assigned-to").val();
//   $.ajax({
//     url: queryURL,
//     method: "POST",
//     data: {
//       name: newChore,
//       details: desc,
//       frequency: frequency,
//       assignedTo: assignee,
//       HouseholdId: session.HouseholdId
//     }
//   }).then(function(resp) {
//     console.log(resp.data);
//   });
// });

$("#chore-edit").on("click", function() {
  var choreID = $(".chore-selector3").val();
  var queryURL = "/api/chores/" + choreID;
  var newChore = $("#new-title")
    .val()
    .trim();
  var desc = $("#new-details")
    .val()
    .trim();
  var frequency = $("#new-frequency").val();
  var assignee = $("#new-assigned-to").val();
  if (newChore === "") {
    $.ajax({
      url: queryURL,
      method: "PUT",
      data: {
        details: desc,
        assignedTo: assignee,
        frequency: frequency
      }
    }).then(function(response) {
      console.log(response.status);
      if (response.status === 200) {
        var intermediate = $("<p>Your chore has been edited! Reloading the page to update...");
        $(".modal-body2").append(intermediate);
        setTimeout(function() {
          intermediate.remove();
        }, 3000);
      }
    });
  } else {
    $.ajax({
      url: queryURL,
      method: "PUT",
      data: {
        name: newChore,
        details: desc,
        frequency: frequency,
        assignedTo: assignee
      }
    }).then(function(resp) {
      if (resp.status === 200) {
        var intermediate = $("<p>Your chore has been edited! Reloading the page to update...");
        $(".modal-body2").append(intermediate);
        setTimeout(function() {
          intermediate.remove();
        }, 3000);
      }
    });
  }
});

$("#");

$("#submitChore").on("click", function() {
  var choreId = $("#chore-selector").val();
  console.log(choreId);
  var assignee = $("#formCheck").val();
  var newFreq = $("#frequency").val();
  console.log(newFreq);
  var queryURL2 = "api/chores/" + choreId;
  console.log(queryURL2);
  console.log(assignee);
  $.ajax({
    type: "PUT",
    url: queryURL2,
    data: {
      id: choreId,
      assignedTo: assignee,
      frequency: newFreq
    }
  }).then(function(response) {
    if (response[0] === 1) {
      var intermediate = $("<p>Your chore reassignment was successful. Reload the page.</p>");
      $("#modal-body1").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    } else {
      var intermediate = $("<p>An error has occurred</p>");
      $("#modal-body1").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    }
  });
});

$(".trashcan").on("click", function() {
  var choreId = $("#chore-selector2").val();
  var queryURL = "/api/chores/" + choreId;
  $.ajax({
    type: "DELETE",
    url: queryURL
  }).then(function(response) {
    console.log(response);
    if (response === 1) {
      var intermediate = $("<p>Your chore deletion was successful. Reloading the page...</p>");
      $("#modal-body2").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
        location.reload();
      }, 3000);
    } else {
      $("#modal-body2").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    }
  });
});

$("#submitFamilyGroup").on("click", function() {
  let queryURL = "/api/household/" + session.HouseholdId;
  var newFamilyName = $("#family-name")
    .val()
    .trim();
  console.log(queryURL);
  function test() {
    $.ajax({
      url: "api/household",
      method: "POST",
      data: {
        name: newFamilyName
      }
    }).then(function(rezponz) {
      console.log(rezponz);
      if (rezponz.status === 200) {
        console.log(rezponz.data[0].id);
        var intermediate = $(
          `<p>Your new household ${newFamilyName}has been created. Your new Household ID is ${rezponz.data[0].id}.</p>`
        );
        $(".householdBody").prepend(intermediate);
      }
      $.ajax({
        url: "api/users/" + session.id,
        method: "PUT",
        data: {
          HouseholdId: rezponz.data[0].id
        }
      }).then(function(response) {
        console.log(response);
        console.log(session.id);
      });
    });
  }
  test();
});

$("#edit-group").hide();
var editMode;
$("#editor").on("click", function() {
  switch (editMode) {
    case undefined:
      console.log(editMode);
      $("#chore-modal-title").html("Edit Existing Chore");
      $("#editor").html("Add Chore");
      $("#edit-group").show();
      editMode = true;
      break;
    case false:
      $("#chore-modal-title").html("Edit Existing Chore");
      $("#editor").html("Edit Chores");
      $("#edit-group").show();
      editMode = true;
      break;
    case true:
      console.log(editMode);
      $("#editor").html("Add Chore");
      $("#chore-modal-title").html("Create A New Chore");
      $("#edit-group").hide();
      editMode = false;
      break;
  }
});

$(document).on("click", ".chore-close", function() {
  $("#chore-modal").hide();
  location.reload();
});

$(document).on("click", "#login-submit", function() {
  console.log(session);
  if (session === undefined) {
    location.reload();
  }
});

$(document).on("click", ".fa-sign-out-alt", function() {
  location.reload();
});

function buttonHider() {
  $("#household-nav").hide();
}
if (session === undefined) {
  buttonHider();
  console.log("Please Log In");
  var login = $("<div class='jumbotron container'>");
  login.append(
    "<p>It appears that you are not logged in! Please log in. If you don't have an account, sign up! It's that easy!"
  );
  $(".special-container").append(login);
} else {
  houseDisplay();
  choreEdit();
}
