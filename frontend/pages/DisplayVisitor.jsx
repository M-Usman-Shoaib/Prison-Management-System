import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ViewVisitorDetails = () => {
    const { id } = useParams(); // Get the visitor ID from URL
    const navigate = useNavigate(); // To navigate back to the list
    const [visitorData, setVisitorData] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        // Fetch the visitor data using the ID
        const fetchVisitorData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/visitor/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Check for a successful response
                if (response.status === 200) {
                    setVisitorData(response.data);
                } else {
                    setAlertMessage('Failed to fetch visitor data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch visitor data.');
                setShowErrorAlert(true);
            }
        };

        fetchVisitorData();
    }, [id, token]);

    if (!visitorData) {
        return <div>Loading...</div>; // Loading state while fetching visitor data
    }

    return (
        <div>
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}

            <div className="visitor-details-container text-center mt-5 pt-5">
                <h4 className="pb-3 brownColor">Visitor Details</h4>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Field</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Visitor Name</strong></td>
                            <td>{visitorData.name}</td>
                        </tr>
                        <tr>
                            <td><strong>Contact Number</strong></td>
                            <td>{visitorData.contactNumber}</td>
                        </tr>
                        <tr>
                            <td><strong>Visit Date</strong></td>
                            <td>{new Date(visitorData.visitDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td><strong>Purpose of Visit</strong></td>
                            <td>{visitorData.purpose}</td>
                        </tr>
                        <tr>
                            <td><strong>Related Inmate</strong></td>
                            <td>{visitorData.relatedInmate?.name || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>

                <button
                    className="brownButton mt-4"
                    onClick={() => navigate('/visitors')} // Navigate back to the list of visitors
                >
                    Back to Visitor List
                </button>
            </div>
        </div>
    );
};

export default ViewVisitorDetails;
