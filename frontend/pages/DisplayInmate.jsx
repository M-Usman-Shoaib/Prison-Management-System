import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ViewInmateDetails = () => {
    const { id } = useParams(); // Get the inmate ID from URL
    const navigate = useNavigate(); // To navigate back to the list
    const [inmateData, setInmateData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        // Fetch the inmate data using the ID
        const fetchInmateData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/inmate/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Check for a successful response
                if (response.status === 200) {
                    setInmateData(response.data);
                } else {
                    setAlertMessage('Failed to fetch inmate data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch inmate data.');
                setShowErrorAlert(true);
            }
        };

        fetchInmateData();
    }, [id, token]);

    if (!inmateData) {
        return <div>Loading...</div>; // Loading state while fetching inmate data
    }

    return (
        <div>
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="inmate-details-container text-center mt-5 pt-5">
                <h4 className="pb-3 brownColor">Inmate Details</h4>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Inmate ID</strong></td>
                            <td>{inmateData.inmateId}</td>
                        </tr>
                        <tr>
                            <td><strong>Full Name</strong></td>
                            <td>{inmateData.fullName}</td>
                        </tr>
                        <tr>
                            <td><strong>Date of Birth</strong></td>
                            <td>{inmateData.dateOfBirth}</td>
                        </tr>
                        {/* <tr>
                            <td><strong>Crime Committed</strong></td>
                            <td>{inmateData.crimeCommitted?.name || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td><strong>Cell Block</strong></td>
                            <td>{inmateData.cellBlock?.blockName || 'N/A'}</td>
                        </tr> */}
                        <tr>
                            <td><strong>Medical History</strong></td>
                            <td>{inmateData.medicalHistory || 'No records available'}</td>
                        </tr>
                    </tbody>
                </table>

                <button
                    className="brownButton mt-4"
                    onClick={() => navigate('/inmates')} // Navigate back to the list of inmates
                >
                    Back to Inmate List
                </button>
            </div>
        </div>
    );
};

export default ViewInmateDetails;
