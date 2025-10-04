import React, { useEffect } from 'react';
import './ContextMenu.css';

export const ContextMenu = ({ visible, x, y, cardId, boards, currentBoardId, onClose, onMove }) => {
  useEffect(() => {
    if (visible) {
      const handleClickOutside = () => onClose();
      window.addEventListener('click', handleClickOutside);
      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }
  }, [visible, onClose]);
  
  if (!visible) {
    return null;
  }
  
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="context-menu" 
      style={{ top: `${y}px`, left: `${x}px` }}
      onClick={handleMenuClick}
    >
      <div className="context-menu-header">Mover para:</div>
      <ul className="context-menu-list">
        {boards.map(board => (
          board.id !== currentBoardId && (
            <li key={board.id} className="context-menu-item" onClick={() => onMove(cardId, board.id)}>
              {board.title}
            </li>
          )
        ))}
      </ul>
    </div>
  );
};