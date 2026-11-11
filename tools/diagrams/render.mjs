// Renders an SVG diagram to PNG: node tools/diagrams/render.mjs <file.svg> [file.png] (PLAYWRIGHT_CORE as for the screenshots).
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const svg = path.resolve(process.argv[2] || 'docs/diagrams/workflow.svg');
const png = path.resolve(process.argv[3] || svg.replace(/\.svg$/, '.png'));
const m = fs.readFileSync(svg, 'utf8').match(/width="(\d+)" height="(\d+)"/);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(m[1]), height: Number(m[2]) }, deviceScaleFactor: 1.5 });
await p.goto(`file://${svg}`);
await p.screenshot({ path: png });
await b.close();
