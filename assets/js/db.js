const DB_NAME = 'iProcessedFile'
const STORAGE_NAME = 'blob'
const DB_VERSION = 1
let DB


export const api =  {
  async getDb () {
    return new Promise((resolve, reject) => {
      if (DB) {
        return resolve(DB)
      }
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)
      request.onerror = e => {
        console.log('Error opening db', e)
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Error')
      }
      request.onsuccess = e => {
        DB = e.target.result
        resolve(DB)
      }
      request.onupgradeneeded = e => {
        let db = e.target.result
        db.createObjectStore(STORAGE_NAME, { autoIncrement: true, keyPath: 'id' })
      }
    })
  },

  async deleteItem (blob) {
    const db = await this.getDb()
    return new Promise(resolve => {
      const trans = db.transaction([STORAGE_NAME], 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }
      const store = trans.objectStore(STORAGE_NAME)
      store.delete(blob.id)
    })
  },


  async clearObjectStore() {
    return new Promise(resolve => {
      const request = window.indexedDB.deleteDatabase(DB_NAME)
      request.oncomplete = () => {
        console.log('db was droped')
        resolve();
      }
    })
  },

  async getItemFromObjectStore(key) {
    let db = await this.getDb()
    const trans = db.transaction([STORAGE_NAME], 'readonly')
    const store = trans.objectStore(STORAGE_NAME)
    const storeRequest = await store.get(key)
    
    return new Promise(resolve => {
      storeRequest.onsuccess = (e) => {
        resolve(e.target.result)
      }
    })
  },

  async getItem () {
    let db = await this.getDb()
    return new Promise(resolve => {
      let trans = db.transaction([STORAGE_NAME], 'readonly')
      trans.oncomplete = () => {
        resolve(items)
      }
      const store = trans.objectStore(STORAGE_NAME)
      const items = []
      store.openCursor().onsuccess = e => {
        const cursor = e.target.result
        if (cursor) {
          items.push(cursor.value)
          cursor.continue()
        }
      }
    })
  },
  
  async saveItem (item) {
    let db = await this.getDb()
    return new Promise(resolve => {
      let trans = db.transaction([STORAGE_NAME], 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }
      let store = trans.objectStore(STORAGE_NAME)
      store.put({ chunk: item })
    })
  }
}
