import moment, { Moment } from "moment";
const { getPrayerTimes } = require("./utilities/getPrayerTimes");
const { sendPushNotification } = require("./utilities/pushNotifications");

const express = require("express");
const categories = require("./routes/categories");
const listings = require("./routes/listings");
const listing = require("./routes/listing");
const users = require("./routes/users");
const user = require("./routes/user");
const auth = require("./routes/auth");
const my = require("./routes/my");
const messages = require("./routes/messages");
const expoPushTokens = require("./routes/expoPushTokens");
const helmet = require("helmet");
const compression = require("compression");
const config = require("config");
const app = express();

let prayerTimes: { [k: string]: moment.Moment } = {};

app.use(express.static("public"));
app.use(express.json());
app.use(helmet());
app.use(compression());

app.use("/api/categories", categories);
app.use("/api/listing", listing);
app.use("/api/listings", listings);
app.use("/api/user", user);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/my", my);
app.use("/api/expoPushTokens", expoPushTokens);
app.use("/api/messages", messages);

const token = "ExponentPushToken[ylX1aGJdCrQM0ibOOCESTK]";

const port = process.env.PORT || config.get("port");

async function salahTimes(token: string, data: Record<string, Moment>) {
  await sendPushNotification(token, "Salah times for the day", prayerTimes);
}

app.listen(port, async function () {
  let sent = false;
  prayerTimes = await getPrayerTimes();
  await salahTimes(token, prayerTimes);
  while (true) {
    const now = moment();
    if (now.millisecond() === 0) {
      console.log("[+] Tick: " + new Date().toLocaleString());

      // If a new day has started then get the prayer times for the day
      // 'sent' flag to prevent race conditions
      if (now.hour() === 0) {
        console.log(
          "[+] Setting the prayer times from the new day: " +
            new Date().toLocaleString()
        );
        prayerTimes = await getPrayerTimes();
        await salahTimes(token, prayerTimes);
      }

      const currentKey = Object.keys(prayerTimes).find((key) =>
        prayerTimes[key].isAfter(now)
      );

      if (currentKey) {
        const currentPrayerTime = moment(prayerTimes[currentKey]);
        const now2 = moment();
        now2.minute(28);
        console.log(
          "[+] Current prayer time is " +
            currentKey +
            ": " +
            currentPrayerTime.toLocaleString()
        );

        if (currentPrayerTime.subtract(15, "minutes").isSame(now, "minute")) {
          if (sent === false) {
            console.log("[+] Sending notication");
            await sendPushNotification(
              token,
              currentKey + " salah is in 15 minutes at DCO masjid"
            );
          }
          sent = true;
        } else {
          sent = false;
        }
      } else console.error("[-] There are no upcoming Salahs");
    }
  }
});
