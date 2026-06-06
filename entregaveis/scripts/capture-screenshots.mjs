import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const printsDir = path.join(__dirname, "..", "prints");
const baseUrl = process.env.EXPO_WEB_URL || "http://localhost:8082";
const MASTER_EMAIL = "master@montecristo.org";
const MASTER_PASSWORD = "CozinhaMae2026!";

if (!fs.existsSync(printsDir)) {
  fs.mkdirSync(printsDir, { recursive: true });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  const file = path.join(printsDir, name);
  await page.screenshot({ path: file, fullPage: true });
  console.log("OK:", name);
}

async function clickText(page, text, timeout = 12000) {
  const el = page.getByText(text, { exact: false }).first();
  await el.waitFor({ state: "visible", timeout });
  await el.click();
}

async function goHome(page) {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90000 });
  await wait(3500);
}

async function fillLogin(page) {
  const inputs = page.locator("input");
  const count = await inputs.count();
  if (count >= 2) {
    await inputs.nth(0).fill(MASTER_EMAIL);
    await inputs.nth(1).fill(MASTER_PASSWORD);
  }
}

async function waitForDashboard(page, timeout = 45000) {
  await page.getByText("RETIRADAS").first().waitFor({ state: "visible", timeout });
  await wait(1500);
}

async function doLogin(page) {
  await goHome(page);
  const onLogin = await page.getByText("Acesso").first().isVisible().catch(() => false);
  if (onLogin) {
    await fillLogin(page);
    await clickText(page, "Entrar");
    await waitForDashboard(page);
  }
}

async function scrollAndClick(page, text) {
  for (let i = 0; i < 8; i += 1) {
    const el = page.getByText(text, { exact: false }).first();
    if (await el.isVisible().catch(() => false)) {
      await el.scrollIntoViewIfNeeded();
      await el.click();
      return;
    }
    await page.evaluate(() => window.scrollBy(0, 500));
    await wait(400);
  }
  await clickText(page, text);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await goHome(page);
  await shot(page, "01-login.png");
  await fillLogin(page);
  await clickText(page, "Entrar");
  await waitForDashboard(page);
  await shot(page, "02-dashboard.png");

  // Retiradas
  await clickText(page, "RETIRADAS");
  await wait(2000);
  await shot(page, "03-retirada-configuracao.png");
  await clickText(page, "Gerar lista semanal");
  await wait(2500);
  await shot(page, "04-retirada-lista-gerada.png");

  // Cadastro — nova sessão no dashboard
  await doLogin(page);
  await scrollAndClick(page, "Cadastro de Famílias");
  await wait(2000);
  await shot(page, "05-cadastro-familias.png");

  // Alimentos
  await doLogin(page);
  await scrollAndClick(page, "Controle de Alimentos");
  await wait(2000);
  await shot(page, "06-alimentos.png");

  // Relatórios
  await doLogin(page);
  await scrollAndClick(page, "Relatórios");
  await wait(2000);
  await shot(page, "07-relatorios.png");

  // Dashboard com gráficos (scroll completo)
  await doLogin(page);
  await wait(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "08-dashboard-visao-geral.png");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await wait(800);
  await shot(page, "09-dashboard-operacao.png");

  await browser.close();
  console.log("Capturas salvas em", printsDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
