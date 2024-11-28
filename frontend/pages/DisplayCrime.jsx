import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ViewCrimeDetails = () => {
    const { id } = useParams(); // Get the crime ID from URL
    const navigate = useNavigate(); // To navigate back to the list
    const [crimeData, setCrimeData] = useState(null);
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
        // Fetch the crime data using the ID
        const fetchCrimeData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/crime/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Check for a successful response
                if (response.status === 200) {
                    setCrimeData(response.data);
                } else {
                    setAlertMessage('Failed to fetch crime data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch crime data.');
                setShowErrorAlert(true);
            }
        };

        fetchCrimeData();
    }, [id, token]);

    if (!crimeData) {
        return <div>Loading...</div>; // Loading state while fetching crime data
    }

    return (
        <div>
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="crime-details-container text-center mt-5 pt-5">
                <h4 className="pb-3 brownColor">Crime Details</h4>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Nature</strong></td>
                            <td>{crimeData.nature}</td>
                        </tr>
                        <tr>
                            <td><strong>Description</strong></td>
                            <td>{crimeData.description}</td>
                        </tr>
                        <tr>
                            <td><strong>Legal References</strong></td>
                            <td>{crimeData.legalReferences}</td>
                        </tr>
                        <tr>
                            <td><strong>Severity</strong></td>
                            <td>{crimeData.severity}</td>
                        </tr>
                    </tbody>
                </table>

                <button
                    className="brownButton mt-4"
                    onClick={() => navigate('/crimes')} // Navigate back to the list of crimes
                >
                    Back to Crime List
                </button>
            </div>
        </div>
    );
};

export default ViewCrimeDetails;
