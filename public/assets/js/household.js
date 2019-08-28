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
    var superCard = $("<div class='row cardContainer'>");
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
          superCard.append(cardDiv);
          $(".special-container").append(superCard);
        }
        for (var z = 0; z < rez.Chores.length; z++) {
          var special = rez.Chores[z];
          if (rez.Users[j].name === special.assignedTo) {
            console.log("special = " + special.name);
            var intermediate2 = $(
              `<li class='chore${z}'>${special.name}(${special.frequency})</p>`
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
        superCard.append(cardDiv);
        $(".special-container").append(superCard);
      }
      // houseHolder.append("</ul>");
      // householdDiv.append(houseHolder);
      // householdDiv.append("<h4> Unassigned Chores </h4>");
      // householdDiv.append(unAssigned);
      // $(".container").append(householdDiv);
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

// function modalChecks() {
//   let queryURL = "/api/household/" + houseID;
//   console.log(queryURL);
//   $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
//     console.log(response.data);
//     console.log(response.data.name);
//     var rez = response.data;
//     for (var j = 0; j < rez.Users.length; j++) {
//       var special = rez.Users[j];
//       specialCheck = $(
//         `<input type="checkbox" name="assigned" value="${special.name}">${special.name}</input><br>`
//       );
//       $("#formCheck").append(specialCheck);
//     }
//   });
// }
// function inviteMember() {
//   $.ajax({ url: "api/users", method: "GET" }).then(function(response) {
//     console.log(response.data);
//     var rez = response.data;
//     $.ajax({
//       type: "PUT",
//       url: "api/users/11",
//       data: {
//         HouseholdId: 1
//       }
//     }).then(function(res) {
//       console.log(res.data);
//     });
//     $.ajax({
//       type: "GET",
//       url: "api/users/11"
//     }).then(function(resp) {
//       console.log(resp.data);
//     });
//   });
// }

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

$("#chore-submit").on("click", function() {
  var queryURL = "/api/chore/";
  var newChore = $("#chore-title")
    .val()
    .trim();
  var desc = $("#chore-details")
    .val()
    .trim();
  var frequency = $("#chore-frequency").val();
  var assignee = $("#chore-assigned-to").val();
  $.ajax({
    url: queryURL,
    method: "POST",
    data: {
      name: newChore,
      details: desc,
      frequency: frequency,
      assignedTo: assignee,
      HouseholdId: session.HouseholdId
    }
  }).then(function(resp) {
    console.log(resp.data);
  });
});

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
      console.log(response);
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
      console.log(resp.data);
    });
  }
});

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

$("#delete-chore").on("click", function() {
  var choreId = $("#chore-selector2").val();
  var queryURL = "/api/chores/" + choreId;
  $.ajax({
    type: "DELETE",
    url: queryURL
  }).then(function(response) {
    console.log(response);
    if (response === 1) {
      var intermediate = $("<p>Your chore deletion was successful. Reload the page.</p>");
      $("#modal-body3").prepend(intermediate);
      setTimeout(function() {
        intermediate.remove();
      }, 3000);
    } else {
      var intermediate = $("<p>An error has occurred.</p>");
      $("#modal-body3").prepend(intermediate);
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
  //Once I figure how the website figures out who's logged in, we can probably change userId to the current logged in User's ID
  //For now it's Hello aka Me
  // var userId = 11;
  //var userData stores the full data of the user
  //var userData;
  console.log(queryURL);
  // function test2() {
  //   $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
  //     var rez = response.data;
  //     for (var i = 0; i < rez.Users.length; i++) {
  //       if (rez.Users[i].id === userId) {
  //         userData = rez.Users[i];
  //         console.log(rez.Users[i]);
  //       }
  //     }
  //   });
  // }
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
  //test2();
  test();
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
