const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const bannersDir = path.join(distDir, "banners");
const outputDir = path.join(rootDir, "packages");

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function cleanDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  ensureDir(dirPath);
}

function listBannerIds() {
  if (!fs.existsSync(bannersDir)) {
    return [];
  }

  return fs.readdirSync(bannersDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function getAssetRefs(htmlContent) {
  const refs = new Set();
  const pattern = /(?:src|href)="([^"]+)"/g;

  let match;
  while ((match = pattern.exec(htmlContent)) !== null) {
    const value = match[1];
    if (!value || value.startsWith("http") || value.startsWith("#") || value.startsWith("data:")) {
      continue;
    }

    refs.add(value);
  }

  return [...refs];
}

function bannerPackageSize(packagePath) {
  let total = 0;

  const walk = (folder) => {
    for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
      const fullPath = path.join(folder, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
      } else {
        total += fs.statSync(fullPath).size;
      }
    }
  };

  walk(packagePath);
  return total;
}

function buildPackages() {
  const ids = listBannerIds();
  cleanDir(outputDir);

  if (!ids.length) {
    console.log("No banners found in dist/banners.");
    return;
  }

  for (const id of ids) {
    const bannerDistDir = path.join(bannersDir, id);
    const sourceHtmlPath = path.join(bannerDistDir, "index.html");

    if (!fs.existsSync(sourceHtmlPath)) {
      continue;
    }

    const packageDir = path.join(outputDir, id);
    const packageAssetsDir = path.join(packageDir, "assets");

    ensureDir(packageAssetsDir);

    let htmlContent = fs.readFileSync(sourceHtmlPath, "utf8");
    const refs = getAssetRefs(htmlContent);

    for (const ref of refs) {
      const sourceRefPath = path.resolve(path.dirname(sourceHtmlPath), ref);
      if (!fs.existsSync(sourceRefPath)) {
        continue;
      }

      const fileName = path.basename(sourceRefPath);
      const targetPath = path.join(packageAssetsDir, fileName);
      fs.copyFileSync(sourceRefPath, targetPath);

      const normalizedRef = ref.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      htmlContent = htmlContent.replace(new RegExp(normalizedRef, "g"), `./assets/${fileName}`);
    }

    fs.writeFileSync(path.join(packageDir, "index.html"), htmlContent, "utf8");

    const totalBytes = bannerPackageSize(packageDir);
    const totalKb = Math.round((totalBytes / 1024) * 100) / 100;
    const status = totalKb <= 150 ? "OK" : "OVER";
    console.log(`${id}: ${totalKb} KB (${status})`);
  }
}

buildPackages();
