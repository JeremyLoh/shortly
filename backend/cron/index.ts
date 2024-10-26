import refreshMaliciousUrlsJob from "./refreshMaliciousUrls.js"

function startCronJobs() {
  console.log("startCronJobs(): Starting cron jobs...")
  refreshMaliciousUrlsJob.start()
  console.log("startCronJobs(): Finished starting cron jobs")
}

export default startCronJobs
