import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaArrowUp, FaArrowDown, FaPencilAlt, FaGripVertical } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import './css/Card.css';

export const Card = ({ card, currencySymbol, onEdit, onDelete, onContextMenu }) => {
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
    onDelete(card.id, card.recurringTemplateId);
  };

  const formattedDate = new Date(`${card.date}T00:00:00`).toLocaleDateString('pt-BR');

  return (
    <div ref={setNodeRef} style={style} 
      {...attributes} 
      className="card"
      onContextMenu={(e) => onContextMenu(e, card.id)}
    >
      <div className="drag-handle" {...listeners}>
        <FaGripVertical />
      </div>

      <div className="card-content-wrapper">
        <div className="card-row">
          <span className="card-title">{card.title}</span>
          <div className={`card-amount ${isReceita ? 'receita' : 'despesa'}`}>
            {isReceita ? <FaArrowUp /> : <FaArrowDown />}
            <span>{currencySymbol} {card.amount.toLocaleString('pt-BR', {minimumFractionDigits: 2, maxmumFractionDigits: 2})}</span>
          </div>
        </div>
        <div className="card-row">
          <span className="card-date">{formattedDate}</span>
        </div>
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