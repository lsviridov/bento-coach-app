interface OfflineDraft {
  id: string;
  type: 'meal';
  data: any;
  createdAt: string;
  synced: boolean;
}

class OfflineQueue {
  private db: IDBDatabase | null = null;
  private readonly dbName = 'ADAPTO_OFFLINE_QUEUE';
  private readonly version = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Создаём store для черновиков
        if (!db.objectStoreNames.contains('drafts')) {
          const draftStore = db.createObjectStore('drafts', { keyPath: 'id' });
          draftStore.createIndex('type', 'type', { unique: false });
          draftStore.createIndex('synced', 'synced', { unique: false });
          draftStore.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async saveDraft(type: 'meal', data: any): Promise<string> {
    if (!this.db) await this.init();

    const draft: OfflineDraft = {
      id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      createdAt: new Date().toISOString(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const request = store.add(draft);

      request.onsuccess = () => resolve(draft.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingDrafts(): Promise<OfflineDraft[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readonly');
      const store = transaction.objectStore('drafts');
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markDraftSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const draft = getRequest.result;
        if (draft) {
          draft.synced = true;
          const putRequest = store.put(draft);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Draft not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async clearSyncedDrafts(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['drafts'], 'readwrite');
      const store = transaction.objectStore('drafts');
      const index = store.index('synced');
      const request = index.getAllKeys(true);

      request.onsuccess = () => {
        const keys = request.result;
        keys.forEach(key => {
          store.delete(key);
        });
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async sync(): Promise<{ success: number; failed: number }> {
    const drafts = await this.getPendingDrafts();
    let success = 0;
    let failed = 0;

    for (const draft of drafts) {
      try {
        if (draft.type === 'meal') {
          // TODO: Вызов API для синхронизации
          console.log('Syncing meal draft:', draft.data);
          
          // Помечаем как синхронизированный
          await this.markDraftSynced(draft.id);
          success++;
        }
      } catch (error) {
        console.error('Failed to sync draft:', error);
        failed++;
      }
    }

    // Очищаем синхронизированные черновики
    await this.clearSyncedDrafts();

    return { success, failed };
  }
}

export const offlineQueue = new OfflineQueue();
