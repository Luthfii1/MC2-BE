const { Account } = require("../models/Account.models");
const { Log } = require("../models/Log.model");
import { error, log } from "console";
import { parseISO, format } from "date-fns";
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

  // Format the dateQuest field
  logs.forEach((log: any) => {
    const date = new Date(log.dateQuest);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateFormating = date.toLocaleDateString("en-US", options);
    log.dateFormat = dateFormating;
  });

  console.log("logs", logs);

  return logs;
};

exports.getQuest;

exports.getAllQuestsByMonth = async function (params: any, body: any) {
  const { id } = params;
  const { month, year } = body;

  checkRequiredField(month, "Month");
  checkRequiredField(year, "Year");

  const account = await Account.findById(id);
  if (!account) {
    throw new Error("Can't find the account");
  }

  // Calculate the date range for the given month
  const startDate = new Date(year, month - 1, 1); // Adjust month - 1 for 0-based index
  const endDate = new Date(year, month, 1); // The first day of the next month

  // get all logs by month at this year
  const logs = await Log.find({
    assignUser: account._id,
    dateQuest: {
      $gte: startDate,
      $lt: endDate,
    },
  });

  return logs;
};
