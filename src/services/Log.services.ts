const { Account } = require("../models/Account.models");
const { Log } = require("../models/Log.model");
import AchievementsInterface from "../models/Int.Achieve.model";
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

exports.getAchievements = async function (params: any) {
  const { id } = params;

  // Find the account by ID
  const account = await Account.findById(id);
  if (!account) {
    throw new Error("Can't find the account");
  }

  // Get the current year
  const today = new Date();
  const year = today.getFullYear();

  // Fetch logs for the current year
  const logs = await Log.find({
    assignUser: account._id,
    dateQuest: {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    },
  });

  // Initialize achievements object and month names array
  const achievements: AchievementsInterface = {};
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Loop through each month to calculate achievements
  monthNames.forEach((month, index) => {
    const startDate = new Date(year, index, 1);
    const endDate = new Date(year, index + 1, 1);

    // Filter logs for the specific month
    const logsByMonth = logs.filter((log: any) => {
      return log.dateQuest >= startDate && log.dateQuest < endDate;
    });

    const totalQuest = logsByMonth.length;
    const totalCompleted = logsByMonth.filter(
      (log: any) => log.isCompleted
    ).length;

    // Calculate the completion percentage
    const percentage = totalQuest > 0 ? (totalCompleted / totalQuest) * 100 : 0;

    // Determine the achievement level based on the percentage
    let category: "GOLD" | "SILVER" | "BRONZE" | "BROKE" = "BROKE";
    if (percentage >= 75) {
      category = "GOLD";
    } else if (percentage >= 50) {
      category = "SILVER";
    } else if (percentage >= 25) {
      category = "BRONZE";
    }

    achievements[month] = {
      category: category,
      quantity: totalQuest,
    };
  });

  const dummy = {
    January: {
      category: "GOLD",
      quantity: 20,
    },
    February: {
      category: "BROKE",
      quantity: 12,
    },
    March: {
      category: "GOLD",
      quantity: 30,
    },
    April: {
      category: "BRONZE",
      quantity: 12,
    },
    May: {
      category: "SILVER",
      quantity: 21,
    },
    June: {
      category: "SILVER",
      quantity: 27,
    },
    July: {
      category: "GOLD",
      quantity: 30,
    },
    August: {
      category: "BROKE",
      quantity: 2,
    },
    September: {
      category: "BROKE",
      quantity: 8,
    },
    October: {
      category: "SILVER",
      quantity: 10,
    },
    November: {
      category: "BROKE",
      quantity: 26,
    },
    December: {
      category: "BRONZE",
      quantity: 17,
    },
  };

  return dummy;
};
