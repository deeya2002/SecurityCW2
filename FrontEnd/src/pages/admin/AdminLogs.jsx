import React, { useEffect, useState } from 'react';
import { getAuditLogsApi } from '../../apis/Api';
import '../../css/adminlogs.css'; // Ensure this CSS file exists and is correctly linked

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getAuditLogsApi()
            .then((res) => {
                setLogs(res.data.logs);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch logs:', err);
                setError('Failed to load logs.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="loading-container"><p className="loading-message">Loading...</p></div>;
    }

    if (error) {
        return <div className="error-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="admin-logs-container">
            <h2 className="logs-title">Audit Log</h2>
            {logs.length === 0 ? (
                <p className="no-logs-message">No logs available.</p>
            ) : (
                <div className="logs-table-container">
                    <table className="logs-table">
                        <thead>
                            <tr>
                                <th className="table-primary">Timestamp</th>
                                <th className="table-secondary">Action</th>
                                <th className="table-success">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={log._id} className={index % 2 === 0 ? 'table-light' : 'table-dark'}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>{log.action}</td>
                                    <td>
                                        <pre>{JSON.stringify(log.details, null, 2)}</pre>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;
