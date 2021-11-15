const books = require("../Models/BookModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");

module.exports = {
  getBook: asyncHandle(async (req, res, next) => {
    const book = await books.findById(req.params.id);
    if (!book) {
      return next(new errorResponse(401, "book invalid"));
    }
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),
  getAllBook: asyncHandle(async (req, res) => {
    const { page } = req.query;
    const perPage = process.env.PERPAGE;
    const startPage = (page - 1) * perPage;
    const endPage = page * perPage;
    const book = await books.find().skip(startPage).limit(endPage);

    // res.render("book.ejs", { book });
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),
  getSearchBook: asyncHandle(async (req, res) => {
    const data = req.query.nameBook;
    // search mongoose
    const book = await books.find({ $text: { $search: data } }).limit(10);
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),

  getfilterBook: asyncHandle(async (req, res, next) => {
    const book = await books.find({
      $and: [
        { price: { $gte: req.query.min } },
        { price: { $lte: req.query.max } },
      ],
    });
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),
  createBook: asyncHandle(async (req, res, next) => {
    const linkImage = req.file.path.split("\\").slice(1).join("/");
    const linkImage2 = linkImage.split("/");
    linkImage2.unshift("");
    req.body.image = linkImage2.join("/");
    const data = req.body;
    const book = await books.create(data);
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),
  deleteBook: asyncHandle(async (req, res, next) => {
    const data = req.params.id;
    const book = await books.findByIdAndDelete(data);
    res.status(200).json({
      status: "success",
      data: "delete successfully",
    });
  }),
  updateBook: asyncHandle(async (req, res, next) => {
    const data = req.body;
    const book = await books.findByIdAndUpdate(req.params.id, data);
    await book.save();
    if (!book) {
      return next(new errorResponse(400, "book is not exists !"));
    }
    res.status(200).json({
      status: "success",
      data: book,
    });
  }),
};
