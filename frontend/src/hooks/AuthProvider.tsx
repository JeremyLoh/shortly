import { createContext, useMemo, useCallback } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import useLocalStorage from "./useLocalStorage"
import { login, User } from "../endpoints/user"

// https://stackoverflow.com/questions/38744159/in-typescript-how-to-define-type-of-async-function
type AuthUser = {
  user: User | null
  performLogin: (username: string, password: string) => Promise<void>
  performLogout: () => Promise<void>
}

// https://stackoverflow.com/questions/75652431/how-should-the-createbrowserrouter-and-routerprovider-be-use-with-application-co
const AuthContext = createContext<AuthUser | null>(null)

// https://blog.logrocket.com/authentication-react-router-v6/
const AuthProvider = () => {
  const navigate = useNavigate()
  const [user, setUser] = useLocalStorage<User | null>("user", null)
  const performLogin = useCallback(
    async (username: string, password: string) => {
      try {
        const user = await login(username, password)
        setUser(user)
        navigate("/")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw new Error(`Could not check login credentials. ${error.message}`)
      }
    },
    [setUser, navigate]
  )
  const performLogout = useCallback(async () => {
    if (!user) {
      return
    }
    // TODO logout user account on server https://stackoverflow.com/questions/31641884/does-passports-logout-function-remove-the-cookie-if-not-how-does-it-work
    // setUser(null)
    // navigate("/", { replace: true })
  }, [user])
  const value = useMemo(() => {
    return {
      user,
      performLogin,
      performLogout,
    }
  }, [user, performLogin, performLogout])
  return (
    <AuthContext.Provider value={value}>
      <Outlet />
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
