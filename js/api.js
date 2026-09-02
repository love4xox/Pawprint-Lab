const ApiService = {
    async generateStory(animalName, breedType, details) {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animal_name: animalName, breed_type: breedType, details })
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || '생성 실패');
      return data.reply;
    }
  };

  // 디스코드 웹훅 전송 API 호출
async function sendToDiscord(animalName, content) {
  try {
    const response = await fetch('/api/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        animalName: animalName,
        content: content
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || '디스코드 전송 실패');
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}