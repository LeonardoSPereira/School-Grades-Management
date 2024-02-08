const Router = require("express");
const ValuesController = require("../controllers/ValuesController");

// create an instance of the router and the controller
const valuesRouter = Router();
const valuesController = new ValuesController();

// create the routes
valuesRouter.get("/", valuesController.getSheetData);
valuesRouter.put("/", valuesController.appendSheetData);

module.exports = valuesRouter;