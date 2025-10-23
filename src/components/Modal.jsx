// src/components/Modal.jsx
import React from 'react';
import { IoMdClose } from 'react-icons/io';
import './css/Modal.css';

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="close-button">
            <IoMdClose size={24} />
          </button>
        </div>
        <div className="modal-body">
            {children}
        </div>
      </div>
    </div>
  );
};