import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditCrimeForm = () => {
    const { id } = useParams(); // Get the crime ID from URL
    const navigate = useNavigate(); // To navigate after updating
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [crimeData, setCrimeData] = useState(null);
    const [inmates, setInmates] = useState([]); // List of inmates for the dropdown
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        // Fetch the crime data using the ID
        const fetchCrimeData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/crime/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

        // Fetch list of inmates for the connectedInmates field
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
            nature: crimeData ? crimeData.nature : '',
            severity: crimeData ? crimeData.severity : '',
            legalReferences: crimeData ? crimeData.legalReferences : '',
            description: crimeData ? crimeData.description : '',
            evidence: crimeData ? crimeData.evidence : '',
            connectedInmates: crimeData ? crimeData.connectedInmates : [],
        },
        validationSchema: Yup.object({
            nature: Yup.string().required('Nature of crime is required'),
            severity: Yup.string()
                .oneOf(['Low', 'Medium', 'High', 'Severe'], 'Invalid severity level')
                .required('Severity is required'),
            legalReferences: Yup.string().required('Legal references are required'),
            description: Yup.string().required('Description is required'),
            evidence: Yup.string().url('Evidence must be a valid URL'),
        }),
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:3000/crime/update/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAlertMessage('Crime updated successfully.');
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        navigate('/crimes');
                    }, 2000);
                } else {
                    setAlertMessage('Failed to update crime.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to update crime. Please try again.');
                setShowErrorAlert(true);
            }
        },
    });

    if (!crimeData) {
        return <div>Loading...</div>; // Loading state while fetching crime data
    }

    return (
        <div>
            {showSuccessAlert && (
                <Alert type="success" message={alertMessage} onClose={() => setShowSuccessAlert(false)} />
            )}
            {showErrorAlert && (
                <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
            )}
            <div className="edit-crime-container text-center mt-5 pt-5">
                <form className="edit-crime-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3">Edit Crime</h4>

                    <input
                        placeholder="Nature of Crime"
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
                            Select Severity
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
                        className={`pt-2 mt-2 ${formik.touched.legalReferences && formik.errors.legalReferences ? 'error-input' : ''}`}
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
                        className={`pt-2 mt-2 ${formik.touched.description && formik.errors.description ? 'error-input' : ''}`}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.description && formik.errors.description && (
                        <div className="error mt-1">{formik.errors.description}</div>
                    )}

                    <input
                        placeholder="Evidence URL"
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

                    <select
                        name="connectedInmates"
                        className="pt-2 mt-2"
                        multiple
                        value={formik.values.connectedInmates}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                            formik.setFieldValue('connectedInmates', selectedOptions);
                        }}
                    >
                        {inmates.map((inmate) => (
                            <option key={inmate._id} value={inmate._id}>
                                {inmate.name}
                            </option>
                        ))}
                    </select>

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Crime
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCrimeForm;
