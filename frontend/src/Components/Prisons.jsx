import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import { useSelector } from "react-redux";
import { FaPen, FaPlus } from 'react-icons/fa';
import Modal from "./Modals/Modal";

const Prisons = () => {
  const [prisons, setPrisons] = useState([]);
  const [newPrison, setNewPrison] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const [selectedPrisonForEdit, setSelectedPrisonForEdit] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const prisonsPerPage = 5;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchPrisons();
  }, [currentPage]);

  const fetchPrisons = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/prison/getAll', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrisons(response.data);
      setTotalPages(Math.ceil(response.data.length / prisonsPerPage));
    } catch (error) {
      setAlertMessage('Error fetching prisons');
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrison = async () => {
    navigate(`/addPrison`);
  };

  const handleEditPrison = (id) => {
    navigate(`/editPrison/${id}`);
  };

  const handleUpdatePrison = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/prison/update/${selectedPrisonForEdit._id}`,
        newPrison,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPrisons = prisons.map((prison) =>
        prison._id === selectedPrisonForEdit._id ? response.data.prison : prison
      );

      setPrisons(updatedPrisons);
      setNewPrison({
        prisonID: "",
        location: "",
        capacity: "",
      });
      setEditModalOpen(false);
      setSelectedPrisonForEdit(null);
    } catch (error) {
      setAlertMessage('Error updating prison');
      setShowErrorAlert(true);
    }
  };

  const handleDeletePrison = async () => {
    try {
      if (!selectedPrisonForEdit) {
        setAlertMessage('No prison selected for deletion');
        setShowErrorAlert(true);
        return;
      }

      await axios.delete(
        `http://localhost:3000/prison/delete/${selectedPrisonForEdit._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedPrisons = prisons.filter(
        (prison) => prison._id !== selectedPrisonForEdit._id
      );

      setPrisons(updatedPrisons);
      setEditModalOpen(false);
      setSelectedPrisonForEdit(null);
    } catch (error) {
      setAlertMessage('Error deleting prison');
      setShowErrorAlert(true);
    }
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) =>
      direction === 'next' ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  const currentData = prisons.slice(
    (currentPage - 1) * prisonsPerPage,
    currentPage * prisonsPerPage
  );

  return (
    <div className="container" style={{ marginTop: "-6px" }}>
      {showErrorAlert && (
        <Alert type="danger" message={alertMessage} onClose={() => setShowErrorAlert(false)} />
      )}
      <div className="row">
        <div className="col col-9">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Prisons</h5>
                <div className="d-flex">
                  <FaPlus
                    className="me-2"
                    size={20}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "white",
                      padding: "4px",
                    }}
                    onClick={() => handleAddPrison()}
                  />
                </div>
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : prisons.length === 0 ? (
                <p className="card-text mt-4">Add Prisons</p>
              ) : (
                <div className="mt-4">
                  {currentData.map((prison) => (
                    <div key={prison._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mt-3">ID: {prison.prisonID}</h6>
                        <FaPen
                          size={22}
                          style={{
                            cursor: "pointer",
                            backgroundColor: "white",
                            padding: "4px",
                          }}
                          onClick={() => handleEditPrison(prison._id)}
                        />
                      </div>
                      <p>Location: {prison.location}</p>
                      <p>Capacity: {prison.capacity}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange('prev')}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange('next')}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-3"></div>
      </div>

      {/* Add Prison Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Prison"
        content={
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Prison Name"
                value={newPrison.name}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="location"
                placeholder="Location"
                value={newPrison.location}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                id="capacity"
                placeholder="Capacity"
                value={newPrison.capacity}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    capacity: e.target.value,
                  })
                }
              />
            </div>
          </form>
        }
        footer={
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddPrison}
          >
            Add
          </button>
        }
      />

      {/* Edit Prison Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Prison"
        content={
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="name"
                value={newPrison.name}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="location"
                value={newPrison.location}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    location: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                className="form-control"
                id="capacity"
                value={newPrison.capacity}
                onChange={(e) =>
                  setNewPrison({
                    ...newPrison,
                    capacity: e.target.value,
                  })
                }
              />
            </div>
          </form>
        }
        footer={
          <div>
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={handleDeletePrison}
            >
              Delete
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdatePrison}
            >
              Update
            </button>
          </div>
        }
      />
    </div>
  );
};

export default Prisons;
