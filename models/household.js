//The Household module connects to the households table.
//This module has no validation on columns at this point.
//For each household, we collect name and size for now.
//Other categories may become evident in the near future.
//sequelize will generate a primary key automatically

module.exports = function(sequelize, DataTypes) {
  var Household = sequelize.define("Household", {
    name: DataTypes.STRING,
    size: DataTypes.INTEGER
  });

  Household.associate = function(models) {
    //Associating Household with Chores
    //When a household is destroyed, also destroy all associated chores.
    Household.hasMany(models.Chore, {
      onDelete: "cascade"
    });

    Household.hasMany(models.User, {});
  };

  return Household;
};
