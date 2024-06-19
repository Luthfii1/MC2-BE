import { Request, Response } from "express";
const { Accounts } = require("../models/Account.models");
const authServices = require("../services/Auth.services");

exports.getAllAccounts = async function (req: Request, res: Response) {
  try {
    const result = await authServices.getAllAccounts();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.register = async function (req: Request, res: Response) {
  try {
    const result = await authServices.register(req.body);
    res.status(200).json({
      messages: "Success create account",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async function (req: Request, res: Response) {
  try {
    const result = await authServices.login(req.body);
    res.status(200).json({
      messages: "Success login",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
