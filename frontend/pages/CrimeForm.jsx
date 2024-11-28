import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddCrimeForm = () => {
    const [inmates, setInmates] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchInmates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/inmates', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInmates(response.data);
            } catch (err) {
                console.error('Failed to fetch inmates:', err);
            }
        };
        fetchInmates();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            nature: '',
            severity: '',
            legalReferences: '',
            description: '',
            evidence: '',
        },
        validationSchema: Yup.object({
            nature: Yup.string().required('Nature of the crime is required'),
            severity: Yup.string()
                .oneOf(['Low', 'Medium', 'High', 'Severe'], 'Invalid severity level')
                .required('Severity level is required'),
            legalReferences: Yup.string().required('Legal references are required'),
            description: Yup.string().required('Description is required'),
            evidence: Yup.string().url('Invalid URL').nullable(),
        }),
        onSubmit: async (values) => {
            try {
                await axios.post('http://localhost:3000/crime/add', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAlertMessage('Crime added successfully.');
                setShowSuccessAlert(true);
                formik.resetForm();
            } catch (error) {
                console.error('Submission Error:', error.response?.data || error.message);
                setAlertMessage('Failed to add crime. Please try again.');
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
                    <h4 className="pb-3 brownColor">Add Crime</h4>

                    <input
                        placeholder="Nature of the Crime"
                        type="text"
                        name="nature"
                        className={`pt-2 ${formik.touched.nature && formik.errors.nature ? 'error-input' : ''}`}
                        value={formik.values.nature}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.nature && formik.errors.nature && (
                        <div className="error mt-1">{formik.errors.nature}</div>
                    )}

                    <select
                        name="severity"
                        className={`pt-2 mt-2 ${formik.touched.severity && formik.errors.severity ? 'error-input' : ''}`}
                        value={formik.values.severity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Severity Level
                        </option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Severe">Severe</option>
                    </select>
                    {formik.touched.severity && formik.errors.severity && (
                        <div className="error mt-1">{formik.errors.severity}</div>
                    )}

                    <input
                        placeholder="Legal References"
                        type="text"
                        name="legalReferences"
                        className={`pt-2 mt-2 ${
                            formik.touched.legalReferences && formik.errors.legalReferences ? 'error-input' : ''
                        }`}
                        value={formik.values.legalReferences}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.legalReferences && formik.errors.legalReferences && (
                        <div className="error mt-1">{formik.errors.legalReferences}</div>
                    )}

                    <textarea
                        placeholder="Description"
                        name="description"
                        className={`pt-2 mt-2 ${
                            formik.touched.description && formik.errors.description ? 'error-input' : ''
                        }`}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <div className="error mt-1">{formik.errors.description}</div>
                    )}

                    <input
                        placeholder="Evidence (Optional - URL)"
                        type="url"
                        name="evidence"
                        className={`pt-2 mt-2 ${formik.touched.evidence && formik.errors.evidence ? 'error-input' : ''}`}
                        value={formik.values.evidence}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.evidence && formik.errors.evidence && (
                        <div className="error mt-1">{formik.errors.evidence}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Add Crime
                    </button>
                    <br></br>
                    <br></br>
                    <button className="brownButton mt-3" onClick={() => navigate('/crimes')}>
                        Back to Crime List
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCrimeForm;
