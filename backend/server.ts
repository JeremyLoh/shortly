import "dotenv/config"
import express from "express"
import session from "express-session"
import connectPgSimple from "connect-pg-simple"
import passport from "passport"
import pool, { setupDatabase } from "./database.js"
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

  await setupDatabase(pool)
  app.use(router)

  // let server = app.listen(port, () => {
  //   console.log(`Server started on port ${port}`)
  //   app.emit("serverStarted")
  // })
  return app
}

export default setupApp
