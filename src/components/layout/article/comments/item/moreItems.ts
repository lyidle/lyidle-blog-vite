// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 类型
import type { menuView } from "@/components/layout/header/types"
export const moreItems = (options: { author: string }) => {
  // 得到 文章的作者
  const { author } = options
  const { userAccount } = storeToRefs(useUserStore())
  const moreItem = ref<menuView>({
    data: [
      {
        id: "1",
        name: "设为置顶",
        click: async () => {
          // 置顶的 逻辑
        },
      },
      {
        id: "2",
        name: "举报",
        click: async () => {
          // 举报的 逻辑
        },
      },
      {
        id: "3",
        name: "修改",
        click: async () => {
          // 修改的 逻辑
        },
      },
      {
        id: "4",
        name: "删除",
        click: async () => {
          // 删除的 逻辑
        },
      },
    ],
    style: {
      width: "100px",
      pl: "20px",
    },
  })
  return moreItem
}
