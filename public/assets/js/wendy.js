// Pull created chores from database and create cards

function pullChores(userName) {
  let queryURL = "/api/chores/" + userName.replace(/%20/g, " ");
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.length);

    for (var i = 0; i < response.data.length; i++) {
      let col = $("<div class='col-6'></div>");
      let card = $("<div class='card mb-3'></div>");
      let cardHeader = $("<div class='card-header'></div>");
      let cardHeaderRow = $("<div class='row'></div>");
      cardHeaderRow.append(`<div class='col-12 text-right'>
      <i id='edit_button' style="cursor: pointer" data-dbID="${response.data[i].id}" data-toggle="modal" data-target="editChoreModal" class="far fa-edit fa-lg"></i>&nbsp;
      <i id='delete_button' style="cursor: pointer" data-dbID="${response.data[i].id}" class="fas fa-minus fa-lg"></i></div>`);
      console.log(response);
      cardHeader.append(cardHeaderRow);
      cardHeader.append(`<p><strong>Chore Name:</strong> ${response.data[i].name}</p>`);
      let cardBody = $("<div class='card-body'></div>");
      cardBody.append(`<p><strong>Created:</strong> ${new Date(response.data[i].createdAt)}</p>`);
      cardBody.append(`<p><strong>Frequency:</strong> ${response.data[i].frequency}</p>`);
      card.append(cardHeader);
      card.append(cardBody);
      col.append(card);
      $("#cardContainer").append(col);
      $("#cardContainerDaily").append(
        response.data.filter(element => element.frequency === "dialy")
      );
    }
  });
}
// Edit chore button

$(document).on("click", "#edit_button", function() {
  $("#editChoreModal").modal("show");
  $("#updateChore").attr("data-dbid", $(this).attr("data-dbid"));
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
    // $("#editById").val(response.data[0].id);
    // let updatedDate = moment(response[0].updatedAt)
    //   .add(12, "hours")
    //   .format("YYYY-MM-DD");
    // console.log(updatedDate);

    $("#cardContainer").empty();
    pullChores("jonathan hansen");
    // pullChores(session.name);
    $("#editChoreModal").modal("hide");
  });
}

// Delete button

$(document).on("click", "#delete_button", function() {
  event.preventDefault();
  let dbID = $(this).attr("data-dbid");
  // $(this)
  //   .parent()
  //   .parent()
  //   .parent()
  //   .parent()
  //   .parent()
  //   .fadeOut();
  deleteChore(dbID);
  //location.reload(false);
});
function deleteChore(dbID) {
  let queryURL = "/api/chores/" + dbID;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "DELETE"
  }).then(function(response) {
    console.log(response);
    console.log("Emptying Card Container");
    $("#cardContainer").empty();
    console.log("Pulling Kim Morris");
    // pullChores(session.name);
    pullChores("jonathan hansen");
  });
}
// req.params.id;

$(window).on("load", pullChores("jonathan hansen"));
// $(window).on("load", pullChores(session.name));
