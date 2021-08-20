const carts = require("../Models/CartModel");
const cartBooks = require("../Models/CartBookModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");

module.exports = {
  createCart: asyncHandle(async (req, res, next) => {
    const data = req.body;
    const cart = await carts.create(data);
    res.status(200).json({
      status: "success",
      data: cart,
    });
  }),

  getCartBook: asyncHandle(async (req, res, next) => {
    const cart = await carts.findOne({ user: req.user.id });
    const cartBook = await cartBooks
      .find({ cart: cart._id })
      .populate("book")
      .exec(function (err, cartBook) {
        res.status(200).json({
          status: "success",
          data: cartBook,
        });
      });
  }),
  createCartBook: asyncHandle(async (req, res, next) => {
    const data = req.body;
    const cartBook = await cartBooks.create(data);
    res.status(200).json({
      status: "success",
      data: cartBook,
    });
  }),
  updateCartBook: asyncHandle(async (req, res, next) => {
    const idCartBook = req.params.id;
    const data = req.body;
    const newCartBook = await cartBooks.findByIdAndUpdate(idCartBook, data);
    if (!newCartBook)
      return next(new errorResponse(400, "cartBook are not exists !"));
    res.status(200).json({
      status: "success",
      data: "update successfully",
    });
  }),
  deleteCartBook: asyncHandle(async (req, res, next) => {
    const idCartBook = req.params.id;
    await cartBooks.findByIdAndDelete(idCartBook);
    res.status(200).json({
      status: "success",
      data: "delete successfully",
    });
  }),
};
