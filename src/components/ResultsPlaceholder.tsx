import React from 'react';
import { ImageIcon } from './Icons';

/**
 * Componente ResultsPlaceholder.
 *
 * Renderiza um placeholder visual para a área de resultados.
 * É exibido quando o usuário ainda não gerou nenhum mockup,
 * indicando que o espaço está aguardando a configuração e geração.
 *
 * @returns {React.FC} O componente de placeholder renderizado.
 */
const ResultsPlaceholder: React.FC = () => {
  return (
    <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
      <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
      <p>Aguardando configuração...</p>
    </div>
  );
};

export default ResultsPlaceholder;