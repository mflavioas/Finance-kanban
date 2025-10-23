import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card } from './Card';
import { MdDelete } from 'react-icons/md';
import { FaPencilAlt } from 'react-icons/fa';
import { IoMdAddCircleOutline } from "react-icons/io";
import './css/Board.css';

export const Board = ({
  board,
  cards,
  currencySymbol,
  onAddCard,
  onEditCard,
  onDeleteCard
}) => {
  const {setNodeRef} = useDroppable({id: board.id});
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const receitas = cards.filter(c => c.type === 'receita').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const despesas = cards.filter(c => c.type === 'despesa').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const boardTotal = receitas - despesas;

  const handleTitleSave = () => {
    if (newTitle.trim() && newTitle !== board.title) {
      handleEditBoard(board.id, newTitle.trim());
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing) {
      const input = document.getElementById(`board-title-input-${board.id}`);
      input ?.focus();
      input ?.select();
    }
  }, [isEditing, board.id]);

  const handleOpenContextMenu = (event, cardId) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      cardId: cardId,
    });
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Tem certeza que deseja excluir essa categoria, todos os registros incluidos nela para este mês ou demais serão excluídos?')) {
      setData(prev => {
        const newBoards = {
          ...prev.boards
        };
        delete newBoards[boardId];
        const newBoardOrder = prev.boardOrder.filter(id => id !== boardId);
        const newCards = {
          ...prev.cards
        };
        Object.values(newCards).forEach(card => {
          if (card.boardId === boardId) delete newCards[card.id];
        });
        return {
          ...prev,
          boards: newBoards,
          cards: newCards,
          boardOrder: newBoardOrder
        };
      });
    }
  };

  const handleEditBoard = (boardId, newTitle) => {
    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [boardId]: {
          ...prev.boards[boardId],
          title: newTitle
        }
      }
    }));
  };

  return(
    <div className = "board">
      <div className = "board-header"> {isEditing ? ( 
        <form onSubmit = {(e) => {e.preventDefault();handleTitleSave();}}>
          <input 
            id = {`board-title-input-${board.id}`}
            className = "board-title-input"
            value = {newTitle}
            onChange = {(e) => setNewTitle(e.target.value)}
            onBlur = {handleTitleSave}
          /> 
        </form>
        ) : (<h3 className = "board-title"> {board.title}</h3>)}

        <div className = "board-header-right" >
          <span className = "board-total" > {currencySymbol} 
            {boardTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maxmumFractionDigits: 2})} 
          </span>

          <div className = "board-actions" >
            <button onClick = {() => setIsEditing(true)}
              className = "action-btn" >
              <FaPencilAlt size = {12}/> 
            </button> 
            <button onClick = {() => handleDeleteBoard(board.id)}
              className = "action-btn" >
              <MdDelete size = {14}/> 
            </button> 
          </div> 
        </div> 
      </div>

      <SortableContext id = {board.id}
        items = {cards.map(c => c.id)}
        strategy = {verticalListSortingStrategy} >
        <div ref = {setNodeRef}
          className = "card-list" > 
          {
            cards.map(card =>
              <Card key = {card.id}
                card = {card}
                currencySymbol = {currencySymbol}
                onEdit = {onEditCard}
                onDelete = {onDeleteCard}
                onContextMenu = {handleOpenContextMenu}
              />
            )
          } 
        </div> 
      </SortableContext>

      <button onClick = {() => onAddCard(board.id)}
        className = "add-card-btn" > < IoMdAddCircleOutline / > Novo Lançamento 
      </button> 
    </div>
  );
};