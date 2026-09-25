const path = require('path');

const educationalPosts = [
  {
    id: 'post-1-calculus',
    title: 'สรุปสูตร แคลคูลัส ม.ปลาย: ลิมิต อนุพันธ์ และปริพันธ์',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'คณิตศาสตร์',
    summary: 'สรุปนิยามและสูตรแคลคูลัส ม.6 ครบทุกหัวข้อ ลิมิต ความต่อเนื่อง อนุพันธ์ กฎลูกโซ่ และการอินทิเกรต พร้อมเทคนิคแก้โจทย์ A-Level',
    tags: ['#สรุปย่อ', '#เตรียมสอบ', '#คณิต'],
    detail: `สรุปสาระสำคัญวิชาคณิตศาสตร์ เรื่อง แคลคูลัสเบื้องต้น สำหรับนักเรียนชั้นมัธยมศึกษาปีที่ 6 และเตรียมสอบ TCAS / A-Level

1. ลิมิตและความต่อเนื่องของฟังก์ชัน
- นิยามลิมิตซ้ายและลิมิตขวา: ฟังก์ชันจะมีลิมิตเมื่อลิมิตทั้งสองข้างมีค่าเท่ากัน
- การแก้โจทย์รูปแบบ indeterminate form (0/0): การแยกตัวประกอบ (Factor), การคูณสังยุค (Conjugate) และกฎของโลปิตาล (L'Hôpital)

2. อนุพันธ์ของฟังก์ชัน (Derivatives)
- กฎพื้นฐาน: Power rule, กฎผลคูณ (Product Rule), กฎผลหาร (Quotient Rule)
- กฎลูกโซ่ (Chain Rule) สำหรับฟังก์ชันประกอบ f(g(x))
- ความหมายทางเรขาคณิต: ความชันของเส้นสัมผัสเส้นโค้ง ณ จุดใดๆ

3. การประยุกต์อนุพันธ์
- การตรวจสอบฟังก์ชันเพิ่มและฟังก์ชันลด
- การหาจุดวิกฤต (Critical Points) และการทดสอบจุดสูงสุด/ต่ำสุดสัมพัทธ์ด้วยอนุพันธ์อันดับ 1 และ 2
- การแก้โจทย์ปัญหาค่าเหมาะสมที่สุด (Optimization Problems)

4. ปริพันธ์ (Integrals)
- ปริพันธ์ไม่จำกัดเขตและการหาฟังก์ชันปฏิยานุพันธ์
- ปริพันธ์จำกัดเขตและทฤษฎีบทหลักมูลของแคลคูลัส
- การคำนวณพื้นที่ปิดล้อมด้วยเส้นโค้งและแกนพิกัด

*ดาวน์โหลดเอกสาร PDF ด้านล่างเพื่อดูสูตรสรุปฉบับพกพาและโจทย์ตัวอย่างพร้อมเฉลยละเอียด*`,
    cover: path.resolve(__dirname, 'post-1-calculus/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-1-calculus/gallery-1.png'),
      path.resolve(__dirname, 'post-1-calculus/gallery-2.png'),
      path.resolve(__dirname, 'post-1-calculus/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-1-calculus/handbook.pdf')
  },
  {
    id: 'post-2-physics',
    title: 'สรุปฟิสิกส์ ม.ปลาย: กฎการเคลื่อนที่และแรงของนิวตัน',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ฟิสิกส์',
    summary: 'รวมสูตรการเคลื่อนที่แนวตรง กฎ 3 ข้อของนิวตัน แรงเสียดทาน และการเขียน Free Body Diagram สำหรับเตรียมสอบฟิสิกส์ประยุกต์',
    tags: ['#สรุปย่อ', '#เตรียมสอบ', '#ฟิสิกส์'],
    detail: `คู่มือทบทวนวิชาฟิสิกส์ บทกลศาสตร์ที่สำคัญที่สุดสำหรับการสอบเข้ามหาวิทยาลัย

1. การเคลื่อนที่แนวตรง (Linear Motion)
- 5 สูตรหลักการเคลื่อนที่ด้วยความเร่งคงที่ (u, v, a, s, t)
- เทคนิคการตั้งเครื่องหมายเวกเตอร์: ให้ทิศของ u เป็นบวกเสมอ
- การแปลความหมายจากกราฟการเคลื่อนที่: s-t, v-t และ a-t

2. กฎการเคลื่อนที่ของนิวตัน (Newton's Laws of Motion)
- กฎข้อที่ 1 (ΣF = 0): ความเฉื่อย วัตถุรักษาสภาพการหยุดนิ่งหรือเคลื่อนที่ตรงด้วยความเร็วคงที่
- กฎข้อที่ 2 (ΣF = ma): เมื่อมีแรงลัพธ์มากระทำ วัตถุจะเคลื่อนที่ด้วยความเร่ง
- กฎข้อที่ 3 (Action = Reaction): แรงกิริยาและแรงปฏิกิริยามีขนาดเท่ากัน ทิศตรงข้าม บนวัตถุคนละก้อน

3. แรงเสียดทานและการต่อต้านการเคลื่อนที่
- แรงเสียดทานสถิตสูงสุด (fs = μs * N)
- แรงเสียดทานจลน์ (fk = μk * N)

4. ขั้นตอนการเขียน Free Body Diagram (FBD)
- การแยกวัตถุ การระบุน้ำหนัก (mg) แรงตั้งฉาก (N) แรงตึงเชือก (T) และแรงเสียดทาน (f)
- การตั้งแกนและแตกแรงเข้าสู่แนวแกน x-y เพื่อตั้งสมการฟิสิกส์

*ดาวน์โหลดเอกสาร PDF แนบด้านล่างสำหรับสรุปสูตรฉบับเต็มและตัวอย่างโจทย์*`,
    cover: path.resolve(__dirname, 'post-2-physics/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-2-physics/gallery-1.png'),
      path.resolve(__dirname, 'post-2-physics/gallery-2.png'),
      path.resolve(__dirname, 'post-2-physics/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-2-physics/handbook.pdf')
  },
  {
    id: 'post-3-biology',
    title: 'สรุปชีววิทยา: เซลล์และการแบ่งเซลล์ ไมโทซิส vs ไมโอซิส',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ชีววิทยา',
    summary: 'เปรียบเทียบการแบ่งเซลล์ Mitosis vs Meiosis ชัดเจน เข้าใจง่าย พร้อมภาพประกอบวัฏจักรของเซลล์ และจุดที่ข้อสอบชอบหลอก',
    tags: ['#สรุปชีท', '#เตรียมสอบ', '#ชีวะ'],
    detail: `สรุปชีววิทยาเรื่อง เซลล์และการแบ่งเซลล์ (Cell Division) เนื้อหาเข้มข้น เข้าใจง่าย สำหรับทบทวนสอบ

1. โครงสร้างเซลล์และออร์แกเนลล์สำคัญ
- นิวเคลียส (Nucleus): บรรจุสารพันธุกรรม ควบคุมการทำงานของเซลล์
- ไมโทคอนเดรีย (Mitochondria): แหล่งสร้างพลังงาน ATP ผ่านกระบวนการ Cellular Respiration
- ไรโบโซม (Ribosome): สังเคราะห์โปรตีน
- เอนโดพลาสมิกเรติคูลัม (ER): RER และ SER
- กอลจิบอดี (Golgi Complex): บรรจุและขนส่งสารออกนอกเซลล์

2. วัฏจักรของเซลล์ (Cell Cycle)
- Interphase: ระยะ G1 (เจริญเติบโต), S (จำลอง DNA), G2 (เตรียมความพร้อม)
- M-Phase: การแบ่งนิวเคลียสและการแบ่งไซโทพลาสซึม

3. การแบ่งเซลล์แบบไมโทซิส (Mitosis)
- เกิดในเซลล์ร่างกาย (Somatic Cells) เพื่อการเติบโตและซ่อมแซม
- 4 ระยะหลัก: Prophase -> Metaphase -> Anaphase -> Telophase
- สิ้นสุดได้ 2 เซลล์ลูกที่มีจำนวนโครโมโซมเท่าเดิม (2n -> 2n)

4. การแบ่งเซลล์แบบไมโอซิส (Meiosis)
- เกิดในเซลล์สืบพันธุ์ (Germ Cells) เพื่อสร้างสเปิร์มและไข่
- แบ่ง 2 รอบ: Meiosis I (ลดจำนวนชุดโครโมโซมจาก 2n เป็น n) และ Meiosis II
- เกิด Crossing Over ในระยะ Prophase I ส่งผลให้เกิดความหลากหลายทางพันธุกรรม

*มีชีทสรุปสีและตารางเปรียบเทียบในไฟล์ PDF ด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-3-biology/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-3-biology/gallery-1.png'),
      path.resolve(__dirname, 'post-3-biology/gallery-2.png'),
      path.resolve(__dirname, 'post-3-biology/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-3-biology/handbook.pdf')
  },
  {
    id: 'post-4-computer',
    title: 'Data Structures & Algorithms พื้นฐานสำหรับผู้เริ่มต้น',
    grade: 'มหาวิทยาลัย',
    subject: 'คอมพิวเตอร์และเทคโนโลยี',
    summary: 'สรุปโครงสร้างข้อมูลพื้นฐาน Array, Linked List, Stack, Queue, Tree พร้อมการวิเคราะห์ Big-O Time Complexity ฉบับเข้าใจง่าย',
    tags: ['#AI', '#แชร์ความรู้', '#คอม'],
    detail: `สรุปความรู้พื้นฐานวิทยาการคอมพิวเตอร์และโครงสร้างข้อมูลสำหรับนักศึกษาและผู้สนใจเขียนโปรแกรม

1. การวิเคราะห์ความซับซ้อน (Big-O Notation)
- O(1): Constant Time - เข้าถึงข้อมูลผ่าน Index
- O(log n): Logarithmic Time - Binary Search
- O(n): Linear Time - การค้นหาแบบเส้นตรง
- O(n log n): อัลกอริทึมเรียงลำดับที่มีประสิทธิภาพ เช่น Merge Sort, Quick Sort
- O(n^2): Quadratic Time - การวนลูปสองชั้น

2. โครงสร้างข้อมูลเชิงเส้น (Linear Data Structures)
- Array vs Dynamic Array: การเข้าถึงข้อมูล O(1) แต่การขยายขนาดมีต้นทุน
- Linked List: ขนาดยืดหยุ่น แทรก/ลบที่หัวได้ใน O(1) แต่เข้าถึงแบบสุ่มไม่ได้
- Stack (LIFO): การใช้งาน Push/Pop สำหรับ Call Stack และประวัติ Undo
- Queue (FIFO): การประยุกต์ใช้ในคิวงาน (Job Scheduling) และ Breadth-First Search (BFS)

3. โครงสร้างข้อมูลแบบต้นไม้ (Trees)
- Binary Tree และ Binary Search Tree (BST)
- คุณสมบัติของ BST: โหนดซ้าย < โหนดปัจจุบัน < โหนดขวา
- เทคนิคการท่องไปในต้นไม้ (Tree Traversal): In-order, Pre-order, Post-order

*ดาวน์โหลดสไลด์สรุปและโค้ดตัวอย่างในเอกสาร PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-4-computer/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-4-computer/gallery-1.png'),
      path.resolve(__dirname, 'post-4-computer/gallery-2.png'),
      path.resolve(__dirname, 'post-4-computer/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-4-computer/handbook.pdf')
  },
  {
    id: 'post-5-english',
    title: 'สรุป 12 Tenses ภาษาอังกฤษ ฉบับเข้าใจง่าย ใช้งานได้จริง',
    grade: 'มัธยมศึกษาตอนปลาย',
    subject: 'ภาษาอังกฤษ',
    summary: 'ตารางสรุป 12 Tenses ในภาษาอังกฤษ เทคนิคการจำโครงสร้าง Time Markers สำคัญ และตัวอย่างประโยคสำหรับเตรียมสอบและใช้งานจริง',
    tags: ['#สรุปย่อ', '#เตรียมสอบ', '#อังกฤษ'],
    detail: `สรุปไวยากรณ์ภาษาอังกฤษ (English Grammar) เรื่อง 12 Tenses ฉบับสมบูรณ์ เข้าใจง่าย ไม่ต้องท่องจำแบบนกแก้วนกขุนทอง

1. Present Tenses (ปัจจุบันกาล)
- Present Simple (S + V.1): กิจวัตร ข้อเท็จจริงทั่วไป
- Present Continuous (S + is/am/are + V.ing): กำลังเกิดขึ้นในขณะนี้
- Present Perfect (S + has/have + V.3): เกิดในอดีตและส่งผลถึงปัจจุบัน
- Present Perfect Continuous (S + has/have been + V.ing): ทำต่อเนื่องมาตั้งแต่ช่วงเวลาหนึ่งและยังคงดำเนินอยู่

2. Past Tenses (อดีตกาล)
- Past Simple (S + V.2): เหตุการณ์สิ้นสุดลงอย่างสมบูรณ์แล้วในอดีต
- Past Continuous (S + was/were + V.ing): กำลังดำเนินอยู่ในอดีตตอนที่มีอีกเหตุการณ์แทรกเข้ามา
- Past Perfect (S + had + V.3): เกิดก่อนอีกเหตุการณ์หนึ่งในอดีต

3. Future Tenses (อนาคตกาล)
- Future Simple (S + will + V.inf): วางแผน คาดการณ์ หรือตัดสินใจในขณะพูด
- Future Continuous (S + will be + V.ing): กำลังดำเนินอยู่ ณ จุดเวลาหนึ่งในอนาคต
- Future Perfect (S + will have + V.3): จะแล้วเสร็จก่อนจุดเวลาหนึ่งในอนาคต

4. เทคนิค Signal Words และ Time Markers ที่ต้องจำ
- since, for, already, yet, just, recently
- yesterday, ago, last week, in the past
- tomorrow, next month, soon

*ดาวน์โหลดสรุปตาราง 12 Tenses พร้อมแบบทดสอบท้ายบทในไฟล์ PDF แนบด้านล่าง*`,
    cover: path.resolve(__dirname, 'post-5-english/cover.png'),
    gallery: [
      path.resolve(__dirname, 'post-5-english/gallery-1.png'),
      path.resolve(__dirname, 'post-5-english/gallery-2.png'),
      path.resolve(__dirname, 'post-5-english/gallery-3.png')
    ],
    pdf: path.resolve(__dirname, 'post-5-english/handbook.pdf')
  }
];

module.exports = {
  educationalPosts
};
