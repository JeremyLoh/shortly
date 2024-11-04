import { useState } from "react"
import "./App.css"
import ShortUrlForm from "./features/createUrl/components/ShortUrlForm/ShortUrlForm.tsx"
import { Url } from "./endpoints/createUrl"
import ShortUrlCard from "./features/createUrl/components/ShortUrlCard/ShortUrlCard.tsx"
import Header from "./components/Header/Header.tsx"
import Footer from "./components/Footer/Footer.tsx"
import AccountActions from "./features/account/history/components/AccountActions.tsx/AccountActions.tsx"

function App() {
  const [url, setUrl] = useState<Url | null>(null)
  return (
    <>
      <Header />
      <div className="content">
        <AccountActions />
        <h3>Create a new short URL</h3>
        <ShortUrlForm
          handleCreateUrl={(url) => {
            setUrl(url)
          }}
        />
        {url && <ShortUrlCard url={url} />}
      </div>
      <Footer />
    </>
  )
}

export default App
