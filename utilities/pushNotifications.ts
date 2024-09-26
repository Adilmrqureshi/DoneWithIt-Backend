import { Moment } from "moment";

const { Expo } = require("expo-server-sdk");

const sendPushNotification = async (
  targetExpoPushToken: string,
  body: string,
  data?: Record<string, Moment>
) => {
  const expo = new Expo();
  const message = { to: targetExpoPushToken, sound: "default", body, data };
  try {
    const tickets = await expo.sendPushNotificationsAsync([message]);
    console.log("Tickets", tickets);
  } catch (error) {
    console.log("Error sending chunk", error);
  }
};

module.exports = { sendPushNotification };
