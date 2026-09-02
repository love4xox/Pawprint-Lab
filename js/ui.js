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

  // 결과 카드 렌더링 함수 내부 예시
function renderResultCard(name, generatedText) {
  const container = document.getElementById('resultContent');
  if (!container) return;

  container.innerHTML = `
    <div class="tape-center"></div>
    <div class="card-tag">STICKER // RESULT</div>
    <h2>💖 ${name}의 다이어리 페이지</h2>
    <div class="diary-text-view">${generatedText.replace(/\n/g, '<br>')}</div>
    
    <div class="result-btn-group" style="margin-top: 15px; display: flex; gap: 10px;">
      <button type="button" class="diary-btn-action" onclick="handleSendDiscord('${name}')">
        🚀 디스코드로 공유하기
      </button>
    </div>
  `;
}

// 디스코드 버튼 클릭 이벤트 핸들러
async function handleSendDiscord(name) {
  const textElem = document.querySelector('.diary-text-view');
  if (!textElem) return;
  
  const text = textElem.innerText;
  try {
    alert('디스코드로 전송 중입니다... 🐾');
    await sendToDiscord(name, text);
    alert('✨ 디스코드 채널로 다이어리가 성공적으로 발행되었습니다!');
  } catch (e) {
    alert('전송 실패: ' + e.message);
  }
}