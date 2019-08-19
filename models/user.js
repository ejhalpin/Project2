//The User module connects to the users table.
//This module has no validation on columns at this point.
//For each user, we collect name, email, familyGroup, and role
//sequelize will generate a primary key automatically

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    emailConfirmed: DataTypes.BOOLEAN,
    tempToken: DataTypes.STRING,
    expiration: DataTypes.STRING
  });

  User.associate = function(models) {
    //A User has many posts or replies. If a user is deleted, their posts should persist.
    User.hasMany(models.Post, {});
  };

  return User;
};
