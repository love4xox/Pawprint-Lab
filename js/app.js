window.quickFillPreset = function(name, breed, notes) {
    document.getElementById('animalName').value = name;
    document.getElementById('breedType').value = breed;
    document.getElementById('details').value = notes;
    document.querySelector('[data-tab="generatorTab"]').click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const adoptForm = document.getElementById('adoptForm');
    const submitBtn = document.getElementById('submitBtn');
    const loadingBox = document.getElementById('loadingBox');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
  
    // Tab 전환
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target).classList.add('active');
  
        if (target === 'musicTab') MusicModule.render();
        if (target === 'archiveTab') UIModule.renderArchives();
      });
    });
  
    // 폼 제출
    adoptForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('animalName').value.trim();
      const breed = document.getElementById('breedType').value.trim();
      const details = document.getElementById('details').value.trim();
  
      submitBtn.disabled = true;
      loadingBox.classList.remove('hidden');
      document.getElementById('resultCard').classList.add('hidden');
  
      try {
        const story = await ApiService.generateStory(name, breed, details);
        UIModule.renderStoryResult(story);
  
        StorageService.saveArchive({
          id: Date.now(),
          name,
          breed,
          content: story,
          date: new Date().toLocaleDateString()
        });
      } catch (err) {
        alert(`오류가 발생했어요: ${err.message}`);
      } finally {
        loadingBox.classList.add('hidden');
        submitBtn.disabled = false;
      }
    });
  
    // 테마 전환 (Butter Pastel ↔ Y2K Pop Dream)
    themeToggleBtn.addEventListener('click', () => {
      const isNoir = document.documentElement.getAttribute('data-theme') === 'noir';
      if (isNoir) {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.textContent = '✨ 테마 바꾸기';
      } else {
        document.documentElement.setAttribute('data-theme', 'noir');
        themeToggleBtn.textContent = '🎀 라이트 모드';
      }
    });
  });