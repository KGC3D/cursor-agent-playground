import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const title = await page.textContent('.app-title');
  const liveCount = await page.locator('.match-card.is-live').count();
  const groups = await page.locator('.standings-card').count();

  console.log('Title:', title);
  console.log('Live matches:', liveCount);

  await page.click('button:has-text("Groups")');
  await page.waitForTimeout(1000);
  const groupCount = await page.locator('.standings-card').count();
  console.log('Groups loaded:', groupCount);

  await page.click('button:has-text("Bracket")');
  await page.waitForTimeout(1000);
  const bracketRounds = await page.locator('.bracket-round').count();
  console.log('Bracket rounds:', bracketRounds);

  await browser.close();
}

main().catch(console.error);
