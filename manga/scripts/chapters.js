
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
  const container = document.getElementById("chapter-container");
  const titleElem = document.getElementById("story-name");

  const stories = await fetchStories();
  const story = stories.find(s => s.id === storyId);
  if (!story) {
    container.innerHTML = "<li>Không tìm thấy truyện.</li>";
    return;
  }

  titleElem.textContent = story.name;

  if (!story.chapters || story.chapters.length === 0) {
    container.innerHTML = "<li>Không có chương nào.</li>";
    return;
  }

  story.chapters.forEach(chap => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="reader.html?id=${storyId}&chap=${chap.id}">${chap.name}</a>`;
    container.appendChild(li);
  });
});
