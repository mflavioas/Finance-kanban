import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';

export const BoardFormModal = ({ isOpen, onClose, onSave }) => {

    const [title, setTitle] = useState('');
    useEffect(() => {
        if (isOpen) {
            setTitle('');
        }
    }, [isOpen]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave(title);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nome">Nome da Categoria</label>
                    <input name="nome" type="text" value={title} onChange={(e)=> setTitle(e.target.value)} required
                    autoFocus/>
                </div>
                <div className="form-actions">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Criar</button>
                </div>
            </form>
        </Modal>
    );
};