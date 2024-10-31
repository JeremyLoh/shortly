import { Link } from "react-router-dom"
import "./ShortUrl.css"
import { Url } from "../endpoints/createUrl"
import QrCode from "./QrCode"

function ShortUrl({ url }: { url: Url }) {
  const shortCodeUrl = `${window.location.href}${url.shortCode}`
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
            {shortCodeUrl}
          </Link>
          <br />
          <button
            className="copy-short-url-btn"
            onClick={() => navigator.clipboard.writeText(shortCodeUrl)}
          >
            Copy Link
          </button>
        </p>
        <QrCode url={shortCodeUrl} />
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
