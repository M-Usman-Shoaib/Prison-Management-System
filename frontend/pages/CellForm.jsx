import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddCellForm = () => {
    const [prisons, setPrisons] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchPrisons = async () => {
            try {
                const response = await axios.get('http://localhost:3000/prison/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const availablePrisons = response.data.filter(prison => 
                    !prison.cellBlocks || prison.cellBlocks.length < prison.capacity
                );

                setPrisons(availablePrisons);
            } catch (error) {
                console.error('Failed to fetch prisons:', error);
            }
        };

        fetchPrisons();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            cellID: '',
            capacity: '',
            securityLevel: '',
            prison: '',
        },
        validationSchema: Yup.object({
            cellID: Yup.string().required('Cell ID is required'),
            capacity: Yup.number()
                .typeError('Capacity must be a number')
                .required('Capacity is required'),
            securityLevel: Yup.string()
                .oneOf(['Low', 'Medium', 'High', 'Maximum'], 'Invalid security level')
                .required('Security level is required'),
            prison: Yup.string().required('Prison selection is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/cell/add', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAlertMessage('Cell added successfully.');
                setShowSuccessAlert(true);
                formik.resetForm();
            } catch (error) {
                if (error.response && error.response.data && error.response.data.msg) {
                    if (error.response.data.msg.includes('Cell ID already exists')) {
                        formik.setFieldError('cellID', 'Cell ID already exists.');
                    } else {
                        setAlertMessage(error.response.data.msg);
                    }
                } else {
                    setAlertMessage('Failed to update cell. Please try again.');
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
                    <h4 className="pb-3 brownColor">Add Cell</h4>

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

                    <select
                        name="prison"
                        className={`pt-2 mt-2 ${formik.touched.prison && formik.errors.prison ? 'error-input' : ''}`}
                        value={formik.values.prison}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Prison
                        </option>
                        {prisons.map((prison) => (
                            <option key={prison._id} value={prison._id}>
                                Prison ID: {prison.prisonID} (Available Capacity: {prison.capacity - (prison.cellBlocks?.length || 0)})
                            </option>
                        ))}
                    </select>
                    {formik.touched.prison && formik.errors.prison && (
                        <div className="error mt-1">{formik.errors.prison}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit" disabled={prisons.length === 0}>
                        {prisons.length > 0 ? 'Add Cell' : 'No Prisons Available'}
                    </button>
                    <br />
                    <br />
                    <button className="brownButton mt-3" onClick={() => navigate('/cells')}>
                        Back to Cell List
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCellForm;
