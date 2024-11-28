import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "../src/Components/Alert";
import { useSelector } from "react-redux";

const CellsList = () => {
    const [cells, setCells] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const token = useSelector((state) => state.auth?.token);

    const cellsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        fetchCells();
    }, []);

    const fetchCells = async () => {

        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/cell/getAll',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCells(response.data);
            setTotalPages(Math.ceil(response.data.length / cellsPerPage));
        } catch (error) {
            setAlertMessage('Error fetching cells');
            setShowErrorAlert(true);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => navigate(`/editCell/${id}`);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/cell/delete/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchCells();
        } catch (error) {
            setAlertMessage('Error deleting cell');
            setShowErrorAlert(true);
        }
    };

    const handleView = (id) => navigate(`/getCell/${id}`);
    const handleAddCell = () => navigate("/addCell");

    const handleNavigateToDashboard = () => {
        navigate("/dashboard");  // Navigate to the dashboard route
    };

    const handlePageChange = (direction) => {
        setCurrentPage((prev) =>
            direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
        );
    };

    const currentData = cells.slice(
        (currentPage - 1) * cellsPerPage,
        currentPage * cellsPerPage
    );

    return (
        <div className="container">
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="header mb-4">
                <h1 className="title brownColor">Cells List</h1>
                <button onClick={handleAddCell} className="brownButton">
                    + Add New Cell
                </button>

                {/* New Button for Dashboard Navigation */}
                <button onClick={handleNavigateToDashboard} className="brownButton">
                    Go to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading">Loading data...</p>
            ) : cells.length === 0 ? (
                <p className="no-cells">No cells available.</p>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Cell ID</th>
                                <th>Capacity</th>
                                <th>Security Level</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((cell) => (
                                <tr key={cell._id}>
                                    <td>{cell.cellID}</td>

                                    <td>{cell.capacity}</td>
                                    <td>{cell.securityLevel}</td>
                                    <td className="actions">
                                        <button
                                            onClick={() => handleView(cell._id)}
                                            className="action-button view"
                                            title="View Details"
                                        >
                                            👁️
                                        </button>
                                        <button
                                            onClick={() => handleEdit(cell._id)}
                                            className="action-button edit"
                                            title="Edit Cell"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cell._id)}
                                            className="action-button delete"
                                            title="Delete Cell"
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

export default CellsList;
