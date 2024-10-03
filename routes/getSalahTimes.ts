import { Router } from "express";
import { getPrayerTimes } from "../utilities/getPrayerTimes";
import { salahTimes } from "../utilities/pushNotifications";

const router = Router();
const token = "ExponentPushToken[rCbBBOP93wI4x5yNXPEGum]";

export const getSalahTimesSync = async () => {
  const prayerTimes = await getPrayerTimes();
  await salahTimes(token, prayerTimes);
  return prayerTimes;
};

router.post("/", async (req, res) => {
  const prayerTimes = await getPrayerTimes();
  res.json(prayerTimes);
});

export default router;
