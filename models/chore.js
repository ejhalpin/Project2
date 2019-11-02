module.exports = function(sequelize, DataTypes) {
  var Chore = sequelize.define("Chore", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedTo: {
      type: DataTypes.STRING
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    markedCompleteAt: {
      type: DataTypes.STRING
    },
    frequency: {
      type: DataTypes.STRING,
      defaultValue: "daily"
    },
    scheduledOn: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    }
  });

  Chore.associate = function(models) {
    Chore.belongsTo(models.Hive, {
      foreignKey: {
        allowNull: false
      },
      onDelete: "cascade"
    });
  };

  return Chore;
};
