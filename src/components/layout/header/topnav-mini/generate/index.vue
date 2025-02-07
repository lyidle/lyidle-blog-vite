<template>
  <recursive-menulist v-bind="$attrs" :MenuList="mock"></recursive-menulist>
</template>

<script setup lang="ts" name="TopNavMiniMenuList">
// 使用子组件
import recursiveMenulist from "./recursive/index.vue"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 类型
import { GetMenuList } from "@/api/admin/types/getMenuList"
const { userMenuList } = storeToRefs(useUserStore())
const mock = [
  {
    id: 1,
    name: "Dashboard",
    icon: "dashboard-icon",
    to: "/dashboard",
    children: [
      {
        id: 11,
        name: "Analytics",
        icon: "analytics-icon",
        to: "/dashboard/analytics",
        children: [
          {
            id: 111,
            name: "Traffic",
            icon: "traffic-icon",
            to: "/dashboard/analytics/traffic",
            children: [
              {
                id: 1111,
                name: "Real-Time",
                icon: "real-time-icon",
                to: "/dashboard/analytics/traffic/real-time",
                children: [
                  {
                    id: 11111,
                    name: "User Flow",
                    icon: "user-flow-icon",
                    to: "/dashboard/analytics/traffic/real-time/user-flow",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Settings",
    icon: "settings-icon",
    to: "/settings",
    children: [
      {
        id: 21,
        name: "User Management",
        icon: "user-management-icon",
        to: "/settings/user-management",
        children: [
          {
            id: 211,
            name: "Permissions",
            icon: "permissions-icon",
            to: "/settings/user-management/permissions",
            children: [
              {
                id: 2111,
                name: "Role Settings",
                icon: "role-settings-icon",
                to: "/settings/user-management/permissions/role-settings",
              },
            ],
          },
        ],
      },
    ],
  },
] as GetMenuList["data"]
</script>

<style scoped></style>
