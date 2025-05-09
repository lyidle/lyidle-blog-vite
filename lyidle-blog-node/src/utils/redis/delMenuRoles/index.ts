import { deduplication } from "@/utils/array/deduplication"
import myError from "@/utils/error/myError"
import { delKeys, delKey, genCacheKey } from "@/utils/redis"

// 清除菜单缓存
export const delMenuRoles = async (roles: string[]) => {
  // 获取所有菜单的缓存 无论如何都要删除
  let settleArr: Promise<any>[] = [delKey("menu:*")]
  if (roles && roles.length) {
    // 需要删除 的数组 去重加 过滤 排序
    const deleteArr = deduplication(roles).filter(Boolean).sort()
    // 判断是否需要和删除缓存
    if (deleteArr && deleteArr.length) {
      // 删除 缓存
      settleArr.push(
        delKeys("menu:", deleteArr, {
          //  使用模糊匹配
          like: true,
        })
      )
    }
  }

  const results = await Promise.allSettled(settleArr)

  // 检查是否有任务失败
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("删除菜单的缓存失败:", result.reason)
    }
  })
}

/**
 * 保存菜单缓存 进行 简单的排序 避免顺序 问题保存多次
 * @param roles 需要进行保存 roles 是string[] 格式 或者 字符串 *
 * @return void
 */
export const saveMenuCache = (roles: string[] | string) => {
  // 获取 权限菜单 的key
  if (roles === "*") return `menu:*`
  // 不在 预期之类 报错
  if (!Array.isArray(roles)) {
    throw new myError("otherError", `缓存menu时出错,保存的键是预期之外的键`)
  }
  return genCacheKey("menu:", roles)
}
