const router = require("express").Router();
const emailController = require("../../controllers/email.controller");

router.route("/").post(emailController.sendMessage);
router.route("/contact").post(emailController.contactUs);
router.route("/notify").post(emailController.notifyHive);
module.exports = router;
