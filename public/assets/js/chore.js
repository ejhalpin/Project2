//=================================================================================================
//******************************* THE CHORE CREATION MODAL ****************************************
//=================================================================================================
var daysInYear = new Array(367);
daysInYear.fill(false);

$(document).on("click", "#chore-modal-show", function() {
  $("#chore-assigned-to").empty();
  Household.Users.forEach(user => {
    var option = $("<option>").text(user.name);
    if (user.name === session.name) {
      option.prop("selected", true);
    }
    option.appendTo($("#chore-assigned-to"));
  });
  $("#chore-submit").attr("data-type", "create");
  $("#chore-modal-title").text("Create A New Chore");
  $("#chore-modal").modal("show");
});

$("#chore-submit").on("click", function(event) {
  event.preventDefault();

  var tableCols = $(".tiny-cal-td").toArray();
  //assign the days to an array
  var days = [];
  if ($("#chore-frequency").val() === "Yearly") {
    daysInYear.forEach((val, index) => {
      if (val) {
        days.push(index);
      }
    });
  } else {
    //loop through the table columns
    tableCols.forEach(col => {
      console.log($(col).attr("data-selected"));
      if ($(col).attr("data-selected") === "1") {
        days.push($(col).attr("data-day"));
      }
    });
  }
  days.sort(function(a, b) {
    return a - b;
  });
  var choreId = $("#chore-selector2").val();
  var queryURL = "/api/chores/" + choreId;
  var choreObj = {
    name: $("#chore-title")
      .val()
      .trim(),
    details: $("#chore-details")
      .val()
      .trim(),
    frequency: $("#chore-frequency").val(),
    assignedWhen: days.join(","),
    assignedTo: $("#chore-assigned-to").val(),
    HouseholdId: session.HouseholdId
  };
  console.log(choreObj.assignedWhen);
  if ($(this).attr("data-type") === "create") {
    $.post("/api/chore", choreObj, response => {
      if (response.status !== 200) {
        console.log(response.reason);
      } else {
        var intermediate = $("<p>Your chore creation was successful.</p>");
        $("#modal-body2").prepend(intermediate);
        setTimeout(function() {
          intermediate.remove();
        }, 3000);
      }
      $("#all-icon").trigger("click");
    });
  } else {
    //editChore($(this).attr("data-dbID"), choreObj);
    $.ajax({ url: queryURL, method: "PUT", data: choreObj }).then(function(response) {
      console.log("test response:" + response);
      if (response.status !== 200) {
        console.log(response.reason);
      } else {
        var intermediate = $("<p>Your chore reassignment was successful.");
        $("#modal-body1").prepend(intermediate);
        setTimeout(function() {
          intermediate.remove();
        }, 3000);
      }
    });
  }
  $(".chore-close").trigger("click");
});

$("#chore-frequency").change(function() {
  daysInYear.fill(false);
  $(".tiny-cal").empty();
  console.log($(this).val());
  switch ($(this).val()) {
    case "Weekly":
      $(".tiny-cal").append(buildTinyWeekView(moment()));
      break;
    case "Monthly":
      $(".tiny-cal").append(buildTinyMonthView(moment()));
      break;
    case "Yearly":
      daysInYear.fill(false);
      $(".tiny-cal").append(buildTinyYearView(moment()));
  }
});

$(document).on("click", ".tiny-cal-td", function() {
  if ($("#chore-frequency").val() === "Yearly") {
    return;
  }
  var selected = $(this).attr("data-selected") === "1";
  if (selected) {
    $(this).attr("data-selected", 0);
  } else {
    $(this).attr("data-selected", 1);
  }
  $(this).toggleClass("td-selected");
});

$(document).on("click", ".shift-month", function() {
  var month = parseInt($(this).attr("data-month"));
  switch ($(this).attr("id")) {
    case "left":
      if (month === 0) {
        return;
      }
      month--;
      buildTinyYearView(moment().month(month));
      break;
    case "right":
      if (month === 11) {
        return;
      }
      month++;
      buildTinyYearView(moment().month(month));
      break;
  }
});

$(document).on("click", ".tiny-cal-year-td", function() {
  if ($("#chore-frequency").val() === "Monthly") {
    return;
  }
  var day = parseInt($(this).attr("data-dayOfYear"));
  console.log(
    "MONTH: " +
      moment()
        .dayOfYear(day)
        .month()
  );
  var currentVal = daysInYear[day];
  daysInYear[day] = !currentVal;
  $(this).toggleClass("td-selected");
});

function buildTinyYearView(now) {
  $(".tiny-cal").empty();
  var currentMonth = now.month();
  //build the shifters and label
  $(".tiny-cal")
    .append(
      `<div class="tiny-cal-shifter">
  <button type="button" class="btn btn-info shift-month" data-month="${currentMonth}" id="left">&lt;</button>
    <div id="tiny-month-label">${months[currentMonth]}</div>
  <button type="button" data-month="${currentMonth}" class="btn btn-info shift-month" id="right">&gt;</button>
</div>`
    )
    .append(buildTinyMonthView(now));
}

function buildTinyMonthView(now) {
  var month = now.month();
  var monthView = $("<table>").addClass("table table-bordered table-dark");

  //add the days of the week to the header row
  var head = $("<thead>");
  var headRow = $("<tr>");
  days.forEach(day => {
    $("<th scope='col'>" + day + "</th>").appendTo(headRow);
  });
  head.append(headRow);
  monthView.append(head);

  //get the day of the month
  var dayOfMonth = now.date();
  //console.log("day of month: " + dayOfMonth);
  var nextMonth = now.add(1, "month").month();
  //console.log("next month: " + nextMonth);
  now.subtract(1, "month");
  console.log("CURRENT MONTH: " + now.month());
  var thisMonth = []; //an array of arrays, each corresponding to a week
  //track the moment to the beginning of the month
  now.date(1);

  do {
    var week = [];
    for (var i = 0; i < now.day(); i++) {
      week.push(-1);
    }
    week.push(now.date());
    while (week.length < 7) {
      week.push(now.add(1, "d").date());
    }
    now.add(1, "d");
    thisMonth.push(week);
    //console.log(now.month() + " || " + nextMonth);
  } while (now.month() !== nextMonth);
  //console.log(thisMonth);
  //reset the day of the week
  now.day(dayOfMonth);
  //loop through the thisMonth array, which now holds the array of calendar (month) days, and append the weeks to the table
  //console.log(thisMonth);
  var tbody = $("<tbody>");
  for (var j = 0; j < thisMonth.length; j++) {
    var week = thisMonth[j];
    var weekRow = $("<tr>");
    for (var i = 0; i < week.length; i++) {
      var day = week[i];
      if (day < 0 || (j === thisMonth.length - 1 && day < 20)) {
        weekRow.append("<td></td>");
        continue;
      }
      var dayOfYear = moment()
        .month(month)
        .date(day)
        .dayOfYear();
      var td = $("<td>")
        .addClass("tiny-cal-td tiny-cal-year-td")
        .attr("data-day", day)
        .attr("data-selected", 0)
        .attr("data-dayOfYear", dayOfYear)
        .append("<div class='text-center'>" + day + "</div>");
      if (daysInYear[dayOfYear]) {
        td.attr("data-selected", 1).toggleClass("td-selected");
      }
      weekRow.append(td);
      now.add(1, "month");
    }
    tbody.append(weekRow);
  }

  // Lastly, append the table data to the monthView table
  monthView.append(tbody);
  return monthView;
}

function buildTinyWeekView(now) {
  var weekView = $("<table>").addClass("table table-bordered table-dark");
  //add the days of the week to the header row
  var head = $("<thead>");
  var headRow = $("<tr>");
  days.forEach(day => {
    $("<th scope='col'>" + day + "</th>").appendTo(headRow);
  });
  head.append(headRow);
  weekView.append(head);
  //get the day of the week -> this will correspond to the index of today in the days array
  var dayOfWeek = now.day();
  var thisWeek = [];
  thisWeek.push(now.day(0).date());
  for (var i = 1; i < 7; i++) {
    thisWeek.push(now.add(1, "d").date());
  }
  //reset the day of the week
  now.day(dayOfWeek);
  //loop through the thisWeek array, which now holds the calendar (month) day, and append the days to the table
  var tbody = $("<tbody>");
  var dayRow = $("<tr>");
  thisWeek.forEach((day, index) => {
    var td = $("<td>")
      .addClass("tiny-cal-td")
      .attr("data-day", index)
      .attr("data-selected", 0)
      .append("<div class='day left'>" + day + "</div>");
    dayRow.append(td);
  });
  tbody.append(dayRow);
  // Lastly, append the table data to the weekView table
  weekView.append(tbody);
  return weekView;
}

$(document).on("click", ".chore-close", function() {
  //empty out the chore modal values
  $("#chore-title").val("");
  $("#chore-details").val("");
  $("#chore-frequency").val("Daily");
  $("#chore-assigned-to").empty();
  $("#chore-submit").attr("data-dbID", "0");
  $(".tiny-cal").empty();
});
