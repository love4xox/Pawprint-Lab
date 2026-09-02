// 1. 마크다운 기호(>, *, 볼드) 및 이모지를 깨짐 없이 파싱하는 함수
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

  // 인용구 및 편지/하트/깨진문자 패턴 (유니코드 안전 처리: >, , 💌, 💕 등)
  const quotePattern = /^(?:>|\uFFFD|\uD83D\uDC8C|\uD83D\uDC95)\s*/u;

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) {
      flushQuote();
      continue;
    }

    // 💌 또는 > 또는 깨진 마름모 기호()로 시작하는 줄을 감지해 메모 박스로 묶고 앞 기호 제거
    if (quotePattern.test(line)) {
      const cleanLine = line.replace(quotePattern, '');
      quoteBuffer.push(cleanLine);
      continue;
    } else {
      flushQuote();
    }

    // 소제목 번호 (예: 1. 뽀짝 프로필 스티커...)
    if (/^[🧸💌🎀✨📌]?\s*\d+\./u.test(line)) {
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

    const petName = (typeof name === 'string' && generatedText) ? name : '댕냥이';
    const contentText = generatedText || name;
    const parsedHtml = parseDiaryMarkdown(contentText);

    // 아이 이름/특성에 따라 귀여운 댕냥이 힐링 영상 ID 매핑
    let videoId = '170uYx24c-Q'; // 기본: 귀여운 사모예드 영상
    if (petName.includes('모찌') || petName.includes('고양이') || petName.includes('냥')) {
      videoId = '4b92p6LwK-k'; // 귀여운 아기 고양이 힐링 영상
    }

    // 유튜브 검색 링크 URL (예: "사모예드 구름이 귀여운 영상" 검색)
    const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(petName + ' 강아지 고양이 귀여운 영상')}`;

    container.innerHTML = `
      <div class="tape-center"></div>
      <div class="card-tag">STICKER // RESULT</div>
      <h2 style="margin-top: 10px; margin-bottom: 15px; color: #ff4d87;">💖 ${petName}의 다이어리 페이지</h2>
      
      <div class="diary-text-view">
        ${parsedHtml}
      </div>

      <!-- 🎬 뽀짝 댕냥이 유튜브 영상 카드 -->
      <div class="diary-youtube-box" style="margin-top: 22px;">
        <div class="card-tag" style="margin-bottom: 8px;">🎬 YOUTUBE // ${petName}의 뽀짝 순간 포착</div>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 14px; border: 2px solid #ffe3e8; box-shadow: 0 4px 12px rgba(255, 182, 193, 0.12);">
          <iframe 
            style="position: absolute; top:0; left: 0; width: 100%; height: 100%; border:0;" 
            src="https://www.youtube.com/embed/${videoId}" 
            title="${petName} 뽀짝 영상" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>

      <!-- 하단 액션 버튼 그룹 (복사 / 디스코드 / 유튜브) -->
      <div class="result-actions-bar">
        <button type="button" class="btn-action-copy" onclick="copyDiaryText()">📋 글 복사하기</button>
        <button type="button" class="btn-action-discord" id="discordShareBtn" onclick="triggerDiscordShare('${petName}')">🐾 디스코드로 바로 쏘기</button>
        <a href="${youtubeSearchUrl}" target="_blank" rel="noopener noreferrer" class="btn-action-youtube" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          유튜브 더보기
        </a>
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