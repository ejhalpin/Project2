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

function buildWeekView(now) {
  console.log("Month: " + (now.month() + 1).toString());
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
    dayRow.append($("<td>" + day + "</td>"));
  });
  tbody.append(dayRow);
  //it would be at this point that we would add the daily chores list to the weekly calendar or showing some data about the chores, number, time, etc.
  //for right now, I'll just throw an empty div into each cell and give it a class called week-view-cell
  var dataRow = $("<tr>");
  for (var i = 0; i < 7; i++) {
    var td = $("<td>");
    var div = $("<div>");
    //add data to the div here...
    div.addClass("week-view-cell");
    td.append(div).appendTo(dataRow);
  }
  tbody.append(dataRow);
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
  console.log("NOW - PRE ADJUST: " + now.toString());
  //now track backwards to the first day of the week
  now.day(0);
  console.log("NOW - POST ADJUST: " + now.toString());
  //now build out the weeks
  do {
    var week = [];
    week.push(now.date());
    while (week.length < 7) {
      week.push(now.add(1, "d").date());
    }
    now.add(1, "d");
    thisMonth.push(week);
    console.log(now.month() + " || " + nextMonth);
  } while (now.month() !== nextMonth);
  console.log(thisMonth);
  //reset the day of the week
  now.day(dayOfMonth);
  //loop through the thisMonth array, which now holds the array of calendar (month) days, and append the weeks to the table
  var tbody = $("<tbody>");
  thisMonth.forEach(week => {
    var weekRow = $("<tr>");
    week.forEach(day => {
      weekRow.append($("<td>" + day + "</td>"));
    });
    tbody.append(weekRow);
    var dataRow = $("<tr>");
    for (var i = 0; i < 7; i++) {
      var td = $("<td>");
      var div = $("<div>");
      //add data to the div here...
      div.addClass("month-view-cell");
      td.append(div).appendTo(dataRow);
    }
    tbody.append(dataRow);
  });

  //it would be at this point that we would add the daily chores list to the weekly calendar or showing some data about the chores, number, time, etc.
  //for right now, I'll just throw an empty div into each cell and give it a class called week-view-cell

  // Lastly, append the table data to the weekView table
  monthView.append(tbody);
  //update the week-month-label text
  $("#month-year-label").text(months[month] + " " + now.year());
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
  }
}
$(document).ready(() => {
  buildWeekView(moment());
  buildMonthView(moment());
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
