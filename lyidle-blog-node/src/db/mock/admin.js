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
      {
        name: "RecycleManager",
        to: "/admin/recycle",
        roles: ["admin"],
        children: [
          {
            name: "UserRecycle",
            roles: ["admin"],
            to: "/admin/recycle/users",
          },
          {
            name: "RoleRecycle",
            roles: ["admin"],
            to: "/admin/recycle/roles",
          },
          {
            name: "GroupRecycle",
            roles: ["admin"],
            to: "/admin/recycle/groups",
          },
          {
            name: "PermissionRecycle",
            roles: ["admin"],
            to: "/admin/recycle/permissions",
          },
          {
            name: "MenuRecycle",
            roles: ["admin"],
            to: "/admin/recycle/menus",
          },
        ],
      },
    ],
  },
]
module.exports = asyncRoute
