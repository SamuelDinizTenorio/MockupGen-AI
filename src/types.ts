/**
 * Define as categorias de mockup disponíveis na aplicação.
 */
export type Category =
  | 'Papelaria'
  | 'Fachada'
  | 'Embalagem'
  | 'Camiseta'
  | 'Mobile'
  | 'Desktop'
  | 'Tablet'
  | 'Caneca'
  | 'Sacola (Tote Bag)'
  | 'Cartão de Visita';

/**
 * Representa o resultado de uma geração de mockup.
 * Pode estar em estado de carregamento, sucesso (com imageUrl) ou erro.
 */
export interface MockupResult {
  id: string;         // Identificador único para o resultado.
  imageUrl?: string;  // URL da imagem do mockup gerado. Presente em caso de sucesso.
  loading: boolean;   // Flag que indica se a geração está em andamento.
  error?: string;     // Mensagem de erro, caso a geração falhe.
}

/**
 * Define a configuração necessária para gerar um mockup.
 * Atualmente não utilizado diretamente nos componentes, mas define a estrutura de dados esperada.
 */
export interface GenerationConfig {
  image: string;       // A imagem do logo do usuário em formato Base64.
  category: Category;  // A categoria de mockup selecionada.
  description: string; // A descrição textual para guiar a geração do mockup.
}

/**
 * Representa um mockup que foi salvo pelo usuário no IndexedDB.
 */
export interface SavedMockup {
  id: string;        // Identificador único para o mockup salvo (pode ser um timestamp).
  url: string;       // URL da imagem do mockup salvo.
  createdAt: string; // Data e hora em que o mockup foi salvo, em formato de string ISO.
}