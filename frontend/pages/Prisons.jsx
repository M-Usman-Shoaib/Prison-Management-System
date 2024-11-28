import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../src/Components/Alert";
import { useSelector } from "react-redux";


const PrisonsList = () => {
    const [prisons, setPrisons] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth.token);

    const prisonsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        } 
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        fetchPrisons();
    }, []);

    const fetchPrisons = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/prison/getAll',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPrisons(response.data);
            setTotalPages(Math.ceil(response.data.length / prisonsPerPage));
        } catch (error) {
            setAlertMessage('Error fetching prisons');
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => navigate(`/editPrison/${id}`);
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/prison/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchPrisons();
        } catch (error) {
            setAlertMessage('Error deleting prison');
            setShowErrorAlert(true);
        }
    };

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");  // Navigate to the dashboard route
    };

    const handleView = (id) => navigate(`/getPrison/${id}`);
    const handleAddPrison = () => navigate("/addPrison");

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        );
    };

    const currentData = prisons.slice(
        (currentPage - 1) * prisonsPerPage,
        currentPage * prisonsPerPage
    );

    return (
        <div className="container">
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="header mb-4">
                <h1 className="title brownColor">Prisons List</h1>
                <button onClick={handleAddPrison} className="brownButton mt-4 mb-2">
                    + Add New Prison
                </button>
                   {/* New Button for Dashboard Navigation */}
                   <button onClick={handleNavigateToDashboard} className="brownButton mt-4 mb-2">
                    Go to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading">Loading data...</p>
            ) : prisons.length === 0 ? (
                <p className="no-prisons">No prisons available.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Location</th>
                                <th>Capacity</th>
                                <th>Security Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((prison) => (
                                <tr key={prison._id}>
                                    <td>{prison.prisonID}</td>
                                    <td>{prison.location}</td>
                                    <td>{prison.capacity}</td>
                                    <td>{prison.securityLevel}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleView(prison._id)}
                                            className="action-button view"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(prison._id)}
                                            className="action-button edit"
                                            title="Edit Prison"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prison._id)}
                                            className="action-button delete"
                                            title="Delete Prison"
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

export default PrisonsList;
