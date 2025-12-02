import React from 'react';
import { Wand2, Sun, Moon } from './Icons';

/** 
 * Propriedades para o componente Header.
 */
interface HeaderProps {
  isDarkMode: boolean; // Indica se o modo escuro está ativo.
  toggleTheme: () => void; // Função para alternar o tema entre claro e escuro.
}

/**
 * Componente Header.
 * 
 * Renderiza o cabeçalho da aplicação, que inclui o título,
 * o logo e um botão para alternar o tema (claro/escuro).
 *
 * @param {HeaderProps} props As propriedades para o componente.
 * @returns {React.FC} O componente de cabeçalho renderizado.
 */
const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Wand2 className="w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl text-slate-800 dark:text-white">MockupGen AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
            Desenvolvido com Google Gemini 2.5
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label="Alternar tema"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
