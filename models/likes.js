'use strict';
module.exports = (sequelize, DataTypes) => {
  const likes = sequelize.define('Likes', {
    messageId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  likes.associate = function(models) {
    // associations can be defined here
    models.User.belongsToMany(models.Message, {
      through: models.Likes,
      foreignKey: 'userId',
      otherKey: 'messageId'
    });

    models.Message.belongsToMany(models.User, {
      through: models.Likes,
      foreignKey: 'messageId',
      otherKey: 'userId'
    });

    models.Likes.belongsTo(models.User, {
      foreignKey: 'userId',
    
    });

    models.Likes.belongsTo(models.Message, {
      foreignKey: 'messageId',
      
    });
  };


  

  return likes;
};