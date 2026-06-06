import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const entregaveisDir = path.join(__dirname, "..");
const css = fs.readFileSync(path.join(entregaveisDir, "abnt-style.css"), "utf8");

const files = [
  "07-relatorio-parcial.md",
  "08-evidencias-validacao.md",
  "09-metricas-impacto.md",
  "04-relatorio-final.md",
];

function convertLine(line) {
  if (!line.trim()) return "";
  if (line.startsWith("# ")) return `<h1>${line.slice(2)}</h1>`;
  if (line.startsWith("## ")) return `<h2>${line.slice(3)}</h2>`;
  if (line.startsWith("### ")) return `<h3>${line.slice(4)}</h3>`;
  if (line === "---") return "<hr />";
  if (line.startsWith("> ")) return `<blockquote><p>${fmt(line.slice(2))}</p></blockquote>`;
  if (line.startsWith("![")) {
    const m = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    if (!m) return "";
    const abs = path.resolve(entregaveisDir, m[2]);
    if (!fs.existsSync(abs)) {
      return `<p><em>[Imagem não encontrada: ${m[2]}]</em></p>`;
    }
    const ext = path.extname(abs).slice(1).toLowerCase() || "png";
    const mime = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : `image/${ext}`;
    const data = fs.readFileSync(abs).toString("base64");
    const src = `data:${mime};base64,${data}`;
    return `<figure><img src="${src}" alt="${m[1]}" /><figcaption><em>${m[1]}</em></figcaption></figure>`;
  }
  if (line.startsWith("|")) return line;
  if (line.startsWith("```")) return line;
  return `<p>${fmt(line)}</p>`;
}

function fmt(s) {
  return s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function mdToHtml(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("<")) {
      out.push(line);
      i += 1;
      continue;
    }
    if (line.startsWith("|")) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(lines[i]);
        i += 1;
      }
      const dataRows = rows.filter((r) => !/^\|[\s\-:|]+\|$/.test(r));
      out.push("<table>");
      dataRows.forEach((row, idx) => {
        const cells = row.split("|").slice(1, -1).map((c) => c.trim());
        const tag = idx === 0 ? "th" : "td";
        out.push("<tr>" + cells.map((c) => `<${tag}>${fmt(c)}</${tag}>`).join("") + "</tr>");
      });
      out.push("</table>");
      continue;
    }
    if (line.startsWith("```")) {
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      out.push(`<pre><code>${code.join("\n")}</code></pre>`);
      i += 1;
      continue;
    }
    out.push(convertLine(line));
    i += 1;
  }
  return out.filter(Boolean).join("\n");
}

async function generatePdf(browser, filename) {
  const md = fs.readFileSync(path.join(entregaveisDir, filename), "utf8");
  const body = mdToHtml(md);
  const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><style>
${css}
figure { text-align:center; page-break-inside:avoid; margin: 16px 0; }
img { max-width: 14cm; height: auto; border: 1px solid #999; }
figcaption { font-size: 10pt; margin-top: 6px; }
table { page-break-inside: avoid; }
h1 { page-break-before: auto; }
</style></head><body>${body}</body></html>`;

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1000);
  const pdfPath = path.join(entregaveisDir, filename.replace(".md", ".pdf"));
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "2cm", right: "2cm", bottom: "2cm", left: "3cm" },
  });
  await page.close();
  console.log("OK:", path.basename(pdfPath));
}

async function main() {
  const browser = await chromium.launch();
  for (const f of files) await generatePdf(browser, f);
  await browser.close();
  console.log("PDFs em:", entregaveisDir);
}

main().catch((e) => { console.error(e); process.exit(1); });
