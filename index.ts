import moment, { Moment } from "moment";
import express from "express";
import { getSalahTimeAsync } from "./utilities/getPrayerTimes";
import { salahTimes } from "./utilities/pushNotifications";
import { getPrayerTimes } from "./utilities/getPrayerTimes";
import { Inngest } from "inngest";
const { sendPushNotification } = require("./utilities/pushNotifications");
import { serve } from "inngest/express";
import { inngest } from "./src/inngest/client";
import getSalahs from "./routes/getSalahTimes";

const expoPushTokens = require("./routes/expoPushTokens");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/getSalahs", getSalahs);

app.use("/api/expoPushTokens", expoPushTokens);

app.use("/api/inngest", serve({ client: inngest, functions: [] }));

export const TOKEN = "ExponentPushToken[rCbBBOP93wI4x5yNXPEGum]";

const port = process.env.PORT || config.get("port");

let prayerTimes: Record<string, Moment> = {};

app.listen(
  port
  //     async () => {
  //   let sent = false;
  //   prayerTimes = await getPrayerTimes();
  //   await salahTimes(TOKEN, prayerTimes);
  //   while (true) {
  //     const now = moment();
  //     if (now.millisecond() === 0) {
  //       console.log("[+] Tick: " + new Date().toLocaleString());

  //       // If a new day has started then get the prayer times for the day
  //       // 'sent' flag to prevent race conditions
  //       if (now.hour() === 0 && now.millisecond() < 5) {
  //         console.log(
  //           "[+] Setting the prayer times from the new day: " +
  //             new Date().toLocaleString()
  //         );
  //         prayerTimes = await getPrayerTimes();
  //         await salahTimes(TOKEN, prayerTimes);
  //       }

  //       const currentKey = Object.keys(prayerTimes).find((key) =>
  //         prayerTimes[key].isAfter(now)
  //       );

  //       if (currentKey) {
  //         const currentPrayerTime = moment(prayerTimes[currentKey]);
  //         console.log(
  //           "[+] Current prayer time is " +
  //             currentKey +
  //             ": " +
  //             currentPrayerTime.toLocaleString()
  //         );

  //         if (currentPrayerTime.subtract(15, "minutes").isSame(now, "minute")) {
  //           if (sent === false) {
  //             console.log("[+] Sending notication");
  //             await sendPushNotification(
  //               TOKEN,
  //               currentKey + " salah is in 15 minutes at DCO masjid"
  //             );
  //           }
  //           sent = true;
  //         } else {
  //           sent = false;
  //         }
  //       } else console.error("[-] There are no upcoming Salahs");
  //     }
  //   }
  // }
);
