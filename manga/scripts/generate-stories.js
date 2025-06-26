const fs = require("fs");
const path = require("path");

const ASSETS_DIR = path.join(__dirname, "assets");
const OUTPUT_FILE = path.join(__dirname, "stories.json");

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter(file =>
    fs.statSync(path.join(srcPath, file)).isDirectory()
  );
}

function getImageFiles(folderPath) {
  return fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => path.join(folderPath, file).replace(/\\/g, "/"));
}

function generateStories() {
  const stories = [];

  const storyDirs = getDirectories(ASSETS_DIR);

  storyDirs.forEach(storyId => {
    const storyPath = path.join(ASSETS_DIR, storyId);
    const coverPath = path.join(storyPath, "cover.jpg");
    const chapters = [];

    getDirectories(storyPath).forEach(chapId => {
      if (chapId.toLowerCase() === "phiêu hành") return; // bỏ thư mục đặc biệt nếu có

      const chapPath = path.join(storyPath, chapId);
      const imagePaths = getImageFiles(chapPath);

      if (imagePaths.length > 0) {
        chapters.push({
          id: chapId,
          name: `Chương ${chapId.replace(/\D/g, "") || chapId}`,
          images: imagePaths
        });
      }
    });

    stories.push({
      id: storyId,
      name: storyId.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim(),
      description: `Truyện ${storyId}`,
      genre: "Không rõ",
      cover: fs.existsSync(coverPath)
        ? path.join("assets", storyId, "cover.jpg").replace(/\\/g, "/")
        : "",
      chapters
    });
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stories, null, 2), "utf8");
  console.log("✅ Đã tạo xong stories.json!");
}

generateStories();
