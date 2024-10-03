import { inngest } from "../client";

export default inngest.createFunction(
  // config
  { id: "salah-times" },
  // trigger (event or cron)
  { event: "main/salah-times" },
  // handler function
  async ({ event, step }) => {}
);
