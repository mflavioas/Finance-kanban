// src/components/CardFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';

export const CardFormModal = ({ isOpen, onClose, onSave, onDelete, card, currentMonth }) => {

// Define o estado inicial do formulário
const getInitialFormData = () => ({
    title: '',
    amount: '',
    type: 'despesa',
    date: '',
    isRecurring: false,
    dayOfMonth: new Date().getDate(),
});

const [formData, setFormData] = useState(getInitialFormData());

useEffect(() => {
    if (isOpen) {
        if (card) {
            // Se estiver editando um card, carrega seus dados
            // Por simplicidade, a edição de uma ocorrência não permite alterar a recorrência
            setFormData({
                ...getInitialFormData(),
                ...card
            });
        } else {
            // Se for um novo card, reseta o formulário
            const today = new Date();
            const defaultDate = `${currentMonth}-${String(today.getDate()).padStart(2, '0')}`;
            setFormData({
                ...getInitialFormData(),
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

// Não permite criar recorrências em cards que já são ocorrências de uma recorrência
const canSetRecurring = !card || !card.recurringTemplateId;

return (
<Modal isOpen={isOpen} onClose={onClose} title={card ? 'Editar Lançamento' : 'Novo Lançamento' }>
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Nome</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required /></div>
        <div className="form-group"><label>Valor</label><input type="number" step="0.01" name="amount"
                value={formData.amount} onChange={handleChange} required /></div>
        <div className="form-group"><label>Tipo</label><select name="type" value={formData.type}
                onChange={handleChange}>
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
            </select></div>

        {/* Se for um lançamento recorrente, mostra o dia. Se não, mostra a data completa */}
        {formData.isRecurring ? (
        <div className="form-group">
            <label>Dia do Vencimento</label>
            <input type="number" min="1" max="31" name="dayOfMonth" value={formData.dayOfMonth} onChange={handleChange}
                required />
        </div>
        ) : (
        <div className="form-group"><label>Data</label><input type="date" name="date" value={formData.date}
                onChange={handleChange} /></div>
        )}

        {/* Checkbox para definir se é recorrente. Só aparece se for um lançamento novo ou não-recorrente */}
        {canSetRecurring && (
        <div className="form-group-checkbox">
            <input type="checkbox" id="isRecurring" name="isRecurring" checked={formData.isRecurring}
                onChange={handleChange} />
            <label htmlFor="isRecurring">Lançamento Recorrente (Mensal)</label>
        </div>
        )}

        <div className="form-actions">{card && <button type="button" className="btn btn-danger" onClick={()=>
                onDelete(card.id, card.recurringTemplateId)}>Excluir</button>}<button type="button"
                className="btn btn-secondary" onClick={onClose}>Cancelar</button><button type="submit"
                className="btn btn-primary">Salvar</button></div>
    </form>
</Modal>
);
};