import { Link } from "react-router-dom"
import "./ShortUrl.css"
import { Url } from "../endpoints/createUrl"

function ShortUrl({ url }: { url: Url }) {
  return (
    <div className="card">
      <div>
        <h2 className="text-center">Your New Short Url 🎯</h2>
        <p className="text-center">
          Short Url{" "}
          <Link
            to={`/${url.shortCode}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${window.location.href}${url.shortCode}`}
          </Link>
          <br />
          <button
            className="copy-short-url-btn"
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.href}${url.shortCode}`
              )
            }
          >
            Copy Link
          </button>
        </p>
      </div>
      <hr className="divider" />
      <p className="text-right">
        Redirect Url{" "}
        <Link to={url.url} target="_blank" rel="noopener noreferrer">
          {url.url}
        </Link>
      </p>
      <p className="text-right">
        Created At {new Date(url.createdAt).toString()}
      </p>
    </div>
  )
}

export default ShortUrl
