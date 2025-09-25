// Node 20+. Fetches RSS/Atom XML from sources and writes feeds.json
import fs from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const FEEDS = [
  // Enterprise / Tech
  'https://techcrunch.com/category/enterprise/feed/',
  'https://www.theregister.com/headlines.atom',
  'https://www.tomshardware.com/feeds.xml',
  'https://www.nextplatform.com/feed/',
  'https://siliconangle.com/feed/',
  // Data center
  'https://www.datacenterdynamics.com/en/rss/',
  'https://www.datacenterknowledge.com/rss.xml',
  // AI
  'https://venturebeat.com/category/ai/feed/',
  'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
  'https://www.artificialintelligence-news.com/feed/',
  'https://syncedreview.com/feed/',
  'https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml',
];

async function fetchText(u){
  try {
    const res = await fetch(u, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return { url: u, ok: true, text };
  } catch (e) {
    return { url: u, ok: false, error: String(e) };
  } finally {
    await delay(200 + Math.random()*300); // polite stagger
  }
}

async function main(){
  const results = await Promise.all(FEEDS.map(fetchText));
  const out = { fetched_at: new Date().toISOString(), results };
  const file = path.join(process.cwd(), 'feeds.json');
  await fs.writeFile(file, JSON.stringify(out, null, 2), 'utf8');
  console.log('Wrote', file);
}

main().catch(err => { console.error(err); process.exit(1); });
