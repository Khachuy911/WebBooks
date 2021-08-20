const express = require("express");
const router = express();
const auth = require("../Controllers/authControllers");
const commentControllers = require("../Controllers/commentControllers");
router.use(auth.protect);
router.route("/")
								.post(commentControllers.createComment)
								.get(commentControllers.getAllComment)
router.route("/:id")
								.get(commentControllers.getComment)	
								.put(commentControllers.updateComment)
								.delete(commentControllers.deleteComment)
module.exports = router;