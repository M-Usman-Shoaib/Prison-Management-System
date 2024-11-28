import React, { useState, useEffect } from 'react';  // Added useEffect import
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Alert from '../src/Components/Alert';
import { useSelector } from "react-redux";
import axios from 'axios';

const AddPrisonForm = () => {
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]); // Ensure the effect runs when the token changes

    const formik = useFormik({
        initialValues: {
            prisonID: '',
            location: '',
            capacity: '',
            securityLevel: '',
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
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/prison/add', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Handle success
                setAlertMessage('Prison added successfully.');
                setShowSuccessAlert(true);
            } catch (error) {
                // Handle error
                if (error.response && error.response.data) {
                    setAlertMessage('Failed to add prison. ' + error.response.data.msg);
                } else {
                    setAlertMessage('Failed to add prison. Please try again.');
                }
                setShowErrorAlert(true);
            }
        },
    });

    return (
        <div>
            {showSuccessAlert && (
                <Alert type="success" message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
            )}
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}
            <div className="sign-up-container text-center mt-5 pt-5">
                <form className="sign-up-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3 brownColor">Add Prison</h4>

                    <input
                        placeholder="Prison ID"
                        type="text"
                        name="prisonID"
                        className={`pt-2 ${formik.touched.prisonID && formik.errors.prisonID ? 'error-input' : ''}`}
                        value={formik.values.prisonID}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.prisonID && formik.errors.prisonID && (
                        <div className="error mt-1">{formik.errors.prisonID}</div>
                    )}

                    <input
                        placeholder="Location"
                        type="text"
                        name="location"
                        className={`pt-2 mt-2 ${formik.touched.location && formik.errors.location ? 'error-input' : ''}`}
                        value={formik.values.location}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.location && formik.errors.location && (
                        <div className="error mt-1">{formik.errors.location}</div>
                    )}

                    <input
                        placeholder="Capacity"
                        type="number"
                        name="capacity"
                        className={`pt-2 mt-2 ${formik.touched.capacity && formik.errors.capacity ? 'error-input' : ''}`}
                        value={formik.values.capacity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.capacity && formik.errors.capacity && (
                        <div className="error mt-1">{formik.errors.capacity}</div>
                    )}

                    <select
                        name="securityLevel"
                        className={`pt-2 mt-2 ${formik.touched.securityLevel && formik.errors.securityLevel ? 'error-input' : ''}`}
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
                    {formik.touched.securityLevel && formik.errors.securityLevel && (
                        <div className="error mt-1">{formik.errors.securityLevel}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Add Prison
                    </button>
                    <br></br>
                    <br></br>
                    <button className="brownButton mt-3" onClick={() => navigate('/prisons')}>
                        Back to Prison List
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AddPrisonForm;
