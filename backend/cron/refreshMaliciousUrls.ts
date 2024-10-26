import { CronJob } from "cron"
import { populateMaliciousFeeds } from "../database.js"

// https://github.com/kelektiv/node-cron?tab=readme-ov-file#cronjob-class
const refreshMaliciousUrlsJob = CronJob.from({
  cronTime: "1 0 * * *", // run every day at 12:01 AM
  onTick: async function () {
    console.log(
      `Cron job triggered at ${new Date().toString()} to get new malicious url feed`
    )
    try {
      await populateMaliciousFeeds()
    } catch (error: any) {
      console.error(
        `Could not execute cron job for getting new malicious url feed due to ${error.message}`
      )
    }
  },
  start: false,
  timeZone: "utc",
})

export default refreshMaliciousUrlsJob
