import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";


const DashboardPage = () => {
    const [message, setMessage] = useState("");
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [transactionData, setTransactionData] = useState([]);
    const [selectedData, setSelectedData] = useState("amount");

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const res = await ApiService.getAllTransactions();
                if (res.status === 200) {
                    const transformed = transformTransactionData(res.transactions, selectedMonth, selectedYear);
                    setTransactionData(transformed);
                }
            } catch (e) {
                console.error(e);
                showMessage(e.message || "Error fetching data");
            }
        };
        fetchAllData();
    }, [selectedMonth, selectedYear]);

    const transformTransactionData = (transactions, month, year) => {
        const dailyData = {};
        const daysInMonth = new Date(year, month, 0).getDate();

        // Initialize each day
        for (let day = 1; day <= daysInMonth; day++) {
            dailyData[day] = { day, count: 0, quantity: 0, amount: 0 };
        }

        transactions.forEach((t) => {
            const date = new Date(t.createdAt);
            const tMonth = date.getMonth() + 1;
            const tYear = date.getFullYear();

            if (tMonth === month && tYear === year) {
                const day = date.getDate();
                dailyData[day].count += 1;
                dailyData[day].quantity += t.totalProducts;
                dailyData[day].amount += t.totalPrice;
            }
        });

        return Object.values(dailyData);
    };


    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));

    }

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));

    }

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);


    }

    
    return (
        <Layout>
            {message && <div className="message">{message}</div>}
            <div className="dashboard-page">
                <div className="button-group">
                    <button onClick={() => setSelectedData("count")}>Total Transactions</button>
                    <button onClick={() => setSelectedData("quantity")}>Product Quantity</button>
                    <button onClick={() => setSelectedData("amount")}>Amount</button>

                </div>

                <div className="dashboard-content">
                    <div className="filter-section">
                        <label>
                            Select Month
                        </label>
                        <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1}>
                                    {new Date(0, i).toLocaleString("default", { month: "long" })}
                                </option>
                            ))}

                        </select>

                        <label>
                            Select Year
                        </label>
                        <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                            {Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                )
                            })}

                        </select>
                    </div>

                    {/* Display the chart */}
                    <div className="chart-section">
                        <div className="chart-container">
                            <h3>Daily Transactions</h3>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={transactionData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey={selectedData}  // "count" | "quantity" | "amount"
                                        stroke="#ff0000"
                                        fill="#cc0000"
                                        fillOpacity={0.8}
                                    />
                                </LineChart>
                            </ResponsiveContainer>


                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )

}

export default DashboardPage;