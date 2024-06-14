import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Account } = require("../models/Account.models");
import {
  checkRequiredField,
  checkDuplicateValue,
} from "../utils/CheckFieldAndValue";

exports.getAllAccounts = async function () {
  // get all accounts from database
  const accounts = await Account.find({});
  return accounts;
};

exports.register = async function (body: any) {
  const { name, email, password, gender, partnerID } = body;
  checkRequiredField(name, "Name");
  checkRequiredField(email, "Email");
  checkRequiredField(password, "Password");
  checkRequiredField(gender, "Gender");

  // check availablity name and email at database Accounts
  checkDuplicateValue(email, "email", await Account.find({ email: email }));

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  if (partnerID) {
    const checkPartner = await Account.findOne({ _id: partnerID });

    if (!checkPartner) {
      throw new Error("PartnerID not found");
    }

    if (checkPartner.partnerID) {
      throw new Error("Partner already has partner");
    }
  }

  const newAccount = new Account({
    name,
    email,
    password: hashedPassword,
    gender,
    partnerID,
  });

  await newAccount.save();

  // find partner and update partnerID
  if (partnerID) {
    await Account.updateOne({ _id: partnerID }, { partnerID: newAccount._id });
  }

  return await Account.find({});
};
