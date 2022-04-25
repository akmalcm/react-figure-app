let store = require("nedb")

let purchase = new store({ filename: "db/purchases.db", autoload: true })

module.exports = purchase