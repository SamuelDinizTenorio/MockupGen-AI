/**
 * @file Ponto de entrada principal da aplicação React.
 * Este arquivo é responsável por renderizar o componente raiz (`App`) no DOM.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

/**
 * O elemento DOM onde a aplicação React será montada.
 * @type {HTMLElement | null}
 */
const rootElement = document.getElementById('root');

// Garante que o elemento raiz exista antes de tentar renderizar a aplicação.
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

/**
 * Cria a raiz da aplicação React usando a API concorrente.
 * @type {ReactDOM.Root}
 */
const root = ReactDOM.createRoot(rootElement);

// Renderiza o componente principal da aplicação.
// React.StrictMode é um wrapper que verifica potenciais problemas na aplicação durante o desenvolvimento.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);