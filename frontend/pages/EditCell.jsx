import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Alert from '../src/Components/Alert';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditCellForm = () => {
    const { id } = useParams(); // Get the cell ID from the URL
    const navigate = useNavigate(); // To navigate after updating
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [cellData, setCellData] = useState(null);
    const [prisons, setPrisons] = useState([]); // List of prisons for the dropdown
    const [inmates, setInmates] = useState([]); // List of inmates for the dropdown
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    useEffect(() => {
        // Fetch cell data using the ID
        const fetchCellData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/cell/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setCellData(response.data);
                } else {
                    setAlertMessage('Failed to fetch cell data.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to fetch cell data.');
                setShowErrorAlert(true);
            }
        };

        fetchCellData();

        // Fetch prisons for the dropdown
        const fetchPrisons = async () => {
            try {
                const response = await axios.get('http://localhost:3000/prison/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setPrisons(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch prisons:', error);
                setAlertMessage('Failed to fetch prisons.');
                setShowErrorAlert(true);
            }
        };

        fetchPrisons();

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
            cellID: cellData ? cellData.cellID : '',
            capacity: cellData ? cellData.capacity : '',
            securityLevel: cellData ? cellData.securityLevel : '',
            prison: cellData ? cellData.prison : '',
            inmates: cellData ? cellData.inmates : [],
        },
        validationSchema: Yup.object({
            cellID: Yup.string().required('Cell ID is required'),
            capacity: Yup.number().min(1, 'Capacity must be at least 1').required('Capacity is required'),
            securityLevel: Yup.string()
                .oneOf(['Low', 'Medium', 'High', 'Maximum'], 'Invalid security level')
                .required('Security level is required'),
            prison: Yup.string().required('Prison is required'),
        }),
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const response = await axios.put(`http://localhost:3000/cell/update/${id}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setAlertMessage('Cell updated successfully.');
                    setShowSuccessAlert(true);
                    setTimeout(() => {
                        navigate('/cells');
                    }, 2000);
                } else {
                    setAlertMessage('Failed to update cell.');
                    setShowErrorAlert(true);
                }
            } catch (error) {
                setAlertMessage('Failed to update cell. Please try again.');
                setShowErrorAlert(true);
            }
        },
    });

    if (!cellData) {
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
            <div className="edit-cell-container text-center mt-5 pt-5">
                <form className="edit-cell-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3">Edit Cell</h4>

                    <input
                        placeholder="Cell ID"
                        type="text"
                        name="cellID"
                        className={`pt-2 ${formik.touched.cellID && formik.errors.cellID ? 'error-input' : ''}`}
                        value={formik.values.cellID}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.cellID && formik.errors.cellID && (
                        <div className="error mt-1">{formik.errors.cellID}</div>
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
                            Select Security Level
                        </option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Maximum">Maximum</option>
                    </select>
                    {formik.touched.securityLevel && formik.errors.securityLevel && (
                        <div className="error mt-1">{formik.errors.securityLevel}</div>
                    )}

                    <select
                        name="prison"
                        className="pt-2 mt-2"
                        value={formik.values.prison}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Prison
                        </option>
                        {prisons.map((prison) => (
                            <option key={prison._id} value={prison._id}>
                                {prison.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.prison && formik.errors.prison && (
                        <div className="error mt-1">{formik.errors.prison}</div>
                    )}

                    <select
                        name="inmates"
                        className="pt-2 mt-2"
                        multiple
                        value={formik.values.inmates}
                        onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
                            formik.setFieldValue('inmates', selectedOptions);
                        }}
                    >
                        {inmates.map((inmate) => (
                            <option key={inmate._id} value={inmate._id}>
                                {inmate.name}
                            </option>
                        ))}
                    </select>

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Cell
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCellForm;
