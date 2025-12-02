import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Loader2, XCircle, Maximize2, Bookmark } from './Icons';
import { MockupResult } from '../types';
import { dbService } from '../services/dbService';

/**
 * Propriedades para o componente ResultCard.
 */
interface ResultCardProps {
  result: MockupResult; // O objeto de resultado do mockup a ser exibido.
  onRedo: (id: string) => void; // Função para refazer a geração da imagem.
  onZoom: (url: string) => void; // Função para abrir a imagem no modal de zoom.
  onSaveChange?: () => void; // Callback opcional para quando o estado de 'salvo' muda.
  savedCount: number; // A contagem atual de imagens salvas.
  maxSavedCount: number; // O número máximo de imagens que podem ser salvas.
}

/**
 * Componente ResultCard.
 *
 * Renderiza um card individual para um resultado de mockup. Este componente gerencia
 * vários estados, incluindo carregamento, erro e sucesso. Ele exibe a imagem gerada
 * e fornece ações como baixar, refazer, salvar/remover e ampliar a imagem.
 *
 * @param {ResultCardProps} props As propriedades para o componente.
 * @returns {React.FC} O componente de card de resultado renderizado.
 */
const ResultCard: React.FC<ResultCardProps> = ({ result, onRedo, onZoom, onSaveChange, savedCount, maxSavedCount }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [isSaveAnimating, setIsSaveAnimating] = useState(false);

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (result.imageUrl && !hasLoadError) {
        // Verifica se já está salvo no IndexedDB
        try {
          const item = await dbService.getMockup(result.id);
          setIsSaved(!!item);
        } catch (e) {
          console.error("Erro ao ler DB", e);
        }
      } else {
        setIsLoaded(false);
        setIsSaved(false);
      }
    };

    checkSavedStatus();
  }, [result.imageUrl, result.loading, result.id, hasLoadError]);

  // Lida com a transição quando o carregamento recomeça (fade out)
  useEffect(() => {
    if (result.loading) {
      setIsLoaded(false);
      setHasLoadError(false);
    }
  }, [result.loading]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o zoom ao clicar em baixar
    if (result.imageUrl && !hasLoadError) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      link.download = `mockup-${result.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRedoClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o zoom ao clicar em refazer
    onRedo(result.id);
  };

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!result.imageUrl || hasLoadError) return;

    try {
      if (isSaved) {
        // Remover
        await dbService.deleteMockup(result.id);
        setIsSaved(false);
      } else {
        // Verifica o Limite
        if (savedCount >= maxSavedCount) {
          alert(`Sua galeria está cheia (${maxSavedCount}/${maxSavedCount}). Exclua algumas imagens antigas para salvar novas.`);
          return;
        }

        // Salvar
        const newItem = {
          id: result.id,
          url: result.imageUrl,
          createdAt: new Date().toISOString()
        };
        await dbService.saveMockup(newItem);
        setIsSaved(true);
        
        // Dispara a Animação de Pop
        setIsSaveAnimating(true);
        setTimeout(() => setIsSaveAnimating(false), 300);
      }
      
      // Notifica o componente pai para atualizar a galeria
      if (onSaveChange) {
        onSaveChange();
      }
    } catch (error) {
      alert("Não foi possível realizar a operação de salvamento.");
      console.error("Erro ao salvar no DB:", error);
    }
  };

  // Helper para gerar sugestão baseada no erro
  const getSuggestion = (errorMsg: string) => {
    const lower = errorMsg.toLowerCase();
    
    // Segurança e Políticas
    if (lower.includes('bloqueada') || lower.includes('safety') || lower.includes('violat') || lower.includes('policy')) {
      return "Conteúdo bloqueado. Evite rostos reais, conteúdo adulto ou marcas protegidas.";
    }
    
    // Recusa ou Confusão do Modelo (Texto retornado em vez de imagem)
    if (lower.includes('texto') || lower.includes('conversar') || lower.includes('language model') || lower.includes('cannot create') || lower.includes('cannot use') || lower.includes('capabilities') || lower.includes('dosen\'t seem')) {
      return "O modelo hesitou em usar esta imagem. Tente novamente ou use uma categoria diferente (ex: Camiseta, Caneca).";
    }

    // Ambiguidade ou Falta de Detalhes
    if (lower.includes('genéric') || lower.includes('generic') || lower.includes('específ') || lower.includes('specific')) {
      return "Instrução muito ampla. Adicione detalhes como cor do fundo, material ou iluminação.";
    }
    if (lower.includes('ambígu') || lower.includes('ambigu') || lower.includes('unclear')) {
      return "Descrição confusa. Tente separar o objeto principal do cenário na descrição.";
    }

    // Limites e Rede
    if (lower.includes('quota') || lower.includes('limit') || lower.includes('429') || lower.includes('resource exhausted')) {
      return "Muitas requisições simultâneas. Aguarde 30 segundos e tente novamente.";
    }
    if (lower.includes('network') || lower.includes('fetch') || lower.includes('connect')) {
      return "Erro de conexão. Verifique sua internet.";
    }
    
    // Erro Genérico "Nenhuma imagem" ou Erro de Carregamento
    if (lower.includes('nenhuma imagem') || lower.includes('no image') || lower.includes('carregar')) {
       return "Falha na geração ou exibição. Tente mudar a categoria para 'Desktop' ou 'Papelaria'.";
    }

    return "Tente alterar a categoria ou adicionar mais detalhes à descrição.";
  };

  // Determina se devemos mostrar o estado de erro (erro da API OU erro de carregamento da imagem)
  const showErrorState = !result.loading && (!!result.error || hasLoadError);
  const errorText = result.error || (hasLoadError ? "Erro ao renderizar a imagem gerada." : "");

  return (
    <div 
      className={`group relative bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden aspect-square flex flex-col hover:shadow-md transition-all duration-300 ${
        result.imageUrl && !result.loading && !showErrorState ? 'cursor-zoom-in' : ''
      }`}
      onClick={() => result.imageUrl && !result.loading && !showErrorState && onZoom(result.imageUrl)}
    >
      
      {/* Overlay de Estado de Carregamento */}
      {result.loading && (
        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-500 ${
          result.imageUrl ? 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm' : 'bg-slate-50 dark:bg-slate-800'
        }`}>
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {result.imageUrl ? 'Atualizando...' : 'Gerando mockup...'}
          </span>
        </div>
      )}

      {/* Overlay de Estado de Erro */}
      {showErrorState && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/90 text-red-600 dark:text-red-200 p-4 text-center animate-in fade-in duration-300">
          <XCircle className="w-8 h-8 mb-2 opacity-80" />
          
          <h3 className="font-semibold text-sm mb-1">Falha na Geração</h3>
          
          <p className="text-xs opacity-90 line-clamp-3 mb-3 px-2 break-words leading-relaxed" title={errorText}>
            {errorText}
          </p>

          <div className="bg-red-100/50 dark:bg-black/20 rounded px-3 py-2 mb-3 w-full max-w-[200px]">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-0.5">Sugestão</p>
            <p className="text-xs font-medium leading-tight">{getSuggestion(errorText)}</p>
          </div>
          
          <button 
            onClick={handleRedoClick}
            className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-700 rounded-full text-xs font-semibold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Exibição da Imagem */}
      {result.imageUrl && !showErrorState && (
        <>
          <img 
            src={result.imageUrl} 
            alt="Generated Mockup" 
            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              isLoaded && !result.loading ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasLoadError(true)}
          />
          
          {/* Ícone de Dica de Zoom - Canto Superior Direito */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
             <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-lg text-white">
                <Maximize2 className="w-4 h-4" />
             </div>
          </div>
          
          {/* Overlay de Ações - Visível apenas quando não está carregando */}
          {!result.loading && (
             <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end z-10">
               <div className="flex gap-2">
                 <button
                  onClick={handleRedoClick}
                  className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-lg transition-colors"
                  title="Refazer"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToggleSave}
                  disabled={hasLoadError}
                  className={`p-2 backdrop-blur-md rounded-lg transition-colors ${
                    isSaved 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                      : 'bg-white/20 hover:bg-white/40 text-white'
                  }`}
                  title={isSaved ? "Remover dos salvos" : "Salvar imagem"}
                >
                  <Bookmark 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isSaved ? 'fill-current' : ''
                    } ${isSaveAnimating ? 'scale-125' : 'scale-100'}`} 
                  />
                </button>
               </div>
               
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-semibold shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResultCard;