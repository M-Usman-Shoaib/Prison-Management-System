import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Alert from '../src/Components/Alert';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddInmateForm = () => {
    const [prisonCells, setPrisonCells] = useState([]);
    const [crimes, setCrimes] = useState([]);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        // Check if token is missing and navigate to /login
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    // Fetch available cell blocks (those with remaining capacity)
    useEffect(() => {
        const fetchCells = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cell/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const availableCells = response.data.filter(cell => 
                    cell.capacity > (cell.occupants || 0) // Ensure capacity is not full
                );
                setPrisonCells(availableCells);
            } catch (error) {
                console.error('Failed to fetch cells:', error);
            }
        };

        // Fetch crimes
        const fetchCrimes = async () => {
            try {
                const response = await axios.get('http://localhost:3000/crime/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCrimes(response.data);
            } catch (error) {
                console.error('Failed to fetch crimes:', error);
            }
        };

        fetchCells();
        fetchCrimes();
    }, [token]);

    const formik = useFormik({
        initialValues: {
            inmateId: '',
            fullName: '',
            dateOfBirth: '',
            crimeCommitted: '',
            cellBlock: '',
        },
        validationSchema: Yup.object({
            inmateId: Yup.string().required('Inmate ID is required'),
            fullName: Yup.string().required('Full name is required'),
            dateOfBirth: Yup.date().required('Date of birth is required'),
            crimeCommitted: Yup.string().required('Crime is required'),
            cellBlock: Yup.string().required('Cell block selection is required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('http://localhost:3000/inmate/add', values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAlertMessage('Inmate added successfully.');
                setShowSuccessAlert(true);
                formik.resetForm();
            } catch (error) {
                if (error.response && error.response.data) {
                    setAlertMessage('Failed to add inmate. ' + error.response.data.msg);
                } else {
                    setAlertMessage('Failed to add inmate. Please try again.');
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
                    <h4 className="pb-3 brownColor">Add Inmate</h4>

                    <input
                        placeholder="Inmate ID"
                        type="text"
                        name="inmateId"
                        className={`pt-2 ${formik.touched.inmateId && formik.errors.inmateId ? 'error-input' : ''}`}
                        value={formik.values.inmateId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.inmateId && formik.errors.inmateId && (
                        <div className="error mt-1">{formik.errors.inmateId}</div>
                    )}

                    <input
                        placeholder="Full Name"
                        type="text"
                        name="fullName"
                        className={`pt-2 mt-2 ${formik.touched.fullName && formik.errors.fullName ? 'error-input' : ''}`}
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.fullName && formik.errors.fullName && (
                        <div className="error mt-1">{formik.errors.fullName}</div>
                    )}

                    <input
                        placeholder="Date of Birth"
                        type="date"
                        name="dateOfBirth"
                        className={`pt-2 mt-2 ${formik.touched.dateOfBirth && formik.errors.dateOfBirth ? 'error-input' : ''}`}
                        value={formik.values.dateOfBirth}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                        <div className="error mt-1">{formik.errors.dateOfBirth}</div>
                    )}

                    <select
                        name="crimeCommitted"
                        className={`pt-2 mt-2 ${formik.touched.crimeCommitted && formik.errors.crimeCommitted ? 'error-input' : ''}`}
                        value={formik.values.crimeCommitted}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Crime
                        </option>
                        {crimes.map((crime) => (
                            <option key={crime._id} value={crime._id}>
                                {crime.description}
                            </option>
                        ))}
                    </select>
                    {formik.touched.crimeCommitted && formik.errors.crimeCommitted && (
                        <div className="error mt-1">{formik.errors.crimeCommitted}</div>
                    )}

                    <select
                        name="cellBlock"
                        className={`pt-2 mt-2 ${formik.touched.cellBlock && formik.errors.cellBlock ? 'error-input' : ''}`}
                        value={formik.values.cellBlock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="" disabled hidden>
                            Select Cell Block
                        </option>
                        {prisonCells.map((cell) => (
                            <option key={cell._id} value={cell._id}>
                                {cell.cellID} (Available Capacity: {cell.capacity - (cell.occupants || 0)})
                            </option>
                        ))}
                    </select>
                    {formik.touched.cellBlock && formik.errors.cellBlock && (
                        <div className="error mt-1">{formik.errors.cellBlock}</div>
                    )}

                    <button className="brownButton mt-2 mb-2" type="submit" disabled={prisonCells.length === 0 || crimes.length === 0}>
                        {prisonCells.length > 0 && crimes.length > 0 ? 'Add Inmate' : 'No Cells or Crimes Available'}
                    </button>
                    <br />
                    <br />
                    <button className="brownButton mt-3" onClick={() => navigate('/inmates')}>
                        Back to Inmate List
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddInmateForm;
