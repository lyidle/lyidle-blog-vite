const { ValidationError, ValidationErrorItem } = require("sequelize")
module.exports = class setDbError {
  constructor(msgs) {
    let msg = [new ValidationErrorItem(msgs)]
    if (Array.isArray(msgs))
      msg = [...new Set([msgs].flat(Infinity))].map((item) => {
        new ValidationErrorItem(item)
      })
    return new ValidationError("Validation failed", msg)
  }
}
