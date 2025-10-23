// src/components/ConfirmationModal.jsx
import React from 'react';
import { Modal } from './Modal';
import './css/ConfirmationModal.css';

export const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  onConfirmAll, // Botão "Sim"
  onConfirmCurrent, // Botão "Somente Atual"
  onCancel // Botão "Cancelar"
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="confirmation-message">{message}</p>
      <div className="confirmation-actions">
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={onConfirmCurrent}>
          Somente este
        </button>
        <button className="btn btn-danger" onClick={onConfirmAll}>
          Sim, excluir futuros
        </button>
      </div>
    </Modal>
  );
};