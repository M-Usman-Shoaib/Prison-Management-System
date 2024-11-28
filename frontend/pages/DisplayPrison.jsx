import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Import axios

const ViewPrisonDetails = () => {
    const { id } = useParams(); // Get the prison ID from URL
    const navigate = useNavigate(); // To navigate back to the list
    const [prisonData, setPrisonData] = useState(null);
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
        // Fetch the prison data using the ID
        const fetchPrisonData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/prison/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Check for a successful response
                if (response.status === 200) {
                    setPrisonData(response.data);
                } else {
                    setAlertMessage('Failed to fetch prison data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch prison data.');
                setShowErrorAlert(true);
            }
        };

        fetchPrisonData();
    }, [id, token]); // Ensure the effect runs when the token or id changes

    if (!prisonData) {
        return <div>Loading...</div>; // Loading state while fetching prison data
    }

    return (
        <div>
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="prison-details-container text-center mt-5 pt-5">
                <h4 className="pb-3 brownColor">Prison Details</h4>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Prison ID</strong></td>
                            <td>{prisonData.prisonID}</td>
                        </tr>
                        <tr>
                            <td><strong>Location</strong></td>
                            <td>{prisonData.location}</td>
                        </tr>
                        <tr>
                            <td><strong>Capacity</strong></td>
                            <td>{prisonData.capacity}</td>
                        </tr>
                        <tr>
                            <td><strong>Security Level</strong></td>
                            <td>{prisonData.securityLevel}</td>
                        </tr>
                        {/* {prisonData.cellBlocks && (
                            <tr>
                                <td><strong>Cell Blocks</strong></td>
                                <td>
                                    <ul>
                                        {prisonData.cellBlocks.map((block) => (
                                            <li key={block._id}>{block.name}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        )} */}
                    </tbody>
                </table>

                <button
                    className="brownButton mt-4"
                    onClick={() => navigate('/prisons')} // Navigate back to the list of prisons
                >
                    Back to Prison List
                </button>
            </div>
        </div>
    );
};

export default ViewPrisonDetails;
