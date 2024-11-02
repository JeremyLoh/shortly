import { useEffect, useRef, useState } from "react"
import { redirect } from "react-router-dom"
import { useAuth } from "../features/auth/hooks/useAuth.tsx"
import Footer from "../components/Footer/Footer.tsx"
import Header from "../components/Header/Header.tsx"

function LogoutPage() {
  const userAuth = useAuth()
  const [error, setError] = useState<string>("")
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    async function logout() {
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()
      if (!userAuth) {
        redirect("/error")
        return
      }
      if (userAuth.user == null) {
        return
      }
      const response = await userAuth.performLogout(abortControllerRef.current)
      if (response.error) {
        setError(response.error)
      }
    }
    logout()
  }, [userAuth])
  return (
    <>
      <Header />
      <h2>{error ? "Could not sign out" : "Logged out"}</h2>
      {error && <p>{error}</p>}
      <Footer />
    </>
  )
}

export default LogoutPage
