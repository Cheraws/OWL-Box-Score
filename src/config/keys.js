
if (process.env.NODE_ENV === "production") {
  console.log("production version")
  module.exports = require("./dev");
} else {
  console.log("dev version")
  module.exports = require("./dev");
}
