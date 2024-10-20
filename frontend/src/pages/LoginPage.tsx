import Footer from "../components/Footer"
import Header from "../components/Header"
import LoginForm from "../components/LoginForm"

function LoginPage() {
  return (
    <>
      <Header />
      <h2>Login</h2>
      <LoginForm />
      <p>Don't have an account? Register</p>
      <Footer />
    </>
  )
}

export default LoginPage
