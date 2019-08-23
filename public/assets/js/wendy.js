// Edit button

// $(document).on("click", "#edit-btn", function() {
//   let dbID = $(this).attr("data-dbID");
//   editChore(dbID);
// });

// Delete button

// $(document).on("click", "delete-btn", function() {
//   let dbID = $(this).attr("data-dbID");
//   deleteChore(dbID);
//   $(this)
//     .parent()
//     .parent()
//     .parent()
//     .fadeOut();
// });

// Pull created chores from database and create cards

function pullChores(userName) {
  let queryURL = "/api/chores/" + userName;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.length);
    for (var i = 0; i < response.data.length; i++) {
      //   console.log("Running for loop");
      let card = $("<div class='card col-6 mb-3 p-2 bg-light'></div>");
      let cardText = $("<div class='card-text'></div>");
      cardText.append(`<p><strong>Chore Name:</strong> ${response.data[i].name}</p>`);
      cardText.append(`<p><strong>Created:</strong> ${response.data[i].createdAt}</p>`);
      cardText.append(`<p><strong>Frequency:</strong> ${response.data[i].frequency}</p>`);
      card.append(cardText);
      $("#cardContainer").append(card);
      //   let cardHeader = $(`div class ='card m-3'></div>`);
      //   let cardHeaderRow = $(`<div class='row'></div>`);

      //   cardHeader.append(cardHeaderRow);
      //   let cardBody = $(`<div class='card-body'></div>`);
      //   let cardText = $(`<div class='card-text'></div>`);
      //   cardText.append(`<p>${response.data[i].name}</p>`);
      //   cardBody.append(cardText);
      //   console.log("Midway checkup");
      //   card.append(cardHeader);
      //   card.append(cardBody);
      //   console.log("Appending card to console.");
      //   $("#cardContainer").append(card);
    }
  });
}

$(window).on("load", pullChores("user_0"));
