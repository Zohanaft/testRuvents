
export default class IndexedDBConnect {
    constructor () {
        this.version = 1;
        this.openRequest = indexedDB.open("fileProcessing", this.version);
        this.openRequest.onupgradeneeded = this.upgradeDB();
        this.openRequest.onerror = this.errorDB();
    }

    upgradeDB() {
        const db = this.openRequest.result;
        switch(db.version) { // существующая (старая) версия базы данных
            case 0:
                this.openRequest = indexedDB.open("fileProcessing", this.version);
            case 1:
                this.openRequest = indexedDB.open("fileProcessing", this.version++);
        }
    }

    errorDB() {
        this.openRequest.onerror = function() {
            console.error("Error", openRequest.error);
        };
    }
}
