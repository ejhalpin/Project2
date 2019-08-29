console.log(session);
//Big Display Function(Probably need to break it down into seperate functions???)
function houseDisplay() {
  $(".house-header").empty();
  $(".jumbo-container").empty();
  $(".special-container").empty();
  $("#userLink").empty();
  $("#userLink").append(`<a class="nav-link" href="/">${session.name}</a>`);
  let queryURL = "/api/household/" + session.HouseholdId;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    $(".house-header").append(
      "<span class='brand-text house-head'>" + response.data.name + "</span>"
    );

    var rez = response.data;
    console.log(rez.Users);
    if (rez.Users === undefined) {
      console.log("No Househould!");
    } else {
      for (var j = 0; j < rez.Users.length; j++) {
        console.log(rez.Users.length);
        var cardDiv = $("<div class='card cardUser bg-light m-2 col-sm-5'>");
        cardDiv.append(`<div class="card-header">${rez.Users[j].name}</div>`);
        var cardBody = $("<div class='card-body'>");
        var cardTitle = $("<h5 class='card-title>Chores</h5>");
        var cardListAnnounce = $("<ul>");
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
          cardListAnnounce.append("<li>No Chores</li>");
          cardBody.append(cardListAnnounce);
          cardBody.append(cardListMonthly);
          cardDiv.append(cardBody);
          $(".special-container").append(cardDiv);
        }
        for (var z = 0; z < rez.Chores.length; z++) {
          var special = rez.Chores[z];
          var counter = 0;

          if (rez.Users[j].name === special.assignedTo) {
            console.log("special = " + special.name);
            var intermediate2 = $(
              `<li class='chore-${z}'>${special.name}(${special.frequency})</p>`
            );
            if (rez.Chores[z].isComplete === true) {
              intermediate2.addClass("complete");
              intermediate2.attr("style", "text-decoration-line: line-through");
            }
            switch (special.frequency) {
              case "Daily":
                intermediate2.addClass("daily");
                if (special.isComplete === false) {
                  cardListDaily.append(intermediate2);
                  console.log(counter);
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
                counter++;

                break;
              case "Monthly":
                intermediate2.addClass("monthly");
                if (special.isComplete === false) {
                  cardListMonthly.append(intermediate2);
                } else {
                  cardListMonthlyComplete.append(intermediate2);
                }
                counter++;

                break;
              case "Yearly":
                intermediate2.addClass("yearly");
                if (special.isComplete === false) {
                  cardListYearly.append(intermediate2);
                } else {
                  cardListYearlyComplete.append(intermediate2);
                }
                counter++;

                break;
            }
          }
        }
        console.log(rez.Users[j].name + " counter: " + counter);
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

function choreListDelete() {
  $("#new-assigned-to").empty();
  $("#chore-assigned-to").empty();
  $("#chore-selector3").empty();
  $("#chore-selector2").empty();
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
      $(".chore-mode").prepend(intermediate);
      $(".special-container").empty();
      houseDisplay();
      choreListDelete();
      choreEdit();
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    } else {
      var intermediate = $("<p>An error has occurred. Please try again </p>");
      $(".chore-mode").prepend(intermediate);
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
    if (newFamilyName === "") {
      var intermediate = $("<p>You must assign a name to your new household.</p>");
      $(".householdBody").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 5000);
    } else {
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
            `<p>Your new household ${newFamilyName} has been created. Your new Household ID is ${rezponz.data[0].id}. Please relog into your account.</p>`
          );
          $(".householdBody").prepend(intermediate);
          setTimeout(function() {
            intermediate.remove();
          }, 5000);
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
  }
  test();
  setTimeout(function() {
    $(".fa-sign-out-alt").trigger("click");
  }, 3000);
});

$("#edit-group").hide();
var editMode;
$("#editor").on("click", function() {
  switch (editMode) {
    case undefined:
      $("#chore-modal-title").html("Edit Existing Chore");
      $("#editor").html("Add Chore");
      $("#edit-group").show();
      editMode = true;
      $("#chore-submit").attr("data-type", "edit");
      break;
    case false:
      $("#chore-modal-title").html("Edit Existing Chore");
      $("#editor").html("Add Chores");
      $("#edit-group").show();
      $("#chore-submit").attr("data-type", "edit");
      editMode = true;
      break;
    case true:
      $("#editor").html("Edit Chores");
      $("#chore-modal-title").html("Create A New Chore");
      $("#edit-group").hide();
      $("#chore-submit").attr("data-type", "create");
      editMode = false;
      break;
  }
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
    "<h3>It appears that you are not logged in! Please log in. If you don't have an account, sign up! It's that easy!"
  );
  $(".jumbo").append(login);
} else {
  houseDisplay();
  choreEdit();
}
