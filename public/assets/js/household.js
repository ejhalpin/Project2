//SAMPLE
var houseID = 1;
//^ REMOVE LATER
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
      for (var z = 0; z < rez.Chores.length; z++) {
        var special = rez.Chores[z];
        console.log(rez.Users[j] + "=" + special.assignedTo);
        if (rez.Users[j].name === special.assignedTo) {
          specialDiv.append(`<p id='${rez.Users[j].name}
          ${z}'>${special.name}(${special.frequency})`);
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
  });
}

houseDisplay();
