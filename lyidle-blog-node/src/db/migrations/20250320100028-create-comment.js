"use strict"
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      content: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      articleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Articles",
          key: "id",
        },
      },
      fromId: {
        type: Sequelize.INTEGER,
        allowNull: true, // 允许为空，表示顶级评论
        references: {
          model: "Comments", // 自引用，指向同一张表
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Comments")
  },
}
