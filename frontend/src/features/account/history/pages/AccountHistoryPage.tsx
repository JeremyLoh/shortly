import { useLoaderData } from "react-router-dom"
import Footer from "../../../../components/Footer/Footer"
import Header from "../../../../components/Header/Header"
import { AccountHistoryData } from "./AccountHistoryLoader"
import UrlCard from "../components/UrlCard/UrlCard"

function AccountHistoryPage() {
  const { urls } = useLoaderData() as AccountHistoryData
  return (
    <>
      <Header />
      <h1>History</h1>
      {urls.length > 0 ? (
        urls.map((history) => (
          <UrlCard
            key={history.id}
            url={history.url}
            shortCode={history.shortCode}
            createdAt={history.createdAt}
            updatedAt={history.updatedAt}
          />
        ))
      ) : (
        <p>You have not created any short urls</p>
      )}
      <Footer />
    </>
  )
}

export default AccountHistoryPage
