import React from "react";

const Modal = ({ isOpen, onClose, title, content, actions }) => {
  const modalStyle = {
    display: isOpen ? "block" : "none",
  };

  return (
    <div className="container">
      {isOpen && (
        <div className="modal-overlay"></div>
      )}
      <div className="modal" style={modalStyle} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">{content}</div>
            <div className="modal-footer">{actions}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
