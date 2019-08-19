function createUser() {
  $.post(
    "/api/users",
    {
      name: "Eugene",
      email: "ejhalpin3@gmail.com",
      token: "abc123"
    },
    response => {
      console.log(response);
    }
  );
}

createUser();
