// migrations/[timestamp]-create-article-bookmark.js
"use strict"

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ArticleBookmarks", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      articleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Articles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      isBookmarked: {
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

    // 添加联合唯一索引
    await queryInterface.addIndex("ArticleBookmarks", {
      fields: ["userId", "articleId"],
      unique: true,
      name: "unique_user_article_bookmark",
    })

    // 添加其他索引
    await queryInterface.addIndex("ArticleBookmarks", ["userId"])
    await queryInterface.addIndex("ArticleBookmarks", ["articleId"])
    await queryInterface.addIndex("ArticleBookmarks", ["isBookmarked"])
  },

  async down(queryInterface, Sequelize) {
    // 然后删除表
    await queryInterface.dropTable("ArticleBookmarks")
  },
}
