import "./Pagination.css"

type PaginationProps = {
  page: number
  handlePreviousNavigation: () => void
  handleNextNavigation: () => void
}

function Pagination({
  page,
  handlePreviousNavigation,
  handleNextNavigation,
}: PaginationProps) {
  return (
    <div className="pagination">
      <button
        className="previous-nav-btn"
        onClick={handlePreviousNavigation}
        disabled={page === 1}
      >
        Previous
      </button>
      <button className="active-tab">{page}</button>
      <button className="next-nav-btn" onClick={handleNextNavigation}>
        Next
      </button>
    </div>
  )
}

export default Pagination
