import React, { useEffect, useState } from 'react';
import { getAuditLogsApi } from '../../apis/Api'; // Ensure this function is implemented correctly

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        // Fetch logs with error handling
        getAuditLogsApi()
            .then((res) => {
                setLogs(res.data.logs);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch((err) => {
                console.error('Failed to fetch logs:', err);
                setError('Failed to load logs.'); // Set error message if the API call fails
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Show loading message while data is being fetched
    }

    if (error) {
        return <p>{error}</p>; // Show error message if there's an error
    }

    return (
        <div className="audit-log">
            <h2>Audit Log</h2>
            {logs.length === 0 ? (
                <p>No logs available.</p> // Show message if there are no logs
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td>{log.action}</td>
                                <td>{typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminLogs;
