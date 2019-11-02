const router = require("express").Router();
const choreController = require("../../controllers/chore.controller");

router.route("/").post(choreController.createChore);
router
  .route("/:id")
  .put(choreController.updateChore)
  .delete(choreController.deleteChore);

module.exports = router;
