const router = require("express").Router();
const emailController = require("../../controllers/email.controller");

router.route("/").post(emailController.sendMessage);
router.route("/contact").post(emailController.contactUs);

module.exports = router;
