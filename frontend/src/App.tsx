import "./App.css"
import ShortUrlForm from "./components/ShortUrlForm"

function App() {
  return (
    <>
      <h1>Url Shortener</h1>
      <ShortUrlForm
        handleCreateUrl={(url) => {
          // TODO display create url to user
          console.log(url)
        }}
      />
    </>
  )
}

export default App
