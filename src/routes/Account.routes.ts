import express from "express";
const router = express.Router();
const AccountController = require("../controllers/Account.controllers");

router.post("/updateAccount/:id", AccountController.updateAccount);
router.get("/:id", AccountController.getAccount);
router.post("/:id", AccountController.removeAccount);

module.exports = router;
