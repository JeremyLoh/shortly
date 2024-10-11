import { useState } from "react"
import "./App.css"
import ShortUrlForm from "./components/ShortUrlForm"
import { Url } from "./endpoints/createUrl"
import ShortUrl from "./components/ShortUrl"

function App() {
  const [url, setUrl] = useState<Url | null>(null)
  return (
    <>
      <h1>Url Shortener</h1>
      <ShortUrlForm
        handleCreateUrl={(url) => {
          setUrl(url)
        }}
      />
      {url && <ShortUrl url={url} />}
    </>
  )
}

export default App
