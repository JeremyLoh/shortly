import "./Pagination.css"

type PaginationProps = {
  page: number
  total: number
  itemsPerPage: number
  handlePreviousNavigation: () => void
  handleNextNavigation: () => void
}

function Pagination({
  page,
  total,
  itemsPerPage,
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
      <button
        className="next-nav-btn"
        onClick={handleNextNavigation}
        disabled={page >= Math.ceil(total / itemsPerPage)}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
