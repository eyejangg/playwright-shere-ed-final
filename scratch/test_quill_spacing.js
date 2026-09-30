const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const testDetail = `สรุปบทเรียนวิชาคณิตศาสตร์ เรื่อง "สมการเชิงเส้นตัวแปรเดียว"

1. นิยามและรูปแบบมาตรฐาน
- สมการเชิงเส้นตัวแปรเดียว คือ สมการที่มีตัวแปรเพียงตัวเดียว
- รูปแบบทั่วไป: ax + b = 0 เมื่อ a และ b เป็นค่าคงตัว

2. สมบัติการเท่ากันที่ใช้ในการแก้สมการ
- สมบัติการบวกและลบ: บวกหรือลบด้วยจำนวนที่เท่ากันทั้งสองข้าง
- สมบัติการคูณและหาร: คูณหรือหารด้วยจำนวนที่เท่ากันทั้งสองข้าง

*ดาวน์โหลดสรุปสูตรและแบบฝึกหัดในเอกสาร PDF แนบด้านล่าง*`;

  function formatDetailHtml(text) {
    const lines = text.split('\n');
    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        return '<p><br></p>';
      }
      if (/^\d+\./.test(trimmed)) {
        return `<p><strong>${trimmed}</strong></p>`;
      }
      return `<p>${trimmed}</p>`;
    }).join('');
  }

  const html = formatDetailHtml(testDetail);
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await editor.evaluate((el, content) => {
    el.innerHTML = content;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, html);

  await page.waitForTimeout(1000);
  console.log('Editor text:\n', await editor.innerText());
  console.log('\nEditor HTML:\n', await editor.innerHTML());

  await browser.close();
})();
