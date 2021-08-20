const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
  console.error(error);
});
client.on("connection", function () {
  console.log("ok");
});
module.exports = client;
