const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customers");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
// router.get("/:id",customersController.getCustomer);

// router.post("/createCustomer", customersController.createCustomer);

// router.put("/vipCustomer/:id", customersController.vipCustomer);

// router.put("/notWaitingCustomer/:id", customersController.notWaitingCustomer);

// router.delete("/deleteCustomer/:id", customersController.deleteCustomer);

module.exports = router;
