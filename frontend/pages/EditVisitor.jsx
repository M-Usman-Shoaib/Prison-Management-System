import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditVisitorForm = () => {
    const { id } = useParams(); // Get the visitor ID from the URL
    const navigate = useNavigate(); // To navigate after updating
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [visitorData, setVisitorData] = useState(null);
    const [inmates, setInmates] = useState([]); // List of inmates for the dropdown
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        // Fetch visitor data using the ID
        const fetchVisitorData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/visitor/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

        // Fetch inmates for the dropdown
        const fetchInmates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inmate/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setInmates(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch inmates:', error);
                setAlertMessage('Failed to fetch inmates.');
                setShowErrorAlert(true);
            }
        };

        fetchInmates();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            visitorID: visitorData ? visitorData.visitorID : '',
            name: visitorData ? visitorData.name : '',
            age: visitorData ? visitorData.age : '',
            relation: visitorData ? visitorData.relation : '',
            inmate: visitorData ? visitorData.inmate : '',
            visitDate: visitorData ? visitorData.visitDate.split('T')[0] : '',
        },
        validationSchema: Yup.object({
            visitorID: Yup.string().required('Visitor ID is required'),
            name: Yup.string().required('Name is required'),
            age: Yup.number().min(0, 'Age must be positive').required('Age is required'),
            relation: Yup.string().required('Relation is required'),
            inmate: Yup.string().required('Inmate is required'),
            visitDate: Yup.date().required('Visit date is required'),
        }),
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:3000/visitor/update/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAlertMessage('Visitor updated successfully.');
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        navigate('/visitors');
                    }, 2000);
                } else {
                    setAlertMessage('Failed to update visitor.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to update visitor. Please try again.');
                setShowErrorAlert(true);
            }
        },
    });

    if (!visitorData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {showSuccessAlert && (
                <Alert type="success" message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
            )}
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}
            <div className="edit-visitor-container text-center mt-5 pt-5">
                <form className="edit-visitor-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3">Edit Visitor</h4>

                    <input
                        placeholder="Visitor ID"
                        type="text"
                        name="visitorID"
                        className={`pt-2 ${formik.touched.visitorID && formik.errors.visitorID ? 'error-input' : ''}`}
                        value={formik.values.visitorID}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.visitorID && formik.errors.visitorID && (
                        <div className="error mt-1">{formik.errors.visitorID}</div>
                    )}

                    <input
                        placeholder="Name"
                        type="text"
                        name="name"
                        className={`pt-2 mt-2 ${formik.touched.name && formik.errors.name ? 'error-input' : ''}`}
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
                        placeholder="Relation"
                        type="text"
                        name="relation"
                        className={`pt-2 mt-2 ${formik.touched.relation && formik.errors.relation ? 'error-input' : ''}`}
                        value={formik.values.relation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.relation && formik.errors.relation && (
                        <div className="error mt-1">{formik.errors.relation}</div>
                    )}

                    <select
                        name="inmate"
                        className="pt-2 mt-2"
                        value={formik.values.inmate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Inmate
                        </option>
                        {inmates.map((inmate) => (
                            <option key={inmate._id} value={inmate._id}>
                                {inmate.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.inmate && formik.errors.inmate && (
                        <div className="error mt-1">{formik.errors.inmate}</div>
                    )}

                    <input
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

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Visitor
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditVisitorForm;
