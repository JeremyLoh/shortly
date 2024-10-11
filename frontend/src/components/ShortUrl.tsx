import "./ShortUrl.css"
import { Url } from "../endpoints/createUrl"

function ShortUrl({ url }: { url: Url }) {
  return (
    <div className="card">
      <h2 className="text-right">Your New Short Url</h2>
      <p className="text-right">
        Short Code{" "}
        <a href={`/${url.shortCode}`} target="_blank">
          {url.shortCode}
        </a>
      </p>
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
