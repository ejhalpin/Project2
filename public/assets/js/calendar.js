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
var offset = 0;
var monthOffset = 0;
var yearOffset = 0;

function buildWeekView(now) {
  //console.log("Month: " + (now.month() + 1).toString());
  var weekView = $("#week-view");
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
    //it would be at this point that we would add the daily chores list to the weekly calendar or showing some data about the chores, number, time, etc.
    //for right now, I'll just throw an empty div into each cell and give it a class called week-view-cell
    var div = $("<div>");
    //add data to the div here...
    div.addClass("week-view-cell");
    td.append(div);
    dayRow.append(td);
  });
  tbody.append(dayRow);
  // Lastly, append the table data to the weekView table
  weekView.append(tbody);
  //update the week-month-label text
  $("#week-month-label").text(months[now.month()]);
}

function buildMonthView(now) {
  var monthView = $("#month-view");

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
  var month = now.subtract(1, "month").month();
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
      //it would be at this point that we would add the daily chores list to the weekly calendar or showing some data about the chores, number, time, etc.
      //for right now, I'll just throw an empty div into each cell and give it a class called week-view-cell
      var div = $("<div>");
      //add data to the div here...
      div.addClass("week-view-cell");
      td.append(div);
      weekRow.append(td);
    });
    tbody.append(weekRow);
  });

  // Lastly, append the table data to the monthView table
  monthView.append(tbody);
  //update the month-year-label text
  $("#month-year-label").text(months[month] + " " + now.year());
}

function buildYearView(now) {
  //grab the year view table
  var yearView = $("#year-view");
  //make a table body for the year view
  var viewBody = $("<tbody>");
  //the year view will have 4 calendar months per row, with 3 rows
  //a loop for each row
  //set the dayOfYear to 1
  now.dayOfYear(1);
  var currentMonth = 0;
  for (var i = 0; i < 4; i++) {
    var viewRow = $("<tr>");
    //a loop for each column (calendar month) in the row
    for (var j = 0; j < 3; j++) {
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
            weekRow.append("<td class='year-day'>" + day + "</td>");
          }
        });
        monthBody.append(weekRow);
      });
      monthTable.append(monthBody);
      col.append(monthTable).appendTo(viewRow);
      currentMonth++;
    }
    viewBody.append(viewRow);
  }
  yearView.append(viewBody);
  console.log(currentMonth);
}

function setLabel(view) {
  switch (view) {
    case "week":
      var plural = "";
      if (offset > 1 || offset < -1) {
        plural = "s";
      }
      var ending = "Ago";
      if (offset > 0) {
        ending = "Ahead";
      }
      var text = "This Week";
      if (offset !== 0) {
        text = `${Math.abs(offset)} Week${plural} ${ending}`;
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

$(document).ready(() => {
  buildWeekView(moment());
  buildMonthView(moment());
  buildYearView(moment());
});

$(document).on("click", "#prev-week", function() {
  offset--;
  setLabel("week");
  $("#week-view").empty();
  buildWeekView(moment().add(offset, "w"));
});

$(document).on("click", "#next-week", function() {
  offset++;
  setLabel("week");
  $("#week-view").empty();
  buildWeekView(moment().add(offset, "w"));
});

$(document).on("click", "#prev-month", function() {
  monthOffset--;
  setLabel("month");
  $("#month-view").empty();
  buildMonthView(moment().add(monthOffset, "month"));
});

$(document).on("click", "#next-month", function() {
  monthOffset++;
  setLabel("month");
  $("#month-view").empty();
  buildMonthView(moment().add(monthOffset, "month"));
});

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
