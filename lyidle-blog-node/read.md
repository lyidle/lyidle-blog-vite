# redis

## 网站信息

### ownerId

> [!value] 网站所有者的账户的 id

```js
let ownerId = await getKey("ownerId")
```

### `webCreatedAt`

> [!value] 创站时间

```js
getKey("webCreatedAt")
```

### `webUpdatedAt`

> [!value] 网站最后更新时间

```js
getKey("webUpdatedAt")
```

### `touristCounts`

> [!value] 访客数量

```js
getKey("touristCounts")
```

### `userCounts`

> [!value] 用户数量

```js
getKey("userCounts")
```

### `webTotalPages`

> [!value] 文章数

```js
getKey("webTotalPages")
```

### `webTotalWords`

> [!value] 网站总字数

```js
getKey("webTotalWords")
```

### `setting:公告`

> [!value] 公告

```js
getKey(`setting:公告`)
```

### `setting:版权`

> [!value] 网站版权信息

```js
getKey("setting:版权")
```

### setting:联系方式

> [!value] 网站所有者的联系方式

```js
getKey("setting:联系方式")
```

### `setting:${name}`

> [!value] 获取设置信息

```js
getKey(`setting:${name}`)
```

## 用户信息

### token 字段

```json
{
  "id",
  "account",
  "role"
}
```

### `user:${id}:token`

> [!value] token

```js
getKey(`user:${id}:token`)
```

### `userInfo:${cacheKey}`  role限定只有owner

> [!value] 用户信息

```js
// 缓存 的键
let cacheKey = `userInfo:${id || roles || account}`
//  查询回收站 缓存 的键
if (isBin) cacheKey = `userInfo:bin:${id || roles || account}`
getKey(cacheKey)
```

## 验证码

### `${setData}:${email}`

> [!value] 根据邮箱获取验证码

```js
setData: "regCode" | "forgetCode"
// redis 插入的键值
const cacheKey = `${setData}:${email}`
// 获取redis的数据
let result = await getKey(cacheKey)
```

## 获取文章

### `recentPages:${limit}`

> [!value] 获取最新的文章

```js
const cacheValue = await getKey(`recentPages:${limit}`)
if (cacheValue) return res.result(cacheValue, "获取最新文章成功~")
```

### `allTags:${author}`

> [!value] 获取作者的所有 tags

```js
const cacheValue = await getKey(`allTags:${author}`)
if (cacheValue) return res.result(cacheValue, "获取所有tags成功~")
```

### `allCategories:${author}`

> [!value] 获取作者的所有 categories

```js
const cacheValue = await getKey(`allCategories:${author}`)
if (cacheValue) return res.result(cacheValue, "获取所有categories成功~")
```

### `category:search:allTag:${category}`

> [!value] 根据 category 查询 下面的 所有 tags 有缓存

```js
const cacheKey = `category:search:allTag:${category}`
const cacheValue = await getKey(cacheKey)
```

### `articlePagination:${currentPage},${pageSize}`

> [!value] 按照分页器格式 获取 文章

```js
const cacheValue = await getKey(`articlePagination:${currentPage},${pageSize}`)
if (cacheValue) return res.result(cacheValue, "获取所有tags成功~")
```

### `carousel:${limit}`

> [!value] 获取轮播图

```js
const cacheValue = await getKey(`carousel:${limit}`)
if (cacheValue) return res.result(cacheValue, "获取首页焦点图成功~")
```

## 获取菜单

### `menu:${role}`

> [!value] 获取菜单 根据权限 `*` 查询所有

```js
const cacheKey = `menu:${role}`
const cachedData = await getKey(cacheKey)
```

## 获取所有角色

### `roles:*`

> [!value] 获取所有权限

```js
const cacheKey = `roles:*`
const cachedData = await getKey(cacheKey)
```

## 获取权限组

### `permissionGroup:*`

> [!value] 获取所有权限组包括子权限

```js
const cacheKey = `permissionGroup:*`
const cachedData = await getKey(cacheKey)
```

## 获取所有权限

### `permission:*`

> [!value] 获取所有权限

```js
const cacheKey = `permissions:*`
const cachedData = await getKey(cacheKey)
```

## 获取古诗

### `poetry`

> [!value] 获取古诗词

```js
getKey("poetry")
```

## 上传

### `upload:img:temp:${account}:${url}`

> [!value] 上传临时文件是否 上传过了

```js
getKey(`upload:img:temp:${account}:${url}`)
```
