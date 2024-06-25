const { Account } = require("../models/Account.models");
import {
  checkRequiredField,
  checkDuplicateValue,
} from "../utils/CheckFieldAndValue";

exports.getDataPartner = async function (params: any) {
  const { id } = params;
  checkRequiredField(id, "ID");

  const accountData = await Account.findById(id);
  if (!accountData) {
    throw new Error("Account not found");
  }
  if (!accountData.partnerID) {
    throw new Error("Account has no partner");
  }

  const partnerData = await Account.findById(accountData.partnerID);
  if (!partnerData) {
    throw new Error("Partner not found");
  }

  return partnerData;
};
