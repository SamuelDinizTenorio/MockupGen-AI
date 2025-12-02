import React, { useEffect } from 'react';
import { X, Download } from './Icons';

/**
 * Propriedades para o componente ImageModal.
 */
interface ImageModalProps {
  isOpen: boolean; // Indica se o modal está aberto.
  imageUrl: string | null; // A URL da imagem a ser exibida, ou nulo.
  onClose: () => void; // Função para fechar o modal.
}

/**
 * Componente ImageModal.
 * 
 * Renderiza um modal para exibir uma imagem ampliada.
 * O modal pode ser fechado clicando fora da imagem, no botão de fechar ou pressionando a tecla 'Escape'.
 * Também oferece uma ação para baixar a imagem exibida.
 *
 * @param {ImageModalProps} props As propriedades para o componente.
 * @returns {React.FC} O componente de modal de imagem renderizado ou nulo se não estiver aberto.
 */
const ImageModal: React.FC<ImageModalProps> = ({ isOpen, imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Adiciona e remove ouvintes de eventos e controla o overflow do body
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Previne o scroll do fundo da página
    }
    
    // Função de limpeza do useEffect
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  // Manipulador para o download da imagem
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `mockup-zoomed-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
    >
      {/* Botão de Fechar */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors z-[110]"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Contêiner da Imagem */}
      <div 
        className="relative max-w-[95vw] max-h-[95vh] p-2 animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()} // Previne o fechamento ao clicar na imagem
      >
        <img 
          src={imageUrl} 
          alt="Mockup Zoomed" 
          className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
        
        {/* Ações Flutuantes */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
           <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-medium hover:bg-white/20 transition-colors shadow-lg"
          >
            <Download className="w-4 h-4" />
            Baixar Imagem
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;