const express = require("express");
const router = express();
const bookControllers = require("../Controllers/bookControllers");
const multer = require("multer");
const authControllers = require("../Controllers/authControllers");
const upload = multer({ dest: "./public/uploads" });

router.get("/search", bookControllers.getSearchBook);
router.get("/filterBook",bookControllers.getfilterBook);
router
  .route("/:id")
  .get(bookControllers.getBook)
  .delete(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    bookControllers.deleteBook
  )
  .put(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    bookControllers.updateBook
  );

router
  .route("/")
  .get(bookControllers.getAllBook)
  .post(
    authControllers.protect,
    authControllers.restrictTo("admin"),
    upload.single("image"),
    bookControllers.createBook
  );

module.exports = router;
