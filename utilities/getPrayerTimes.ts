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
    console.log(name, time, hours);
    if (name !== "FAJR") {
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
