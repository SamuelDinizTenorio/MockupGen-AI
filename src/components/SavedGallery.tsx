import React from 'react';
import { SavedMockup } from '../types';
import { Bookmark } from './Icons';
import SavedCard from './SavedCard';

/**
 * Propriedades para o componente SavedGallery.
 */
interface SavedGalleryProps {
  savedItems: SavedMockup[]; // A lista de mockups salvos a serem exibidos.
  maxSavedCount: number; // O número máximo de itens que podem ser salvos.
  onDelete: (id: string) => void; // Função para excluir um item da galeria.
  onZoom: (url: string) => void; // Função para abrir uma imagem no modal de zoom.
}

/**
 * Componente SavedGallery.
 *
 * Renderiza a seção "Minha Galeria", que exibe todos os mockups salvos pelo usuário.
 * Mostra uma barra de progresso indicando o uso do armazenamento local (IndexedDB)
 * e uma grade de `SavedCard` para cada item salvo. O componente não é renderizado
 * se não houver itens salvos.
 *
 * @param {SavedGalleryProps} props As propriedades para o componente.
 * @returns {React.FC | null} A seção da galeria renderizada ou nulo se estiver vazia.
 */
const SavedGallery: React.FC<SavedGalleryProps> = ({ savedItems, maxSavedCount, onDelete, onZoom }) => {
  if (savedItems.length === 0) {
    return null;
  }

  return (
    <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Minha Galeria</h2>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Armazenamento</span>
          <div className="w-24 sm:w-32 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${savedItems.length >= maxSavedCount ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${Math.min((savedItems.length / maxSavedCount) * 100, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${savedItems.length >= maxSavedCount ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
            {savedItems.length}/{maxSavedCount}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {savedItems.map((item) => <SavedCard key={item.id} item={item} onDelete={onDelete} onZoom={onZoom} />)}
      </div>
    </div>
  );
};

export default SavedGallery;