const Router = require("express");

const valuesRouter = require("./values.routes")

const router = Router();

router.use("/values", valuesRouter);

module.exports = router;