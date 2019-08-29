$("#signup-submit").on("click", function(event) {
  event.preventDefault();
  var userObj = {
    name: $("#signup-name")
      .val()
      .trim(),
    email: $("#login-email")
      .val()
      .trim(),
    password: $("#login-password")
      .val()
      .trim()
  };

  $.ajax({ url: "/auth/signup", method: "PUT", data: userObj }).then(response => {
    if (response.status === 200) {
      //set the data instance in session storage
      session = response.data[0];
      sessionStorage.setItem("instance", JSON.stringify(session));
      location.href = "/";
    } else {
      console.log(response.reason);
    }
  });
});
