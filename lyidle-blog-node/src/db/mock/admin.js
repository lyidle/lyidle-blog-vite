const asyncRoute = [
  {
    name: "Admin",
    to: "/admin",
    children: [
      {
        name: "Dashboard",
        to: "/admin/dashboard",
      },
      {
        name: "ArticleManagement",
        to: "/admin/articles",
        children: [
          {
            name: "ArticleList",
            to: "/admin/articles/list",
          },
          {
            name: "CategoryManagement",
            to: "/admin/articles/category",
          },
          {
            name: "TagManagement",
            to: "/admin/articles/tag",
          },
        ],
      },
      {
        name: "AccessManagement",
        to: "/admin/access",
        children: [
          {
            name: "UserManagement",
            to: "/admin/access/users",
          },
          {
            name: "RoleManagement",
            to: "/admin/access/roles",
          },
          {
            name: "MenuManagement",
            to: "/admin/access/menus",
          },
        ],
      },
    ],
  },
]
module.exports = asyncRoute
