const { Account } = require("../models/Account.models");
const { Log } = require("../models/Log.model");
import { log } from "console";
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
  const { type, description, assignUser, isCompleted } = body;

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

    if (!log) {
      throw new Error("No quest found today");
    }

    log.isCompleted = isCompleted;
    await log.save();
  }

  return log;
};

exports.getQuest;
