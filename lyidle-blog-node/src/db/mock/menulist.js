"use strict"
const { resolve } = require("path")
const test = require(resolve(__dirname, "./testRoutes"))
const admin = require(resolve(__dirname, "./admin"))
const data = [...admin, ...test]

module.exports = data
