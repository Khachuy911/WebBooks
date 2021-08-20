const userRouter = require("./userRoute");
const bookRouter = require("./bookRouter");
const cartRouter = require("./cartRouter");
const commentRouter = require("./commentRouter");
const errorHandle = require("../Middleware/errorHandle");
function router(app) {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/book", bookRouter);
  app.use("/api/v1/cart",cartRouter);
  app.use("/api/v1/comment",commentRouter);
  app.use(errorHandle);
}

module.exports = router;
