// src/components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import './SettingsModal.css'; 

export const SettingsModal = ({ isOpen, onClose, onSave, currentSettings, onClearHistory }) => {
    
    const [settings, setSettings] = useState({ 
        currencySymbol: 'R$', 
        theme: 'light'
    });

    useEffect(() => {
        if (isOpen && currentSettings) {
            setSettings({
                currencySymbol: currentSettings.currencySymbol || 'R$',
                theme: currentSettings.theme || 'light'
            });
        }
    }, [currentSettings, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    }

    const handleSave = () => {
        onSave(settings);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configurações">
            <div className="form-group">
                <label>Símbolo da Moeda</label>
                <input
                    type="text"
                    name="currencySymbol"
                    value={settings.currencySymbol}
                    onChange={handleChange}
                    placeholder="Ex: R$, $, €"
                />
            </div>
            <div className="form-group">
                <label>Tema</label>
                <div className="theme-selector">
                    <label>
                        <input 
                            type="radio" 
                            name="theme" 
                            value="light" 
                            checked={settings.theme === 'light'} 
                            onChange={handleChange} 
                        />
                        <span className="theme-option">Claro</span>
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            name="theme" 
                            value="dark" 
                            checked={settings.theme === 'dark'} 
                            onChange={handleChange} 
                        />
                        <span className="theme-option">Escuro</span>
                    </label>
                </div>
            </div>
            <div className="form-actions">
                <button type="button" className="btn btn-danger" onClick={onClearHistory}>Limpar Histórico</button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Salvar</button>
            </div>
        </Modal>
    );
};