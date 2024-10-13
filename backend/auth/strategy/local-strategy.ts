import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { findUserBasedOnCredential, findUserById } from "../../model/user.js"

// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((user, done) => {
  // take user object passed to strategy done() and store it in session
  // @ts-ignore
  done(null, user.id)
})

passport.deserializeUser(async (id: string, done) => {
  // used to get the user based on session details passed by user to endpoint
  try {
    const user = await findUserById(id)
    if (!user || user.id !== id) {
      throw new Error("User not found")
    }
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})

// passport will look at request body for the "username" and "password" (default values)
export default passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserBasedOnCredential(username, password)
      if (!user) {
        throw new Error("Invalid Credentials")
      }
      done(null, user)
    } catch (error) {
      done(error)
    }
  })
)
