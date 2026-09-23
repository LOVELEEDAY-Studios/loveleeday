// Screenshot every concept page at desktop (full page) and phone (first screen), write board
// thumbnails, and build two contact sheets for review.
// node scripts/concept-shots.mjs <baseUrl> <conceptsDir> <sheetOutDir>
import { chromium } from "playwright";
import fs from "fs";
import { execFileSync } from "child_process";
const [base, dir, sheetDir] = process.argv.slice(2);
const names = fs.readdirSync(dir).filter((f) => /^c\d-.*\.html$/.test(f)).map((f) => f.replace(".html", "")).sort();
const shots = `${dir}/shots`;
fs.mkdirSync(shots, { recursive: true });
for (const f of fs.readdirSync(shots)) fs.unlinkSync(`${shots}/${f}`);
const b = await chromium.launch();
for (const n of names) {
  for (const [w, h, suffix, full] of [[1440, 900, "full", true], [390, 844, "phone", false]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    await p.goto(`${base}/${n}.html`, { waitUntil: "load" });
    await p.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `${shots}/${n}-${suffix}.png`, fullPage: full });
    await p.close();
  }
}
await b.close();
const py = `
from PIL import Image
import glob,os
d='${shots}'
fs=sorted(glob.glob(d+'/*-full.png'))
for f in fs:
  im=Image.open(f).convert('RGB'); t=im.copy(); t.thumbnail((720,6000)); t.save(f.replace('-full.png','-thumb.jpg'),quality=82)
def sheet(files,out,box):
  ims=[Image.open(f).convert('RGB') for f in files]
  for i in ims: i.thumbnail(box)
  g=Image.new('RGB',(sum(i.width for i in ims)+20*len(ims),max(i.height for i in ims)),'white'); x=0
  for i in ims: g.paste(i,(x,0)); x+=i.width+20
  g.thumbnail((2400,3000)); g.save(out)
sheet(fs,'${sheetDir}/concepts-desktop.png',(440,9000))
sheet(sorted(glob.glob(d+'/*-phone.png')),'${sheetDir}/concepts-phone.png',(390,844))
for f in glob.glob(d+'/*.png'): os.remove(f)
`;
execFileSync("python3", ["-c", py], { stdio: "inherit" });
console.log(names.join(" "));
