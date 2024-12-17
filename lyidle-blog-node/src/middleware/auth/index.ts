const { expressjwt: jwt } = require("express-jwt")
export default jwt({ secret: process.env.HASH, algorithms: ["HS256"] })
