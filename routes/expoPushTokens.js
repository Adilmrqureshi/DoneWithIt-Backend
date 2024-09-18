const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { Builder, Browser, By } = require("selenium-webdriver");

const usersStore = require("../store/users");
const auth = require("../middleware/auth");
const validateWith = require("../middleware/validation");
const { sendPushNotification } = require("../utilities/pushNotifications");
const moment = require("moment");
const { fromPairs } = require("lodash");
const { prayerTimes } = require("..");

// const token = "ExponentPushToken[ylX1aGJdCrQM0ibOOCESTK]";

router.post("/", async (req, res) => {
  const token = req.body.token;
  console.log("Token: " + token);
  // await sendPushNotification(token, "There's only one God");
  res.status(201).send();
});

module.exports = router;
