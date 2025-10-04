import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaArrowUp, FaArrowDown, FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import './Card.css';

export const Card = ({ card, currencySymbol, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isReceita = card.type === 'receita';

  const handleEditClick = (e) => {
    e.stopPropagation(); 
    onEdit(card);
  };
  
  const handleDeleteClick = (e) => {
    e.stopPropagation(); 
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      onDelete(card.id);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card">
      <div className="card-content">
        <span className="card-title">{card.title}</span>
        
      </div>
      <div className={`card-amount ${isReceita ? 'receita' : 'despesa'}`}>
          {isReceita ? <FaArrowUp /> : <FaArrowDown />}
          <span>{currencySymbol} {card.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maxmumFractionDigits: 2})}</span>
        </div>
      <div className="card-actions">
        <button className="card-action-btn" onClick={handleEditClick}>
          <FaPencilAlt size={12} />
        </button>
        <button className="card-action-btn" onClick={handleDeleteClick}>
          <MdDelete size={14} />
        </button>
      </div>
    </div>
  );
};