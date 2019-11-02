const router = require("express").Router();
const authController = require("../../controllers/auth.contoller");

router
  .route("/")
  .post(authController.getToken)
  .put(authController.compareToken);

module.exports = router;
