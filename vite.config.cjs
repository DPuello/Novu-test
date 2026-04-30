const fs = require("node:fs");
const path = require("node:path");
const { defineConfig } = require("vite");

const rootDir = __dirname;
const bannersDir = path.join(rootDir, "banners");
const previewEntry = path.join(rootDir, "index.html");
const emailEntry = path.join(rootDir, "email", "index.html");

function parseAdSize(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const adSizeMatch = html.match(/<meta[^>]+name=["']ad\.size["'][^>]+content=["']width=(\d+),height=(\d+)["']/i);

  if (!adSizeMatch) {
    return { width: 300, height: 250 };
  }

  return {
    width: Number(adSizeMatch[1]),
    height: Number(adSizeMatch[2])
  };
}

function getBannerList() {
  if (!fs.existsSync(bannersDir)) {
    return [];
  }

  return fs
    .readdirSync(bannersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const htmlPath = path.join(bannersDir, entry.name, "index.html");
      if (!fs.existsSync(htmlPath)) {
        return null;
      }

      const size = parseAdSize(htmlPath);
      return {
        id: entry.name,
        route: `./banners/${entry.name}/`,
        width: size.width,
        height: size.height
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.id.localeCompare(b.id));
}

const banners = getBannerList();

const htmlInputs = {
  preview: previewEntry,
  email: emailEntry
};

for (const banner of banners) {
  htmlInputs[`banner-${banner.id}`] = path.join(bannersDir, banner.id, "index.html");
}

module.exports = defineConfig({
  base: "./",
  define: {
    __BANNER_LIST__: JSON.stringify(banners)
  },
  server: {
    open: "/"
  },
  build: {
    outDir: "dist",
    modulePreload: {
      polyfill: false
    },
    rollupOptions: {
      input: htmlInputs
    }
  }
});
