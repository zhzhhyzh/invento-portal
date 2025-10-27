import React from "react";
import "../index.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    //Generate page numbers based on total pages
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                disabled={currentPage == 1}
                onClick={() => onPageChange(currentPage - 1)}>
                &laquo; Prev
            </button>

            {pageNumbers.map((num) => (
                <button key={num}
                    className={`pagination-button ${currentPage == num ? "active" : ""} `}
                    onClick={() => onPageChange(num)}
                >
                    {num}

                </button>
            ))}

            <button
                className="pagination-button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next &raquo;
            </button>

        </div>
    )
}

export default Pagination;