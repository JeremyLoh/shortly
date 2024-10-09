import express from "express"
import pool, { setupDatabase } from "./database.js"
import router from "./route/index.js"

const PORT = 3000 // port need to match docker compose setup for app

async function setupServer() {
  await setupDatabase(pool)
  setupRoutes()
}

function setupRoutes() {
  const app = express()
  app.use(express.json()) // middleware to parse json request body
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
  app.use(router)
}

setupServer()
