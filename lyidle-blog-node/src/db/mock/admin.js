const asyncRoute = [
  {
    name: "Admin",
    to: "/admin",
    roles: ["admin"],
    children: [
      {
        name: "Dashboard",
        to: "/admin/dashboard",
        icon: "i-material-symbols:home-rounded",
        roles: ["admin"],
      },
      {
        name: "Articles",
        to: "/admin/article",
        icon: "i-mdi:paper",
        roles: ["admin"],
      },
      {
        name: "Other",
        to: "/admin/other",
        roles: ["admin"],
        icon: "i-basil:other-1-solid",
        children: [
          {
            name: "BannerImg",
            roles: ["admin"],
            icon: "i-ic:round-color-lens",
            to: "/admin/other/banner",
          },
          {
            name: "Settings",
            roles: ["admin"],
            icon: "i-lsicon:setting-filled",
            to: "/admin/other/settings",
          },
        ],
      },
      {
        name: "AccessManagement",
        to: "/admin/access",
        icon: '<svg t="1744723644460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4518" id="mx_n_1744723644460" width="200" height="200"><path d="M787 214.5c-110.8-10-194.6-69.2-234.8-98.1-9.6-6.9-20.8-10.6-32.4-10.6-14 0-27.7 5.4-38.6 15.3-67.5 61-180.5 87.2-241.9 91.9-30.3 2.3-54 29.7-54 62.4V535c0 124.2 184.7 385.7 329.7 385.7 151.7 0 325.6-266.9 325.6-376.1V276.7c0.1-32.8-23-59.5-53.6-62.2zM540.9 513.4v160.4c0 15.7-12.7 28.5-28.5 28.5-15.7 0-28.5-12.7-28.5-28.5V513c-39.2-12.4-67.8-48.8-67.8-92 0-53.4 43.4-96.8 96.8-96.8s96.9 43.4 96.9 96.8c0.1 43.6-29.1 80.4-68.9 92.4z" fill="#ffffff" p-id="4519"></path></svg>',
        roles: ["admin"],
        children: [
          {
            name: "UserManagement",
            roles: ["admin"],
            icon: "i-mage:user-fill",
            to: "/admin/access/users",
          },
          {
            name: "RoleManagement",
            roles: ["admin"],
            icon: "i-fa6-solid:user-group",
            to: "/admin/access/roles",
          },
          {
            name: "GroupManagement",
            roles: ["admin"],
            icon: "i-fluent:contact-card-group-48-filled",
            to: "/admin/access/groups",
          },
          {
            name: "PermissionManagement",
            roles: ["admin"],
            icon: "i-mdi:key-variant",
            to: "/admin/access/permissions",
          },
          {
            name: "MenuManagement",
            roles: ["admin"],
            icon: "i-ep:menu",
            to: "/admin/access/menus",
          },
        ],
      },
      {
        name: "RecycleManager",
        to: "/admin/recycle",
        icon: "i-fluent:bin-recycle-20-filled",
        roles: ["admin"],
        children: [
          {
            name: "UserRecycle",
            icon: "i-mage:user-fill",
            roles: ["admin"],
            to: "/admin/recycle/users",
          },
          {
            name: "RoleRecycle",
            roles: ["admin"],
            icon: "i-fa6-solid:user-group",
            to: "/admin/recycle/roles",
          },
          {
            name: "GroupRecycle",
            roles: ["admin"],
            icon: "i-fluent:contact-card-group-48-filled",
            to: "/admin/recycle/groups",
          },
          {
            name: "PermissionRecycle",
            roles: ["admin"],
            icon: "i-mdi:key-variant",
            to: "/admin/recycle/permissions",
          },
          {
            name: "MenuRecycle",
            roles: ["admin"],
            icon: "i-ep:menu",
            to: "/admin/recycle/menus",
          },
        ],
      },
      {
        name: "Report",
        to: "/admin/report",
        icon: "i-fluent:collections-20-filled",
        roles: ["admin"],
        children: [
          {
            name: "ReportManager",
            icon: "i-fluent:collections-add-24-filled",
            roles: ["admin"],
            to: "/admin/report/manager",
          },
          {
            name: "FilterWords",
            icon: '<svg t="1744725074410" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12930" width="200" height="200"><path d="M515.0208 533.7088h72.8576v94.6176h-72.8576z" fill="#6893DF" p-id="12931"></path><path d="M781.9264 105.6256H237.6192c-73.0624 0-132.5056 59.4432-132.5056 132.5056v544.3072c0 73.0624 59.4432 132.5056 132.5056 132.5056h544.3072c73.0624 0 132.5056-59.4432 132.5056-132.5056V238.08c-0.0512-73.0624-59.4432-132.4544-132.5056-132.4544zM265.0112 260.7616a30.67904 30.67904 0 0 1 43.4176 1.2288l32.0512 33.9456a30.67904 30.67904 0 0 1-1.2288 43.4176 30.5152 30.5152 0 0 1-21.0944 8.3968 30.6176 30.6176 0 0 1-22.3232-9.6256l-32.0512-33.9456c-11.6224-12.3392-11.1104-31.7952 1.2288-43.4176z m144.384 451.6352l-75.5712 40.96a30.83776 30.83776 0 0 1-32.1024-1.7408 30.70464 30.70464 0 0 1-12.9536-29.44l38.2976-281.7536h-48.8448c-16.9472 0-30.72-13.7728-30.72-30.72s13.7728-30.72 30.72-30.72h84.0192c8.8576 0 17.3056 3.84 23.1424 10.496s8.4992 15.5648 7.3216 24.32l-34.8672 256.6144 22.3232-12.1344c14.9504-8.0896 33.5872-2.56 41.6256 12.3904 8.0384 15.0016 2.5088 33.6384-12.3904 41.728z m74.9056-22.6304c-16.9472 0-30.72-13.7728-30.72-30.72V502.9888c0-16.9472 13.7728-30.72 30.72-30.72h134.2976c16.9472 0 30.72 13.7728 30.72 30.72v156.0576c0 16.9472-13.7728 30.72-30.72 30.72H484.3008z m-36.6592-282.3168c0-16.9472 13.7728-30.72 30.72-30.72h140.544c16.9472 0 30.72 13.7728 30.72 30.72s-13.7728 30.72-30.72 30.72H478.3616c-16.9472 0-30.72-13.7216-30.72-30.72z m314.1632 303.5136c0 40.1408-32.6656 72.8576-72.8576 72.8576h-24.0128c-16.9472 0-30.72-13.7728-30.72-30.72s13.7728-30.72 30.72-30.72h24.0128c6.2976 0 11.4176-5.12 11.4176-11.4176v-380.928c0-11.7248-7.68-21.6576-16.6912-21.6576H458.9568c-16.9472 0-30.72-13.7728-30.72-30.72s13.7728-30.72 30.72-30.72h224.6656c43.1104 0 78.1312 37.2736 78.1312 83.0976v380.928z" fill="#6893DF" p-id="12932"></path></svg>',
            roles: ["admin"],
            to: "/admin/report/filter-words",
          },
          {
            name: "FilterWordTypes",
            icon: '<svg t="1744725295801" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15254" width="200" height="200"><path d="M950.857143 146.285714c-21.723429-81.188571-65.828571-146.285714-146.285714-146.285714H219.428571C138.971429 0 92.598857 67.437714 73.142857 146.285714L0 402.285714V877.714286c0 80.457143 65.828571 146.285714 146.285714 146.285714h731.428572c80.457143 0 146.285714-65.828571 146.285714-146.285714V402.285714L950.857143 146.285714zM273.554286 512L365.714286 731.428571h-39.204572l-21.211428-52.736H206.701714L184.466286 731.428571H146.285714l92.16-219.428571h35.108572z m-16.237715 38.985143h-1.024a68.169143 68.169143 0 0 1-6.363428 20.553143l-30.72 75.117714h72.996571L262.582857 571.538286a60.342857 60.342857 0 0 1-5.266286-20.553143zM146.285714 146.285714c12.580571-40.009143 32.914286-73.142857 73.142857-73.142857h585.142858c40.228571 0 60.562286 33.133714 73.142857 73.142857l73.142857 256H73.142857L146.285714 146.285714z m730.258286 704c0 20.114286-16.457143 36.571429-36.571429 36.571429H475.428571a36.644571 36.644571 0 0 1-36.571428-36.571429c0-20.114286 16.457143-36.571429 36.571428-36.571428h364.544c20.114286 0 36.571429 16.457143 36.571429 36.571428zM841.142857 731.428571H658.285714a36.644571 36.644571 0 0 1-36.571428-36.571428c0-20.114286 16.457143-36.571429 36.571428-36.571429h182.857143c20.114286 0 36.571429 16.457143 36.571429 36.571429s-16.457143 36.571429-36.571429 36.571428z" p-id="15255" fill="#e6e6e6"></path></svg>',
            roles: ["admin"],
            to: "/admin/report/filter-groups",
          },
        ],
      },
      {
        name: "SystemMessage",
        to: "/admin/system-msg",
        icon: "i-mynaui:message-solid",
        roles: ["admin"],
      },
    ],
  },
]
module.exports = asyncRoute
