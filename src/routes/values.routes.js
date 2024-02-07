const Router = require("express");
const ValuesController = require("../controllers/ValuesController");

const valuesRouter = Router();
const valuesController = new ValuesController();

valuesRouter.get("/", valuesController.getSheetData);
valuesRouter.put("/", valuesController.appendSheetData);

module.exports = valuesRouter;