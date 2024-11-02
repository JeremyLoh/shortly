import { Link } from "react-router-dom"
import Footer from "../components/Footer/Footer.tsx"
import Header from "../components/Header/Header.tsx"
import LoginForm from "../features/login/components/LoginForm/LoginForm.tsx"
import { useAuth } from "../features/auth/hooks/useAuth.tsx"

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
      <p>
        Don't have an account?{" "}
        <Link to="/register" data-testid="loginPage-register-link">
          Register
        </Link>
      </p>
      <Footer />
    </>
  )
}

export default LoginPage
