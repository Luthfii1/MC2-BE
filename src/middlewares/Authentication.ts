import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");
const { Account } = require("../models/Account.models");

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const _id = decoded._id;

    const account = await Account.findById(_id);
    if (!account) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    req.body.account = account;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden access" });
  }
};
