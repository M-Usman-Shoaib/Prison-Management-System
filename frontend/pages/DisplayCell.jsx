import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ViewCellDetails = () => {
    const { id } = useParams(); // Get the cell ID from URL
    const navigate = useNavigate(); // To navigate back to the list
    const [cellData, setCellData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        } 
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        // Fetch the cell data using the ID
        const fetchCellData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/cell/get/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                // Check for a successful response
                if (response.status === 200) {
                    setCellData(response.data);
                } else {
                    setAlertMessage('Failed to fetch cell data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch cell data.');
                setShowErrorAlert(true);
            }
        };

        fetchCellData();
    }, [id]);

    if (!cellData) {
        return <div>Loading...</div>; // Loading state while fetching cell data
    }

    return (
        <div>
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="cell-details-container text-center mt-5 pt-5">
                <h4 className="pb-3 brownColor">Cell Details</h4>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Cell ID</strong></td>
                            <td>{cellData.cellID}</td>
                        </tr>
                        <tr>
                            <td><strong>Capacity</strong></td>
                            <td>{cellData.capacity}</td>
                        </tr>
                        <tr>
                            <td><strong>Security Level</strong></td>
                            <td>{cellData.securityLevel}</td>
                        </tr>
                        {/* {cellData.inmates && (
                            <tr>
                                <td><strong>Inmates</strong></td>
                                <td>
                                    <ul>
                                        {cellData.inmates.map((inmate) => (
                                            <li key={inmate._id}>{inmate.name}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        )} */}
                    </tbody>
                </table>

                <button
                    className="brownButton mt-4"
                    onClick={() => navigate('/cells')} // Navigate back to the list of cells
                >
                    Back to Cell List
                </button>
            </div>
        </div>
    );
};

export default ViewCellDetails;
