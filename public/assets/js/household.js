//SAMPLE HOUSEHOLD
var houseID = 1;
//Big Display Function(Probaconsole.log(db.User);
//Big Display Function(Probably need to break it down into seperate functions???)
function houseDisplay() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var rez = response.data;
    for (var j = 0; j < rez.Users.length; j++) {
      var cardDiv = $("<div class='card bg-light mb-3' style='max-width: 20rem;'>");
      cardDiv.append(`<div class="card-header">${rez.Users[j].name}</div>`);
      var cardBody = $("<div class='card-body'>");
      var cardTitle = $("<h5 class='card-title>Chores</h5>");
      var cardListDaily = $("<ul>");
      var cardListMonthly = $("<ul>");
      var cardListWeekly = $("<ul>");
      var cardListYearly = $("<ul>");
      cardBody.append(cardTitle);
      for (var z = 0; z < rez.Chores.length; z++) {
        var special = rez.Chores[z];
        if (rez.Users[j].name === special.assignedTo && special.frequency) {
          var intermediate2 = $(`<li class='chore${z}'>${special.name}(${special.frequency})</p>`);
          switch (special.frequency) {
            case "dialy":
              intermediate2.addClass("daily");
              cardListDaily.append(intermediate2);
              break;
            case "weekly":
              intermediate2.addClass("weekly");
              cardListWeekly.append(intermediate2);
              break;
            case "monthly":
              intermediate2.addClass("monthly");
              cardListMonthly.append(intermediate2);
              break;
            case "yearly":
              intermediate2.addClass("yearly");
              cardListYearly.append(intermediate2);
              break;
          }
        }
      }
      cardBody.append(cardListDaily);
      cardBody.append(cardListWeekly);
      cardBody.append(cardListMonthly);
      cardBody.append(cardListYearly);
      cardDiv.append(cardBody);
      $(".container").append(cardDiv);
    }
    // houseHolder.append("</ul>");
    // householdDiv.append(houseHolder);
    // householdDiv.append("<h4> Unassigned Chores </h4>");
    // householdDiv.append(unAssigned);
    // $(".container").append(householdDiv);
    for (var z = 0; z < rez.Chores.length; z++) {
      if (rez.Chores[z].isComplete === true) {
        $(`.chore${z}`).attr("style", "color: green;");
      }
    }
    var hide = false;
    $("#hideComplete").on("click", function() {
      if (hide === false) {
        for (var z = 0; z < rez.Chores.length; z++) {
          if (rez.Chores[z].isComplete === true) {
            $(`.chore${z}`).hide();
          }
          $("#hideComplete").html("Show Completed Chores");
        }
        hide = true;
      } else {
        $("#hideComplete").html("Hide Completed Chores");
        for (var z = 0; z < rez.Chores.length; z++) {
          if (rez.Chores[z].isComplete === true) {
            $(`.chore${z}`).show();
          }
        }
        hide = false;
      }
    });
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
    case "all":
      $(".daily").show();
      $(".weekly").show();
      $(".monthly").show();
      $(".yearly").show();
      break;
  }
});

function modalChecks() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var rez = response.data;
    for (var j = 0; j < rez.Users.length; j++) {
      var special = rez.Users[j];
      specialCheck = $(
        `<input type="checkbox" name="assigned" value="${special.name}">${special.name}</input><br>`
      );
      $("#formCheck").append(specialCheck);
    }
  });
}

function makeChore() {
  $.post("/api/chore", {
    name: "test",
    assignedTo: null,
    HouseholdId: houseID,
    frequency: "weekly"
  }).then(function(response) {
    console.log(response.data);
  });
}

houseDisplay();
modalChecks();
makeChore();
