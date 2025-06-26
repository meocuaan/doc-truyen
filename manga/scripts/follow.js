
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
  const container = document.getElementById("followed-stories");
  const followed = JSON.parse(localStorage.getItem("followedStories")) || [];
  if (followed.length === 0) {
    container.innerHTML = "<p>Bạn chưa theo dõi truyện nào.</p>";
    return;
  }

  followed.forEach(story => {
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `
      <a href="story.html?id=${story.id}">
        <img src="${story.cover}" alt="${story.title}">
        <h3>${story.title}</h3>
        <p>${story.description}</p>
      </a>
    `;
    container.appendChild(card);
  });
});
