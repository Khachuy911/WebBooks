const express = require("express");
const router = express();
const cartControllers = require("../Controllers/cartControllers");
const auth = require("../Controllers/authControllers");

router.use(auth.protect);

router.post("/addCart", cartControllers.createCart);

router
  .route("/")
  .post(cartControllers.createCartBook)
  .get(cartControllers.getCartBook);
router
  .route("/:id")
  .put(cartControllers.updateCartBook)
  .delete(cartControllers.deleteCartBook);
module.exports = router;
