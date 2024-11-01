import "dotenv/config"
import cors from "cors"
import startCronJobs from "./cron/index.js"
import pool, { populateMaliciousFeeds, setupDatabase } from "./database.js"
import setupApp from "./server.js"

// port need to match docker compose setup for app
const PORT = 3000

async function startBackend() {
  const app = await setupApp()
  if (process.env.ENV === "PROD") {
    app.use(
      cors({
        origin: process.env.FRONTEND_ORIGIN, // Access-Control-Allow-Origin, allow only frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Access-Control-Allow-Credentials for cookies
      })
    )
  }
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    app.emit("serverStarted")
  })
  await setupDatabase(pool)
  await populateMaliciousFeeds()
  startCronJobs()
}

startBackend()
