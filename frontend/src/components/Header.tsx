import { Link } from "react-router-dom"
import "./Header.css"

function Header() {
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
      </nav>
    </header>
  )
}

export default Header
