import React from 'react';
import { IoMdSettings } from "react-icons/io";
import { ImUpload } from "react-icons/im";
import { FaFileExport } from "react-icons/fa";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import './css/Header.css';
import logoImage from '/logo.png';

export const Header = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  totals,
  currencySymbol,
  onExport,
  onImport,
  onSettings
}) => {
    const monthDate = new Date(`${currentMonth}-02`);
    const monthName = monthDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });

    const saldo = totals.receitas - totals.despesas;
    const saldoColor = saldo >= 0 ? 'var(--color-saldo-pos)' : 'var(--color-saldo-neg)';
    
    return (
        <header className="app-header">
            <div className="header-top">
                <div>
                    <img src={logoImage} alt="Meu Financeiro Kanban" className="logo" />
                    <h2>SeiQueDevo!</h2>
                    <p>Devo, não nego.<br/>
                    Pago porque agora eu sei.</p>
                </div>
                <div className="month-selector">
                    <button onClick={onPrevMonth}><MdNavigateBefore size={32}/></button>
                    <h2>{monthName}</h2>
                    <button onClick={onNextMonth}><MdNavigateNext size={32}/></button>
                </div>
                <div className="header-actions">
                    <button onClick={onExport}><FaFileExport /> Exportar</button>
                    <button onClick={onImport}><ImUpload /> Importar</button>
                    <button onClick={onSettings}><IoMdSettings size={18} /></button>
                </div>
            </div>
            <div className="header-summary">
                <div className="summary-item">
                    <span>Receitas</span>
                    <strong style={{color: 'var(--color-receita)'}}>{currencySymbol} {totals.receitas.toLocaleString('pt-BR', {minimumFractionDigits: 2, maxmumFractionDigits: 2})}</strong>
                </div>
                <div className="summary-item">
                    <span>Despesas</span>
                    <strong style={{color: 'var(--color-despesa)'}}>{currencySymbol} {totals.despesas.toLocaleString('pt-BR', {minimumFractionDigits: 2, maxmumFractionDigits: 2})}</strong>
                </div>
                <div className="summary-item">
                    <span>Saldo</span>
                    <strong style={{color: saldoColor}}>{currencySymbol} {saldo.toLocaleString('pt-BR', {minimumFractionDigits: 2, maxmumFractionDigits: 2})}</strong>
                </div>


                
            </div>
        </header>
    );
};
