import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../src/Components/Alert";
import { useSelector } from "react-redux";

const VisitorsList = () => {
    const [visitors, setVisitors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const visitorsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/visitor/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setVisitors(response.data);
            setTotalPages(Math.ceil(response.data.length / visitorsPerPage));
        } catch (error) {
            setAlertMessage('Error fetching visitors');
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => navigate(`/editVisitor/${id}`);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/visitor/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchVisitors();
        } catch (error) {
            setAlertMessage('Error deleting visitor');
            setShowErrorAlert(true);
        }
    };

    const handleView = (id) => navigate(`/getVisitor/${id}`);
    const handleAddVisitor = () => navigate("/addVisitor");

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        );
    };

    const currentData = visitors.slice(
        (currentPage - 1) * visitorsPerPage,
        currentPage * visitorsPerPage
    );

    return (
        <div className="container">
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="header mb-4">
                <h1 className="title brownColor">Visitors List</h1>
                <button onClick={handleAddVisitor} className="brownButton">
                    + Add New Visitor
                </button>
                <button onClick={handleNavigateToDashboard} className="brownButton">
                    Go to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading">Loading data...</p>
            ) : visitors.length === 0 ? (
                <p className="no-visitors">No visitors available.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Visitor ID</th>
                                <th>Name</th>
                                <th>Purpose</th>
                                <th>Visit Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((visitor) => (
                                <tr key={visitor._id}>
                                    <td>{visitor.visitorID}</td>
                                    <td>{visitor.name}</td>
                                    <td>{visitor.purpose}</td>
                                    <td>{new Date(visitor.visitDate).toLocaleDateString()}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleView(visitor._id)}
                                            className="action-button view"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(visitor._id)}
                                            className="action-button edit"
                                            title="Edit Visitor"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(visitor._id)}
                                            className="action-button delete"
                                            title="Delete Visitor"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                        className="pagination-button prev"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage === totalPages}
                        className="pagination-button next"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default VisitorsList;
