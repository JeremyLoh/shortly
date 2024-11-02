import { Link } from "react-router-dom"
import { UrlStat } from "../../../../endpoints/urlStatistic.ts"
import "./UrlStatCard.css"

function UrlStatCard({ urlStat }: { urlStat: UrlStat }) {
  return (
    <div className="url-stat-card">
      <h3>{urlStat.shortCode}</h3>
      <hr />
      <p>
        <Link to={urlStat.url} target="_blank" rel="noopener noreferrer">
          {urlStat.url}
        </Link>
      </p>
      <p>
        {urlStat.accessCount} engagement{urlStat.accessCount > 1 ? "s" : ""}
      </p>
      <p>Created at {new Date(urlStat.createdAt).toString()}</p>
      {urlStat.updatedAt
        ? `Last updated at ${new Date(urlStat.updatedAt).toString()}`
        : "Never Updated"}
    </div>
  )
}

export default UrlStatCard
