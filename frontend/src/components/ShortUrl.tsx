import "./ShortUrl.css"
import { Url } from "../endpoints/createUrl"

function ShortUrl({ url }: { url: Url }) {
  return (
    <div className="card">
      <div>
        <h2 className="text-center">Your New Short Url 🎯</h2>
        <p className="text-center">
          Short Url{" "}
          <a href={`/${url.shortCode}`} target="_blank">
            {`${window.location.href}${url.shortCode}`}
          </a>
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
        <a href={url.url} target="_blank">
          {url.url}
        </a>
      </p>
      <p className="text-right">
        Created At {new Date(url.createdAt).toString()}
      </p>
    </div>
  )
}

export default ShortUrl
