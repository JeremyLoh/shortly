import QrCode from "../../../../../components/QrCode/QrCode"
import "./UrlCard.css"

type UrlCardProps = {
  url: string
  shortCode: string
  createdAt: string
  updatedAt: string | null
}

function UrlCard(props: UrlCardProps) {
  const shortUrl = new URL(window.location.href).origin + "/" + props.shortCode
  return (
    <div className="url-card">
      <div className="url-card-qr-code-container">
        <QrCode url={props.url} size={100} />
      </div>
      <div className="card-row">
        <a
          className="text-center url-card-title"
          target="_blank"
          rel="noopener noreferrer"
          href={shortUrl}
        >
          {shortUrl}
        </a>
      </div>
      <div className="card-row">
        <p>Url</p>
        <a target="_blank" rel="noopener noreferrer" href={props.url}>
          {props.url}
        </a>
      </div>
      <div className="card-row">
        <p>Created At</p>
        <p>{new Date(props.createdAt).toDateString()}</p>
      </div>
      <div className="card-row">
        <p>Updated At</p>
        <p>
          {props.updatedAt != null
            ? new Date(props.updatedAt).toDateString()
            : "Never Updated"}
        </p>
      </div>
    </div>
  )
}

export default UrlCard
