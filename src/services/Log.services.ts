const { Account } = require("../models/Account.models");
const { Log } = require("../models/Log.model");
import { error, log } from "console";
import {
  checkRequiredField,
  checkDuplicateValue,
} from "../utils/CheckFieldAndValue";

exports.uploadQuest = async function (params: any, body: any) {
  const { id } = params;
  const { type, description, assignUser } = body;

  checkRequiredField(type, "Type");
  checkRequiredField(description, "Description");

  if (type !== "DAILY") {
    checkRequiredField(assignUser, "Assign User");
  }

  const newLog = new Log({
    assignUser: type === "DAILY" ? [id] : [assignUser],
    type,
    description,
  });

  await newLog.save();

  return newLog;
};

exports.updateQuest = async function (params: any, body: any) {
  const { id } = params;
  const { type, description, assignUser, isCompleted, rating, idQuest } = body;

  var idLog = null;

  if (isCompleted) {
    // find log with the same day with today
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const log = await Log.findOne({
      assignUser: id,
      dateQuest: {
        $gte: start,
        $lt: end,
      },
    });
    idLog = log._id;

    if (!log) {
      throw new Error("No quest found today");
    }

    log.isCompleted = isCompleted;
    await log.save();
  }

  //   rating quest by partner
  if (rating) {
    // validate input
    checkRequiredField(idQuest, "idQuest");
    checkRequiredField(rating, "Rating");

    // get partner id
    const account = await Account.findById(id);
    const partnerId = account.partner;

    // find the log that has been completed and not rated
    const log = await Log.findById(idQuest);
    idLog = log._id;

    if (!log) {
      throw new Error("No quests found to be rated");
    }

    log.rating = rating;
    await log.save();
  }

  return await Log.findById({ _id: idLog });
};

exports.getValidatingQuest = async function (params: any) {
  const { id } = params;

  const account = await Account.findById(id);
  if (!account) {
    throw new Error("Can't find the account");
  }

  const logs = await Log.find({
    assignUser: account.partnerID,
    isCompleted: true,
    rating: { $exists: false },
  });

  return logs;
};

exports.getQuest;
