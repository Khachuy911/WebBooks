const comments = require("../Models/CommentModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createComment: asyncHandle(async (req, res, next) => {
    const data = req.body;
    const comment = await comments.create(data);
    res.status(200).json({
      status: "success",
      data: comment,
    });
  }),
  getComment: asyncHandle(async (req, res, next) => {
    const idBook = req.params.id;
    const comment = await comments
      .find({ book: idBook })
      .populate("user")
      .exec(function (err, comment) {
        res.status(200).json({
          status: "success",
          comment,
        });
      });
  }),
  getAllComment: asyncHandle(async (req, res, next) => {
    const data = await comments
      .find()
      .populate("book")
      .populate("user")
      .exec(function (err, comment) {
        res.status(200).json({
          status: "success",
          comment,
        });
      });
  }),
  updateComment: asyncHandle(async (req, res, next) => {
    const idComment = req.params.id;
    const data = req.body;
    const newComment = await comments.findByIdAndUpdate(idComment, data);
    if (!newComment) return next(new errorResponse(400, "not comment found"));
    res.status(200).json({
      status: "success",
      data: "update successfully",
    });
  }),
  deleteComment: asyncHandle(async (req, res, next) => {
    const idComment = req.params.id;
    const data = await comments.findOneAndDelete({
      $and: [{ _id: idComment }, { user: req.user.id }],
    });
    if (!data)
      return next(new errorResponse(400, "deny mission delete comment"));
    res.status(200).json({
      status: "success",
      data: "delete successfully",
    });
  }),
};
