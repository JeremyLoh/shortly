import { useState } from "react"
import "./App.css"
import ShortUrlForm from "./components/ShortUrlForm"
import { Url } from "./endpoints/createUrl"
import ShortUrl from "./components/ShortUrl"
import Header from "./components/Header"

function App() {
  const [url, setUrl] = useState<Url | null>(null)
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <ShortUrlForm
          handleCreateUrl={(url) => {
            setUrl(url)
          }}
        />
        {url && <ShortUrl url={url} />}
      </div>
    </div>
  )
}

export default App
