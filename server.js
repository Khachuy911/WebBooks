const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const port = process.env.PORT || 9000;
const connect = require("./Config/database");
const route = require("./Routers/index");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", "./public/views");

app.use(express.urlencoded());
app.use(express.json());
// connect with database
connect();

app.use(express.static(path.join(__dirname, "public")));

//set route
route(app);

app.listen(port, () => {
  console.log(`Server start with http://localhost:${port}`);
});
