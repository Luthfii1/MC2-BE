import { NextFunction, Request, Response } from "express";
import accountsData from "../models/dummyData";
const jwt = require("jsonwebtoken");
const { Account } = require("../models/Account.models");

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({ message: "Unauthorized access" });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const _id = decoded._id;

  //   const account = accountsData.find((account: any) => account._id === _id);
  const account = Account.findOne({ _id: _id });
  if (!account) return res.status(403).json({ message: "Forbidden access" });

  console.log("account auth", account);

  req.body.account = account;
  next();
};
