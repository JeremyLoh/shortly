import "./UrlHistoryView.css"
import { UrlHistory } from "../../../../../endpoints/history"
import UrlCard from "../UrlCard/UrlCard"

type UrlHistoryProps = {
  urls: Array<UrlHistory>
}

function UrlHistoryView({ urls }: UrlHistoryProps) {
  return (
    <div className="url-history-container">
      {urls.map((history) => (
        <UrlCard
          key={history.id}
          url={history.url}
          shortCode={history.shortCode}
          createdAt={history.createdAt}
          updatedAt={history.updatedAt}
        />
      ))}
    </div>
  )
}

export default UrlHistoryView
