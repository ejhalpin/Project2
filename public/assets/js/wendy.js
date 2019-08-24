// Edit button

$(document).on("click", "#edit_button", function() {
  let dbID = $(this).attr("data-dbID");
  editChore(dbID);
});

// Delete button

$(document).on("click", "#delete_button", function() {
  let dbID = $(this).attr("data-dbID");
  deleteChore(dbID);
  $(this)
    .parent()
    .parent()
    .parent()
    .fadeOut();
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
      cardHeaderRow.append(`<div class='col-6 text-right'>
      <i id='edit_button' data-dbID="${response.data[i].id}" data-toggle="modal" data-target="editChoreModal" class="far fa-check-circle" style='font-size: 20px; border-radius: 100%; cursor: pointer'>edit</i>
      <i id='delete_button' data-dbID="${response.data[i].id}" data-toggle"modal" class="fas fa-ban" style='font-size: 20px; border-radius: 100%; cursor: pointer'>clear</i></div>`);
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

function editChore(dbID) {
  let queryURL = `/api/${dbType}/${dbID}`;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "PUT" }).then(function(response) {
    console.log(response.data);
    $("#editById").val(response[0].params.id);
    // let updatedDate = moment(response[0].updatedAt)
    //   .add(12, "hours")
    //   .format("YYYY-MM-DD");
    // console.log(updatedDate);
    $("#editFrequency").val(response.data[0].frequency);
    $("#editChoreName").val(response.data[0].name);
  });
}
// req.params.id;
$(window).on("load", pullChores("user_0"));
