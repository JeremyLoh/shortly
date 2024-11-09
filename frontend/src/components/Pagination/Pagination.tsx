import "./Pagination.css"

type PaginationProps = {
  page: number
  total: number
  itemsPerPage: number
  handlePreviousNavigation: () => void
  handleNextNavigation: () => void
  handlePageItemNavigation: (navPage: number) => void
}

function Pagination({
  page,
  total,
  itemsPerPage,
  handlePreviousNavigation,
  handleNextNavigation,
  handlePageItemNavigation,
}: PaginationProps) {
  const totalPages = Math.ceil(total / itemsPerPage)
  return (
    <div className="pagination">
      <button
        className="previous-nav-btn"
        onClick={handlePreviousNavigation}
        disabled={page === 1}
      >
        Previous
      </button>
      <div className="page-item-container">
        {Array(totalPages)
          .fill(0)
          .map((_, index) => {
            return (
              <button
                key={`tab-${index}`}
                className={
                  index + 1 === page
                    ? "active-tab pagination-page-item"
                    : "pagination-page-item"
                }
                onClick={() => handlePageItemNavigation(index + 1)}
              >
                {index + 1}
              </button>
            )
          })}
      </div>
      <button
        className="next-nav-btn"
        onClick={handleNextNavigation}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  )
}

export default Pagination
