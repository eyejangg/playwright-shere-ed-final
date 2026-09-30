const path = require('path');

/**
 * Educational Posts Data (6 Posts)
 * ตามลำดับที่กำหนด:
 * 1. สมการเชิงเส้นตัวแปรเดียว
 * 2. ระบบสุริยะ
 * 3. 12 Tenses
 * 4. กฎการเคลื่อนที่ของนิวตัน
 * 5. โครงสร้างเซลล์
 * 6. Frontend Backend Database และ API
 */
const educationalPosts = [
  {
    id: 'post-1-equation',
    title: 'สมการเชิงเส้นตัวแปรเดียว: สรุปหลักการแก้สมการและโจทย์ปัญหา',
    searchTitle: 'สมการเชิงเส้นตัวแปรเดียว',
    grade: 'มัธยมศึกษาตอนต้น',
    subject: 'คณิตศาสตร์',
    summary: 'สรุปหลักการแก้สมการเชิงเส้นตัวแปรเดียว เทคนิคการย้ายข้าง การกระจายพจน์ และขั้นตอนการตีโจทย์ปัญหาทางคณิตศาสตร์ให้เป็นสมการอย่างถูกต้องแม่นยำ',
    tags: ['#คณิต', '#สมการ', '#สรุปย่อ'],
    detail: `สรุปบทเรียนวิชาคณิตศาสตร์ เรื่อง "สมการเชิงเส้นตัวแปรเดียว" สำหรับนักเรียนระดับมัธยมศึกษาตอนต้น

1. นิยามและรูปแบบมาตรฐาน
- สมการเชิงเส้นตัวแปรเดียว คือ สมการที่มีตัวแปรเพียงตัวเดียวและเลขชี้กำลังของตัวแปรเท่ากับ 1
- รูปแบบทั่วไป: ax + b = 0 เมื่อ a และ b เป็นค่าคงตัว และ a ≠ 0

2. สมบัติการเท่ากันที่ใช้ในการแก้สมการ
- สมบัติการบวกและลบ: บวกหรือลบด้วยจำนวนที่เท่ากันทั้งสองข้าง
- สมบัติการคูณและหาร: คูณหรือหารด้วยจำนวนที่เท่ากันทั้งสองข้าง (ตัวหารต้องไม่เท่ากับ 0)
- เทคนิคการย้ายข้าง: เปลี่ยนเครื่องหมายบวกเป็นลบ เปลี่ยนลบเป็นบวก เปลี่ยนคูณเป็นหาร เปลี่ยนหารเป็นคูณ

3. ขั้นตอนการแก้โจทย์ปัญหา
- ขั้นที่ 1: วิเคราะห์สิ่งที่โจทย์กำหนดให้และสิ่งที่โจทย์ต้องการทราบ
- ขั้นที่ 2: กำหนดตัวแปร x แทนปริมาณที่ต้องการหา
- ขั้นที่ 3: เขียนประโยคสัญลักษณ์หรือสมการตามเงื่อนไขในโจทย์
- ขั้นที่ 4: ดำเนินการแก้สมการหาค่า x
- ขั้นที่ 5: ตรวจคำตอบโดยนำค่า x ที่ได้ไปแทนในเงื่อนไขของโจทย์

*ดาวน์โหลดสรุปสูตรและแบบฝึกหัดพร้อมเฉลยในเอกสาร PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-1-equation/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-1-equation/gallery-1.png'),
      path.resolve(__dirname, 'post-1-equation/gallery-2.png'),
      path.resolve(__dirname, 'post-1-equation/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-1-equation/handbook.pdf')
  },
  {
    id: 'post-2-solar-system',
    title: 'ระบบสุริยะ: สรุปข้อมูลดาวเคราะห์และวัตถุท้องฟ้าในระบบสุริยะ',
    searchTitle: 'ระบบสุริยะ',
    grade: 'มัธยมศึกษาตอนต้น',
    subject: 'วิทยาศาสตร์',
    summary: 'สรุปความรู้ดาราศาสตร์เรื่องระบบสุริยะ ดาวเคราะห์ชั้นใน ดาวเคราะห์ชั้นนอก แถบดาวเคราะห์น้อย และดาวบริวารสำคัญในระบบสุริยะจักรวาลของเรา',
    tags: ['#วิทย์', '#อวกาศ', '#จักรวาล'],
    detail: `สรุปเนื้อหาวิทยาศาสตร์ดาราศาสตร์ เรื่อง "ระบบสุริยะ (The Solar System)"

1. ภาพรวมของระบบสุริยะ
- มีดวงอาทิตย์ (The Sun) เป็นศูนย์กลาง จัดเป็นดาวฤกษ์ที่มีมวลมากถึง 99.86% ของทั้งระบบ
- วัตถุท้องฟ้าโคจรรอบดวงอาทิตย์ด้วยแรงโน้มถ่วง แบ่งออกเป็นดาวเคราะห์ 8 ดวง ดาวเคราะห์แคระ ดาวเคราะห์น้อย และดาวหาง

2. การจำแนกประเภทดาวเคราะห์
- ดาวเคราะห์ชั้นใน (ดาวเคราะห์หิน): พุธ, ศุกร์, โลก, อังคาร มีพื้นผิวแข็งเป็นหินและโลหะ ขนาดค่อนข้างเล็กและไม่มีวงแหวน
- แถบดาวเคราะห์น้อย (Asteroid Belt): อยู่ระหว่างวงโคจรของดาวอังคารและดาวพฤหัสบดี
- ดาวเคราะห์ชั้นนอก (ดาวเคราะห์แก๊สยักษ์และน้ำแข็ง): พฤหัสบดี, เสาร์, ดาวยูเรนัส, ดาวเนปจูน ขนาดใหญ่ มีแก๊สหนาแน่นและมีระบบวงแหวน

3. จุดเด่นของดาวเคราะห์แต่ละดวง
- ดาวพุธ: เตาไฟแช่แข็ง อุณหภูมิกลางวันและกลางคืนต่างกันมากที่สุด
- ดาวศุกร์: ฝาแฝดโลก สว่างที่สุด ร้อนที่สุดเพราะปรากฏการณ์เรือนกระจก
- ดาวอังคาร: ดาวเคราะห์สีแดง มีร่องรอยของธารน้ำแข็งและภูเขาไฟโอลิมปัส
- ดาวพฤหัสบดี: ดาวเคราะห์ที่ใหญ่ที่สุด มีจุดแดงใหญ่ (Great Red Spot)
- ดาวเสาร์: วงแหวนที่สวยงามและเด่นชัดที่สุด สร้างจากน้ำแข็งและหิน

*สามารถศึกษาแผนผังวงโคจรและข้อมูลเปรียบเทียบในเอกสาร PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-2-solar-system/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-2-solar-system/gallery-1.png'),
      path.resolve(__dirname, 'post-2-solar-system/gallery-2.png'),
      path.resolve(__dirname, 'post-2-solar-system/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-2-solar-system/handbook.pdf')
  },
  {
    id: 'post-3-english-tenses',
    title: '12 Tenses ภาษาอังกฤษ: สรุปหลักการใช้ โครงสร้าง และตัวบอกเวลา',
    searchTitle: '12 Tenses',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ภาษาอังกฤษ',
    summary: 'สรุป 12 Tenses ภาษาอังกฤษแบบเข้าใจง่าย ทั้ง Present, Past, Future ครบทุกโครงสร้าง พร้อม Time Markers สำคัญสำหรับทำข้อสอบและใช้งานจริงในชีวิตประจำวัน',
    tags: ['#อังกฤษ', '#Tense', '#Grammar'],
    detail: `สรุปไวยากรณ์ภาษาอังกฤษ (English Grammar) เรื่อง 12 Tenses ฉบับสมบูรณ์ เข้าใจง่าย ใช้งานได้จริง

1. แกนหลัก 4 รูปแบบ (Aspects)
- Simple: เล่าข้อเท็จจริง นิสัย หรือเหตุการณ์ทั่วไป (S + V)
- Continuous: กำลังเกิดขึ้น ณ ขณะใดขณะหนึ่ง (S + be + V.ing)
- Perfect: ทำเสร็จสิ้นแล้ว หรือเชื่อมโยงระหว่างสองจุดเวลา (S + have/has/had + V.3)
- Perfect Continuous: ทำอย่างต่อเนื่องไม่หยุดพัก (S + have/has/had been + V.ing)

2. การผันตาม 3 กาลเวลา (Present, Past, Future)
- Present Simple (S + V.1): กิจวัตรประจำวัน ข้อเท็จจริงวิทยาศาสตร์
- Present Continuous (S + is/am/are + V.ing): สิ่งที่กำลังทำอยู่ขณะนี้
- Present Perfect (S + have/has + V.3): เริ่มในอดีตแต่มีผลถึงปัจจุบัน
- Past Simple (S + V.2): เหตุการณ์จบลงแล้วในอดีตอย่างเด็ดขาด
- Past Continuous (S + was/were + V.ing): กำลังดำเนินอยู่ในอดีตแล้วมีอีกเหตุการณ์แทรก
- Future Simple (S + will + V.inf): การคาดการณ์หรือวางแผนในอนาคต

3. Time Markers สำคัญที่ต้องจำ
- Present: always, usually, now, right now, since, for, already, yet
- Past: yesterday, ago, last year, when, while, as
- Future: tomorrow, next week, soon, in the future

*ดาวน์โหลดชีทสรุปสูตรผันกริยา 12 Tenses พร้อมตัวอย่างประโยคในไฟล์ PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-3-english-tenses/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-3-english-tenses/gallery-1.png'),
      path.resolve(__dirname, 'post-3-english-tenses/gallery-2.png'),
      path.resolve(__dirname, 'post-3-english-tenses/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-3-english-tenses/handbook.pdf')
  },
  {
    id: 'post-4-newton-laws',
    title: 'กฎการเคลื่อนที่ของนิวตัน: สรุปแรง กลศาสตร์ และการเขียน FBD',
    searchTitle: 'กฎการเคลื่อนที่ของนิวตัน',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ฟิสิกส์',
    summary: 'สรุปกฎการเคลื่อนที่ของนิวตันทั้ง 3 ข้อ แรงเสียดทาน การวิเคราะห์แรง และขั้นตอนการเขียน Free Body Diagram สำหรับเตรียมสอบฟิสิกส์ ม.ปลาย และ A-Level',
    tags: ['#ฟิสิกส์', '#นิวตัน', '#แรง'],
    detail: `คู่มือทบทวนวิชาฟิสิกส์ บทกลศาสตร์ เรื่อง "กฎการเคลื่อนที่ของนิวตัน" สำหรับเตรียมสอบ A-Level

1. กฎการเคลื่อนที่ 3 ข้อของนิวตัน
- กฎข้อที่ 1 (กฎความเฉื่อย, ΣF = 0): วัตถุจะรักษาสภาพหยุดนิ่งหรือเคลื่อนที่ด้วยความเร็วคงที่ในแนวเส้นตรง เว้นแต่จะมีแรงลัพธ์ภายนอกมากระทำ
- กฎข้อที่ 2 (กฎความเร่ง, ΣF = ma): เมื่อมีแรงลัพธ์ที่ไม่เป็นศูนย์มากระทำต่อวัตถุ วัตถุจะมีความเร่งในทิศทางเดียวกับแรงลัพธ์
- กฎข้อที่ 3 (กฎแรงกิริยา-ปฏิกิริยา, Action = -Reaction): ทุกแรงกิริยาจะมีแรงปฏิกิริยาที่มีขนาดเท่ากันแต่ทิศทางตรงกันข้ามเสมอ โดยกระทำบนวัตถุคนละก้อน

2. แรงเสียดทาน (Friction Force)
- แรงเสียดทานสถิต (fs): เกิดขึ้นเมื่อวัตถุยังไม่เคลื่อนที่ มีค่าสูงสุด fs(max) = μs · N
- แรงเสียดทานจลน์ (fk): เกิดขึ้นเมื่อวัตถุกำลังไถลไปบนพื้นผิว มีค่าคงที่ fk = μk · N

3. เทคนิคการเขียน Free Body Diagram (FBD)
- 1. วาดเฉพาะวัตถุที่สนใจ ไม่ต้องวาดสิ่งแวดล้อมอื่น
- 2. ใส่แรงโน้มถ่วง (W = mg) ชี้ลงในแนวดิ่งเสมอ
- 3. ระบุแรงตั้งฉาก (N) เมื่อวัตถุสัมผัสพื้นผิว
- 4. ใส่แรงตึงเชือก (T) ชี้ออกจากวัตถุไปตามแนวเชือก
- 5. ใส่แรงเสียดทาน (f) ต้านทิศทางการไถล
- 6. แตกแรงเข้าสู่แกน x-y แล้วตั้งสมการตามกฎของนิวตัน

*ดาวน์โหลดสรุปสูตรฟิสิกส์กลศาสตร์ฉบับพกพาได้ในเอกสาร PDF ด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-4-newton-laws/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-4-newton-laws/gallery-1.png'),
      path.resolve(__dirname, 'post-4-newton-laws/gallery-2.png'),
      path.resolve(__dirname, 'post-4-newton-laws/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-4-newton-laws/handbook.pdf')
  },
  {
    id: 'post-5-cell-structure',
    title: 'โครงสร้างเซลล์: สรุปหน้าที่ออร์แกเนลล์ เซลล์พืชและเซลล์สัตว์',
    searchTitle: 'โครงสร้างเซลล์',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ชีววิทยา',
    summary: 'สรุปโครงสร้างเซลล์ หน้าที่ของออร์แกเนลล์สำคัญ ความแตกต่างระหว่างเซลล์พืชและเซลล์สัตว์ และการลำเลียงสารผ่านเยื่อหุ้มเซลล์สำหรับเตรียมสอบชีววิทยา',
    tags: ['#ชีวะ', '#เซลล์', '#สรุปย่อ'],
    detail: `สรุปชีววิทยาเรื่อง "โครงสร้างเซลล์และหน้าที่ของออร์แกเนลล์" ฉบับเข้าใจง่ายสำหรับเตรียมสอบ

1. ส่วนประกอบหลักของเซลล์
- ส่วนห่อหุ้มเซลล์: ผนังเซลล์ (Cell Wall - พบในพืช) และ เยื่อหุ้มเซลล์ (Cell Membrane - Phospholipid Bilayer)
- ไซโทพลาสซึม (Cytoplasm): สารกึ่งเหลวภายในเซลล์ที่ออร์แกเนลล์ลอยอยู่
- นิวเคลียส (Nucleus): บรรจุสารพันธุกรรม (DNA) และนิวคลีโอลัส ควบคุมกิจกรรมทั้งหมดของเซลล์

2. ออร์แกเนลล์และหน้าที่สำคัญ
- ไมโทคอนเดรีย (Mitochondria): โรงไฟฟ้าของเซลล์ แหล่งสร้างพลังงาน ATP ผ่าน Cellular Respiration
- คลอโรพลาสต์ (Chloroplast): เฉพาะในพืช มีสารคลอโรฟิลล์สำหรับสังเคราะห์ด้วยแสง
- ไรโบโซม (Ribosome): สังเคราะห์โปรตีนตามคำสั่งของ RNA
- เอนโดพลาสมิกเรติคูลัม (ER):
  - RER (ผิวขรุขระมีไรโบโซมเกาะ): สร้างโปรตีนส่งออกนอกเซลล์
  - SER (ผิวเรียบ): สังเคราะห์ลิพิด สเตียรอยด์ และกำจัดสารพิษ
- กอลจิบอดี (Golgi Complex): ปรับแต่ง บรรจุ และส่งสารออกนอกเซลล์ผ่านถุง Vesicle
- ไลโซโซม (Lysosome): ถุงย่อยอาหารและทำลายออร์แกเนลล์ที่เสื่อมสภาพ (Autophagy)

3. ตารางเปรียบเทียบเซลล์พืช vs เซลล์สัตว์
- เซลล์พืช: มีผนังเซลล์, มีคลอโรพลาสต์, มีแวคิวโอลขนาดใหญ่ (Central Vacuole), รูปร่างเหลี่ยม
- เซลล์สัตว์: ไม่มีผนังเซลล์, ไม่มีคลอโรพลาสต์, มีเซนทริโอลช่วยแบ่งเซลล์, รูปร่างกลมหรือมน

*มีภาพไดอะแกรมเซลล์และตารางเปรียบเทียบในเอกสาร PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-5-cell-structure/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-5-cell-structure/gallery-1.png'),
      path.resolve(__dirname, 'post-5-cell-structure/gallery-2.png'),
      path.resolve(__dirname, 'post-5-cell-structure/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-5-cell-structure/handbook.pdf')
  },
  {
    id: 'post-6-web-architecture',
    title: 'Frontend Backend Database และ API: พื้นฐานสถาปัตยกรรมเว็บ',
    searchTitle: 'Frontend Backend Database และ API',
    grade: 'มหาวิทยาลัย',
    subject: 'คอมพิวเตอร์และเทคโนโลยี',
    summary: 'สรุปภาพรวมการทำงานของระบบเว็บแอปพลิเคชัน ตั้งแต่ Frontend ส่วนติดต่อผู้ใช้, Backend ระบบประมวลผล, Database จัดเก็บข้อมูล จนถึง REST API เชื่อมต่อระหว่างกัน',
    tags: ['#WebDev', '#Frontend', '#Backend'],
    detail: `สรุปสถาปัตยกรรมระบบเว็บแอปพลิเคชันยุคใหม่ (Full-Stack Web Architecture) สำหรับนักศึกษาสายไอทีและผู้เริ่มต้นพัฒนาซอฟต์แวร์

1. Frontend (ส่วนติดต่อผู้ใช้งาน - Client Side)
- หน้าที่: นำเสนอข้อมูล โต้ตอบกับผู้ใช้ จัดการสถานะ UI และรับ Input
- เทคโนโลยีหลัก: HTML5, CSS3/Tailwind, JavaScript/TypeScript, React, Vue, Next.js
- หัวใจสำคัญ: Responsive Design, Accessibility (a11y), และ State Management

2. Backend (ระบบประมวลผล - Server Side)
- หน้าที่: ตรวจสอบความถูกต้อง (Validation), ประมวลผล Business Logic, และรักษาความปลอดภัย (Authentication & Authorization)
- เทคโนโลยีหลัก: Node.js/Express, Python/FastAPI, Go, Java/Spring Boot
- หัวใจสำคัญ: Scalability, Rate Limiting, CORS, Error Handling, และ Session/JWT

3. Database (ระบบฐานข้อมูล)
- SQL (Relational): PostgreSQL, MySQL ข้อมูลมีโครงสร้างชัดเจน (Schema) รองรับ ACID Transactions
- NoSQL (Document/Key-Value): MongoDB, Redis เหมาะสำหรับข้อมูลยืดหยุ่นและการทำ Caching ประสิทธิภาพสูง

4. API (Application Programming Interface)
- RESTful API: ใช้ HTTP Methods (GET, POST, PUT, DELETE) สื่อสารผ่าน JSON Payload
- WebSocket / Socket.io: การสื่อสารแบบ Two-Way Real-time Full-Duplex สำหรับ Live Feed หรือ Chat
- Status Codes สำคัญ: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error

*ดาวน์โหลดสไลด์สรุป Architecture Diagram และ Code Examples ในไฟล์ PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-6-web-architecture/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-6-web-architecture/gallery-1.png'),
      path.resolve(__dirname, 'post-6-web-architecture/gallery-2.png'),
      path.resolve(__dirname, 'post-6-web-architecture/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-6-web-architecture/handbook.pdf')
  }
];

module.exports = {
  educationalPosts
};
