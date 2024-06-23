import { Request, Response } from "express";
const { Accounts } = require("../models/Account.models");
const accountServices = require("../services/Account.services");

exports.updateAccount = async function (req: Request, res: Response) {
  try {
    const result = await accountServices.updateAccount(req.body, req.params);
    res.status(200).json({
      message: "Success update account",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccount = async function (req: Request, res: Response) {
  try {
    const result = await accountServices.getAccount(req.body);
    res.status(200).json({
      message: "Success get account",
      result: result.account,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeAccount = async function (req: Request, res: Response) {
  try {
    const result = await accountServices.removeAccount(req.params);
    res.status(200).json({
      message: "Success remove account",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
