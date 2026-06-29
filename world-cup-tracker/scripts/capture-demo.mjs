import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';

const OUT = '/opt/cursor/artifacts/screenshots';
const URL = 'http://localhost:5173';

async function screenshot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`Saved ${name}.png`);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await screenshot(page, '01-live-scores');

  // Schedule tab
  await page.click('button:has-text("Schedule")');
  await page.waitForTimeout(500);
  await screenshot(page, '02-schedule');

  // Groups tab
  await page.click('button:has-text("Groups")');
  await page.waitForTimeout(500);
  await screenshot(page, '03-standings');

  // Bracket tab - live view
  await page.click('button:has-text("Bracket")');
  await page.waitForTimeout(500);
  await screenshot(page, '04-bracket-live');

  // Simulator mode
  await page.click('button:has-text("Simulator")');
  await page.waitForTimeout(500);
  await screenshot(page, '05-bracket-simulator');

  // Pick some winners in R32
  const slots = page.locator('.bracket-slot.clickable');
  const count = await slots.count();
  for (let i = 0; i < Math.min(count, 8); i++) {
    await slots.nth(i).click();
    await page.waitForTimeout(150);
  }
  await page.waitForTimeout(500);
  await screenshot(page, '06-bracket-simulated');

  // Back to live
  await page.click('button:has-text("Live")');
  await page.waitForTimeout(500);
  await screenshot(page, '07-live-final');

  await browser.close();
  console.log('Done!');
}

main().catch(console.error);
