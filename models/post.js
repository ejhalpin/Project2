//The Post module connects to the posts table.
//This module has no validation on columns at this point.
//For each post, we collect title, body, isFlagged, and a linkedTo property used to associate replies with main posts.
//sequelize will generate a primary key automatically
module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //the title should be limitied to 80 characters and cannot be an empty string
        len: [1, 80]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      //The body cannot be an empty string
      len: [1]
    },
    category: DataTypes.STRING,
    isReply: DataTypes.BOOLEAN,
    linkedTo: DataTypes.STRING,
    isFlagged: DataTypes.BOOLEAN
  });

  Post.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
