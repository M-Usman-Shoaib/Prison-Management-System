import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditPrisonForm = () => {
    const { id } = useParams(); // Get the prison ID from URL
    const navigate = useNavigate(); // To navigate after updating
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
    const [alertMessage, setAlertMessage] = useState('');
    const [prisonData, setPrisonData] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]); // Ensure the effect runs when the token changes

    useEffect(() => {
        // Fetch prison data using the ID
        const fetchPrisonData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/prison/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setPrisonData(response.data);
                } else {
                    setAlertMessage('Failed to fetch prison data.');
                    setAlertType('error');
                    setShowAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch prison data.');
                setAlertType('error');
                setShowAlert(true);
            }
        };

        fetchPrisonData();
    }, [id, token]);

    const formik = useFormik({
        initialValues: {
            prisonID: prisonData ? prisonData.prisonID : '',
            location: prisonData ? prisonData.location : '',
            capacity: prisonData ? prisonData.capacity : '',
            securityLevel: prisonData ? prisonData.securityLevel : '',
        },
        validationSchema: Yup.object({
            prisonID: Yup.string().required('Prison ID is required'),
            location: Yup.string().required('Location is required'),
            capacity: Yup.number()
                .typeError('Capacity must be a number')
                .required('Capacity is required'),
            securityLevel: Yup.string()
                .oneOf(['Low', 'Medium', 'High', 'Maximum'], 'Invalid security level')
                .required('Security level is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:3000/prison/update/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAlertMessage('Prison updated successfully.');
                    setAlertType('success');
                    setShowAlert(true);
                    setTimeout(() => navigate('/prisons'), 2000);
                } else {
                    setAlertMessage('Failed to update prison.');
                    setAlertType('error');
                    setShowAlert(true);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.msg) {
                    if (error.response.data.msg.includes('Prison ID already exists')) {
                        formik.setFieldError('prisonID', 'Prison ID already exists.');
                        setAlertMessage('Prison ID already exists.');
                        setAlertType('error');
                        setShowAlert(true);
                    } else {
                        setAlertMessage(error.response.data.msg);
                    }
                } else {
                    setAlertMessage('Failed to update prison. Please try again.');
                }
                setAlertType('error');
                setShowAlert(true);
            }
        },
    });

    if (!prisonData) {
        return <div>Loading...</div>; // Loading state while fetching prison data
    }

    return (
        <div>
             {showAlert && (
                <Alert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setShowAlert(false)}
                />
            )}
            <div className="sign-up-container text-center mt-5 pt-5">
                <form className="sign-up-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3 brownColor">Edit Prison</h4>

                    <input
                        placeholder="Prison ID"
                        type="text"
                        name="prisonID"
                        className="pt-2"
                        value={formik.values.prisonID}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    <input
                        placeholder="Location"
                        type="text"
                        name="location"
                        className="pt-2 mt-2"
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    <input
                        placeholder="Capacity"
                        type="number"
                        name="capacity"
                        className="pt-2 mt-2"
                        value={formik.values.capacity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    <select
                        name="securityLevel"
                        className="pt-2 mt-2"
                        value={formik.values.securityLevel}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Security Level
                        </option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Maximum">Maximum</option>
                    </select>

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Prison
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPrisonForm;
