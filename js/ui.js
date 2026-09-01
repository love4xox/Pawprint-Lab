const UIModule = {
    formatMarkdown(text) {
      return text
        .replace(/^# (.*$)/gim, '<h1 style="color:var(--gold-light); margin-bottom:18px; font-size:1.5rem; font-family:\'Cormorant Garamond\', serif; letter-spacing:1px;">$1</h1>')
        .replace(/^### (.*$)/gim, '<h3 style="color:var(--gold-accent); margin-top:25px; margin-bottom:10px; font-size:1.15rem; border-bottom:1px solid var(--border-color); padding-bottom:5px;">$1</h3>')
        .replace(/^\* \*\*(.*?)\*\*:(.*$)/gim, '<li style="margin-bottom:8px; list-style:none;">⚜️ <strong style="color:var(--gold-light);">$1:</strong>$2</li>')
        .replace(/^\* (.*$)/gim, '<li style="margin-bottom:8px; list-style:none;">• $1</li>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:var(--gold-light);">$1</strong>')
        .replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:var(--gold-accent); text-decoration:underline;">$1</a>')
        .replace(/^---$/gim, '<div class="gold-divider"></div>')
        .replace(/\n/g, '<br>');
    },
  
    renderStoryResult(text) {
      const card = document.getElementById('resultCard');
      const content = document.getElementById('resultContent');
      content.innerHTML = this.formatMarkdown(text);
      card.classList.remove('hidden');
      card.scrollIntoView({ behavior: 'smooth' });
    },
  
    renderArchives() {
      const list = document.getElementById('archiveList');
      const items = StorageService.getArchives();
      if (!list) return;
  
      if (items.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:35px; font-style:italic;">현재 편철된 VIP 의전 리포트가 없습니다.</p>';
        return;
      }
  
      list.innerHTML = items.map(item => `
        <div class="luxury-card">
          <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
            <span class="guest-badge">[DOSSIER #${item.id.toString().slice(-4)}]</span>
            <span style="color:var(--text-muted); font-size:0.8rem;">${item.date}</span>
          </div>
          <h2 style="font-size:1.3rem; color:var(--gold-light); margin-bottom:6px;">${item.name} <small style="color:var(--text-muted); font-size:0.85rem;">(${item.breed})</small></h2>
          <div style="margin-top:18px;">${this.formatMarkdown(item.content)}</div>
        </div>
      `).join('');
    }
  };