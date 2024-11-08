import { useLoaderData, useNavigate } from "react-router-dom"
import Footer from "../../../../components/Footer/Footer"
import Header from "../../../../components/Header/Header"
import { AccountHistoryData } from "./AccountHistoryLoader"
import UrlCard from "../components/UrlCard/UrlCard"
import Pagination from "../../../../components/Pagination/Pagination"

function AccountHistoryPage() {
  const navigate = useNavigate()
  const { urls, page } = useLoaderData() as AccountHistoryData
  return (
    <>
      <Header />
      <h1>History</h1>
      <Pagination
        page={page}
        handlePreviousNavigation={() => navigate(`/history?page=${page - 1}`)}
        handleNextNavigation={() => {
          navigate(`/history?page=${page + 1}`)
        }}
      />
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
