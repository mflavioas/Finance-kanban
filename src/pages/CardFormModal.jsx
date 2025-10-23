import React, { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { getInitialCard } from '../data/initialCard';

export const CardFormModal = ({ isOpen, onClose, onSave, onDelete, card, currentMonth }) => {

    const [formData, setFormData] = useState(getInitialCard());

    useEffect(() => {
        if (isOpen) {
            if (card) {
                setFormData({
                    ...getInitialCard(),
                    ...card
                });
            } else {
                const today = new Date();
                const defaultDate = `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`;
                setFormData({
                    ...getInitialCard(),
                    date: defaultDate,
                    dayOfMonth: today.getDate()
                });
            }
        }
    }, [card, isOpen, currentMonth]);

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked
        } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    const canSetRecurring = !card || !card.recurringTemplateId;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={card ? 'Editar Lançamento' : 'Novo Lançamento' }>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Descrição</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Valor</label>
                    <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="type">Tipo</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="despesa">Despesa</option>
                        <option value="receita">Receita</option>
                    </select>
                </div>

                {formData.isRecurring ? (
                    <div className="form-group">
                        <label htmlFor="dayOfMonth">Dia do Vencimento</label>
                        <input type="number" min="1" max="31" name="dayOfMonth" value={formData.dayOfMonth} onChange={handleChange} required />
                    </div>
                ) : (
                    <div className="form-group">
                        <label htmlFor="date">Data</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} />
                    </div>
                )}

                {canSetRecurring && (
                    <div className="form-group-checkbox">
                        <input type="checkbox" id="isRecurring" name="isRecurring" checked={formData.isRecurring} onChange={handleChange} />
                        <label htmlFor="isRecurring">Lançamento Recorrente (Mensal)</label>
                    </div>
                )}

                <div className="form-actions">
                    {card && 
                    <button type="button" className="btn btn-danger" onClick={()=> onDelete(card.id, card.recurringTemplateId)}>Excluir</button>}
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};