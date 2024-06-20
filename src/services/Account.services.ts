const { Account } = require("../models/Account.models");
import {
  checkRequiredField,
  checkDuplicateValue,
} from "../utils/CheckFieldAndValue";

exports.updateAccount = async function (body: any, params: any) {
  const { id } = params;
  const { ...data } = body;

  checkRequiredField(id, "ID");

  const accountData = await Account.findById(id);
  if (!accountData) {
    throw new Error("Account not found");
  }

  if (data.email !== accountData.email) {
    checkDuplicateValue(
      data.email,
      "email",
      await Account.find({ email: data.email })
    );
  }

  if (data.partnerID && data.partnerID !== accountData.partnerID) {
    // if remove partner
    if (data.partnerID === null) {
      await Account.findByIdAndUpdate(
        data.partnerID,
        { partnerID: null },
        {
          new: true,
        }
      );
    } else {
      // if change partner check the partner of partner is not has partner awokwowkowk
      const checkPartner = await Account.findOne({ _id: data.partnerID });
      if (!checkPartner) {
        throw new Error("PartnerID not found");
      }

      if (checkPartner.partnerID) {
        throw new Error("Partner already has partner");
      }

      // update partnerID of partner
      await Account.findByIdAndUpdate(
        data.partnerID,
        { partnerID: id },
        {
          new: true,
        }
      );
    }
  }

  const updateAccount = await Account.findByIdAndUpdate(id, data, {
    new: true,
  });

  return updateAccount;
};

exports.getAccount = async function (body: any) {
  // const { id } = params;

  // if (!id) {
  //   throw new Error("ID is missing");
  // }

  // const accountData = await Account.findById(id);
  // if (!accountData) {
  //   throw new Error("Account not found");
  // }

  return body;
  
};

exports.removeAccount = async function (params: any) {
  const { id } = params;
  checkRequiredField(id, "ID");

  const accountData = await Account.findById(id);

  if (!accountData) {
    throw new Error("Account not found");
  }

  // if account has partner, remove partnerID from partner
  if (accountData.partnerID) {
    await Account.findByIdAndUpdate(accountData.partnerID, { partnerID: null });
  }

  await Account.deleteOne({ _id: id });

  return await Account.find({});
};
