"use strict"

// 生成随机 `vh` 高度
const randomHeight = () => `${Math.floor(Math.random() * 40) + 30}vh`

const generateMenuData = () => [
  {
    name: "作品",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: null,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "piece1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 1,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "piece1-1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 2,
  },
  {
    name: "piece1-1-1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 3,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "piece2",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 1,
  },
  {
    name: "笔记",
    icon: "i-lucide:notebook-pen",
    to: "/note",
    parentId: null,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "note1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 6,
  },
  {
    name: "note2",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 6,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "数据库",
    icon: "i-mdi:database",
    to: "/note",
    parentId: null,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "筛选",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zm-6-8v2h16v-2H4zm3-6v2h10V4H7z"/></svg>`,
    to: "/note",
    parentId: null,
  },
  {
    name: "标签",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 10,
  },
  {
    name: "标签1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 11,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "标签1-1",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 12,
  },
  {
    name: "分类",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 10,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "文章",
    icon: "i-mdi:collection",
    to: "/note",
    parentId: 10,
  },
  {
    name: "图库",
    icon: "i-jam:picture-f",
    to: "/note",
    parentId: null,
  },
  {
    name: "图库-相册",
    icon: "i-jam:picture-f",
    to: "/note",
    parentId: 16,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "留言板",
    icon: "i-uil:message",
    to: "/note",
    parentId: null,
    bannerImg: { height: randomHeight() },
  },
  {
    name: "友链",
    icon: "i-heroicons-solid:link",
    to: "/note",
    parentId: null,
  },
]

// 导出数据
module.exports = generateMenuData()
