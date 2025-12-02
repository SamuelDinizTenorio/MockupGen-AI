import React, { useState, useRef, useEffect } from 'react';
import { Category, MockupResult, SavedMockup } from './types';
import { generateSingleMockup } from './services/geminiService';
import { dbService } from './services/dbService';
import ImageModal from './components/ImageModal';
import Header from './components/Header';
import ConfigurationPanel from './components/ConfigurationPanel';
import SavedGallery from './components/SavedGallery';
import ResultsSection from './components/ResultsSection';

/**
 * @constant CATEGORIES
 * Lista de categorias de mockup disponíveis para o usuário.
 */
const CATEGORIES: Category[] = [
  'Papelaria', 'Fachada', 'Embalagem', 'Camiseta', 
  'Mobile', 'Desktop', 'Tablet', 'Caneca', 
  'Sacola (Tote Bag)', 'Cartão de Visita'
];

/**
 * @constant ALLOWED_TYPES
 * Tipos de arquivo de imagem permitidos para upload.
 */
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif'];

/**
 * @constant MAX_SAVED_ITEMS
 * Número máximo de mockups que podem ser salvos na galeria.
 */
const MAX_SAVED_ITEMS = 50;

/**
 * Componente principal da aplicação.
 * Gerencia o estado geral, a lógica de negócios e a renderização dos subcomponentes.
 */
function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);             // State para o arquivo de imagem (logo) selecionado pelo usuário.
  const [imagePreview, setImagePreview] = useState<string | null>(null);           // State para a URL de pré-visualização da imagem carregada.
  const [selectedCategory, setSelectedCategory] = useState<Category>('Papelaria'); // State para a categoria de mockup selecionada.
  const [description, setDescription] = useState('');                              // State para a descrição textual fornecida pelo usuário para o mockup.
  const [results, setResults] = useState<MockupResult[]>([]);                      // State para armazenar os resultados dos mockups gerados.
  const [isProcessing, setIsProcessing] = useState(false);                         // State para indicar se a geração de mockups está em andamento.
  const [isDarkMode, setIsDarkMode] = useState(false);                             // State para controlar o tema da aplicação (claro/escuro).
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);             // State para a URL da imagem que está sendo exibida no modal de zoom.
  const [savedItems, setSavedItems] = useState<SavedMockup[]>([]);                 // State para armazenar os mockups salvos pelo usuário, carregados do IndexedDB.
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializa o Tema e Carrega os Itens Salvos
  useEffect(() => {
    // Tema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Carrega os itens salvos do IndexedDB
    loadSavedItems();
  }, []);

  /**
   * Carrega os mockups salvos do IndexedDB e atualiza o estado `savedItems`.
   */
  const loadSavedItems = async () => {
    try {
      const items = await dbService.getAllMockups();
      setSavedItems(items);
    } catch (e) {
      console.error("Failed to load saved items from DB", e);
    }
  };

  /**
   * Alterna o tema da aplicação entre claro e escuro e salva a preferência no localStorage.
   */
  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  /**
   * Manipula a mudança de arquivo no input de upload.
   * Valida o tipo de arquivo e cria uma pré-visualização da imagem.
   * @param event - O evento de mudança do input de arquivo.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Por favor, envie apenas arquivos PNG, JPG ou GIF.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Manipula o evento de arrastar um arquivo sobre a área de drop.
   * @param e - O evento de arrastar.
   */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /**
   * Manipula o evento de soltar um arquivo na área de drop.
   * @param e - O evento de soltar.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
       if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Por favor, envie apenas arquivos PNG, JPG ou GIF.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /**
   * Gera um único mockup para um slot de resultado específico.
   * @param id - O ID do slot de resultado a ser atualizado.
   * @param img - A imagem em formato base64.
   * @param mimeType - O tipo MIME da imagem.
   * @param cat - A categoria do mockup.
   * @param desc - A descrição para a geração do mockup.
   */
  const generateMockupForSlot = async (id: string, img: string, mimeType: string, cat: Category, desc: string) => {
    try {
      const url = await generateSingleMockup(img, mimeType, cat, desc);
      setResults(prev => prev.map(r => r.id === id ? { ...r, loading: false, imageUrl: url } : r));
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Falha ao gerar.';
      setResults(prev => prev.map(r => r.id === id ? { ...r, loading: false, error: errorMessage } : r));
    }
  };

  /**
   * Inicia o processo de geração de mockups.
   * Cria 4 slots de resultado e dispara a geração para cada um em paralelo.
   */
  const handleGenerate = () => {
    if (!imagePreview || !selectedFile) return;

    setIsProcessing(true);
    
    // Cria 4 slots
    const newResults: MockupResult[] = Array.from({ length: 4 }).map((_, i) => ({
      id: Date.now().toString() + i,
      loading: true,
    }));

    setResults(newResults);

    // Dispara as gerações em paralelo
    const mimeType = selectedFile.type;
    const categoryToUse = selectedCategory;
    const descriptionToUse = description;

    newResults.forEach(result => {
      generateMockupForSlot(result.id, imagePreview, mimeType, categoryToUse, descriptionToUse);
    });

    setIsProcessing(false);

    setSelectedCategory('Papelaria');
    setDescription('');
  };

  /**
   * Refaz a geração de um mockup para um slot de resultado específico.
   * @param id - O ID do resultado a ser refeito.
   */
  const handleRedo = (id: string) => {
    if (!imagePreview || !selectedFile) return;
    
    // Mantém a imageUrl antiga para permitir a animação de fade-out no ResultCard
    setResults(prev => prev.map(r => r.id === id ? { ...r, loading: true, error: undefined } : r));
    
    generateMockupForSlot(id, imagePreview, selectedFile.type, selectedCategory, description);
  };

  /**
   * Exclui um mockup salvo da galeria e do IndexedDB.
   * @param id - O ID do mockup salvo a ser excluído.
   */
  const handleDeleteSaved = async (id: string) => {
    try {
      await dbService.deleteMockup(id);
      loadSavedItems();
    } catch (e) {
      console.error("Failed to delete item", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-300">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <ConfigurationPanel
            imagePreview={imagePreview}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            description={description}
            setDescription={setDescription}
            handleGenerate={handleGenerate}
            results={results}
          />

          {/* Results & Gallery Section */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Live Results */}
            <ResultsSection
              results={results}
              savedItemsCount={savedItems.length}
              maxSavedItems={MAX_SAVED_ITEMS}
              onRedo={handleRedo}
              onZoom={setZoomedImage}
              onSaveChange={loadSavedItems}
            />

            {/* Saved Gallery */}
            <SavedGallery
              savedItems={savedItems}
              maxSavedCount={MAX_SAVED_ITEMS}
              onDelete={handleDeleteSaved}
              onZoom={setZoomedImage}
            />

          </div>
        </div>
      </main>

      {/* Image Modal */}
      <ImageModal 
        isOpen={!!zoomedImage} 
        imageUrl={zoomedImage} 
        onClose={() => setZoomedImage(null)} 
      />
    </div>
  );
}

export default App;