import express from "express";
const router = express.Router();
const PartnerController = require("../controllers/Partner.controllers");

router.get("/:id", PartnerController.getDataPartner);

module.exports = router;
