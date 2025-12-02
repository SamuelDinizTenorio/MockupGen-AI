# MockupGen AI ✨

Gerador de mockups instantâneos utilizando Inteligência Artificial. Envie sua arte (logotipo, estampa ou textura) e aplique-a automaticamente em diversos contextos realistas como camisetas, canecas, papelaria e dispositivos digitais.

## 🚀 Funcionalidades

- **Geração Multi-Slot**: Gera 4 variações de mockups simultaneamente.
- **Categorias Diversas**: Suporte para Papelaria, Fachadas, Embalagens, Camisetas, Mobile, Desktop, Tablets, Canecas, Tote Bags e Cartões de Visita.
- **Upload Flexível**: Aceita imagens nos formatos PNG, JPG e GIF.
- **Galeria Local**: Sistema de salvamento de imagens utilizando **IndexedDB** para persistência de dados no navegador (suporta dezenas de imagens sem pesar a memória).
- **Modo Escuro**: Interface totalmente adaptada para temas claro e escuro.
- **Zoom & Download**: Visualização em tela cheia (Lightbox) e download direto das imagens geradas.
- **Auto-Limpeza**: Sistema inteligente que remove imagens corrompidas do cache automaticamente.
- **Sugestões de Erro**: Diagnóstico amigável caso a IA não consiga gerar a imagem (ex: conteúdo bloqueado ou instruções ambíguas).

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **IA Generativa**: Google Gemini API (`gemini-2.5-flash-image`)
- **Armazenamento**: IndexedDB (via Wrapper personalizado)

## 📦 Como Usar

1. **Upload**: Arraste ou clique para enviar sua imagem (Logo ou Design).
2. **Configuração**: Escolha uma categoria (ex: "Camiseta") e, opcionalmente, adicione detalhes sobre o estilo desejado (ex: "Camiseta preta dobrada sobre mesa de madeira").
3. **Gerar**: Clique no botão "Gerar Mockups" e aguarde o processamento.
4. **Interagir**:
   - Clique na imagem para dar Zoom.
   - Clique em "Baixar" para salvar no computador.
   - Clique no ícone de "Salvar" (Bookmark) para guardar na sua Galeria Local.

## 🔑 Configuração da API

Este projeto requer uma **API Key do Google Gemini** válida.
A chave deve ser configurada no ambiente de execução como `process.env.API_KEY`.

O modelo utilizado é o `gemini-2.5-flash-image`, otimizado para tarefas de visão e geração de imagens com alta fidelidade.

## ⚙️ Como inicializar o projeto localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/mockupgen-ai.git
   cd mockupgen-ai
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a chave de API:**
   Crie um arquivo chamado `.env.local` na raiz do projeto e adicione sua chave da API do Google Gemini:
   ```
   GEMINI_API_KEY=SUA_API_KEY_AQUI
   ```

4. **Execute o projeto:**
   ```bash
   npm run dev
   ```
   O servidor de desenvolvimento será iniciado em `http://localhost:5173`.

## 🐳 Como usar com Docker

### Usando Docker Compose

1. **Crie um arquivo `.env`**:
   Renomeie seu arquivo `.env.local` para `.env` ou crie um novo com o seguinte conteúdo:
   ```
   GEMINI_API_KEY=SUA_API_KEY_AQUI
   ```

2. **Execute o Docker Compose:**
   ```bash
   docker-compose up -d --build
   ```
   A aplicação estará acessível em `http://localhost`.


## 💾 Sobre o Armazenamento

As imagens salvas na "Minha Galeria" ficam armazenadas no **IndexedDB** do seu navegador.
- Os dados são locais (não vão para nuvem).
- Limpar o cache do navegador apagará sua galeria.
- Existe um limite visual de 50 imagens para garantir a performance do dispositivo.

---

**Desenvolvido com Google Gemini 2.5** 🤖
