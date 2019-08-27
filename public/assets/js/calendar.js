//global data
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

var weekOffset = 0;
var monthOffset = 0;

//=================================================================================================
//******************************* THE CALENDAR DISPLAY LOGIC **************************************
//=================================================================================================

$(document).on("click", "#cal-close", function() {
  $("#parent").empty();
});

$(document).on("change", "#cal-scope", function() {
  var scope = $(this).val();
  $("#cal-view").remove();
  $("#parent").append("<div id='cal-view'>");
  switch (scope) {
    case "Today":
      console.log("today");
      //this is Wendy's view
      break;
    case "This Week":
      weekOffset = 0;
      $("#cal-view").append(`
      <div class="tiny-cal-shifter">
        <button type="button" class="btn btn-info" id="prev-week">&lt;</button>
          <div id="week-label">This Week</div>
        <button type="button" class="btn btn-info" id="next-week">&gt;</button>
      </div>
      <div id="cal-view-target" class="table-responsive"></div>`);
      $("#cal-view-target").append(buildWeekView(moment()));
      break;
    case "This Month":
      monthOffset = 0;
      $("#cal-view").append(`
      <div class="tiny-cal-shifter">
        <button type="button" class="btn btn-info" id="prev-month">&lt;</button>
          <div id="month-label">This Month</div>
        <button type="button" class="btn btn-info" id="next-month">&gt;</button>
      </div>
      <div id="cal-view-target" class="table-responsive"></div>`);
      $("#cal-view-target").append(buildMonthView(moment()));
      break;
    case "This Year":
      $("#cal-view").append(`
        <div id="cal-view-target" class="table-responsive"></div>`);
      $("#cal-view-target").append(buildYearView(moment()));
      console.log("this year");
      //lay out the calendar year and put click events on the days and months. On click, the user should snap to those views.
      break;
  }
});

$(document).on("click", "#cal-icon", function() {
  $("#parent").empty().append(`
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#Content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="Content">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <a class="nav-link close" id="cal-close" href="#"><span class="v-fix" aria-hidden="true">&times;</span></span></a>
          </li>
          <li class="nav-item">
            <select class="form-control" id="cal-scope">
              <option>Today</option>
              <option selected>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </li>
        </ul>
    <form class="form-inline my-2 my-lg-0">
      <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
      <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
    </form>
  </div>
</nav>`);

  $("#cal-scope").trigger("change");
});

$(document).on("click", "#prev-week", function() {
  weekOffset--;
  setLabel("week");
  $("#cal-view-target")
    .empty()
    .append(buildWeekView(moment().add(weekOffset, "week")));
});

$(document).on("click", "#next-week", function() {
  weekOffset++;
  setLabel("week");
  $("#cal-view-target")
    .empty()
    .append(buildWeekView(moment().add(weekOffset, "week")));
});

$(document).on("click", "#prev-month", function() {
  monthOffset--;
  setLabel("month");
  $("#cal-view-target")
    .empty()
    .append(buildMonthView(moment().add(monthOffset, "month")));
});

$(document).on("click", "#next-month", function() {
  monthOffset++;
  setLabel("month");
  $("#cal-view-target")
    .empty()
    .append(buildMonthView(moment().add(monthOffset, "month")));
});

$(document).on("click", ".year-view-cell", function() {
  var date = parseInt($(this).text());
  var month = parseInt($(this).attr("data-month"));
  var thisWeek = moment().week();
  var targetWeek = moment()
    .month(month)
    .date(date)
    .week();
  weekOffset = targetWeek - thisWeek;
  $("#cal-view").empty().append(`
  <div class="tiny-cal-shifter">
    <button type="button" class="btn btn-info" id="prev-week">&lt;</button>
      <div id="week-label">This Week</div>
    <button type="button" class="btn btn-info" id="next-week">&gt;</button>
  </div>
  <div id="cal-view-target" class="table-responsive"></div>`);
  $("#cal-view-target").append(buildWeekView(moment().add(weekOffset, "week")));
  setLabel("week");
});

function buildMonthView(now) {
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
  var nextMonth = now.add(1, "month").month();
  now.subtract(1, "month");
  var thisMonth = []; //an array of arrays, each corresponding to a week
  //track the moment to the beginning of the month
  now.date(1);
  //console.log("NOW - PRE ADJUST: " + now.toString());
  //now track backwards to the first day of the week
  now.day(0);
  //console.log("NOW - POST ADJUST: " + now.toString());
  //now build out the weeks
  do {
    var week = [];
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
  var tbody = $("<tbody>");
  thisMonth.forEach(week => {
    var weekRow = $("<tr>");
    week.forEach(day => {
      var td = $("<td>");
      td.append("<div class='day left'>" + day + "</div>");
      td.append("<hr />");
      var choresList = getChores(day);
      //a div to hold the chore list
      var div = $("<ul>").addClass("chores-list");
      //each chore in the choreslist needs to be appended to the calendar day
      choresList.forEach(chore => {
        div.append(`
        <li>${chore}</li>
      `);
      });

      td.append(div);
      weekRow.append(td);
    });
    tbody.append(weekRow);
  });

  // Lastly, append the table data to the monthView table
  monthView.append(tbody);
  return monthView;
}

function buildWeekView(now) {
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
  thisWeek.forEach(day => {
    var td = $("<td>");
    td.append("<div class='day left'>" + day + "</div>");
    td.append("<hr />");
    var choresList = getChores(day);
    //a div to hold the chore list
    var div = $("<ul>").addClass("chores-list");
    //each chore in the choreslist needs to be appended to the calendar day
    choresList.forEach(chore => {
      div.append(`
        <li>${chore}</li>
      `);
    });

    //add data to the div here...
    td.append(div);
    dayRow.append(td);
  });
  tbody.append(dayRow);
  // Lastly, append the table data to the weekView table
  weekView.append(tbody);
  return weekView;
}

function getChores(day) {
  //get a list of all chores for today
  //let's make sure that we have all of the necessary info to parse thorough the chores data
  var dayOfWeek = moment()
    .date(day)
    .day();
  var dayOfYear = moment()
    .date(day)
    .dayOfYear();
  //assuming that we are now correlating days and months correctly,
  //make a list of all chores for the day based on frequency and assignedWhen
  var choresList = [];
  Household.Chores.forEach(chore => {
    if (chore.assignedTo === session.name) {
      switch (chore.frequency) {
        case "Daily":
          choresList.push(chore.name);
          break;
        case "Weekly":
          if (chore.assignedWhen.includes(dayOfWeek.toString())) {
            choresList.push(chore.name);
          }
          break;
        case "Monthly":
          if (chore.assignedWhen.includes(dayOfMonth.toString())) {
            choresList.push(chore.name);
          }
          break;
        case "Yearly":
          if (chore.assignedWhen.includes(dayOfYear.toString())) {
            choresList.push(chore.name);
          }
      }
    }
  });
  return choresList;
}

function buildYearView(now) {
  //grab the year view table
  var yearView = $("<table>").addClass("table table-bordered table-dark");
  //make a table body for the year view
  var viewBody = $("<tbody>");
  //the year view will have 4 calendar months per row, with 3 rows
  //a loop for each row
  //set the dayOfYear to 1
  now.dayOfYear(1);
  var currentMonth = 0;
  for (var i = 0; i < 4; i++) {
    var labelRow = $("<tr>");
    var viewRow = $("<tr>");
    //a loop for each column (calendar month) in the row
    for (var j = 0; j < 3; j++) {
      var monthIndex = j + i * 3;
      var month = months[monthIndex];
      labelRow.append(`<th>${month}</th>`);
      var col = $("<td>");
      //build the month table
      var monthTable = $("<table>");
      var monthBody = $("<tbody>");
      //build an array of weeks on the month, filled with dates to be added to the table
      var weeksInMonth = []; //an array of arrays
      while (now.month() === currentMonth) {
        var week = [];
        //backfill the week array for the first week, if now is not a sunday
        for (var p = 0; p < now.day(); p++) {
          week.push(0);
        }
        //fill in the rest of the week
        for (var q = now.day(); q < 7; q++) {
          week.push(now.date());
          now.add(1, "day");
          if (now.month() > currentMonth) {
            break;
          }
        }
        //fill out the rest of the week if the month doesn't end on a saturday
        for (var r = week.length; r < 7; r++) {
          week.push(0);
        }
        weeksInMonth.push(week);
      }
      //fill in the dates in the calendar and push it to the view column
      weeksInMonth.forEach(week => {
        var weekRow = $("<tr>");
        week.forEach(day => {
          if (day === 0) {
            weekRow.append("<td></td>");
          } else {
            weekRow.append(
              `<td class='year-view-cell' data-month=${monthIndex.toString()}>${day}</td>`
            );
          }
        });
        monthBody.append(weekRow);
      });
      monthTable.append(monthBody);
      col.append(monthTable).appendTo(viewRow);
      currentMonth++;
    }
    viewBody.append(labelRow);
    viewBody.append(viewRow);
  }
  yearView.append(viewBody);
  return yearView;
}

function setLabel(view) {
  switch (view) {
    case "week":
      var plural = "";
      if (weekOffset > 1 || weekOffset < -1) {
        plural = "s";
      }
      var ending = "Ago";
      if (weekOffset > 0) {
        ending = "Ahead";
      }
      var text = "This Week";
      if (weekOffset !== 0) {
        text = `${Math.abs(weekOffset)} Week${plural} ${ending}`;
      }
      $("#week-label").text(text);
      break;
    case "month":
      var plural = "";
      if (monthOffset > 1 || monthOffset < -1) {
        plural = "s";
      }
      var ending = "Ago";
      if (monthOffset > 0) {
        ending = "Ahead";
      }
      var text = "This Month";
      if (monthOffset !== 0) {
        text = `${Math.abs(monthOffset)} Month${plural} ${ending}`;
      }
      $("#month-label").text(text);
      break;
    case "year":
      var plural = "";
      if (yearOffset > 1 || yearOffset < -1) {
        plural = "s";
      }
      var ending = "Ago";
      if (yearOffset > 0) {
        ending = "Ahead";
      }
      var text = "This Year";
      if (yearOffset !== 0) {
        text = `${Math.abs(yearOffset)} Year${plural} ${ending}`;
      }
      $("#year-label").text(text);
      break;
  }
}

$(document).on("click", "#prev-year", function() {
  yearOffset--;
  setLabel("year");
  $("#year-view").empty();
  buildYearView(moment().add(yearOffset, "year"));
});

$(document).on("click", "#next-year", function() {
  yearOffset++;
  setLabel("year");
  $("#year-view").empty();
  buildYearView(moment().add(yearOffset, "year"));
});

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
  if ($(this).attr("data-type") === "create") {
    //call the api to create the chore
    $.post("/api/chore", choreObj, response => {
      if (response.status !== 200) {
        console.log(response.reason);
      }
      //TODO change this to a reload of the scene, not the page
      location.reload();
    });
  } else {
    editChore($(this).attr("data-dbID"), choreObj);
  }
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
