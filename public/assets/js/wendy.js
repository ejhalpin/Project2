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
      cardBody.append(`<p><strong>Created:</strong> ${new Date(sortedChores[i].createdAt)}</p>`);
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

  var choreObj = { frequency: $("#editFrequency").val(), name: $("#editChoreName").val() };
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
    $("#chore-modal").modal("hide");
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
  if (session) {
    $("#user-link").prepend(session.name);
    $("[data-toggle='tooltip']").tooltip();
  } else {
    location.href = "/forum";
  }
});

//all chores icon click
$("#all-icon").on("click", function() {
  $(
    "#parent"
  ).empty().append(`<div class="title-row"><h2>All Chores</h2><button type="button" class="btn btn-dark" id="chore-modal-show">Create a New Chore</button></div>
  <div id="cardContainer" class="row animated fadeInUp"></div>`);
  pullChores(session.name);
});

function getChoreObjects(day, date, month) {
  var now = moment()
    .month(month)
    .date(date)
    .day(day);
  console.log(now);
  //get a list of all chores for today
  //let's make sure that we have all of the necessary info to parse thorough the chores data
  var dayOfWeek = now.day();
  var dayOfYear = now.dayOfYear();
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
          if (chore.assignedWhen.includes(day.toString())) {
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
  console.log("daily-icon");
  //get the chores from the database
  let queryURL = "/api/chores/" + session.name.replace(/%20/g, " ");
  $.get(queryURL).then(response => {
    if (response.status !== 200) {
      console.log(response.reason);
    }
    //update the cached chores
    Household.Chores = response.data;
    var now = moment();
    var today = getChoreObjects(now.day(), now.date(), now.month());
    console.log(today);
    var list = $("<div>").addClass("to-do table-responsive");
    var table = $("<table>")
      .addClass("table table-borderless")
      .attr("id", "today-table");
    today.forEach(chore => {
      //redo this to handle completed chores
      var row = $("<tr>").attr("id", "row-" + chore.id);
      var col1 = $(`
      <td>
      <div class="input-group">

      <div class="input-group-prepend">
        <div class="input-group-text">
          <input type="checkbox" class="checkmark" data-id="${chore.id}" aria-label="Checkbox for marking chore complete" aria-describedby="choreDetail${chore.id}" >
        </div>
      </div>
      
      <div class='slidy'>
      <input type="text" id="chore-${chore.id}" class="form-control to-do-item" aria-label="Chore" placeholder ="${chore.name}"  readonly>
      <div><small id="choreDetail${chore.id}" class="form-text text-muted">${chore.details}</small></div></div></td>
      </div>

      `);
      row.append(col1);
      table.append(row);
    });
    list.append(table);
    $("#parent")
      .empty()
      .append(list);
  });
});

$(document).on("change", ".checkmark", function() {
  var checked = $(this).prop("checked");
  var id = parseInt($(this).attr("data-id"));
  var row = "#row-" + id;
  if (checked) {
    $(row)
      .detach()
      .appendTo("#today-table");
  } else {
    $(row)
      .detach()
      .prependTo("#today-table");
  }
  //update the database and the chached chores object
});

$(document).on("click", ".slidy", function() {
  $(this)
    .children()
    .slideToggle();
});
