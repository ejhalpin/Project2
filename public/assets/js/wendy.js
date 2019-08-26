// Edit button

$(document).on("click", "#edit_button", function() {
  let dbID = $(this).attr("data-dbID");
  let dbType = $(this).attr("data-dbType");
  $(".modal").modal("show");
});

// Pull created chores from database and create cards

function pullChores(userName) {
  let queryURL = "/api/chores/" + userName;
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
      <i id='edit_button' data-dbID="${response.data[i].id}" data-toggle="modal" data-target="editChoreModal" class="far fa-check-circle"</i>
      <i id='delete_button' data-dbID="${response.data[i].id}" data-toggle"modal" class="fas fa-ban"</i></div>`);
      console.log(response);
      cardHeader.append(cardHeaderRow);
      cardHeader.append(`<p><strong>Chore Name:</strong> ${response.data[i].name}</p>`);
      let cardBody = $("<div class='card-body'></div>");
      cardBody.append(`<p><strong>Created:</strong> ${response.data[i].createdAt}</p>`);
      cardBody.append(`<p><strong>Frequency:</strong> ${response.data[i].frequency}</p>`);
      card.append(cardHeader);
      card.append(cardBody);
      col.append(card);
      $("#cardContainer").append(col);
    }
  });
}
// Edit chore button

$(document).on("click", "#updateChore", function(event) {
  event.preventDefault();
  dbID = 2;
  var choreObj = { frequency: $("#editFrequency").val(), name: $("#editChoreName").val() };
  console.log(choreObj);
  //get all form data and put it inside that object
  editChore(dbID, choreObj);
});

// Edit chore function

function editChore(dbID, choreObj) {
  let queryURL = "/api/chores/" + dbID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "PUT", data: choreObj }).then(function(response) {
    console.log(response.data);
    // $("#editById").val(response.data[0].id);
    // let updatedDate = moment(response[0].updatedAt)
    //   .add(12, "hours")
    //   .format("YYYY-MM-DD");
    // console.log(updatedDate);
    $("#editFrequency").val(response.data[0].frequency);
    $("#editChoreName").val(response.data[0].name);
  });
}

// Delete button

$(document).on("click", "#delete_button", function() {
  event.preventDefault();
  let dbID = $(this).attr("data-dbID");
  // $(this)
  //   .parent()
  //   .parent()
  //   .parent()
  //   .parent()
  //   .parent()
  //   .fadeOut();
  deleteChore(dbID);
  location.reload(false);
});
function deleteChore(dbID) {
  let queryURL = "/api/chores/" + dbID;
  console.log(queryURL);
  $.ajax({
    url: queryURL,
    method: "DELETE"
  }).then(function(response) {
    console.log(response);
  });
}
// req.params.id;
$(window).on("load", pullChores("stella legrand"));
