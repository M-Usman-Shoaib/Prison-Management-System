import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../src/Components/Alert";
import { useSelector } from "react-redux";

const CrimesList = () => {
    const [crimes, setCrimes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const crimesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        fetchCrimes();
    }, []);

    const fetchCrimes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/crime/getAll', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCrimes(response.data);
            setTotalPages(Math.ceil(response.data.length / crimesPerPage));
        } catch (error) {
            setAlertMessage('Error fetching crimes');
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => navigate(`/editCrime/${id}`);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/crime/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCrimes();
        } catch (error) {
            setAlertMessage('Error deleting crime');
            setShowErrorAlert(true);
        }
    };

    const handleView = (id) => navigate(`/getCrime/${id}`);
    const handleAddCrime = () => navigate("/addCrime");

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        );
    };

    const currentData = crimes.slice(
        (currentPage - 1) * crimesPerPage,
        currentPage * crimesPerPage
    );

    return (
        <div className="container">
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="header mb-4">
                <h1 className="title brownColor">Crimes List</h1>
                <button onClick={handleAddCrime} className="brownButton">
                    + Add New Crime
                </button>
                <button onClick={handleNavigateToDashboard} className="brownButton">
                    Go to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading">Loading data...</p>
            ) : crimes.length === 0 ? (
                <p className="no-crimes">No crimes available.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Nature</th>
                                <th>Severity</th>
                                <th>Legal References</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((crime) => (
                                <tr key={crime._id}>
                                    <td>{crime.nature}</td>
                                    <td>{crime.severity}</td>
                                    <td>{crime.legalReferences}</td>
                                    <td>{crime.description}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleView(crime._id)}
                                            className="action-button view"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(crime._id)}
                                            className="action-button edit"
                                            title="Edit Crime"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(crime._id)}
                                            className="action-button delete"
                                            title="Delete Crime"
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

export default CrimesList;
