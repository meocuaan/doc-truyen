
async function fetchStories() {
  try {
    const res = await fetch("stories.json");
    return await res.json();
  } catch (e) {
    console.error("Không thể tải stories.json:", e);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("history-stories");
  const history = JSON.parse(localStorage.getItem("readingHistory")) || [];

  if (history.length === 0) {
    container.innerHTML = "<p>Chưa có lịch sử đọc.</p>";
    return;
  }

  const stories = await fetchStories();

  history.reverse().forEach(entry => {
    const story = stories.find(s => s.id === entry.storyId);
    if (!story) return;

    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <img src="${story.cover}" alt="Bìa truyện">
      <h3>${story.name}</h3>
      <p>Chương cuối đọc: ${entry.chapter}</p>
      <button onclick="location.href='reader.html?id=${story.id}&chap=${entry.chapter}'">Tiếp tục đọc</button>
    `;
    container.appendChild(card);
  });
});
