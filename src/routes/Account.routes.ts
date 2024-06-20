import express from "express";
const router = express.Router();
const AccountController = require("../controllers/Account.controllers");
import { authenticateToken } from "../middlewares/Authentication";

router.post("/updateAccount/:id", AccountController.updateAccount);
router.get("/getAccount", authenticateToken, AccountController.getAccount);
router.post("/:id", AccountController.removeAccount);

module.exports = router;
