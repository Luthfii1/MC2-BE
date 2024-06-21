import { Request, Response } from "express";
const { Accounts } = require("../models/Account.models");
const logServices = require("../services/Log.services");

exports.uploadQuest = async function (req: Request, res: Response) {
  try {
    const result = await logServices.uploadQuest(req.params, req.body);
    res.status(200).json({
      messages: "Success upload quest",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuest = async function (req: Request, res: Response) {
  try {
    const result = await logServices.updateQuest(req.params, req.body);
    res.status(200).json({
      messages: "Success update quest",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.getValidatingQuest = async function (req: Request, res: Response) {
  try {
    const result = await logServices.getValidatingQuest(req.params);
    res.status(200).json({
      messages: "Success get all quests",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};