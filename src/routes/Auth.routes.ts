import express from "express";
const router = express.Router();

const AuthController = require("../controllers/Auth.controllers");

router.get("/getAllAccounts", AuthController.getAllAccounts);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;
