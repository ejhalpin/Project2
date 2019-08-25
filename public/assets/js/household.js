//SAMPLE HOUSEHOLD
var houseID = 1;
//Big Display Function(Probably need to break it down into seperate functions???)
function houseDisplay() {
  let queryURL = "/api/household/" + houseID;
  console.log(queryURL);
  $.ajax({ url: queryURL, method: "GET" }).then(function(response) {
    console.log(response.data);
    console.log(response.data.name);
    var householdDiv = $("<div class='households'></div>");
    var rez = response.data;
    householdDiv.append(`<h2>${rez.name}</h2>`);
    householdDiv.append("<h2>Members</h2>");
    var houseHolder = $(`<ul id='${rez.name}'> </ul>`);
    var specialDiv;
    var unAssigned = $(`<ul id='unAssigned-${rez.name}'></ul>`);
    for (var j = 0; j < rez.Users.length; j++) {
      var special = rez.Users[j];
      console.log("User name = " + special.name);
      var intermediate = $("<li>");
      specialDiv = $("<div>");
      specialDiv.attr("id", "user" + j);
      specialDiv.append("<h3>" + special.name + "</h3>");
      //Probably not the most efficient way of doing this, but if the person being assigned the chores matches a user, it automatically pushes the chore name into the div that sits underneath the user.
      for (var z = 0; z < rez.Chores.length; z++) {
        var special = rez.Chores[z];
        if (rez.Users[j].name === special.assignedTo) {
          var intermediate2 = $(`<p class='chore${z}'>${special.name}(${special.frequency})</p>`);
          specialDiv.append(intermediate2);
          console.log(special.isComplete);
        }
      }
      intermediate.append(specialDiv);
      houseHolder.append(intermediate);
    }
    houseHolder.append("</ul>");
    householdDiv.append(houseHolder);
    householdDiv.append("<h4> Unassigned Chores </h4>");
    householdDiv.append(unAssigned);
    $(".container").append(householdDiv);
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

houseDisplay();
