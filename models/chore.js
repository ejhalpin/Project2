//The Chores module connects to the chores table.
//This module has no validation on columns at this point.
//For each chore, we collect name, frequency, asignedTo
//sequelize will generate a primary key automatically

module.exports = function(sequelize, DataTypes) {
  var Chore = sequelize.define("Chore", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: DataTypes.STRING,
    frequency: DataTypes.STRING, //"daily", "weekly", "monthly", "yearly"
    assignedTo: DataTypes.STRING,
    assignedWhen: DataTypes.STRING, //a sting of comma separated numbers corresponding to the days in the frequency scope
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Chore.associate = function(models) {
    //Chores belong to a Household and cannot be created without a household defined.
    Chore.belongsTo(models.Household, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Chore;
};
