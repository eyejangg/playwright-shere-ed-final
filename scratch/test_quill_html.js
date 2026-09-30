const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: 'playwright/.auth/member.json' });
  const page = await context.newPage();

  await page.goto('https://share-ed.online/create', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const testDetail = `สรุปบทเรียนวิชาคณิตศาสตร์ เรื่อง "สมการเชิงเส้นตัวแปรเดียว"

1. นิยามและรูปแบบมาตรฐาน
- สมการเชิงเส้นตัวแปรเดียว คือ สมการที่มีตัวแปรเพียงตัวเดียวและเลขชี้กำลังของตัวแปรเท่ากับ 1
- รูปแบบทั่วไป: ax + b = 0 เมื่อ a และ b เป็นค่าคงตัว

2. สมบัติการเท่ากัน
- สมบัติการบวกและลบ: บวกหรือลบด้วยจำนวนที่เท่ากัน
- สมบัติการคูณและหาร: คูณหรือหารด้วยจำนวนที่เท่ากัน

*ดาวน์โหลดสรุปสูตรในไฟล์ PDF แนบด้านล่าง*`;

  // Convert text paragraphs to HTML <p>
  const html = testDetail.split('\n\n').map(para => {
    return `<p>${para.split('\n').join('<br>')}</p><p><br></p>`;
  }).join('');

  console.log('Formatted HTML:\n', html);

  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await editor.evaluate((el, content) => {
    el.innerHTML = content;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, html);

  await page.waitForTimeout(1000);
  const editorHtml = await editor.innerHTML();
  console.log('\nEditor InnerHTML after set:\n', editorHtml);

  await browser.close();
})();
