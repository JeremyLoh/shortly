import { useState } from "react"
import "./App.css"
import ShortUrlForm from "./components/ShortUrlForm"
import { Url } from "./endpoints/createUrl"
import ShortUrl from "./components/ShortUrl"
import Header from "./components/Header"
import Footer from "./components/Footer"

function App() {
  const [url, setUrl] = useState<Url | null>(null)
  return (
    <>
      <Header />
      <div className="content">
        <h3>Create a new short URL</h3>
        <ShortUrlForm
          handleCreateUrl={(url) => {
            setUrl(url)
          }}
        />
        {url && <ShortUrl url={url} />}
      </div>
      <Footer />
    </>
  )
}

export default App
