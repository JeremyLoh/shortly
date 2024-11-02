import { useContext } from "react"
import { AuthContext } from "../AuthProvider.tsx"

function useAuth() {
  return useContext(AuthContext)
}

export { useAuth }
