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
  const stories = await fetchStories();
  const story = stories.find(s => s.id === storyId);
  if (!story) return;

  // Hiển thị thông tin
  document.getElementById("story-title").textContent = story.name;
  document.getElementById("story-cover").src = story.cover;
  document.getElementById("story-description").textContent = story.description;
  document.querySelector("#story-genre span").textContent = story.genre;

  // Danh sách chương
  const chapterList = document.getElementById("chapter-list");
  story.chapters.forEach((chap) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="reader.html?id=${story.id}&chap=${chap.id}">${chap.name}</a>`;
    chapterList.appendChild(li);
  });

  // Nút đọc từ đầu / mới nhất / tiếp tục
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

  // Theo dõi truyện
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
      alert("✅ Đã thêm vào danh sách theo dõi.");
    } else {
      alert("🔔 Truyện đã có trong danh sách theo dõi.");
    }
  };
});
