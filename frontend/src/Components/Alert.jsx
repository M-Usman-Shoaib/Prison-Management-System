import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) onClose(); // Calls onClose if provided
        }, 3000); // Adjust the duration as needed

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!show) return null;

    return (
        <div
            className={`alert alert-${type} alert-dismissible fade show custom-alert`}
            style={{
                borderRadius: '8px',
                fontWeight: '500',
                margin: '10px 0',
                padding: '15px 20px',
                fontSize: '16px',
                color: '#fff',  // White text
                backgroundColor: '#6c757d', // Grey background
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                transition: 'opacity 0.3s ease-in-out', // Smooth fade out
            }}
            role="alert"
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{message}</span>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                        setShow(false);
                        if (onClose) onClose();
                    }}
                    aria-label="Close"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff', // White close button
                        fontSize: '20px',
                        opacity: '0.7',
                        cursor: 'pointer',
                    }}
                ></button>
            </div>
        </div>
    );
};

export default Alert;
