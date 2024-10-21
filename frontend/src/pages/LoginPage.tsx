import Footer from "../components/Footer"
import Header from "../components/Header"
import LoginForm from "../components/LoginForm"
import { useAuth } from "../hooks/useAuth"

function LoginPage() {
  const auth = useAuth()
  async function handleLogin(username: string, password: string) {
    if (auth == null) {
      throw new Error("Cannot perform login")
    }
    await auth.performLogin(username, password)
  }
  return (
    <>
      <Header />
      <h2>Login</h2>
      <LoginForm handleLogin={handleLogin} />
      <p>Don't have an account? Register</p>
      <Footer />
    </>
  )
}

export default LoginPage
