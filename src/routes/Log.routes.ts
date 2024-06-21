import express from "express";
const router = express.Router();
const LogController = require("../controllers/Log.controllers");

router.post("/uploadQuest/:id", LogController.uploadQuest);
router.post("/updateQuest/:id", LogController.updateQuest);
router.get("/getValidatingQuest/:id", LogController.getValidatingQuest);
router.get("/getAllQuestsByMonth/:id", LogController.getAllQuestsByMonth);

module.exports = router;
