import { Request, Response } from "express";
const { Accounts } = require("../models/Account.models");
const partnerServices = require("../services/Partner.services");

exports.getDataPartner = async function (req: Request, res: Response) {
  try {
    const result = await partnerServices.getDataPartner(req.params);
    res.status(200).json({
      message: "Success get data partner",
      result: result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
