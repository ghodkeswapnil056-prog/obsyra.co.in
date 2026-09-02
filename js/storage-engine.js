/* OBSYRA CAREER PORTAL - UNIFIED MULTI-TIER STORAGE ENGINE (v5.2.0) */
const STORAGE_ENGINE = {
  dbName: 'ObsyraStorageDB',
  dbVersion: 1,
  db: null,

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        resolve(null);
        return;
      }

      const req = indexedDB.open(this.dbName, this.dbVersion);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('drafts')) db.createObjectStore('drafts');
        if (!db.objectStoreNames.contains('documents_cache')) db.createObjectStore('documents_cache');
      };

      req.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };

      req.onerror = (e) => {
        console.warn('IndexedDB initialization failed:', e);
        resolve(null);
      };
    });
  },

  async saveDraft(key, data) {
    try {
      localStorage.setItem('obsyra_draft_' + key, JSON.stringify(data));

      if (this.db) {
        const tx = this.db.transaction('drafts', 'readwrite');
        const store = tx.objectStore('drafts');
        store.put(data, key);
      }
      return { success: true, message: `Draft '${key}' saved locally` };
    } catch (e) {
      return { success: false, message: e.toString() };
    }
  },

  async loadDraft(key) {
    try {
      const local = localStorage.getItem('obsyra_draft_' + key);
      if (local) return JSON.parse(local);
      return null;
    } catch (e) {
      return null;
    }
  },

  async uploadToDrive(file, folderType = 'HR_DOCUMENTS') {
    if (!file) return { success: false, message: 'No file selected' };

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result.split(',')[1];
        const payload = {
          action: 'uploadDocumentToVault',
          fileName: file.name,
          fileType: file.type,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          folderType: folderType,
          base64: base64Data
        };

        const res = await API.request('uploadDocumentToVault', payload);
        resolve(res);
      };
      reader.readAsDataURL(file);
    });
  },

  getStorageUsageStats() {
    let usedBytes = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        usedBytes += (localStorage[key].length + key.length) * 2;
      }
    }
    const usedKB = (usedBytes / 1024).toFixed(2);
    return {
      tier1_local: `${usedKB} KB Used`,
      tier2_drive: '15 GB Available (Google Drive)',
      tier3_database: '27 Tables Active (Google Sheets & SQL)'
    };
  }
};

document.addEventListener('DOMContentLoaded', () => {
  STORAGE_ENGINE.initIndexedDB();
});
