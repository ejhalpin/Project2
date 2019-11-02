const router = require("express").Router();
const apiRoutes = require("./api");
const htmlRoutes = require("./html.routes");

//API Routes
router.use("/api", apiRoutes);

//Html Routes
router.use("/", htmlRoutes);

module.exports = router;
