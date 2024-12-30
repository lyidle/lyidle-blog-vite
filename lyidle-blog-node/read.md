# redis

## token

`setkey(`token:${id}`,data)`
`getKey(`token:${id}`)`

## regCode

`setkey(`regCode:${email}`,code)`
`getKey(`regCode:${email}`)`

## forgetCode

`setkey(`forgetCode:${email}`,code)`
`getKey(`forgetCode:${email}`)`

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
