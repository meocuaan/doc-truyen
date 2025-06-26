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
  const params = new URLSearchParams(window.location.search);
  const storyId = params.get("id");
  const chapterId = params.get("chap");

  const stories = await fetchStories();
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  const select = document.getElementById("chapter-select");
  const container = document.getElementById("image-container");
  const title = document.getElementById("chapter-title");
  const btnPrev = document.getElementById("prev-chap");
  const btnNext = document.getElementById("next-chap");

  function loadChapter(chapId) {
    const chap = story.chapters.find(c => c.id === chapId);
    if (!chap) return;
    container.innerHTML = "";
    title.textContent = chap.name || chap.id;
    chap.images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      container.appendChild(img);
    });

    // Lưu lịch sử đọc
    localStorage.setItem("readingHistory", JSON.stringify([{ storyId, chapter: chapId, title: story.name }]));
  }

  function populateChapters() {
    story.chapters.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.text = c.name || c.id;
      if (c.id === chapterId) opt.selected = true;
      select.appendChild(opt);
    });
    loadChapter(chapterId || story.chapters[0]?.id);
  }

  // Điều hướng chương
  select.addEventListener("change", () => loadChapter(select.value));
  btnPrev.addEventListener("click", () => {
    const i = story.chapters.findIndex(c => c.id === select.value);
    if (i > 0) {
      select.value = story.chapters[i - 1].id;
      loadChapter(story.chapters[i - 1].id);
    }
  });
  btnNext.addEventListener("click", () => {
    const i = story.chapters.findIndex(c => c.id === select.value);
    if (i < story.chapters.length - 1) {
      select.value = story.chapters[i + 1].id;
      loadChapter(story.chapters[i + 1].id);
    }
  });

  document.getElementById("save-progress")?.addEventListener("click", () => {
    alert("📌 Vị trí đọc đã được lưu!");
  });

  populateChapters();
});
