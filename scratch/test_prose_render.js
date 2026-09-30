const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test rendering in standard Tailwind prose
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com?plugins=typography"></script>
      </head>
      <body class="p-8 bg-slate-50">
        <div class="prose prose-slate max-w-none bg-white p-6 rounded-2xl border">
          <p><strong>สรุปสถาปัตยกรรมระบบเว็บแอปพลิเคชันยุคใหม่ (Full-Stack Web Architecture) สำหรับนักศึกษาสายไอทีและผู้เริ่มต้นพัฒนาซอฟต์แวร์</strong></p>
          
          <p>&nbsp;</p>
          <p><strong>1. Frontend (ส่วนติดต่อผู้ใช้งาน - Client Side)</strong></p>
          <p>• หน้าที่: นำเสนอข้อมูล โต้ตอบกับผู้ใช้ จัดการสถานะ UI และรับ Input</p>
          <p>• เทคโนโลยีหลัก: HTML5, CSS3/Tailwind, JavaScript/TypeScript, React, Vue, Next.js</p>
          <p>• หัวใจสำคัญ: Responsive Design, Accessibility (a11y), และ State Management</p>

          <p>&nbsp;</p>
          <p><strong>2. Backend (ระบบประมวลผล - Server Side)</strong></p>
          <p>• หน้าที่: ตรวจสอบความถูกต้อง (Validation), ประมวลผล Business Logic, และรักษาความปลอดภัย (Authentication & Authorization)</p>
          <p>• เทคโนโลยีหลัก: Node.js/Express, Python/FastAPI, Go, Java/Spring Boot</p>
          <p>• หัวใจสำคัญ: Scalability, Rate Limiting, CORS, Error Handling, และ Session/JWT</p>

          <p>&nbsp;</p>
          <p><strong>3. Database (ระบบฐานข้อมูล)</strong></p>
          <p>• SQL (Relational): PostgreSQL, MySQL ข้อมูลมีโครงสร้างชัดเจน (Schema) รองรับ ACID Transactions</p>
          <p>• NoSQL (Document/Key-Value): MongoDB, Redis เหมาะสำหรับข้อมูลยืดหยุ่นและการทำ Caching ประสิทธิภาพสูง</p>

          <p>&nbsp;</p>
          <p><strong>4. API (Application Programming Interface)</strong></p>
          <p>• RESTful API: ใช้ HTTP Methods (GET, POST, PUT, DELETE) สื่อสารผ่าน JSON Payload</p>
          <p>• WebSocket / Socket.io: การสื่อสารแบบ Two-Way Real-time Full-Duplex สำหรับ Live Feed หรือ Chat</p>
          <p>• Status Codes สำคัญ: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error</p>

          <p>&nbsp;</p>
          <p><em>*ดาวน์โหลดสไลด์สรุป Architecture Diagram และ Code Examples ในไฟล์ PDF แนบด้านล่าง*</em></p>
        </div>
      </body>
    </html>
  `);

  await page.screenshot({ path: 'scratch/test_prose_render.png', fullPage: true });
  console.log('Saved test render');
  await browser.close();
})();
