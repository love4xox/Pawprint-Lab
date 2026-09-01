const StorageService = {
    STORAGE_KEY: 'pawprint_archives',
    getArchives() {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },
    saveArchive(item) {
      const list = this.getArchives();
      list.unshift(item);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    },
    removeArchive(id) {
      const list = this.getArchives().filter(i => i.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    }
  };