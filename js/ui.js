// 1. 마크다운 기호(>, *, 볼드) 및 이모지(💌, 💕)를 예쁜 다꾸 HTML로 파싱하는 함수
function parseDiaryMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let quoteBuffer = [];

  const flushQuote = () => {
    if (quoteBuffer.length > 0) {
      const fullQuote = quoteBuffer.join('<br>');
      const isLetter = fullQuote.includes('안녕?') || fullQuote.includes('집사');
      html += `<div class="${isLetter ? 'letter-memo-box' : 'diary-memo-box'}">${fullQuote}</div>`;
      quoteBuffer = [];
    }
  };

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) {
      flushQuote();
      continue;
    }

    // 인용구 (>) 또는 편지 이모지(💌, 💕)가 들어간 줄을 메모지 박스로 처리
    if (line.startsWith('>') || line.startsWith('💌') || line.startsWith('💕')) {
      const cleanLine = line.replace(/^[>💌💕]\s*/, '');
      quoteBuffer.push(cleanLine);
      continue;
    } else {
      flushQuote();
    }

    // 소제목 번호 (예: 1. 뽀짝 프로필 스티커...)
    if (/^[🧸💌🎀✨📌]?\s*\d+\./.test(line)) {
      html += `<div class="diary-section-title">${line}</div>`;
      continue;
    }

    // 불릿 리스트 (*) 처리 -> 🐾
    if (line.startsWith('*')) {
      let content = line.replace(/^\*\s*/, '');
      content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      html += `<div class="diary-list-item">${content}</div>`;
      continue;
    }

    // 일반 줄의 **볼드** 처리
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html += `<div>${line}</div>`;
  }
  flushQuote();
  return html;
}

// 2. UI 모듈 객체 (기존 app.js와의 호환 유지)
const UIModule = {
  formatMarkdown(text) {
    return parseDiaryMarkdown(text);
  },

  renderStoryResult(name, generatedText) {
    const card = document.getElementById('resultCard');
    const container = document.getElementById('resultContent');
    if (!container) return;

    // 이름 인자가 생략되었을 때 기본값 처리
    const petName = (typeof name === 'string' && generatedText) ? name : '댕냥이';
    const contentText = generatedText || name;

    const parsedHtml = parseDiaryMarkdown(contentText);

    container.innerHTML = `
      <div class="tape-center"></div>
      <div class="card-tag">STICKER // RESULT</div>
      <h2 style="margin-top: 10px; margin-bottom: 15px; color: #ff4d87;">💖 ${petName}의 다이어리 페이지</h2>
      <div class="diary-text-view">
        ${parsedHtml}
      </div>
      <div class="result-actions-bar">
        <button type="button" class="btn-action-copy" onclick="copyDiaryText()">📋 글 복사하기</button>
        <button type="button" class="btn-action-discord" id="discordShareBtn" onclick="triggerDiscordShare('${petName}')">🐾 디스코드로 바로 쏘기</button>
      </div>
    `;

    if (card) {
      card.classList.remove('hidden');
      card.scrollIntoView({ behavior: 'smooth' });
    }
  },

  renderArchives() {
    const list = document.getElementById('archiveList');
    if (!list) return;

    const items = typeof StorageService !== 'undefined' ? StorageService.getArchives() : [];

    if (items.length === 0) {
      list.innerHTML = '<p style="color:#a08a8a; text-align:center; padding:35px; font-style:italic;">아직 보관된 뽀짝 다이어리가 없어요 🐾</p>';
      return;
    }

    list.innerHTML = items.map(item => `
      <div class="polaroid-card" style="margin-bottom: 20px;">
        <div class="tape-center"></div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <span class="sticker-tag">PAGE #${item.id.toString().slice(-4)}</span>
          <span style="color:#888; font-size:0.85rem;">${item.date}</span>
        </div>
        <h2 style="font-size:1.3rem; color:#ff4d87; margin-bottom:6px;">
          ${item.name} <small style="color:#666; font-size:0.85rem;">(${item.breed})</small>
        </h2>
        <div class="diary-text-view" style="margin-top:14px;">
          ${parseDiaryMarkdown(item.content)}
        </div>
      </div>
    `).join('');
  }
};

// 3. 글로벌 액션 함수 (복사 및 디스코드 전송)
window.copyDiaryText = function() {
  const elem = document.querySelector('.diary-text-view');
  if (!elem) return;
  navigator.clipboard.writeText(elem.innerText).then(() => {
    alert('✨ 다이어리 내용이 클립보드에 복사되었어요!');
  });
};

window.triggerDiscordShare = async function(animalName) {
  const elem = document.querySelector('.diary-text-view');
  const btn = document.getElementById('discordShareBtn');
  if (!elem || !btn) return;

  try {
    btn.disabled = true;
    btn.innerText = '🚀 전송 중...';
    await sendToDiscord(animalName, elem.innerText);
    alert(`🎀 [${animalName}]의 다이어리가 디스코드 채널로 성공적으로 발행되었습니다!`);
  } catch (err) {
    alert('전송 실패: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.innerText = '🐾 디스코드로 바로 쏘기';
  }
};