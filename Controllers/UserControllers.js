const users = require("../Models/UsersModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");
module.exports = {
  getUser: asyncHandle(async (req, res) => {
    const user = await users.findById(req.params.id);
    if (!user) return next(new errorResponse(401, "user not exists"));
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  getAllUser: asyncHandle(async (req, res) => {
    const user = await users.find();
    if (!user) return next(new errorResponse(401, "user not exists"));
    // res.render("user.ejs", { user });
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  updateUser: asyncHandle(async (req, res) => {
    console.log(req.body);
    const updateUser = req.body;
    const user = await users.findByIdAndUpdate(req.params.id, updateUser);
    if (!user) return next(new errorResponse(401, "user not exists"));
    res.status(200).json({
      status: "sucess",
      data: "update sucessfully",
    });
  }),
  deleteUser: asyncHandle(async (req, res) => {
    const user = await users.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "sucess",
      data: {},
    });
  }),
  uploadsAvatart: asyncHandle(async (req, res) => {
    const linkImage = req.file.path.split("\\").slice(1).join("/");
    const linkImage2 = linkImage.split("/");
    linkImage2.unshift("");
    req.body.avatar = linkImage2.join("/");
    const data = req.body;
    const user = await users.findByIdAndUpdate(req.params.id, data);
    await user.save();
    res.status(200).json({
      status: "success",
      data: user,
    });
  }),
};
