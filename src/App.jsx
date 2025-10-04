import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getInitialState } from './data/initialState';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
//import { CardFormModal } from './components/CardFormModal';
import { SettingsModal } from './components/SettingsModal';
import { IoMdAddCircleOutline } from "react-icons/io";
import './App.css';


const BoardFormModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    useEffect(() => { if (isOpen) { setTitle(''); } }, [isOpen]);
    const handleSubmit = (e) => { e.preventDefault(); if (!title.trim()) return; onSave(title); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Nova Categoria">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome da Categoria</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus/>
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Criar</button>
                </div>
            </form>
        </Modal>
    );
};

const CardFormModal = ({ isOpen, onClose, onSave, onDelete, card, currentMonth }) => {
    const [formData, setFormData] = useState({ title: '', amount: '', type: 'despesa', date: '' });
    useEffect(() => {
      if (isOpen) {
        if (card) {
          setFormData({
            ...card
          });
        } else {
          setFormData({
            title: '',
            amount: '',
            type: 'despesa',
            date: currentMonth + '-' + new Date().getDate().toString().padStart(2, '0')
          });
        }
      }
    }, [card, isOpen, currentMonth]);
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={card ? 'Editar Lançamento' : 'Novo Lançamento' }>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Valor</label>
              <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="despesa">Despesa</option>
                <option value="receita">Receita</option>
              </select>
            </div>
            <div className="form-group">
              <label>Data</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-actions">{card && <button type="button" className="btn btn-danger" onClick={()=>
                onDelete(card.id)}>Excluir</button>}
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar</button>
            </div>
          </form>
        </Modal>
    );
};


function App() {
  const [data, setData] = useLocalStorage('finanKanbanData', getInitialState());
  const [activeCard, setActiveCard] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  });

  useEffect(() => {
    const currentTheme = data.settings?.theme || 'light';
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(currentTheme);
  }, [data.settings?.theme]);

  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [boardIdForNewCard, setBoardIdForNewCard] = useState(null);

  const importFileRef = useRef(null);
  const currencySymbol = data.settings?.currencySymbol || 'R$';

  const cardsForMonth = useMemo(() => {
    return Object.values(data.cards).filter(card => card.date.startsWith(currentMonth));
  }, [data.cards, currentMonth]);

  const totals = useMemo(() => {
    const monthlyCards = Object.values(data.cards).filter(card => card.date.startsWith(currentMonth));
    const receitas = monthlyCards.filter(c => c.type === 'receita').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const despesas = monthlyCards.filter(c => c.type === 'despesa').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    return {
      receitas,
      despesas
    };
  }, [data.cards, currentMonth]);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8
    }
  }));

  const handleClearHistory = () => {
    const confirmation = window.confirm("Esta ação irá apagar todos os dados cadastrados. Deseja continuar ?");

    if (confirmation) {
      setData(getInitialState());
      setSettingsModalOpen(false);
    }
  };

  const handleAddBoard = (title) => {
    const newBoardId = uuidv4();
    setData(prev => ({
      ...prev,
      boards: {
        ...prev.boards,
        [newBoardId]: {
          id: newBoardId,
          title
        }
      },
      boardOrder: [...prev.boardOrder, newBoardId]
    }));
    setBoardModalOpen(false);
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

  const handleSaveCard = (cardDataFromForm) => {
    const isEditing = !!editingCard;
    const cardId = isEditing ? editingCard.id : uuidv4();
    const boardId = isEditing ? editingCard.boardId : boardIdForNewCard;

    setData(prev => {
      const newCardObject = {
        id: cardId,
        boardId: boardId,
        title: cardDataFromForm.title,
        amount: parseFloat(cardDataFromForm.amount) || 0,
        type: cardDataFromForm.type,
        date: cardDataFromForm.date,
      };

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: newCardObject,
        },
      };
    });
    closeCardModal();
  };

  const handleDeleteCard = (cardId) => {
    setData(prev => {
      const newCards = { ...prev.cards };
      delete newCards[cardId];
      return { ...prev, cards: newCards };
    });
    closeCardModal();
  };

  const handleSaveSettings = (newSettings) => {
    setData(prev => ({ 
      ...prev, 
      settings: newSettings
    }));
    setSettingsModalOpen(false);
  };

  const openCardModal = (boardId) => { setBoardIdForNewCard(boardId); setEditingCard(null); setCardModalOpen(true); };
  const openEditCardModal = (card) => { setEditingCard(card); setCardModalOpen(true); };
  const closeCardModal = () => { setEditingCard(null); setCardModalOpen(false); };
  const handleDragStart = (event) => { setActiveCard(data.cards[event.active.id] || null); };
  const handleDragEnd = (event) => {
    const {
      active,
      over
    } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    const activeCardData = data.cards[active.id];
    let overBoardId = null;
    if (data.boards[over.id]) {
      overBoardId = over.id;
    } else if (data.cards[over.id]) {
      overBoardId = data.cards[over.id].boardId;
    }
    if (overBoardId && activeCardData.boardId !== overBoardId) {
      setData(prev => ({
        ...prev,
        cards: {
          ...prev.cards,
          [active.id]: {
            ...activeCardData,
            boardId: overBoardId
          }
        }
      }));
    }
  };

  const handleExport = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meu-finan-kanban.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importFileRef.current.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file || !window.confirm("Isso substituirá todos os seus dados atuais. Deseja continuar?")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const d = JSON.parse(e.target.result);
        if (d.boards && d.cards && d.boardOrder) setData(d);
        else alert("Arquivo inválido.");
      } catch (error) {
        alert("Erro ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };
  
  const changeMonth = (offset) => {
    const d = new Date(`${currentMonth}-02T00:00:00`);
    d.setMonth(d.getMonth() + offset);
    setCurrentMonth(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'));
  };

  return (
    <div className="app">
      <input type="file" ref={importFileRef} style={{ display: 'none' }}
        onChange={handleImportFile} accept=".json" />
      <Header currentMonth={currentMonth} onPrevMonth={()=> changeMonth(-1)} onNextMonth={() => changeMonth(1)}
        totals={totals} currencySymbol={currencySymbol} onExport={handleExport} onImport={handleImportClick}
        onSettings={() => setSettingsModalOpen(true)} />
        <main className="kanban-container">
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}>
            {data.boardOrder.map(boardId => {
            const board = data.boards[boardId]; if (!board) return null;
            const cardsInBoard = cardsForMonth.filter(card => card.boardId === boardId);
            return (
            <Board key={board.id} board={board} cards={cardsInBoard} currencySymbol={currencySymbol}
              onAddCard={openCardModal} onDeleteBoard={handleDeleteBoard} onEditCard={openEditCardModal}
              onEditBoard={handleEditBoard} onDeleteCard={handleDeleteCard} />);
            })}
            <DragOverlay>
              {activeCard ? <Card card={activeCard} currencySymbol={currencySymbol} onEdit={()=> {}} onDelete={() => {}}
                /> : null}
            </DragOverlay>
          </DndContext>
          <div className="add-board-container"><button onClick={()=> setBoardModalOpen(true)}
              className="add-board-btn"><IoMdAddCircleOutline/> Adicionar Categoria</button></div>
        </main>
        <CardFormModal isOpen={isCardModalOpen} onClose={closeCardModal} onSave={handleSaveCard}
          onDelete={handleDeleteCard} card={editingCard} currentMonth={currentMonth} />
        <BoardFormModal isOpen={isBoardModalOpen} onClose={()=> setBoardModalOpen(false)} onSave={handleAddBoard} />
          <SettingsModal isOpen={isSettingsModalOpen} onClose={()=> setSettingsModalOpen(false)}
            onSave={handleSaveSettings}
            currentSettings={data.settings}
            onClearHistory={handleClearHistory}
            />
    </div>
  );
}

export default App;