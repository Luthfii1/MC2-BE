import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Account } = require("../models/Account.models");
import {
  checkRequiredField,
  checkDuplicateValue,
} from "../utils/CheckFieldAndValue";
// import accountsData from "../models/dummyData";
require("dotenv").config();

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
  checkDuplicateValue(
    email,
    "email",
    await Account.find({ email: email.toLowerCase() })
  );

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create unique invitation code for 4 characters
  // check the invitationCode already exist or not with other accounts
  let invitationCode = "";
  let isExist = true;
  while (isExist) {
    invitationCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const checkInvitationCode = await Account.findOne({
      invitationCode: invitationCode,
    });

    if (!checkInvitationCode) {
      isExist = false;
    }
  }

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
    email: email.toLowerCase(),
    password: hashedPassword,
    gender,
    invitationCode,
    partnerID,
  });

  await newAccount.save();

  // find partner and update partnerID
  if (partnerID) {
    await Account.updateOne({ _id: partnerID }, { partnerID: newAccount._id });
  }

  return await Account.findOne({ _id: newAccount._id });
};

exports.login = async function (body: any) {
  const { email, password } = body;
  checkRequiredField(email, "Email");
  checkRequiredField(password, "Password");

  // const account = accountsData.find((account) => account.email === email);
  const account = await Account.findOne({ email: email });
  if (!account) {
    throw new Error("Email account is not found");
  }

  // const validPassword = account.password === password;
  const validPassword = await bcrypt.compare(password, account.password);
  if (!validPassword) {
    throw new Error("Password is not correct");
  }

  const token = jwt.sign(
    { _id: account._id },
    process.env.TOKEN_SECRET as string
  );
  if (!token) {
    throw new Error("Token is not generated, please relogin");
  }

  return token;
};
