import { createContext, useMemo, useCallback, useContext } from "react"
import { login, User } from "../endpoints/user"
import useLocalStorage from "./useLocalStorage"
import { Outlet, useNavigate } from "react-router-dom"

// https://stackoverflow.com/questions/38744159/in-typescript-how-to-define-type-of-async-function
type AuthUser = {
  user: User | null
  performLogin: (username: string, password: string) => Promise<void>
  performLogout: () => Promise<void>
}

// https://blog.logrocket.com/authentication-react-router-v6/
// https://stackoverflow.com/questions/75652431/how-should-the-createbrowserrouter-and-routerprovider-be-use-with-application-co
const AuthContext = createContext<AuthUser | null>(null)

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

function useAuth() {
  return useContext(AuthContext)
}

export { useAuth, AuthProvider }
