/**
 * @file dbService.ts
 * Este arquivo contém a classe de serviço para interagir com o IndexedDB.
 * Ele encapsula toda a lógica para abrir o banco de dados, criar object stores,
 * e realizar operações de CRUD (Create, Read, Update, Delete) para os mockups salvos.
 */

import { SavedMockup } from '../types';

const DB_NAME = 'MockupGenDB';    // Nome do banco de dados IndexedDB.
const DB_VERSION = 1;             // Versão do banco de dados. Mudar este número acionará o evento `onupgradeneeded`.
const STORE_NAME = 'mockups';     // Nome do object store onde os mockups são armazenados.

/**
 * Classe de serviço para gerenciar operações do IndexedDB.
 * Segue o padrão Singleton, exportando uma única instância `dbService`.
 */
class DBService {
  private db: IDBDatabase | null = null; // A instância do banco de dados. É privada e gerenciada internamente.

  /**
   * Abre (e, se necessário, cria e atualiza) a conexão com o banco de dados IndexedDB.
   * @private
   * @returns {Promise<IDBDatabase>} Uma promessa que resolve com a instância do banco de dados.
   */
  private async open(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // Chamado quando o banco de dados é criado pela primeira vez ou a versão é incrementada.
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      // Chamado quando a conexão é bem-sucedida.
      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  /**
   * Busca todos os mockups salvos no banco de dados.
   * @returns {Promise<SavedMockup[]>} Uma promessa que resolve com um array de mockups salvos, ordenados do mais novo para o mais antigo.
   */
  async getAllMockups(): Promise<SavedMockup[]> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // Retorna invertido para mostrar os mais novos primeiro
        resolve((request.result as SavedMockup[]).reverse());
      };
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Salva ou atualiza um mockup no banco de dados.
   * @param {SavedMockup} mockup - O objeto de mockup a ser salvo.
   * @returns {Promise<void>} Uma promessa que resolve quando a operação é concluída.
   */
  async saveMockup(mockup: SavedMockup): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(mockup);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Deleta um mockup do banco de dados com base em seu ID.
   * @param {string} id - O ID do mockup a ser deletado.
   * @returns {Promise<void>} Uma promessa que resolve quando a operação é concluída.
   */
  async deleteMockup(id: string): Promise<void> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Busca um único mockup no banco de dados pelo seu ID.
   * @param {string} id - O ID do mockup a ser buscado.
   * @returns {Promise<SavedMockup | undefined>} Uma promessa que resolve com o mockup encontrado ou `undefined` se não existir.
   */
  async getMockup(id: string): Promise<SavedMockup | undefined> {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DBService(); // Instância única (Singleton) do serviço de banco de dados.
