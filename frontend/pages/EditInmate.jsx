import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditInmateForm = () => {
    const { id } = useParams(); // Get the inmate ID from URL
    const navigate = useNavigate(); // To navigate after updating
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [inmateData, setInmateData] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Redirect to login if token is missing
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        // Fetch inmate data using the ID
        const fetchInmateData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/inmate/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    const formik = useFormik({
        initialValues: {
            name: inmateData ? inmateData.name : '',
            age: inmateData ? inmateData.age : '',
            crime: inmateData ? inmateData.crime : '',
            prisonTerm: inmateData ? inmateData.prisonTerm : '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            age: Yup.number()
                .required('Age is required')
                .min(18, 'Age must be at least 18')
                .max(100, 'Age must be less than 100'),
            crime: Yup.string().required('Crime is required'),
            prisonTerm: Yup.string().required('Prison term is required'),
        }),
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:3000/inmate/update/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAlertMessage('Inmate updated successfully.');
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        navigate('/inmates');
                    }, 2000);
                } else {
                    setAlertMessage('Failed to update inmate.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to update inmate. Please try again.');
                setShowErrorAlert(true);
            }
        },
    });

    if (!inmateData) {
        return <div>Loading...</div>; // Loading state while fetching inmate data
    }

    return (
        <div>
            {showSuccessAlert && (
                <Alert type="success" message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
            )}
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}
            <div className="edit-inmate-container text-center mt-5 pt-5">
                <form className="edit-inmate-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3">Edit Inmate</h4>

                    <input
                        placeholder="Name"
                        type="text"
                        name="name"
                        className={`pt-2 ${formik.touched.name && formik.errors.name ? 'error-input' : ''}`}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <div className="error mt-1">{formik.errors.name}</div>
                    )}

                    <input
                        placeholder="Age"
                        type="number"
                        name="age"
                        className={`pt-2 mt-2 ${formik.touched.age && formik.errors.age ? 'error-input' : ''}`}
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.age && formik.errors.age && (
                        <div className="error mt-1">{formik.errors.age}</div>
                    )}

                    <input
                        placeholder="Crime"
                        type="text"
                        name="crime"
                        className={`pt-2 mt-2 ${formik.touched.crime && formik.errors.crime ? 'error-input' : ''}`}
                        value={formik.values.crime}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.crime && formik.errors.crime && (
                        <div className="error mt-1">{formik.errors.crime}</div>
                    )}

                    <input
                        placeholder="Prison Term"
                        type="text"
                        name="prisonTerm"
                        className={`pt-2 mt-2 ${formik.touched.prisonTerm && formik.errors.prisonTerm ? 'error-input' : ''}`}
                        value={formik.values.prisonTerm}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.prisonTerm && formik.errors.prisonTerm && (
                        <div className="error mt-1">{formik.errors.prisonTerm}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Inmate
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditInmateForm;
