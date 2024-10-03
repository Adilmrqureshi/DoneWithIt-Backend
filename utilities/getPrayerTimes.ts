import { TOKEN } from "..";
import { salahTimes, sendPushNotification } from "./pushNotifications";

const moment = require("moment");

const { Builder, Browser, By } = require("selenium-webdriver");
const { fromPairs } = require("lodash");

export const getPrayerTimes = async () => {
  let driver = await new Builder().forBrowser(Browser.CHROME).build();

  await driver.get("https://www.towerhamletsmosques.co.uk/dco/");

  await driver.manage().setTimeouts({ implicit: 10000 });

  const table = await driver.findElement(By.css("tbody")).getText();

  const times = table.replaceAll(".", ":").split("\n");

  const newTimes = times.map((val: string) => {
    const [name, time] = val.split(" ");
    const [hours, minutes] = time.split(":");
    if (
      name !== "FAJR" ||
      //@ts-ignore
      (name === "ZUHR" && +hours < 12)
    ) {
      return [
        name,
        moment()
          .hour(+hours + 12)
          .minutes(+minutes),
      ];
    } else {
      return [name, moment().hour(+hours).minutes(+minutes)];
    }
  });

  await driver.quit();

  return fromPairs(newTimes);
};

let prayerTimes: { [k: string]: moment.Moment } = {};
export const getSalahTimeAsync = async () => {
  let sent = false;
  prayerTimes = await getPrayerTimes();
  await salahTimes(TOKEN, prayerTimes);
  while (true) {
    const now = moment();
    if (now.millisecond() === 0) {
      console.log("[+] Tick: " + new Date().toLocaleString());

      // If a new day has started then get the prayer times for the day
      // 'sent' flag to prevent race conditions
      if (now.hour() === 0 && now.millisecond() < 5) {
        console.log(
          "[+] Setting the prayer times from the new day: " +
            new Date().toLocaleString()
        );
        prayerTimes = await getPrayerTimes();
        await salahTimes(TOKEN, prayerTimes);
      }

      const currentKey = Object.keys(prayerTimes).find((key) =>
        prayerTimes[key].isAfter(now)
      );

      if (currentKey) {
        const currentPrayerTime = moment(prayerTimes[currentKey]);
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
              TOKEN,
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
};
