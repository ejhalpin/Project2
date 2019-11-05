//package dependencies
const router = require("express").Router();
const htmlController = require("../controllers/html.controller");
router.route("/").get(htmlController.getIndex);
router.route("/account-recovery/").get(htmlController.getReset);
module.exports = router;
