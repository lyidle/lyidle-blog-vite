const asyncRoute = [
  {
    name: "Admin",
    to: "/admin",
    roles: ["admin"],
    children: [
      {
        name: "Dashboard",
        to: "/admin/dashboard",
        roles: ["admin"],
      },
      {
        name: "ArticleManagement",
        to: "/admin/articles",
        roles: ["admin"],
        children: [
          {
            name: "ArticleList",
            roles: ["admin"],
            to: "/admin/articles/list",
          },
          {
            name: "CategoryManagement",
            roles: ["admin"],
            to: "/admin/articles/category",
          },
          {
            name: "TagManagement",
            roles: ["admin"],
            to: "/admin/articles/tag",
          },
        ],
      },
      {
        name: "AccessManagement",
        to: "/admin/access",
        roles: ["admin"],
        children: [
          {
            name: "UserManagement",
            roles: ["admin"],
            to: "/admin/access/users",
          },
          {
            name: "RoleManagement",
            roles: ["admin"],
            to: "/admin/access/roles",
          },
          {
            name: "MenuManagement",
            roles: ["admin"],
            to: "/admin/access/menus",
          },
        ],
      },
    ],
  },
]
module.exports = asyncRoute
