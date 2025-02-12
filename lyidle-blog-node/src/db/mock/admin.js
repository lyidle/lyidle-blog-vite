const asyncRoute = [
  {
    name: "Admin",
    to: "/admin",
    role: ["admin"],
    children: [
      {
        name: "Dashboard",
        to: "/admin/dashboard",
        role: ["admin"],
      },
      {
        name: "ArticleManagement",
        to: "/admin/articles",
        role: ["admin"],
        children: [
          {
            name: "ArticleList",
            role: ["admin"],
            to: "/admin/articles/list",
          },
          {
            name: "CategoryManagement",
            role: ["admin"],
            to: "/admin/articles/category",
          },
          {
            name: "TagManagement",
            role: ["admin"],
            to: "/admin/articles/tag",
          },
        ],
      },
      {
        name: "AccessManagement",
        to: "/admin/access",
        role: ["admin"],
        children: [
          {
            name: "UserManagement",
            role: ["admin"],
            to: "/admin/access/users",
          },
          {
            name: "RoleManagement",
            role: ["admin"],
            to: "/admin/access/roles",
          },
          {
            name: "MenuManagement",
            role: ["admin"],
            to: "/admin/access/menus",
          },
        ],
      },
    ],
  },
]
module.exports = asyncRoute
