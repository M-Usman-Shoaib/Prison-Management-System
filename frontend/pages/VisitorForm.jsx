import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddVisitorForm = () => {
    const [inmates, setInmates] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    // Fetch available inmates
    useEffect(() => {
        const fetchInmates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inmate/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInmates(response.data);
            } catch (error) {
                console.error('Failed to fetch inmates:', error);
            }
        };

        fetchInmates();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            relationshipToInmate: '',
            phone: '',
            inmate: '',
            visitDate: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Full Name is required'),
            relationshipToInmate: Yup.string().required('Relationship to Inmate is required'),
            phone: Yup.string().matches(/^\d{10}$/, 'Phone number must be 10 digits'),
            inmate: Yup.string().required('Inmate selection is required'),
            visitDate: Yup.date().required('Visit Date is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/visitor/add', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Handle success
                setAlertMessage('Visitor added successfully.');
                setShowSuccessAlert(true);
                formik.resetForm();
            } catch (error) {
                // Handle error
                if (error.response && error.response.data) {
                    setAlertMessage('Failed to add visitor. ' + error.response.data.msg);
                } else {
                    setAlertMessage('Failed to add visitor. Please try again.');
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
                    <h4 className="pb-3 brownColor">Add Visitor</h4>

                    <input
                        placeholder="Full Name"
                        type="text"
                        name="fullName"
                        className={`pt-2 ${formik.touched.fullName && formik.errors.fullName ? 'error-input' : ''}`}
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                        <div className="error mt-1">{formik.errors.fullName}</div>
                    )}

                    <input
                        placeholder="Relationship to Inmate"
                        type="text"
                        name="relationshipToInmate"
                        className={`pt-2 mt-2 ${
                            formik.touched.relationshipToInmate && formik.errors.relationshipToInmate ? 'error-input' : ''
                        }`}
                        value={formik.values.relationshipToInmate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.relationshipToInmate && formik.errors.relationshipToInmate && (
                        <div className="error mt-1">{formik.errors.relationshipToInmate}</div>
                    )}

                    <input
                        placeholder="Phone (Optional)"
                        type="text"
                        name="phone"
                        className={`pt-2 mt-2 ${formik.touched.phone && formik.errors.phone ? 'error-input' : ''}`}
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                        <div className="error mt-1">{formik.errors.phone}</div>
                    )}

                    <select
                        name="inmate"
                        className={`pt-2 mt-2 ${formik.touched.inmate && formik.errors.inmate ? 'error-input' : ''}`}
                        value={formik.values.inmate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Inmate
                        </option>
                        {inmates.map((inmate) => (
                            <option key={inmate._id} value={inmate._id}>
                                {inmate.name} (ID: {inmate._id})
                            </option>
                        ))}
                    </select>
                    {formik.touched.inmate && formik.errors.inmate && (
                        <div className="error mt-1">{formik.errors.inmate}</div>
                    )}

                    <input
                        placeholder="Visit Date"
                        type="date"
                        name="visitDate"
                        className={`pt-2 mt-2 ${formik.touched.visitDate && formik.errors.visitDate ? 'error-input' : ''}`}
                        value={formik.values.visitDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.visitDate && formik.errors.visitDate && (
                        <div className="error mt-1">{formik.errors.visitDate}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit" disabled={inmates.length === 0}>
                        {inmates.length > 0 ? 'Add Visitor' : 'No Inmates Available'}
                    </button>
                    <br></br>
                    <br></br>
                    <button className="brownButton mt-3" onClick={() => navigate('/visitors')}>
                        Back to Visitor List
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVisitorForm;
