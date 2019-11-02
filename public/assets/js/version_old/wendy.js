// Pull created chores from database and create cards

function pullChores(userName) {
  let queryURL = "/api/chores/" + userName.replace(/%20/g, " ");
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    Household.Chores = response.data;
    console.log(response.data);
    console.log(response.data.length);

    // Daily view first
    let daily = response.data.filter(element => element.frequency === "Daily");
    let weekly = response.data.filter(element => element.frequency === "Weekly");
    let monthly = response.data.filter(element => element.frequency === "Monthly");
    let yearly = response.data.filter(element => element.frequency === "Yearly");
    let sortedChores = daily.concat(weekly.concat(monthly.concat(yearly)));
    console.log(sortedChores);
    for (var i = 0; i < sortedChores.length; i++) {
      let col = $("<div class='col-6'></div>");
      let card = $("<div class='card mb-3'></div>");

      let cardHeader = $("<div class='card-header'></div>");
      let cardHeaderRow = $("<div class='row'></div>");

      cardHeaderRow.append(
        `<div class='col-9 text-left'><strong>Chore Name:</strong> ${sortedChores[i].name}</div>`
      );
      cardHeaderRow.append(`<div class='col-3 text-right'>
      <i id='edit_button' style="cursor: pointer" data-dbID="${sortedChores[i].id}" data-toggle="modal" data-target="editChoreModal" class="far fa-edit fa-lg"></i>&nbsp;
      <i id='delete_button' style="cursor: pointer" data-dbID="${sortedChores[i].id}" class="far fa-trash-alt fa-lg"></i></div>`);
      console.log(response);

      cardHeader.append(cardHeaderRow);

      let cardBody = $("<div class='card-body'></div>");
      cardBody.append(`<p><strong>Details:</strong> ${sortedChores[i].details}</p>`);
      cardBody.append(`<p><strong>Frequency:</strong> ${sortedChores[i].frequency}</p>`);
      card.append(cardHeader);
      card.append(cardBody);
      col.append(card);
      $("#cardContainer").append(col);
      // $("#cardContainer").append(response.data.filter(element => element.frequency === "daily"));
    }
    $("#cardContainer").removeClass("animate fadeInUp slow");
    $("#cardContainer").addClass("animate fadeInUp slow");
  });
}

// Edit chore button
function fetchChore(id) {
  for (var i = 0; i < Household.Chores.length; i++) {
    var chore = Household.Chores[i];
    if (parseInt(chore.id) === id) {
      return chore;
    }
  }
}

$(document).on("click", "#edit_button", function() {
  //grab everything we know about the chore before we edit it and prepopulate the modal
  var id = parseInt($(this).attr("data-dbID"));
  //pull the chore from the household object
  var chore = fetchChore(id);
  //prepopulate the modal
  $("#chore-title").val(chore.name);
  $("#chore-details").val(chore.details);
  $("#chore-frequency").val(chore.frequency);
  $("#chore-assigned-to")
    .empty()
    .append("<option>" + chore.assignedTo + "</option>");
  $("#chore-submit")
    .attr("data-type", "update")
    .attr("data-dbID", id);
  $("#chore-modal-title").text("Update Chore");
  $("#chore-modal").modal("show");
});

$(document).on("click", "#updateChore", function(event) {
  event.preventDefault();

  let dbID = $(this).attr("data-dbid");
  // let dbType = $(this).attr("data-dbType");

  var choreObj = {
    frequency: $("#editFrequency").val(),
    name: $("#editChoreName").val()
  };
  console.log(dbID, choreObj);
  //get all form data and put it inside that object
  editChore(dbID, choreObj);
});

// Edit chore function

function editChore(dbID, choreObj) {
  let queryURL = "/api/chores/" + dbID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "PUT", data: choreObj }).then(function(response) {
    console.log("modal success: ", response);
    $("#editChoreModal").modal("hide");
    $("#all-icon").trigger("click");
  });
}

// Delete button

$(document).on("click", "#delete_button", function() {
  event.preventDefault();
  let dbID = $(this).attr("data-dbid");
  deleteChore(dbID);
});

function deleteChore(dbID) {
  let queryURL = "/api/chores/" + dbID;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "DELETE"
  }).then(function(response) {
    console.log(response);
    $("#all-icon").trigger("click");
  });
}

$(document).ready(function() {
  $("[data-toggle='tooltip']").tooltip();
  if (session) {
    $("#user-link").text(session.name);
  } else {
    $("#user-link").text("Welcome");
  }
});

//all chores icon click
$("#all-icon").on("click", function() {
  $(
    "#parent"
  ).empty().append(`<div class="title-row"><h2 class="allChoresTitle" style="font-family:Handlee, cursive">All Chores</h2><button type="button" class="btn btn-dark" id="chore-modal-show">Create a New Chore</button></div>
  <div id="cardContainer" class="row animated fadeInUp"></div>`);
  pullChores(session.name);
});

function getChoreObjects(day) {
  //get a list of all chores for today
  //let's make sure that we have all of the necessary info to parse thorough the chores data
  var dayOfWeek = moment()
    .date(day)
    .day();
  var dayOfYear = moment()
    .date(day)
    .dayOfYear();
  //assuming that we are now correlating days and months correctly,
  //make a list of all chores for the day based on frequency and assignedWhen
  var choresList = [];
  Household.Chores.forEach(chore => {
    if (chore.assignedTo === session.name) {
      switch (chore.frequency) {
        case "Daily":
          choresList.push(chore);
          break;
        case "Weekly":
          if (chore.assignedWhen.includes(dayOfWeek.toString())) {
            choresList.push(chore);
          }
          break;
        case "Monthly":
          if (chore.assignedWhen.includes(dayOfMonth.toString())) {
            choresList.push(chore);
          }
          break;
        case "Yearly":
          if (chore.assignedWhen.includes(dayOfYear.toString())) {
            choresList.push(chore);
          }
      }
    }
  });
  return choresList;
}

$("#daily-icon").on("click", function() {
  $("#parent")
    .empty()
    .append(
      `<div class="title-row">
      <h2 class="dailyToDo" style="font-family:Handlee, cursive">Daily To-Do List</h2>
      </div>
      <div id="cardContainer" class="row animated fadeInUp"></div>`
    );
  // $("#parent").append("<div id='cardContainer' class='row p-5'></div>");
  let queryURL = "/api/chores/" + session.name.replace(/%20/g, " ");
  $.get(queryURL).then(response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    //update the cached chores
    Household.Chores = response.data;
    var today = getChoreObjects(moment().date());
    today.forEach(function(chore) {
      var checked = "";
      var strikethrough = "";
      if (chore.isComplete) {
        checked = "checked";
        strikethrough = "strikethrough";
      }
      console.log(checked);
      $("#cardContainer").append(
        `
      <div class="col-6">
        <div class="card choreCard mb-4">
          <div class="card-header">
            <div class="row">
              <div class="col-2">
                <input class="checkbox" data-id="${chore.id}" type="checkbox" ${checked}/>
              </div>
              <div class="col-10 ${strikethrough}" id="chore-${chore.id}">${chore.name}</div>
            </div>
          </div>
          <div class="card-body choreDescription" style="display:none">
          ${chore.details}
          </div>
        </div>
      </div>
    `
      );
    });
  });
});

$(document).on("change", ".checkbox", function() {
  var checked = $(this).prop("checked");
  console.log(checked);
  var id = parseInt($(this).attr("data-id"));

  $("#chore-" + id).toggleClass("strikethrough");

  //update the database and the chached chores object
  $.ajax({ url: "/api/chores/" + id, method: "PUT", data: { isComplete: checked } }).then(
    response => {
      if (response.status !== 200) {
        console.log(response.reason);
        return;
      }
      console.log("chore uppadted");
      $.get("/api/chores/" + session.name.replace(/%20/g, " ")).then(res => {
        if (res.data !== 200) {
          console.log(res.reason);
          return;
        }
        Household.Chores = res.data;
      });
    }
  );
});

$(document).on("click", ".choreCard", function(e) {
  if (!$(e.target).closest(".checkbox").length) {
    $(this)
      .children(".choreDescription")
      .slideToggle();
  }
});

$(document).ready(function() {
  $(".choreDescription").slideUp();
});
