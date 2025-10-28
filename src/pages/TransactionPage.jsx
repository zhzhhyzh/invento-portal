import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import Pagination from "../component/Pagination";

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [filter, setFilter] = useState("");
    const [valueToSearch, setValueToSearch] = useState("");
    const navigate = useNavigate();


    //Pagination setup
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10;
    //Fetch transactions from the backend
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const transactionData = await ApiService.getAllTransactions(valueToSearch);

                if (transactionData.status === 200) {
                    const allTransactions = transactionData.transactions || [];
                    setTotalPages(Math.ceil(allTransactions.length / itemsPerPage));

                    const paginatedTransactions = allTransactions.slice(
                        (currentPage - 1) * itemsPerPage,
                        currentPage * itemsPerPage
                    );

                    setTransactions(paginatedTransactions);
                }
            } catch (e) {
                console.error("Fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching transactions.";
                showMessage(backendMsg);
            }
        };

        getTransactions();
    }, [currentPage, valueToSearch]);


    //Method to show message
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    //Handle search
    const handleSearch = () => {
        setCurrentPage(1);
        setValueToSearch(filter);

    }

    const handleTransactionsDTOSPage = (transactionId) => {
        navigate(`/transaction/${transactionId}`);
    }
    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="transaction-page">
                <div className="transaction-header">
                    <h1>
                        Transactions
                    </h1>

                    <div className="transaction-search">
                        <input
                            placeholder="Search Transactions..."
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value) }}
                            type="text" />
                        <button onClick={() => handleSearch()}>Search</button>
                    </div>
                </div>

                {transactions &&
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Total Price</th>
                                <th>No. of Product</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.transactionType}</td>
                                    <td>{transaction.status}</td>
                                    <td>{transaction.totalPrice}</td>
                                    <td>{transaction.totalProducts}</td>
                                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleTransactionsDTOSPage(transaction.id)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                }
            </div>
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </Layout>


    )


}

export default TransactionPage;