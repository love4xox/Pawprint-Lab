const MusicModule = {
    playlists: [
      {
        page: "PAGE #01",
        title: "레서판다 메롱 통통 🍎",
        sub: "메롱 & 힐링 어쿠스틱",
        img: "assets/images/redpanda.jpg",
        style: "object-position: center;",
        desc: "두 눈을 꼭 감고 혓바닥을 쏙 내밀 때 어울리는 앙증맞고 귀여운 어쿠스틱 사운드트랙.",
        url: "https://www.youtube.com/results?search_query=cute+acoustic+healing+music"
      },
      {
        page: "PAGE #02",
        title: "토끼들의 이불 낮잠 🥕",
        sub: "포근포근 로파이 자장가",
        img: "assets/images/rabbit.png",
        // 귀 끝부터 입매까지 알맞게 들어오도록 위치 조정
        style: "object-position: center 30%;",
        desc: "나란히 이불을 덮고 쿨쿨 단잠에 빠져들 때 편안하게 틀어두는 감성 로파이 멜로디.",
        url: "https://www.youtube.com/results?search_query=cute+lofi+sleep+music"
      },
      {
        page: "PAGE #03",
        title: "아기 펭귄 둥실 힐링 🐧",
        sub: "보들보들 앰비언트 사운드",
        img: "assets/images/penguin.jpg",
        style: "object-position: center;",
        desc: "담요 속에서 고개를 빼꼼 내밀고 휴식할 때 듣는 맑고 따뜻한 힐링 음악.",
        url: "https://www.youtube.com/results?search_query=relaxing+warm+ambient+music"
      }
    ],
    render() {
      const container = document.getElementById('musicList');
      if (!container) return;
      
      container.innerHTML = this.playlists.map(p => `
        <div class="polaroid-card">
          <div class="tape-center"></div>
          <div class="sticker-tag">${p.page}</div>
          
          <div class="polaroid-img-box">
            <img src="${p.img}" alt="${p.title}" style="${p.style || 'object-position: center;'}" loading="lazy">
          </div>
  
          <h3>${p.title}</h3>
          <p class="work-name">${p.sub}</p>
          <p class="desc">"${p.desc}"</p>
          <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="diary-btn-link" style="text-decoration:none; display:inline-block;">
            음원 감상하기 ➔
          </a>
        </div>
      `).join('');
    }
  };