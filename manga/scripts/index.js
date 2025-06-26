(async function () {
  try {
    const res = await fetch("stories.json?" + Date.now()); // chống cache
    const stories = await res.json();
    initPage(stories);
  } catch (err) {
    console.error("Không thể tải stories.json:", err);
    initPage([]); // fallback rỗng
  }
})();

function initPage(stories) {
  const storyListEl = document.getElementById("story-list");
  const genreFilterEl = document.getElementById("genre-filter");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const searchInput = document.getElementById("search-input");
  const searchSuggestions = document.getElementById("search-suggestions");

  const genres = [...new Set(stories.flatMap(s => (s.genre || "").split(", ").map(g => g.trim())))];
  let currentPage = 1;
  const storiesPerPage = 8;
  let filteredStories = [...stories];

  function renderStories(list) {
    storyListEl.innerHTML = "";
    const start = (currentPage - 1) * storiesPerPage;
    const currentStories = list.slice(start, start + storiesPerPage);

    currentStories.forEach(story => {
      const card = document.createElement("div");
      card.className = "story-card";
      card.innerHTML = `
        <a href="story.html?id=${story.id}">
          <img src="${story.cover}" alt="${story.name}">
          <div class="story-info">
            <h3>${story.name}</h3>
            <p>${story.description || "Không có mô tả."}</p>
          </div>
        </a>
      `;
      storyListEl.appendChild(card);
    });

    renderPagination(list.length);
  }

  function renderPagination(total) {
    const paginationEl = document.getElementById("pagination");
    paginationEl.innerHTML = "";
    const pageCount = Math.ceil(total / storiesPerPage);
    for (let i = 1; i <= pageCount; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      if (i === currentPage) btn.classList.add("active");
      btn.onclick = () => {
        currentPage = i;
        renderStories(filteredStories);
      };
      paginationEl.appendChild(btn);
    }
  }

  function renderGenres() {
    genreFilterEl.innerHTML = "";
    genres.forEach(g => {
      const btn = document.createElement("button");
      btn.textContent = g;
      btn.onclick = () => {
        currentPage = 1;
        filteredStories = stories.filter(st => st.genre.includes(g));
        renderStories(filteredStories);
      };
      genreFilterEl.appendChild(btn);
    });

    const btnAll = document.createElement("button");
    btnAll.textContent = "Tất cả";
    btnAll.onclick = () => {
      currentPage = 1;
      filteredStories = [...stories];
      renderStories(filteredStories);
    };
    genreFilterEl.prepend(btnAll);
  }

  // Scroll top
  scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  window.addEventListener("scroll", () => {
    scrollTopBtn.classList.toggle("show", window.scrollY > 300);
  });

  // Tìm kiếm
  searchInput.addEventListener("input", function () {
    const value = this.value.trim().toLowerCase();
    searchSuggestions.innerHTML = "";
    if (!value) return;

    const matched = stories.filter(s => s.name.toLowerCase().includes(value));
    matched.forEach(st => {
      const li = document.createElement("li");
      li.textContent = st.name;
      li.onclick = () => {
        window.location.href = `story.html?id=${st.id}`;
      };
      searchSuggestions.appendChild(li);
    });
  });

  renderGenres();
  renderStories(filteredStories);
}
