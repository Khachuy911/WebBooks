const express = require("express");
const router = express();
const userControllers = require("../Controllers/UserControllers");
const authControllers = require("../Controllers/authControllers");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads" });

router.post("/signin", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/token", authControllers.accessTokenRefresh);
router.post("/forgotPassword", authControllers.forgotPassword);
router.patch("/resetPassword/:token", authControllers.resetPassword);

router.use(authControllers.protect);
router.get("/getMe", authControllers.getMe);
router.post("/logout", authControllers.logout);
router.patch(
  "/uploadAvatar/:id",
  upload.single("avatar"),
  userControllers.uploadsAvatart
);
router
  .route("/:id")
  .get(authControllers.restrictTo("admin"), userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(authControllers.restrictTo("admin"), userControllers.deleteUser);
router
  .route("/")
  .get(authControllers.restrictTo("admin"), userControllers.getAllUser);

module.exports = router;
