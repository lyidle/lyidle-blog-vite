## 设置信息的 content 一律需要 json 化存储

# token 字段

```
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

# redis 设置缓存

## token

`getKey(`token:${id}`)`
登录时设置,修改时改了 pwd 和删除用户时需要删除缓存
修改时没改 pwd，则更新

## regCode 注册密码发送邮箱

`setKey(`regCode:${email}`,code)`
发送邮箱时设置，验证通过删除

## forgetCode 忘记密码发送邮箱

`getKey(`forgetCode:${email}`)`
发送邮箱时设置，验证通过删除

## userBin 垃圾桶临时变量

`delKey(`userBin:${userId}`)`
进入垃圾桶后禁止再次回收
移除垃圾桶时也要删除

## userArticleBin 垃圾桶临时变量

`delKey(`userArticleBin:${userId}`)`
进入垃圾桶后禁止再次回收
移除垃圾桶时也要删除

## userInfo 用户信息

`getKey(`userInfo:${id}`)`
获取时设置，修改和删除时要删除缓存
登录时也删除缓存
修改和删除和增加文章时也删除缓存

## announce 公告

`getKey(`announce`)`
获取和设置时设置值

## upRegion ip 信息

`getKey(`ipRegion:${userIp}`)`

## menuList 菜单

`getKey(`menuList`)`
获取和设置时设置值

## poetry 古诗

`getKey(`poetry`)`
获取时设置值 使用的第三方 api

## webCreatedAt 网站创建时间

`getKey("webCreatedAt")`
运行程序时初始化

## webUpdatedAt 网站文章最后更新时间

`getKey("webUpdatedAt")`
文章创建和更新时，赋值

## touristCounts 游客数量

`getKey("touristCounts")`
获取 webinfo 时设置，访客数增加时，赋值 加了本地 ip 和 设备 限制

## userCounts 用户数量

`getKey("userCounts")`
初始化管理员账号时默认 1
登录增 +1
删除用户 -1

## webTotalPages 文章总数

`getKey("webTotalPages")`
文章增加和删除时赋值
用户删除时删除缓存

## totalWords 网站文章总字数

`getKey("totalWords")`
获取 webinfo 时设置，更新文章和删除文章与增加文章时删除缓存
用户删除时删除缓存
