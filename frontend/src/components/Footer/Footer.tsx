import { Link } from "react-router-dom"
import "./Footer.css"
import Kofi from "/kofi1.webp"

function Footer() {
  return (
    <footer id="footer">
      <Link
        id="footer-github-link"
        to="https://github.com/JeremyLoh/"
        target="_blank"
        rel="noopener noreferrer"
      >
        @Jeremy_Loh
      </Link>
      <Link
        id="footer-kofi-button"
        to="https://ko-fi.com/W7W215XL1U"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          height="36"
          style={{ border: "0px", height: "36px" }}
          src={Kofi}
          alt="Buy Me a Coffee at ko-fi.com"
        />
      </Link>
    </footer>
  )
}

export default Footer
