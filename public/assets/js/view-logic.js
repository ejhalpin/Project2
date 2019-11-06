const hiveView = $("#hive-view");
const profileView = $("#profile-view");
const communityView = $("#community-view");
const taskView = $("#task-view");
let buildHive = () => {
  if (!user) {
    console.log("no user");
  }
  if (!hive) {
    console.log("no hive");
  }
  //add users to the user table
  var userTable = $("#user-table-body");
  var choreTable = $("#chore-table-body");
  var disabled = user.name !== hive.queen;
  userTable.empty();
  choreTable.empty();
  hive.Users.forEach(user => {
    var row = $("<tr>");
    var role = "worker-bee";
    if (user.name === hive.queen) {
      role = "queen-bee";
    }
    row.append(`<td>${user.id}</td>`);
    row.append(`<td>${user.name}</td>`);
    row.append(
      `<td><button class="btn btn-custom-light user-btn" data-id="${user.id}" data-role="email">${user.email}</button></td>`
    );
    row.append(`<td>${role}</td>`);
    if (!disabled) {
      row.append(
        `<td><div class="table-actions"><button data-id="${user.id}" class="rem-user btn btn-custom-red p-1"><i class="fas fa-minus"></i></button></div></td>`
      );
    } else {
      row.append(
        "<td><div class='table-actions'><button class='btn btn-custom-red p-0' disabled><i class='fas fa-minus'></i></button></div></td>"
      );
    }
    row.appendTo(userTable);
  });
  hive.Chores.forEach((chore, index) => {
    var row = $("<tr>");
    row.append(`<td>${chore.id}</td>`);
    row.append(`<td>${chore.name}</button></td>`);
    row.append(`<td>${chore.assignedTo}</td>`);
    row.append(`<td>${chore.description.substring(0, 30) + " ..."}</td>`);

    row.append(`<td>${chore.frequency}</td>`);
    row.append(`<td>${chore.scheduledOn}</td>`);

    row.append(
      `<td><div class="table-actions"><button class="edit-chore btn btn-custom-light p-1" data-id="${index}">Edit</button><button data-id="${chore.id}" class="rem-chore btn btn-custom-red p-1"><i class="fas fa-minus"></i></button></div></td>`
    );
    row.appendTo(choreTable);
  });
  $("#hive-name").text(hive.name);
  hiveView.detach().appendTo(parentDiv);
};

let buildProfile = () => {
  $("#profile-email").val(user.email);
  $("#profile-name").val(user.name);
  $("#profile-hive").val(hive.name);
  profileView.detach().appendTo(parentDiv);
};

let buildCommunity = () => {
  communityView.detach().appendTo(parentDiv);
};

var showCompletedTasks = true;
var showCompletedToDo = true;
let buildTask = () => {
  $("#today-chores").empty();
  $("#to-do").empty();
  var chores = hive.Chores.filter(chore => chore.assignedTo === user.name);
  var todayChores = chores.filter(chore => {
    if (chore.frequency === "Daily") {
      return true;
    }
    if (chore.frequency === "Weekly") {
      var dayOfWeek = moment()
        .day()
        .toString();
      var assignedDays = chore.scheduledOn.split(",");
      if (assignedDays.includes(dayOfWeek)) {
        return true;
      }
    }
    if (chore.frequency === "Monthly") {
      var date = moment()
        .date()
        .toString();
      var assignedDates = chore.scheduledOn.split(",");
      if (assignedDates.includes(date)) {
        return true;
      }
    }
    if (chore.frequency === "Yearly") {
      var assignedCalendarDays = chore.scheduledOn.split(",");
      var calendarDay = moment()
        .dayOfYear()
        .toString();
      if (assignedCalendarDays.includes(calendarDay)) {
        return true;
      }
    }
  });
  var todoTasks = chores.filter(chore => chore.frequency === "Once");

  todayChores.forEach(chore => {
    var today = moment();
    if (today.isAfter(chore.markedCompleteAt, "day")) {
      chore.isComplete = false;
      $.ajax({
        url: "/api/chore/" + chore.id,
        method: "PUT",
        data: { isComplete: false }
      }).then(updatedHive => {
        hive = updatedHive;
        sessionStorage.setItem("hive", JSON.stringify(hive));
      });
    }
    if (chore.isComplete && !showCompletedTasks) {
      return;
    }
    $("#today-chores").append(`<li class="list-group-item">
    <input class="form-check-input" type="checkbox" value="" id="chore-item-${chore.id}" ${
      chore.isComplete ? "checked" : ""
    }>
    <label class="${
      chore.isComplete ? "form-check-label completed" : "form-check-label"
    }" for="chore-item-${chore.id}" id="label-item-${chore.id}">
    ${chore.name}
    </label>
    ${
      chore.description.length > 0
        ? `<div class="chore-expand" data-id="${chore.id}" data-state="0"><i class="fas fa-caret-down"></i></div><div class="chore-desc" id="chore-desc-${chore.id}"></div>`
        : ""
    }
    
    </li>`);
  });

  todoTasks.forEach(chore => {
    if (chore.isComplete && !showCompletedToDo) {
      return;
    }
    $("#to-do").append(`<li class="list-group-item">
    <input class="form-check-input" type="checkbox" value="" id="chore-item-${chore.id}" ${
      chore.isComplete ? "checked" : ""
    }>
    <label class="${
      chore.isComplete ? "form-check-label completed" : "form-check-label"
    }" for="chore-item-${chore.id}" id="label-item-${chore.id}">
    ${chore.name}
    </label>
    ${
      chore.description.length > 0
        ? `<div class="chore-expand" data-id="${chore.id}" data-state="0"><i class="fas fa-caret-down"></i></div><div class="chore-desc" id="chore-desc-${chore.id}"></div>`
        : ""
    }
    </li>`);
  });
  taskView.detach().appendTo(parentDiv);
};

const never = false;

if (never) {
  buildHive();
  buildProfile();
  buildCommunity();
  buildTask();
  //fuck you linter. All of these functions are called in another file.
}
