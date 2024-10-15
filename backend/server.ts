import "dotenv/config"
import express from "express"
import session from "express-session"
import passport from "passport"
import pool, { setupDatabase } from "./database.js"
import router from "./route/index.js"

if (process.env.BACKEND_SESSION_SECRET == undefined) {
  throw new Error(
    `Please provide a value for .env secret property "BACKEND_SESSION_SECRET"`
  )
}

const PORT = 3000 // port need to match docker compose setup for app
const app = express()
app.use(
  session({
    // @ts-ignore require .env file with this property
    secret: process.env.BACKEND_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, // time in ms
    },
  })
)
app.use(passport.initialize())
app.use(passport.session())

async function setupServer() {
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 1) // Trust first proxy (reverse proxy)
  await setupDatabase(pool)
  setupRoutes()
}

function setupRoutes() {
  app.use(express.json()) // middleware to parse json request body
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
  })
  app.use(router)
}

setupServer()
