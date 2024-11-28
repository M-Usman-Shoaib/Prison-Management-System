import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../src/Components/Alert";
import { useSelector } from "react-redux";

const InmatesList = () => {
    const [inmates, setInmates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const inmatesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        fetchInmates();
    }, []);

    const fetchInmates = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/inmate/getAll',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setInmates(response.data);
            setTotalPages(Math.ceil(response.data.length / inmatesPerPage));
        } catch (error) {
            setAlertMessage('Error fetching inmates');
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => navigate(`/editInmate/${id}`);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/inmate/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchInmates();
        } catch (error) {
            setAlertMessage('Error deleting inmate');
            setShowErrorAlert(true);
        }
    };

    const handleView = (id) => navigate(`/getInmate/${id}`);
    const handleAddInmate = () => navigate("/addInmate");

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");  // Navigate to the dashboard route
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        );
    };

    const currentData = inmates.slice(
        (currentPage - 1) * inmatesPerPage,
        currentPage * inmatesPerPage
    );

    return (
        <div className="container">
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="header mb-4">
                <h1 className="brownColor">Inmates List</h1>
                <button onClick={handleAddInmate} className="brownButton">
                    + Add New Inmate
                </button>
                {/* New Button for Dashboard Navigation */}
                <button onClick={handleNavigateToDashboard} className="brownButton">
                    Go to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading">Loading data...</p>
            ) : inmates.length === 0 ? (
                <p className="no-inmates">No inmates available.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Inmate ID</th>
                                <th>Full Name</th>
                                <th>Date of Birth</th>
                                
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((inmate) => (
                                <tr key={inmate._id}>
                                    <td>{inmate.inmateId}</td>
                                    <td>{inmate.fullName}</td>
                                    <td>{inmate.dateOfBirth}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleView(inmate._id)}
                                            className="action-button view"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(inmate._id)}
                                            className="action-button edit"
                                            title="Edit Inmate"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(inmate._id)}
                                            className="action-button delete"
                                            title="Delete Inmate"
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

export default InmatesList;
