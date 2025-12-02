import React from 'react';
import { MockupResult } from '../types';
import ResultsPlaceholder from './ResultsPlaceholder';
import ResultCard from './ResultCard';

/**
 * Propriedades para o componente ResultsSection.
 */
interface ResultsSectionProps {
  results: MockupResult[]; // A lista de resultados de mockup a serem exibidos.
  savedItemsCount: number; // A contagem atual de itens salvos na galeria.
  maxSavedItems: number; // O número máximo de itens que podem ser salvos.
  onRedo: (id: string) => void; // Função para refazer a geração de um mockup específico.
  onZoom: (url: string) => void; // Função para abrir uma imagem em um modal de zoom.
  onSaveChange: () => void; // Callback para quando o estado de salvamento de um item muda.
}

/**
 * Componente ResultsSection.
 *
 * Este componente é responsável por exibir a lista de resultados de mockups gerados.
 * Ele mostra um placeholder se não houver resultados e, caso contrário, renderiza
 * uma grade de `ResultCard` para cada mockup. Também gerencia a contagem de itens
 * salvos e o limite máximo de salvamento, passando essas informações para os cards individuais.
 *
 * @param {ResultsSectionProps} props As propriedades para o componente.
 * @returns {React.FC} A seção de resultados renderizada.
 */
const ResultsSection: React.FC<ResultsSectionProps> = ({ results, savedItemsCount, maxSavedItems, onRedo, onZoom, onSaveChange }) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Resultados</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {results.length > 0 
            ? 'Aqui estão suas prévias geradas.' 
            : 'Seus mockups aparecerão aqui.'}
        </p>
      </div>

      {results.length === 0 ? (
         <ResultsPlaceholder />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((result) => (
            <ResultCard 
              key={result.id} 
              result={result} 
              onRedo={onRedo} 
              onZoom={onZoom}
              onSaveChange={onSaveChange}
              savedCount={savedItemsCount}
              maxSavedCount={maxSavedItems}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsSection;