import React from 'react';
import styles from './ProfitLogsTable.module.css'; // Import the CSS module
import { logoutService } from '../../../services/authService';

const handleLogout = () => {
    logoutService(); // Call the logout service to remove tokens
    // Optionally, redirect to the login page or home page after logout
    window.location.href = '/login'; // Redirect to the login page
};

const ProfitLogsTable = ({ profitLogs }) => {
    // Sort the profit logs by timestamp in descending order
    const sortedLogs = [...profitLogs].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    // Function to handle CSV export
    const exportToCSV = () => {
        const csvHeaders = ["Order ID", "Client Name", "Profit Amount", "Finalized Payment", "Commission Rate", "Timestamp"];
        const csvRows = sortedLogs.map(log => [
            log.order_id,
            log.client_name || 'N/A',
            log.profit_amount,
            log.finalized_payment,
            log.commission_rate_at_time,
            new Date(log.timestamp).toLocaleString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + [csvHeaders.join(","), ...csvRows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "profit_logs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className={styles.headerContainer}>
                <h2 className={styles.headerTitle}>Profit Logs</h2>
                <button className={styles.exportButton} onClick={exportToCSV}>
                    Export to CSV
                </button>
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Client Name</th>
                        <th>Profit Amount</th>
                        <th>Finalized Payment</th>
                        <th>Commission Rate</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.order_id}</td>
                            <td>{log.client_name || 'N/A'}</td>
                            <td>{log.profit_amount}</td>
                            <td>{log.finalized_payment}</td>
                            <td>{log.commission_rate_at_time}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <button onClick={handleLogout} className={styles.logoutButton}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfitLogsTable;
