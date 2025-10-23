// src/App.jsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getInitialState } from './data/initialState';
import { Header } from './components/Header';
import { Board } from './pages/Board';
import { Card } from './pages/Card';
import { CardFormModal } from './pages/CardFormModal';
import { BoardFormModal } from './pages/BoardFormModal';
import { SettingsModal } from './pages/SettingsModal';
import { IoMdAddCircleOutline } from "react-icons/io";
import { ContextMenu } from './pages/ContextMenu';
import { ConfirmationModal } from './components/ConfirmationModal'; // 1. IMPORTE O NOVO COMPONENTE
import './App.css';

function App() {
  const [data, setData] = useLocalStorage('finanKanbanData', getInitialState());
  const [activeCard, setActiveCard] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    return today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, cardId: null });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    cardId: null,
    recurringTemplateId: null,
  });

  useEffect(() => {
    const currentTheme = data.settings?.theme || 'light';
    document.body.className = currentTheme;
  }, [data.settings?.theme]);

  useEffect(() => {
    const templates = Object.values(data.recurringTemplates || {});
    const cards = Object.values(data.cards || {});
    let newCardsGenerated = false;
    const updatedCards = {
      ...data.cards
    };

    templates.forEach(template => {
      const canGenerate = !template.startDate || currentMonth >= template.startDate;
      if (canGenerate) {
        const instanceDate = `${currentMonth}-${String(template.dayOfMonth).padStart(2, '0')}`;
        const instanceExists = cards.some(card => card.recurringTemplateId === template.id && card.date.startsWith(currentMonth));

        const isException = (template.exceptions || []).includes(instanceDate);

        if (!instanceExists && !isException) {
          const newCardId = uuidv4();
          updatedCards[newCardId] = {
            id: newCardId,
            boardId: template.boardId,
            title: template.title,
            amount: template.amount,
            type: template.type,
            date: instanceDate,
            recurringTemplateId: template.id,
          };
          newCardsGenerated = true;
        }
      }
    });

    if (newCardsGenerated) {
      setData(prev => ({
        ...prev,
        cards: updatedCards
      }));
    }
  }, [currentMonth, data.recurringTemplates, data.cards, setData]);

  const [isCardModalOpen, setCardModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [boardIdForNewCard, setBoardIdForNewCard] = useState(null);

  const importFileRef = useRef(null);
  const currencySymbol = data.settings?.currencySymbol || 'R$';

  const cardsForMonth = useMemo(() => {
    // CORREÇÃO: Adicionada uma verificação de segurança para garantir que 'card.date' exista.
    return Object.values(data.cards || {}).filter(card => card && card.date && card.date.startsWith(currentMonth));
  }, [data.cards, currentMonth]);

  const totals = useMemo(() => {
    const receitas = cardsForMonth.filter(c => c.type === 'receita').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    const despesas = cardsForMonth.filter(c => c.type === 'despesa').reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
    return { receitas, despesas };
  }, [cardsForMonth]); // A dependência aqui está correta

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleCloseContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

  const handleMoveCardFromMenu = (cardId, targetBoardId) => {
    setData(prev => ({ ...prev, cards: { ...prev.cards, [cardId]: { ...prev.cards[cardId], boardId: targetBoardId } } }));
    handleCloseContextMenu();
  };

  const handleClearHistory = () => {
    if (window.confirm("Esta ação irá apagar todos os dados cadastrados. Deseja continuar ?")) {
      setData(getInitialState());
      setSettingsModalOpen(false);
    }
  };

  const handleAddBoard = (title) => {
    const newBoardId = uuidv4();
    setData(prev => ({ ...prev, boards: { ...prev.boards, [newBoardId]: { id: newBoardId, title } }, boardOrder: [...prev.boardOrder, newBoardId] }));
    setBoardModalOpen(false);
  };
  
  // CORREÇÃO: Lógica de salvar o card foi refatorada e corrigida
  const handleSaveCard = (formData) => {
    const isEditing = !!editingCard;

    if (formData.isRecurring) {
      const templateId = isEditing ? editingCard.id : uuidv4();
      const newTemplate = {
        id: templateId,
        boardId: isEditing ? editingCard.boardId : boardIdForNewCard,
        title: formData.title,
        amount: parseFloat(formData.amount) || 0,
        type: formData.type,
        dayOfMonth: parseInt(formData.dayOfMonth, 10),
        exceptions: isEditing ? (editingCard.exceptions || []) : [],
        startDate: isEditing ? editingCard.startDate : currentMonth,
      };

      setData(prev => {
        // Se um card normal foi transformado em recorrente, remove o card antigo
        const newCards = {
          ...prev.cards
        };
        if (isEditing && !editingCard.isRecurring) {
          delete newCards[editingCard.id];
        }
        const currentInstance = Object.values(newCards).find(
          c => c.recurringTemplateId === templateId && c.date.startsWith(currentMonth)
        );

        if (currentInstance) {
          const instanceDate = `${currentMonth}-${String(newTemplate.dayOfMonth).padStart(2, '0')}`;
          // Atualiza a instância com os novos dados do template
          newCards[currentInstance.id] = {
            ...currentInstance,
            title: newTemplate.title,
            amount: newTemplate.amount,
            type: newTemplate.type,
            date: instanceDate,
          };
        }
        return {
          ...prev,
          cards: newCards,
          recurringTemplates: {
            ...prev.recurringTemplates,
            [templateId]: newTemplate
          },
        };
      });
    } else { // É um lançamento normal
      const cardId = isEditing ? editingCard.id : uuidv4();
      const boardId = isEditing ? editingCard.boardId : boardIdForNewCard;
      const newCardObject = {
        id: cardId,
        boardId,
        title: formData.title,
        amount: parseFloat(formData.amount) || 0,
        type: formData.type,
        date: formData.date,
      };

      setData(prev => {
        // Se um item recorrente foi transformado em normal, remove o template antigo
        const newTemplates = {
          ...prev.recurringTemplates
        };
        if (isEditing && editingCard.isRecurring) {
          delete newTemplates[editingCard.id];
        }
        return {
          ...prev,
          cards: {
            ...prev.cards,
            [cardId]: newCardObject
          },
          recurringTemplates: newTemplates,
        };
      });
    }
    closeCardModal();
  };
  
  // CORREÇÃO: Adicionada confirmação para deletar cards normais
  const handleDeleteCard = (cardId, recurringTemplateId) => {
    if (recurringTemplateId) {
      setDeleteConfirmation({
        isOpen: true,
        cardId: cardId,
        recurringTemplateId: recurringTemplateId,
      });
    } else { 
      // Se for um item normal, a lógica de confirmação e exclusão continua a mesma.
      if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
        setData(prev => {
          const newCards = { ...prev.cards };
          delete newCards[cardId];
          return { ...prev, cards: newCards };
        });
      }
    }
    // O closeCardModal() foi removido daqui para não fechar o modal de edição antes da confirmação.
  };

  const handleConfirmDeleteCurrentOnly = () => {
    const { cardId, recurringTemplateId } = deleteConfirmation;
    const template = data.recurringTemplates[recurringTemplateId];
    const card = data.cards[cardId];

    if (template && card) {
      setData(prev => {
        const updatedTemplate = { ...template, exceptions: [...(template.exceptions || []), card.date] };
        const newCards = { ...prev.cards };
        delete newCards[cardId];
        return { 
          ...prev, 
          cards: newCards, 
          recurringTemplates: { ...prev.recurringTemplates, [recurringTemplateId]: updatedTemplate }
        };
      });
    }
    // Fecha ambos os modais (confirmação e edição)
    setDeleteConfirmation({ isOpen: false, cardId: null, recurringTemplateId: null });
    closeCardModal();
  };

  // Função para "Sim, excluir futuros" (neste caso, a regra toda)
  const handleConfirmDeleteAll = () => {
    const { recurringTemplateId } = deleteConfirmation;
    const template = data.recurringTemplates[recurringTemplateId];

    if (template) {
      if (window.confirm(`Isso irá apagar a regra de recorrência "${template.title}" permanentemente. Deseja continuar?`)) {
        setData(prev => {
          const newTemplates = { ...prev.recurringTemplates };
          delete newTemplates[recurringTemplateId];
          const newCards = { ...prev.cards };
          Object.values(newCards).forEach(c => { if (c.recurringTemplateId === recurringTemplateId && c.dayOfMonth >= template.dayOfMonth) delete newCards[c.id]; });
          return { ...prev, cards: newCards, recurringTemplates: newTemplates };
        });
      }
    }
    // Fecha ambos os modais
    setDeleteConfirmation({ isOpen: false, cardId: null, recurringTemplateId: null });
    closeCardModal();
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, cardId: null, recurringTemplateId: null });
  };

  const openCardModal = (boardId) => { setBoardIdForNewCard(boardId); setEditingCard(null); setCardModalOpen(true); };
  const openEditCardModal = (card) => {
    if (card.recurringTemplateId) {
      const template = data.recurringTemplates[card.recurringTemplateId];
      if (template) setEditingCard({ ...template, isRecurring: true });
    } else {
      setEditingCard(card);
    }
    setCardModalOpen(true);
  };
  const closeCardModal = () => { setEditingCard(null); setCardModalOpen(false); };
  const handleDragStart = (event) => { setActiveCard(data.cards[event.active.id] || null); };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    const activeCardData = data.cards[active.id];
    let overBoardId = null;
    if (data.boards[over.id]) overBoardId = over.id;
    else if (data.cards[over.id]) overBoardId = data.cards[over.id].boardId;
    if (overBoardId && activeCardData.boardId !== overBoardId) {
      setData(prev => ({ ...prev, cards: { ...prev.cards, [active.id]: { ...activeCardData, boardId: overBoardId } } }));
    }
  };
  const handleSaveSettings = (newSettings) => { setData(prev => ({ ...prev, settings: newSettings })); setSettingsModalOpen(false); };
  const handleExport = () => { const jsonData = JSON.stringify(data, null, 2); const blob = new Blob([jsonData], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'meu-finan-kanban.json'; a.click(); URL.revokeObjectURL(url); };
  const handleImportClick = () => { importFileRef.current.click(); };
  const handleImportFile = (event) => { const file = event.target.files[0]; if (!file || !window.confirm("Substituir dados atuais?")) return; const reader = new FileReader(); reader.onload = (e) => { try { const d = JSON.parse(e.target.result); if (d.boards && d.cards && d.boardOrder) setData(d); else alert("Arquivo inválido."); } catch (error) { alert("Erro ao ler o arquivo."); } }; reader.readAsText(file); event.target.value = null; };
  const changeMonth = (offset) => { const d = new Date(`${currentMonth}-02T00:00:00`); d.setMonth(d.getMonth() + offset); setCurrentMonth(d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')); };

  const currentCardForMenu = data.cards ? data.cards[contextMenu.cardId] : null;

  return (
    <div className="app">
      <input type="file" ref={importFileRef} style={{ display: 'none' }} onChange={handleImportFile} accept=".json" />
      <Header currentMonth={currentMonth} onPrevMonth={() => changeMonth(-1)} onNextMonth={() => changeMonth(1)} totals={totals} currencySymbol={currencySymbol} onExport={handleExport} onImport={handleImportClick} onSettings={() => setSettingsModalOpen(true)} />
      <main className="kanban-container">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {(data.boardOrder || []).map(boardId => {
            const board = data.boards[boardId]; if (!board) return null;
            const cardsInBoard = cardsForMonth.filter(card => card.boardId === boardId);
            return (
              <Board
                key={board.id} board={board} cards={cardsInBoard} currencySymbol={currencySymbol}
                onAddCard={openCardModal} onEditCard={openEditCardModal} onDeleteCard={handleDeleteCard}
                // CORREÇÃO: Props que estavam faltando foram adicionadas novamente
                //onDeleteBoard={handleDeleteBoard} onEditBoard={handleEditBoard} onContextMenu={handleOpenContextMenu}
              />);
          })}
          <DragOverlay>{activeCard ? <Card card={activeCard} currencySymbol={currencySymbol} onEdit={() => {}} onDelete={() => {}} /> : null}</DragOverlay>
        </DndContext>
        <div className="add-board-container">
          <button onClick={() => setBoardModalOpen(true)} className="add-board-btn">
            <IoMdAddCircleOutline /> Adicionar Categoria
          </button>
        </div>
      </main>
      <CardFormModal isOpen={isCardModalOpen} onClose={closeCardModal} onSave={handleSaveCard} onDelete={handleDeleteCard} card={editingCard} currentMonth={currentMonth} />
      <BoardFormModal isOpen={isBoardModalOpen} onClose={() => setBoardModalOpen(false)} onSave={handleAddBoard} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} onSave={handleSaveSettings} currentSettings={data.settings} onClearHistory={handleClearHistory} />
      <ContextMenu visible={contextMenu.visible} x={contextMenu.x} y={contextMenu.y} cardId={contextMenu.cardId} boards={Object.values(data.boards || {})} currentBoardId={currentCardForMenu?.boardId} onClose={handleCloseContextMenu} onMove={handleMoveCardFromMenu} />
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title="Excluir Lançamento Recorrente"
        message="Deseja excluir apenas este lançamento ou a regra de recorrência inteira (este e todos os futuros)?"
        onConfirmCurrent={handleConfirmDeleteCurrentOnly}
        onConfirmAll={handleConfirmDeleteAll}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default App;