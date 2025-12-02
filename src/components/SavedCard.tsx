import React, { useState } from 'react';
import { Download, Maximize2, Trash2, CheckCircle } from './Icons';
import { SavedMockup } from '../types';

/**
 * Propriedades para o componente SavedCard.
 */
interface SavedCardProps {
  item: SavedMockup; // O objeto do mockup salvo a ser exibido.
  onDelete: (id: string) => void; // Função para excluir o item da galeria.
  onZoom: (url: string) => void; // Função para abrir a imagem no modal de zoom.
}

/**
 * Componente SavedCard.
 *
 * Renderiza um card para um mockup salvo na galeria do usuário.
 * Exibe a imagem e fornece ações como baixar, ampliar (zoom) e excluir.
 * A exclusão utiliza um mecanismo de confirmação em duas etapas para evitar remoções acidentais.
 * Também possui uma funcionalidade de auto-limpeza que remove imagens corrompidas ou quebradas.
 *
 * @param {SavedCardProps} props As propriedades para o componente.
 * @returns {React.FC} O componente de card de item salvo renderizado.
 */
const SavedCard: React.FC<SavedCardProps> = ({ item, onDelete, onZoom }) =>
{
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = item.url;
    link.download = `mockup-saved-${item.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isConfirming) {
      onDelete(item.id);
    } else {
      setIsConfirming(true);
      // Reseta o estado de confirmação após 3 segundos se o usuário não clicar novamente
      setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
    }
  };

  const handleImageError = () => {
    // Se a imagem falhar ao carregar (corrompida no DB ou URL inválida),
    // removemos automaticamente para limpar a galeria.
    console.warn(`Imagem corrompida detectada (${item.id}). Removendo do cache.`);
    onDelete(item.id);
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden aspect-square cursor-zoom-in hover:shadow-md transition-all duration-300"
      onClick={() => onZoom(item.url)}
      onMouseLeave={() => setIsConfirming(false)} // Reseta a confirmação se o mouse sair do card
    >
      <img 
        src={item.url} 
        alt="Saved Mockup" 
        className="w-full h-full object-cover"
        loading="lazy"
        onError={handleImageError}
      />
      
      {/* Ícone de Dica de Zoom */}
      <div className={`absolute top-3 left-3 transition-opacity duration-300 z-10 ${
        isConfirming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
      }`}>
         <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-lg text-white">
            <Maximize2 className="w-4 h-4" />
         </div>
      </div>

      {/* Botão de Excluir - Confirmação em Duas Etapas */}
      <div className={`absolute top-3 right-3 transition-all duration-300 z-20 ${
        isConfirming ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`}>
         <button
            onClick={handleDelete}
            className={`flex items-center gap-1 backdrop-blur-sm rounded-lg text-white transition-all shadow-sm ${
              isConfirming 
                ? 'bg-red-600 px-3 py-1.5' 
                : 'p-1.5 bg-red-500/80 hover:bg-red-600'
            }`}
            title={isConfirming ? "Confirmar exclusão" : "Excluir"}
         >
            {isConfirming ? (
              <>
                <span className="text-xs font-bold">Confirmar?</span>
              </>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
         </button>
      </div>
      
      {/* Ações Inferiores */}
      <div className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 flex justify-end items-end z-10 ${
        isConfirming ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'
      }`}>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-xs font-semibold shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Baixar
        </button>
      </div>
    </div>
  );
};

export default SavedCard;