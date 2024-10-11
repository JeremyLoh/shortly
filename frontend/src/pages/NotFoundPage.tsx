import { Link } from "react-router-dom"

function NotFoundPage() {
  return (
    <div>
      <h1>404 Not Found 💥</h1>
      <Link to="/">Go 🔙 Home</Link>
    </div>
  )
}

export default NotFoundPage
