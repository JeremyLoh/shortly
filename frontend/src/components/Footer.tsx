import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer id="footer">
      <span>Made by </span>
      <Link
        to="https://github.com/JeremyLoh/"
        target="_blank"
        rel="noopener noreferrer"
      >
        @Jeremy_Loh
      </Link>
    </footer>
  )
}

export default Footer
