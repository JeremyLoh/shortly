import { useLoaderData, useNavigate } from "react-router-dom"
import { AccountHistoryData } from "./AccountHistoryLoader"
import Header from "../../../../components/Header/Header"
import Footer from "../../../../components/Footer/Footer"
import Pagination from "../../../../components/Pagination/Pagination"
import UrlHistoryView from "../components/UrlHistoryView/UrlHistoryView"

function AccountHistoryPage() {
  const navigate = useNavigate()
  const { urls, page, total } = useLoaderData() as AccountHistoryData
  function handlePreviousNavigation() {
    navigate(`/history?page=${page - 1}`)
  }
  function handleNextNavigation() {
    navigate(`/history?page=${page + 1}`)
  }
  function handlePageItemNavigation(navPage: number) {
    if (navPage === page) {
      return
    }
    navigate(`/history?page=${navPage}`)
  }
  return (
    <>
      <Header />
      <h1>History</h1>
      <Pagination
        page={page}
        total={total}
        itemsPerPage={10}
        handlePreviousNavigation={handlePreviousNavigation}
        handleNextNavigation={handleNextNavigation}
        handlePageItemNavigation={handlePageItemNavigation}
      />
      {urls.length > 0 ? (
        <UrlHistoryView urls={urls} />
      ) : (
        <p>You have not created any short urls</p>
      )}
      <Footer />
    </>
  )
}

export default AccountHistoryPage
