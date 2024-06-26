import express from "express";
const router = express.Router();
const LogController = require("../controllers/Log.controllers");

router.post("/uploadQuest/:id", LogController.uploadQuest);
router.post("/updateQuest/:id", LogController.updateQuest);
router.get("/getValidatingQuest/:id", LogController.getValidatingQuest);
router.post("/getAllQuestsByMonth/:id", LogController.getAllQuestsByMonth);
router.get("/getAchievements/:id", LogController.getAchievements);

module.exports = router;
