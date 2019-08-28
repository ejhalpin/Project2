$(document).on("click", ".chore-close", function() {
  //empty out the chore modal values
  $("#chore-title").val("");
  $("#chore-details").val("");
  $("#chore-frequency").val("Daily");
  $("#chore-assigned-to").empty();
  $("#chore-submit")
    .attr("data-type", "create")
    .attr("data-dbID", "0");
});
