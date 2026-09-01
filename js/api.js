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