import { createContext, useMemo, useCallback } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import useLocalStorage from "../../hooks/useLocalStorage.tsx"
import { login, logout, User } from "../../endpoints/user.ts"

type LogoutResponseType = {
  error: string
}

// https://stackoverflow.com/questions/38744159/in-typescript-how-to-define-type-of-async-function
type AuthUser = {
  user: User | null
  performLogin: (username: string, password: string) => Promise<void>
  performLogout: (
    abortController: AbortController
  ) => Promise<LogoutResponseType>
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
  const performLogout = useCallback(
    async (abortController: AbortController) => {
      if (!user) {
        return { error: "Could not perform logout as user is not logged in" }
      }
      try {
        await logout(abortController)
        setUser(null)
        return { error: null }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return { error: error.message }
      }
    },
    [user, setUser]
  )
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
