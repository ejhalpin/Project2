const router = require("express").Router();
const authRoutes = require("./auth.routes");
const choreRoutes = require("./chore.routes");
//const forumRoutes = require("./forum.routes");
const hiveRoutes = require("./hive.routes");
const userRoutes = require("./user.routes");
const emailRoutes = require("./email.routes");

router.use("/auth", authRoutes);
router.use("/chore", choreRoutes);
router.use("/email", emailRoutes);
//router.use("/forum", forumRoutes);
router.use("/hive", hiveRoutes);
router.use("/user", userRoutes);

module.exports = router;
