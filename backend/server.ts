import "dotenv/config"
import cors from "cors"
import express from "express"
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import passport from "passport"
import pool from "./database.js"
import router from "./route/index.js"

if (process.env.BACKEND_SESSION_SECRET == undefined) {
  throw new Error(
    `Please provide a value for .env secret property "BACKEND_SESSION_SECRET"`
  )
}
async function setupApp() {
  const app = express()
  // https://github.com/express-rate-limit/express-rate-limit/wiki/Troubleshooting-Proxy-Issues
  app.set("trust proxy", 1) // Trust first proxy (reverse proxy)
  if (process.env.ENV === "PROD") {
    const frontendOrigin = process.env.FRONTEND_ORIGIN
    if (!frontendOrigin) {
      throw new Error("FRONTEND_ORIGIN backend env property cannot be empty")
    }
    // https://stackoverflow.com/questions/71948888/cors-why-do-i-get-successful-preflight-options-but-still-get-cors-error-with-p
    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin) {
            callback(new Error("Invalid empty origin"))
          }
          const regex = new RegExp("^" + frontendOrigin)
          try {
            // @ts-ignore
            const isAllowed = regex.test(new URL(origin).origin)
            if (isAllowed) {
              callback(null, origin)
            } else {
              callback(new Error("Origin is not allowed"))
            }
          } catch (error) {
            callback(new Error("Could not process origin"))
          }
        }, // Access-Control-Allow-Origin, allow only frontend origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true, // Access-Control-Allow-Credentials for cookies
      })
    )
  }
  const pgSession = connectPgSimple(session)
  app.use(
    session({
      store: new pgSession({
        pool: pool,
        createTableIfMissing: true,
        tableName: "session",
      }),
      // @ts-ignore require .env file with this property
      secret: process.env.BACKEND_SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // time in ms
      },
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(express.json()) // middleware to parse json request body

  app.use(router)
  return app
}

export default setupApp
