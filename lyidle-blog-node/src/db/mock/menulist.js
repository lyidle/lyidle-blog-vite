"use strict"
const { resolve } = require("path")
const data = require(resolve(__dirname, "./testRoutes"))
const manager = [
  {
    name: "Manager",
    to: "/manager",
    children: [
      {
        name: "DashBoard",
        to: "/manager/dashBoard",
      },
      {
        name: "MenuManagement",
        to: "/manager/menu",
        children: [
          {
            name: "MenuList",
            to: "/manager/menu/list",
          },
          {
            name: "MenuEdit",
            to: "/manager/menu/edit/",
          },
          {
            name: "MenuCreate",
            to: "/manager/menu/create",
          },
        ],
      },
      {
        name: "UserManagement",
        to: "/manager/user",
        children: [
          {
            name: "UserList",
            to: "/manager/user/list",
          },
          {
            name: "UserEdit",
            to: "/manager/user/edit/",
          },
          {
            name: "UserCreate",
            to: "/manager/user/create",
          },
        ],
      },
      {
        name: "RoleManagement",
        to: "/manager/role",
        children: [
          {
            name: "RoleList",
            to: "/manager/role/list",
          },
          {
            name: "RoleEdit",
            to: "/manager/role/edit/",
          },
          {
            name: "RoleCreate",
            to: "/manager/role/create",
          },
        ],
      },
      {
        name: "PermissionManagement",
        to: "/manager/permission",
        children: [
          {
            name: "PermissionList",
            to: "/manager/permission/list",
          },
          {
            name: "PermissionEdit",
            to: "/manager/permission/edit/",
          },
          {
            name: "PermissionCreate",
            to: "/manager/permission/create",
          },
        ],
      },
    ],
  },
  ...data,
]

module.exports = manager
