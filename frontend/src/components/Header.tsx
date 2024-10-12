import { Link } from "react-router-dom"
import "./Header.css"

function Header() {
  return (
    <header>
      <h1>Url Shortener</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/stats">Stats</Link>
      </nav>
    </header>
  )
}

export default Header
