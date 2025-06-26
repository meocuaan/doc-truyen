// story-reader.js

async function fetchStories() {
  try {
    const res = await fetch("stories.json");
    return await res.json();
  } catch (e) {
    console.error("Không thể tải stories.json:", e);
    return [];
  }
}

// ==========================
// 📘 Trang: story.html
// ==========================
export async function initStoryDetail() {
  const params = new URLSearchParams(location.search);
  const storyId = params.get("id");
  const stories = await fetchStories();
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  document.getElementById("story-title").textContent = story.name;
  document.getElementById("story-cover").src = story.cover;
  document.getElementById("story-description").textContent = story.description;
  document.querySelector("#story-genre span").textContent = story.genre;

  const chapterList = document.getElementById("chapter-list");
  story.chapters?.forEach((chap) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="reader.html?id=${story.id}&chap=${chap.id}">${chap.name || chap.id}</a>`;
    chapterList.appendChild(li);
  });

  document.getElementById("read-first").onclick = () => {
    location.href = `reader.html?id=${story.id}&chap=${story.chapters[0].id}`;
  };

  document.getElementById("read-latest").onclick = () => {
    const last = story.chapters[story.chapters.length - 1];
    location.href = `reader.html?id=${story.id}&chap=${last.id}`;
  };

  document.getElementById("read-continue").onclick = () => {
    const history = JSON.parse(localStorage.getItem("readingHistory")) || [];
    const record = history.find(h => h.storyId === story.id);
    if (record) {
      location.href = `reader.html?id=${story.id}&chap=${record.chapter}`;
    } else {
      alert("Bạn chưa đọc truyện này trước đó.");
    }
  };

  document.getElementById("follow-story").onclick = () => {
    let followed = JSON.parse(localStorage.getItem("followedStories")) || [];
    if (!followed.some(f => f.id === story.id)) {
      followed.push({
        id: story.id,
        title: story.name,
        description: story.description,
        cover: story.cover
      });
      localStorage.setItem("followedStories", JSON.stringify(followed));
      alert("Đã thêm vào danh sách theo dõi.");
    } else {
      alert("Truyện đã có trong danh sách theo dõi.");
    }
  };
}

// ==========================
// 📖 Trang: reader.html
// ==========================
export async function initReaderPage() {
  const params = new URLSearchParams(location.search);
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

    chap.images?.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      container.appendChild(img);
    });

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
    loadChapter(chapterId || story.chapters[0].id);
  }

  select.addEventListener("change", () => loadChapter(select.value));

  btnPrev.addEventListener("click", () => {
    const index = story.chapters.findIndex(c => c.id === select.value);
    if (index > 0) {
      select.value = story.chapters[index - 1].id;
      loadChapter(select.value);
    }
  });

  btnNext.addEventListener("click", () => {
    const index = story.chapters.findIndex(c => c.id === select.value);
    if (index < story.chapters.length - 1) {
      select.value = story.chapters[index + 1].id;
      loadChapter(select.value);
    }
  });

  document.getElementById("save-progress")?.addEventListener("click", () => {
    alert("Vị trí đọc đã được lưu!");
  });

  populateChapters();
}
