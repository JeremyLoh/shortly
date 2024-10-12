import { Link } from "react-router-dom"
import "./NotFoundPage.css"

function NotFoundPage({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">Error - {errorMessage}</h1>
      <div className="not-found-content">
        <p>An error has occured, to continue:</p>
        <p>* Return to the homepage.</p>
        <p>* Try again later.</p>
      </div>
      <Link to="/">Home</Link>
    </div>
  )
}

export default NotFoundPage
