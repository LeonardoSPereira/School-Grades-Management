const Router = require("express");

const valuesRouter = require("./values.routes")

// create an instance of the router
const router = Router();

// create the routes
router.use("/values", valuesRouter);

module.exports = router;