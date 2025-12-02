import React from 'react';
import { Category, MockupResult } from '../types';
import { Upload, Wand2, Loader2 } from './Icons';

/** 
 * Propriedades para o componente ConfigurationPanel.
 */
interface ConfigurationPanelProps {
  imagePreview: string | null; // A URL da pré-visualização da imagem, ou nulo se nenhuma imagem for carregada. 
  handleDragOver: (e: React.DragEvent) => void; // Manipulador para o evento de arrastar sobre a área de soltar. 
  handleDrop: (e: React.DragEvent) => void; // Manipulador para o evento de soltar na área de soltar. 
  fileInputRef: React.RefObject<HTMLInputElement>; // Referência para o elemento de input de arquivo oculto. 
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Manipulador para quando um arquivo é selecionado através do input de arquivo. 
  categories: Category[]; // A lista de categorias de mockup disponíveis. 
  selectedCategory: Category; // A categoria de mockup atualmente selecionada. 
  setSelectedCategory: (category: Category) => void; // Função para atualizar a categoria selecionada. 
  description: string; // A descrição fornecida pelo usuário para a geração do mockup. 
  setDescription: (description: string) => void; // Função para atualizar a descrição. 
  handleGenerate: () => void; // Manipulador para acionar o processo de geração de mockup. 
  results: MockupResult[]; // A lista de resultados da geração de mockup. 
}

/**
 * Componente ConfigurationPanel.
 * 
 * Este componente renderiza todo o painel de configuração para o gerador de mockups.
 * Inclui seções para upload de uma imagem, seleção de uma categoria, adição de uma descrição
 * e acionamento do processo de geração.
 *
 * @param {ConfigurationPanelProps} props As propriedades para o componente.
 * @returns {React.FC} O painel de configuração renderizado.
 */
const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
  imagePreview,
  handleDragOver,
  handleDrop,
  fileInputRef,
  handleFileChange,
  categories,
  selectedCategory,
  setSelectedCategory,
  description,
  setDescription,
  handleGenerate,
  results,
}) => {
  return (
    <div className="lg:col-span-4 space-y-6">
      {/* 1. Seção de Upload */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs">1</span>
          Upload da Arte
        </h2>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-6 transition-all text-center cursor-pointer ${
            imagePreview 
              ? 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/30 dark:bg-indigo-900/20' 
              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/gif"
            onChange={handleFileChange}
          />
          
          {imagePreview ? (
            <div className="relative group">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-48 mx-auto rounded shadow-sm object-contain" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded text-white text-sm font-medium backdrop-blur-sm">
                Trocar imagem
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-200 font-medium">Clique ou arraste aqui</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">PNG, JPG ou GIF</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Seção de Configuração */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs">2</span>
          Configuração
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categoria</label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-all text-left truncate ${
                    selectedCategory === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Detalhes (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: fundo de madeira clara, iluminação natural..."
              className="w-full text-sm p-3 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none min-h-[100px] resize-y bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!imagePreview || results.some(r => r.loading)}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-md ${
              !imagePreview || results.some(r => r.loading)
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5'
            }`}
          >
             {results.some(r => r.loading) ? (
               <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
               </>
             ) : (
               <>
                <Wand2 className="w-5 h-5" />
                Gerar Mockups
               </>
             )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
