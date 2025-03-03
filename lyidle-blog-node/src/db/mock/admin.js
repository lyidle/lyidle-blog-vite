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
        name: "Articles",
        to: "/admin/article",
        roles: ["admin"],
        children: [
          {
            name: "Articles Manager",
            roles: ["admin"],
            path: "/admin/article/manager",
          },
          {
            name: "Carousel Manager",
            roles: ["admin"],
            path: "/admin/article/carousel",
          },
        ],
      },
      {
        name: "Other",
        to: "/admin/other",
        roles: ["admin"],
        children: [
          {
            name: "BannerImg",
            roles: ["admin"],
            to: "/admin/other/banner",
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
            name: "GroupManagement",
            roles: ["admin"],
            to: "/admin/access/groups",
          },
          {
            name: "PermissionManagement",
            roles: ["admin"],
            to: "/admin/access/permissions",
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
