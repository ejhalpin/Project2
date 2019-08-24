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
    householdDiv.append("<h3>Members</h3>");
    var houseHolder = $(`<ul id='${rez.name}'> </ul>`);

    var unAssigned = $(`<ul id='unAssigned-${rez.name}'></ul>`);
    for (var j = 0; j < rez.Users.length; j++) {
      var special = rez.Users[j];
      var intermediate = $(`<li  id ='${special.name}'>${special.name}</li>`);
      houseHolder.append(intermediate);
    }
    houseHolder.append("</ul>");
    householdDiv.append(houseHolder);
    for (var z = 0; z < rez.Chores.length; z++) {
      var special = rez.Chores[z];
      console.log("Special name= " + special.name);
      console.log("Special frequency=" + special.frequency);
      var intermediate = $(`<br><p>${special.name}(${special.frequency})</p>`);
      console.log("#" + special.assignedTo);
    }
    householdDiv.append("<h4> Unassigned Chores </h4>");
    householdDiv.append(unAssigned);
    $(".container").append(householdDiv);
  });
}

houseDisplay();
