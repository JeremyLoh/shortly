import pool, { setupDatabase } from "./database.js"
import setupApp from "./server.js"

// port need to match docker compose setup for app
const PORT = 3000

async function startBackend() {
  const app = await setupApp()
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
    app.emit("serverStarted")
  })
  await setupDatabase(pool)
}

startBackend()
