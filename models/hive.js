module.exports = function(sequelize, DataTypes) {
  var Hive = sequelize.define("Hive", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: [4, 32]
      }
    },
    queen: {
      type: DataTypes.STRING
    },
    members: DataTypes.INTEGER,
    choresCount: DataTypes.INTEGER,
    compOnTime: DataTypes.INTEGER,
    compLate: DataTypes.INTEGER,
    unassigned: DataTypes.INTEGER
  });

  Hive.associate = function(models) {
    Hive.hasMany(models.Chore, {
      onDelete: "cascade",
      hooks: true
    });
    Hive.hasMany(models.User, {});
  };

  return Hive;
};
