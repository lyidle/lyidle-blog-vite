"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Reports", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      desc: {
        type: Sequelize.STRING,
      },
      filterType: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: "FilterTypes",
          key: "name",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      targetType: {
        type: Sequelize.ENUM("article", "comment", "msg", "user"),
        allowNull: false,
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Articles",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Comments",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      msgId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Messages",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      targetUserId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "id",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      },
      isSend: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // 添加复合索引提高查询性能
    await queryInterface.addIndex("Reports", ["targetType", "isSend"])
    await queryInterface.addIndex("Reports", ["isSend"])
    await queryInterface.addIndex("Reports", ["createdAt"])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reports")
  },
}
