import { useLoaderData, useNavigate } from "react-router-dom"
import { AccountHistoryData } from "./AccountHistoryLoader"
import Header from "../../../../components/Header/Header"
import Footer from "../../../../components/Footer/Footer"
import Pagination from "../../../../components/Pagination/Pagination"
import UrlCard from "../components/UrlCard/UrlCard"

function AccountHistoryPage() {
  const navigate = useNavigate()
  const { urls, page, total } = useLoaderData() as AccountHistoryData
  return (
    <>
      <Header />
      <h1>History</h1>
      <Pagination
        page={page}
        total={total}
        itemsPerPage={10}
        handlePreviousNavigation={() => navigate(`/history?page=${page - 1}`)}
        handleNextNavigation={() => navigate(`/history?page=${page + 1}`)}
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
