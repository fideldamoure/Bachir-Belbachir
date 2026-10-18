const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const nm = (p) => path.join(root, "node_modules", p);
const www = path.join(root, "www");
const vendor = path.join(www, "vendor");

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from)) {
    const s = path.join(from, f);
    const d = path.join(to, f);
    fs.statSync(s).isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

copyFile(path.join(root, "src", "index.html"), path.join(www, "index.html"));

copyFile(
  nm("@fortawesome/fontawesome-free/css/all.min.css"),
  path.join(vendor, "fontawesome/css/all.min.css")
);
copyDir(
  nm("@fortawesome/fontawesome-free/webfonts"),
  path.join(vendor, "fontawesome/webfonts")
);

const weights = [300, 400, 600, 700, 800];
const subsets = {
  arabic:
    "U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC",
  latin:
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
};
let fontCss = "";
for (const w of weights) {
  for (const [subset, range] of Object.entries(subsets)) {
    const file = `cairo-${subset}-${w}-normal.woff2`;
    const src = nm(`@fontsource/cairo/files/${file}`);
    if (!fs.existsSync(src)) {
      console.warn("Missing font file:", file);
      continue;
    }
    copyFile(src, path.join(vendor, "fonts", file));
    fontCss += `@font-face{font-family:'Cairo';font-style:normal;font-weight:${w};font-display:swap;src:url('fonts/${file}') format('woff2');unicode-range:${range};}\n`;
  }
}
fs.writeFileSync(path.join(vendor, "fonts.css"), fontCss);

copyFile(nm("jspdf/dist/jspdf.umd.min.js"), path.join(vendor, "jspdf.umd.min.js"));
copyFile(nm("html2canvas/dist/html2canvas.min.js"), path.join(vendor, "html2canvas.min.js"));

console.log("www/ is ready.");
