import { Link } from "react-router-dom"
import "./Header.css"
import { useAuth } from "../hooks/useAuth"

function Header() {
  const auth = useAuth()
  return (
    <header>
      <h1>Url Shortener</h1>
      <nav>
        <Link to="/" data-testid="header-homepage-link">
          Home
        </Link>
        <Link to="/stats" data-testid="header-stats-link">
          Stats
        </Link>
        {auth && auth.user ? (
          <Link to="/logout" data-testid="header-logout-link">
            Logout
          </Link>
        ) : (
          <Link to="/login" data-testid="header-login-link">
            Login
          </Link>
        )}
      </nav>
    </header>
  )
}

export default Header
