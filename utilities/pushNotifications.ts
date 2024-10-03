import { Moment } from "moment";

import { Expo } from "expo-server-sdk";

export async function salahTimes(token: string, data: Record<string, Moment>) {
  await sendPushNotification(token, "Salah times for the day", data);
}

export const sendPushNotification = async (
  targetExpoPushToken: string,
  body: string,
  data?: Record<string, Moment>
) => {
  const expo = new Expo();
  const message = {
    to: targetExpoPushToken,
    sound: "default" as const,
    body,
    data,
  };
  try {
    const tickets = await expo.sendPushNotificationsAsync([message]);
    console.log("Tickets", tickets);
  } catch (error) {
    console.log("Error sending chunk", error);
  }
};
