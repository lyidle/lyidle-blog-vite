# redis

## 网站信息

### `webCreatedAt`

> [!value] 创站时间

```js
getKey("webCreatedAt")
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

### `webUpdatedAt`

> [!value] 网站最后更新时间

```js
getKey("webUpdatedAt")
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

## 网站所有者的信息

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

## 网站状态

### `initialWebInfo`

> [!value] 初始化小站中

```js
getKey("initialWebInfo")
```

## 临时垃圾桶值

### `userArticleBin:${id}`

> [!value] 文章是否移动到垃圾桶

```js
getKey(`userArticleBin:${id}`)
```

### `userBin:${id}`

> [!value] 用户是否移动到垃圾桶

```js
getKey(`userBin:${id}`)
```

## 用户信息

### token 字段

```json
{
  "id",
  "account",
  "avater",
  "signer",
  "email",
  "nickName",
  "role"
}
```

### `token:${id}`

> [!value] token

```js
getKey(`token:${id}`)
```

### `userInfo:${cacheKey}`

> [!value] 用户信息

```js
getKey(`userInfo:${cacheKey}`)
```

### `ipRegion:${userIp}`

> [!value] 访客 ip

```js
getKey(`ipRegion:${userIp}`)
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

### `ArticlefindAuthorAndId:${id}`

> [!value] 根据文章 id 和用户 id 查找文章 判断是否是 文章页面 404 了

```js
getKey(`ArticlefindAuthorAndId:${id}`)
```

### `ArticlefindByPk:${id}`

> [!value] 根据 id 获取文章

```js
getKey(`ArticlefindByPk:${id}`)
```

## 获取菜单

### `menu:${role}`

> [!value] 获取菜单

```js
const cacheKey = `menu:${role}`
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
