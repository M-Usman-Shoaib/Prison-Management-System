import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Alert from '../src/Components/Alert';

const EditCellForm = () => {
    const { id } = useParams(); // Get the cell ID from the URL
    const navigate = useNavigate(); // To navigate after updating
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [cellData, setCellData] = useState(null);
    const [prisons, setPrisons] = useState([]); // List of prisons for the dropdown
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
                }
            } catch (error) {
                setAlertMessage('Failed to fetch cell data.');
            }
        };

        fetchCellData();

        const fetchPrisons = async () => {
            try {
                const response = await axios.get('http://localhost:3000/prison/getAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.status === 200) {
                    setPrisons(response.data);
                } else {
                    setAlertMessage('Failed to fetch prisons.');
                }
            } catch (error) {
                setAlertMessage('Error fetching prisons. Please try again.');
            }
        };


        fetchPrisons();
    }, [id, token]);

    const formik = useFormik({
        initialValues: {
            cellID: cellData ? cellData.cellID : '',
            capacity: cellData ? cellData.capacity : '',
            securityLevel: cellData ? cellData.securityLevel : '',
            prison: cellData ? cellData.prison : '',
        },
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
                        formik.resetForm(); // Reset the form fields on success
                    }, 2000);
                }

                else {
                    setAlertMessage('Failed to update cell.');
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.msg) {
                    if (error.response.data.msg.includes('Cell ID already exists')) {
                        formik.setFieldError('cellID', 'Cell ID already exists.');
                        setAlertMessage(error.response.data.msg);
                    } else {
                        setAlertMessage(error.response.data.msg);
                    }
                    setShowSuccessAlert(true);
                    showSuccessAlert(true);
                } else {
                    setAlertMessage('An unexpected error occurred. Please try again.');
                }

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
            <div className="edit-cell-container text-center mt-5 pt-5">
                <form className="edit-cell-form" onSubmit={formik.handleSubmit}>
                    <h4 className="pb-3">Edit Cell</h4>

                    <input
                        placeholder="Cell ID"
                        type="text"
                        name="cellID"
                        className="pt-2"
                        value={formik.values.cellID}
                        onChange={formik.handleChange}
                    />

                    <input
                        placeholder="Capacity"
                        type="number"
                        name="capacity"
                        className="pt-2 mt-2"
                        value={formik.values.capacity}
                        onChange={formik.handleChange}
                    />

                    <select
                        name="securityLevel"
                        className="pt-2 mt-2"
                        value={formik.values.securityLevel}
                        onChange={formik.handleChange}
                    >
                        <option value="" disabled hidden>
                            Select Security Level
                        </option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Maximum">Maximum</option>
                    </select>

                    <select
                        name="prison"
                        className="pt-2 mt-2"
                        value={formik.values.prison}
                        onChange={formik.handleChange}
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

                    <button className="brownButton mt-2 mb-2" type="submit">
                        Update Cell
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditCellForm;
