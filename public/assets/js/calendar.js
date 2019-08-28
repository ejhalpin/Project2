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
  now.date(1);

  //console.log("NOW - PRE ADJUST: " + now.dayOfYear());
  var nextMonth = now.add(1, "month").month();
  now.subtract(1, "month");

  var thisMonth = []; //an array of arrays, each corresponding to a week
  //track the moment to the beginning of the month
  //now track backwards to the first day of the week
  now.day(0);

  //console.log("NOW - POST ADJUST: " + now.dayOfYear());
  //now build out the weeks
  do {
    var week = [];
    week.push(now.dayOfYear());
    while (week.length < 7) {
      week.push(now.add(1, "d").dayOfYear());
    }
    now.add(1, "d");

    thisMonth.push(week);
    //console.log(now.month() + " || " + nextMonth);
  } while (now.month() !== nextMonth);
  //console.log(thisMonth);
  //reset the day of the week
  now.month(month).date(dayOfMonth);
  console.log("DATE " + now.toString() + "DOY: " + now.dayOfYear() + ", DOW: " + now.day());
  //loop through the thisMonth array, which now holds the array of calendar (month) days, and append the weeks to the table
  var tbody = $("<tbody>");
  thisMonth.forEach(week => {
    var weekRow = $("<tr>");
    week.forEach(dayOfYear => {
      var td = $("<td>");
      td.append(
        "<div class='day left'>" +
          moment()
            .dayOfYear(dayOfYear)
            .date() +
          "</div>"
      );
      td.append("<hr />");
      var choresList = getChores(dayOfYear);
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

  var thisWeek = [];
  thisWeek.push(now.day(0).dayOfYear());
  for (var i = 1; i < 7; i++) {
    thisWeek.push(now.add(i, "d").dayOfYear());
    now.subtract(i, "d");
  }

  //loop through the thisWeek array, which now holds the calendar (month) day, and append the days to the table
  var tbody = $("<tbody>");
  var dayRow = $("<tr>");
  thisWeek.forEach(dayOfYear => {
    var day = moment()
      .dayOfYear(dayOfYear)
      .date();
    var td = $("<td>");
    td.append("<div class='day left'>" + day + "</div>");
    td.append("<hr />");
    var choresList = getChores(dayOfYear);
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

function getChores(dayOfYear) {
  //the variable day, which is passed into the function, is either a date or a day of the week, depending on the function call
  var choresList = [];
  Household.Chores.forEach(chore => {
    if (chore.assignedTo === session.name) {
      var dayOfWeek = moment()
        .dayOfYear(dayOfYear)
        .day();
      var date = moment()
        .dayOfYear(dayOfYear)
        .date();
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
          if (chore.assignedWhen.includes(date.toString())) {
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
