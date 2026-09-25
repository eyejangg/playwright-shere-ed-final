const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../test-data/educational');

const posts = [
  {
    id: 'post-1-calculus',
    title: 'สรุปสูตร แคลคูลัส ม.ปลาย: ลิมิต อนุพันธ์ และปริพันธ์',
    subject: 'คณิตศาสตร์',
    grade: 'มัธยมศึกษาตอนปลาย',
    color: { primary: '#4f46e5', secondary: '#7c3aed', accent: '#06b6d4', bg: '#f5f3ff' },
    coverIcon: '∫ dx',
    coverSubtitle: 'Limits, Derivatives & Integrals - คู่มือสรุปสูตรเตรียมสอบ A-Level',
    badge: 'ม.6 / TCAS & A-Level',
    gallery: [
      {
        title: 'สูตรอนุพันธ์พื้นฐาน (Derivative Rules)',
        desc: 'รวมสูตรดิฟที่ต้องใช้สอบบ่อยที่สุด Power Rule, Product Rule, Chain Rule',
        items: [
          'd/dx (c) = 0',
          'd/dx (x^n) = n · x^(n-1)',
          'd/dx [c · f(x)] = c · f\'(x)',
          'd/dx [f(x) ± g(x)] = f\'(x) ± g\'(x)',
          'กฎผลคูณ: d/dx (u · v) = u\'v + uv\'',
          'กฎผลหาร: d/dx (u / v) = (u\'v - uv\') / v^2',
          'กฎลูกโซ่ (Chain Rule): dy/dx = (dy/du) · (du/dx)'
        ]
      },
      {
        title: 'การประยุกต์อนุพันธ์: จุดสูงสุด-ต่ำสุดสัมพัทธ์',
        desc: 'ขั้นตอนการหาจุดวิกฤตและการทดสอบค่าสุดขีดของฟังก์ชัน',
        items: [
          '1. หาอนุพันธ์อันดับ 1: f\'(x) = 0 เพื่อหาค่าวิกฤต c',
          '2. ตรวจสอบฟังก์ชันเพิ่ม/ลด: ถ้า f\'(x) > 0 เป็นฟังก์ชันเพิ่ม, f\'(x) < 0 เป็นฟังก์ชันลด',
          '3. ทดสอบอนุพันธ์อันดับ 2: f\'\'(c)',
          '   - ถ้า f\'\'(c) < 0 => จุดสูงสุดสัมพัทธ์ (Relative Maximum)',
          '   - ถ้า f\'\'(c) > 0 => จุดต่ำสุดสัมพัทธ์ (Relative Minimum)',
          '   - ถ้า f\'\'(c) = 0 => ต้องใช้การทดสอบอนุพันธ์อันดับที่ 1'
        ]
      },
      {
        title: 'สรุปสูตรการอินทิเกรต (Integration Formulas)',
        desc: 'สูตรการหาปริพันธ์ไม่จำกัดเขตและเทคนิคคำนวณพื้นที่ใต้กราฟ',
        items: [
          '∫ k dx = kx + C',
          '∫ x^n dx = (x^(n+1))/(n+1) + C (เมื่อ n ≠ -1)',
          '∫ [f(x) ± g(x)] dx = ∫ f(x) dx ± ∫ g(x) dx',
          'การอินทิเกรตจำกัดเขต: ∫[a to b] f(x) dx = F(b) - F(a)',
          'พื้นที่ใต้กราฟปิดล้อม: Area = ∫[a to b] |f(x)| dx',
          'ข้อควรระวัง: อย่าลืมบวกค่าคงที่ C ทุกครั้งในการอินทิเกรตไม่จำกัดเขต!'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: ลิมิตและความต่อเนื่องของฟังก์ชัน',
        content: `
          <h3>1.1 นิยามของลิมิต (Limit Definition)</h3>
          <p>ลิมิตของฟังก์ชัน f(x) เมื่อ x เข้าใกล้ค่า a คือค่า L ที่ f(x) เข้าใกล้ เมื่อ x เข้าใกล้ a ทั้งทางซ้ายและทางขวา</p>
          <div class="box">
            <strong>ทฤษฎีบทสำคัญ:</strong> lim_{x→a} f(x) = L ก็ต่อเมื่อ lim_{x→a^-} f(x) = lim_{x→a^+} f(x) = L
          </div>
          <h3>1.2 การหาค่าลิมิตในรูปแบบ indeterminate form (0/0)</h3>
          <ul>
            <li><strong>การแยกตัวประกอบ (Factoring):</strong> แยกตัวประกอบแล้วตัดทอนตัวร่วมที่ทำให้เกิด 0</li>
            <li><strong>การคูณด้วยคอนจูเกต (Conjugate):</strong> เหมาะสำหรับฟังก์ชันที่มีเครื่องหมายกรณฑ์ (Square Root)</li>
            <li><strong>กฎของโลปิตาล (L'Hôpital's Rule):</strong> ดิฟเศษและดิฟส่วนแยกกัน lim f(x)/g(x) = lim f'(x)/g'(x)</li>
          </ul>
        `
      },
      {
        heading: 'บทที่ 2: อนุพันธ์ของฟังก์ชันและการประยุกต์',
        content: `
          <h3>2.1 อัตราการเปลี่ยนแปลงเฉลี่ยและขณะใดๆ</h3>
          <p>อัตราการเปลี่ยนแปลงเฉลี่ยของ y เทียบกับ x ในช่วง [x, x+h] คือ [f(x+h) - f(x)] / h</p>
          <p>อัตราการเปลี่ยนแปลงขณะที่ x ใดๆ คือ f'(x) = lim_{h→0} [f(x+h) - f(x)] / h</p>
          <div class="box">
            <strong>ความหมายทางเรขาคณิต:</strong> f'(x) คือความชันของเส้นสัมผัสกราฟ y = f(x) ณ จุด (x, y)
          </div>
          <h3>2.2 ตัวอย่างโจทย์ประยุกต์ค่าสูงสุด-ต่ำสุด</h3>
          <p>ต้องการล้อมรั้วรูปสี่เหลี่ยมผืนผ้าติดริมแม่น้ำโดยมีลวดหนามยาว 200 เมตร พื้นที่มากที่สุดที่เป็นไปได้คือเท่าใด?</p>
          <p><em>วิธีคิด:</em> ให้ด้านกว้างคือ x เมตร ด้านยาวคือ 200 - 2x เมตร พื้นที่ A(x) = x(200 - 2x) = 200x - 2x^2</p>
          <p>หา A'(x) = 200 - 4x = 0 => x = 50 เมตร ดังนั้นพื้นที่สูงสุด = 50 × 100 = 5,000 ตารางเมตร</p>
        `
      }
    ]
  },
  {
    id: 'post-2-physics',
    title: 'สรุปฟิสิกส์ ม.ปลาย: กฎการเคลื่อนที่และแรงของนิวตัน',
    subject: 'ฟิสิกส์',
    grade: 'มัธยมศึกษาตอนปลาย',
    color: { primary: '#0284c7', secondary: '#0369a1', accent: '#0284c7', bg: '#f0f9ff' },
    coverIcon: 'F = ma',
    coverSubtitle: 'Newton\'s Laws, Kinematics & Dynamics - สรุปฟิสิกส์ ม.4-6 เตรียมสอบวิศวะฯ และแพทย์',
    badge: 'ฟิสิกส์ ม.ปลาย / A-Level',
    gallery: [
      {
        title: '5 สูตรหลักการเคลื่อนที่แนวตรง (สุวัท)',
        desc: 'ใช้เมื่อความเร่ง (a) คงที่เท่านั้น และต้องกำหนดทิศทางเวกเตอร์ให้ชัดเจน',
        items: [
          '1. v = u + at (ไม่มี s)',
          '2. s = ((u + v) / 2) · t (ไม่มี a)',
          '3. s = ut + 1/2 · a · t^2 (ไม่มี v)',
          '4. s = vt - 1/2 · a · t^2 (ไม่มี u)',
          '5. v^2 = u^2 + 2as (ไม่มี t)',
          'เทคนิค: กำหนดให้ทิศของความเร็วต้น (u) เป็นบวกเสมอ ปริมาณตรงข้ามใส่เครื่องหมายลบ'
        ]
      },
      {
        title: 'กฎการเคลื่อนที่ 3 ข้อของนิวตัน (Newton\'s Laws)',
        desc: 'หัวใจสำคัญของกลศาสตร์ฟิสิกส์และแบบจำลองแรง',
        items: [
          'กฎข้อที่ 1 (ความเฉื่อย): ΣF = 0 => วัตถุหยุดนิ่งหรือเคลื่อนที่ด้วยความเร็วคงที่',
          'กฎข้อที่ 2 (ความเร่ง): ΣF = ma => เมื่อมีแรงลัพธ์ที่ไม่เป็นศูนย์มากระทำ',
          'กฎข้อที่ 3 (แรงกิริยา-ปฏิกิริยา): Action = -Reaction',
          'ข้อสังเกต: Action และ Reaction เกิดขึ้นพร้อมกัน มีขนาดเท่ากัน ทิศตรงข้าม แต่กระทำบน "วัตถุคนละก้อน"',
          'แรงเสียดทาน: f_s ≤ μ_s · N (สถิต) และ f_k = μ_k · N (จลน์)'
        ]
      },
      {
        title: 'ขั้นตอนการเขียน Free Body Diagram (FBD)',
        desc: 'เทคนิคการวิเคราะห์แรงเพื่อแก้โจทย์กลศาสตร์อย่างเป็นระบบ',
        items: [
          '1. แยกวัตถุที่สนใจออกมาเดี่ยวๆ',
          '2. ใส่แรงโน้มถ่วง mg ชี้ลงสู่จุดศูนย์กลางโลกเสมอ',
          '3. สำรวจจุดสัมผัส: มีพื้นผิว => เกิดแรงปฏิกิริยาตั้งฉาก N',
          '4. มีเชือกดึง => เกิดแรงตึงเชือก T ชี้ออกจากวัตถุ',
          '5. มีแรงเสียดทาน f => ต้านทิศทางการไถลหรือแนวโน้มการไถล',
          '6. ตั้งแกนพิกัด x-y และแตกแรงเข้าสู่แนวแกน แล้วใช้ ΣFx = max และ ΣFy = may'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: การเคลื่อนที่แนวตรงและความเร่งคงที่',
        content: `
          <h3>1.1 ปริมาณทางฟิสิกส์ที่เกี่ยวข้อง</h3>
          <p>การเคลื่อนที่เกี่ยวข้องกับ 5 ตัวแปรหลัก ได้แก่ การกระจัด (s), ความเร็วต้น (u), ความเร็วปลาย (v), ความเร่ง (a), และเวลา (t)</p>
          <div class="box">
            <strong>ข้อควรจำ:</strong> การกระจัดและความเร็วเป็นปริมาณเวกเตอร์ ต้องคำนึงถึงทิศทางเสมอ การตกอย่างอิสระใต้แรงโน้มถ่วงโลกจะมี a = g ≈ 9.8 หรือ 10 m/s^2 ชี้ลง
          </div>
          <h3>1.2 กราฟการเคลื่อนที่ (Motion Graphs)</h3>
          <ul>
            <li><strong>กราฟ s-t:</strong> ความชัน (Slope) คือ ความเร็ว (v)</li>
            <li><strong>กราฟ v-t:</strong> ความชัน (Slope) คือ ความเร่ง (a), พื้นที่ใต้กราฟ (Area) คือ การกระจัด (s)</li>
            <li><strong>กราฟ a-t:</strong> พื้นที่ใต้กราฟ (Area) คือ การเปลี่ยนแปลงความเร็ว (Δv)</li>
          </ul>
        `
      },
      {
        heading: 'บทที่ 2: งาน พลังงาน และกฎการอนุรักษ์พลังงาน',
        content: `
          <h3>2.1 นิยามของงาน (Work)</h3>
          <p>งานเกิดจากผลคูณของแรงกับการกระจัดในทิศทางเดียวกับแรง: W = F · s · cos(θ)</p>
          <p>หน่วยของงานคือ จูล (Joule, J) หรืองานเป็นบวกเมื่องานช่วยเสริมการเคลื่อนที่ และเป็นลบเมื่อต้านการเคลื่อนที่</p>
          <div class="box">
            <strong>กฎการอนุรักษ์พลังงานกล (Conservation of Mechanical Energy):</strong><br>
            E_total1 + W_other = E_total2<br>
            พลังงานจลน์ E_k = 1/2 · m · v^2, พลังงานศักย์โน้มถ่วง E_p = mgh, พลังงานศักย์ยืดหยุ่น E_s = 1/2 · k · x^2
          </div>
        `
      }
    ]
  },
  {
    id: 'post-3-biology',
    title: 'สรุปชีววิทยา: เซลล์และการแบ่งเซลล์ ไมโทซิส vs ไมโอซิส',
    subject: 'ชีววิทยา',
    grade: 'มัธยมศึกษาตอนปลาย',
    color: { primary: '#059669', secondary: '#047857', accent: '#10b981', bg: '#ecfdf5' },
    coverIcon: '🧬 Cell',
    coverSubtitle: 'Mitosis vs Meiosis, Cell Organelles & Cell Cycle ฉบับเตรียมสอบ สอวน. และ A-Level',
    badge: 'ชีววิทยา ม.ปลาย',
    gallery: [
      {
        title: 'โครงสร้างเซลล์และออร์แกเนลล์สำคัญ',
        desc: 'หน้าที่หลักของส่วนประกอบเซลล์พืชและเซลล์สัตว์',
        items: [
          'นิวเคลียส (Nucleus): ศูนย์กลางควบคุมการทำงานและถ่ายทอดสารพันธุกรรม (DNA)',
          'ไมโทคอนเดรีย (Mitochondria): แหล่งสร้างพลังงาน ATP ผ่านการหายใจระดับเซลล์',
          'ไรโบโซม (Ribosome): แหล่งสังเคราะห์โปรตีน',
          'เอนโดพลาสมิกเรติคูลัม (ER): RER (สังเคราะห์โปรตีนส่งออก), SER (สังเคราะห์ลิพิด/กำจัดสารพิษ)',
          'กอลจิบอดี (Golgi Body): ปรับแต่ง บรรจุ และหลั่งสารออกนอกเซลล์',
          'คลอโรพลาสต์ (Chloroplast): เฉพาะเซลล์พืช เป็นแหล่งเกิดการสังเคราะห์ด้วยแสง'
        ]
      },
      {
        title: 'ขั้นตอนการแบ่งเซลล์แบบไมโทซิส (Mitosis)',
        desc: 'การแบ่งเซลล์ร่างกายเพื่อการเจริญเติบโต ได้ 2 เซลล์ลูก โครโมโซมคงเดิม (2n)',
        items: [
          'Prophase: เยื่อหุ้มนิวเคลียสเริ่มสลาย โครมาทินขดตัวเป็นโครโมโซม เซนโทรโซมแยกไปคนละขั้ว',
          'Metaphase: โครโมโซมเรียงตัวกึ่งกลางเซลล์ (Equatorial Plate) ชัดเจนที่สุดในการนับโครโมโซม',
          'Anaphase: Sister Chromatids ถูกดึงแยกออกจากกันไปยังขั้วเซลล์ตรงข้าม',
          'Telophase: เยื่อหุ้มนิวเคลียสสร้างขึ้นใหม่ โครโมโซมคลายตัว และเริ่มแบ่งไซโทพลาสซึม',
          'Cytokinesis: สัตว์ใช้ Cleavage Furrow, พืชสร้าง Cell Plate'
        ]
      },
      {
        title: 'ตารางเปรียบเทียบ Mitosis vs Meiosis',
        desc: 'จุดแตกต่างหลักที่ข้อสอบชอบนำมาออกเป็นประจำ',
        items: [
          'จุดประสงค์: Mitosis (เจริญเติบโต/ซ่อมแซม) vs Meiosis (สร้างเซลล์สืบพันธุ์)',
          'สถานที่เกิด: Mitosis (เซลล์ร่างกาย Somatic Cell) vs Meiosis (อวัยวะสืบพันธุ์ Germ Cell)',
          'จำนวนรอบการแบ่ง: Mitosis (1 รอบ) vs Meiosis (2 รอบ: Meiosis I และ II)',
          'จำนวนเซลล์ลูก: Mitosis (2 เซลล์) vs Meiosis (4 เซลล์)',
          'ชุดโครโมโซม: Mitosis (2n -> 2n คงที่) vs Meiosis (2n -> n ลดลงครึ่งหนึ่ง)',
          'Crossing Over: Mitosis (ไม่เกิด) vs Meiosis (เกิดใน Prophase I ทำให้เกิดความหลากหลายทางพันธุกรรม)'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: วัฏจักรของเซลล์ (The Cell Cycle)',
        content: `
          <h3>1.1 ระยะอินเตอร์เฟส (Interphase)</h3>
          <p>เป็นระยะที่เซลล์ใช้เวลาส่วนใหญ่ (ประมาณ 90%) ในการเตรียมความพร้อมก่อนแบ่งเซลล์ ประกอบด้วย 3 ระยะย่อย:</p>
          <ul>
            <li><strong>G1 Phase (Gap 1):</strong> เซลล์เจริญเติบโต สร้างสารและออร์แกเนลล์ต่างๆ</li>
            <li><strong>S Phase (Synthesis):</strong> การจำลองตัวของ DNA (DNA Replication) เพื่อเพิ่มปริมาณสารพันธุกรรมเป็นสองเท่า</li>
            <li><strong>G2 Phase (Gap 2):</strong> เซลล์เตรียมพร้อมขั้นสุดท้าย ตรวจสอบความถูกต้องของ DNA ก่อนเข้าสู่ระยะแบ่งเซลล์</li>
          </ul>
          <div class="box">
            <strong>จุดตรวจสอบ (Cell Cycle Checkpoints):</strong> G1/S checkpoint ตรวจสอบขนาดเซลล์และสารอาหาร, G2/M checkpoint ตรวจการจำลอง DNA, และ Spindle checkpoint ในระยะ Metaphase
          </div>
        `
      },
      {
        heading: 'บทที่ 2: การแบ่งเซลล์แบบไมโอซิส (Meiosis)',
        content: `
          <h3>2.1 Meiosis I: การลดจำนวนชุดโครโมโซม</h3>
          <p>เป็นการแบ่งแยก Homologous Chromosome ออกจากกัน ทำให้เซลล์ลูกเปลี่ยนสถานะจาก Diploid (2n) เป็น Haploid (n)</p>
          <div class="box">
            <strong>เหตุการณ์สำคัญที่สุด:</strong> ในระยะ <em>Prophase I</em> โครโมโซมคู่เหมือนจะมาจับคู่กัน (Synapsis) เกิดโครงสร้าง Bivalent หรือ Tetrad และมีการแลกเปลี่ยนชิ้นส่วนยีนระหว่างกัน เรียกว่า <strong>Crossing Over</strong> ทำให้เกิด Recombination และความหลากหลายในสิ่งมีชีวิต
          </div>
          <h3>2.2 Meiosis II: การแยก Sister Chromatids</h3>
          <p>มีลักษณะคล้ายกับการแบ่งแบบ Mitosis โดย Sister Chromatids จะแยกออกจากกันในระยะ Anaphase II สิ้นสุดจะได้เซลล์ลูก 4 เซลล์ที่มีพันธุกรรมแตกต่างกัน</p>
        `
      }
    ]
  },
  {
    id: 'post-4-computer',
    title: 'Data Structures & Algorithms พื้นฐานสำหรับผู้เริ่มต้น',
    subject: 'คอมพิวเตอร์และเทคโนโลยี',
    grade: 'มหาวิทยาลัย',
    color: { primary: '#9333ea', secondary: '#7e22ce', accent: '#a855f7', bg: '#faf5ff' },
    coverIcon: '</> DSA',
    coverSubtitle: 'Array, Linked List, Stack, Queue, Tree & Big-O Notation ฉบับเข้าใจง่าย',
    badge: 'Computer Science / Developer',
    gallery: [
      {
        title: 'Big-O Complexity Cheat Sheet',
        desc: 'การวัดความเร็วและประสิทธิภาพของโค้ดเมื่อขนาดข้อมูล (n) เพิ่มขึ้น',
        items: [
          'O(1) - Constant Time: เข้าถึง Array ผ่าน Index ทันที, Push/Pop บน Stack',
          'O(log n) - Logarithmic Time: Binary Search บนข้อมูลที่เรียงลำดับแล้ว',
          'O(n) - Linear Time: วนลูปค้นหาข้อมูลตัวต่อตัว (Linear Search)',
          'O(n log n) - Linearithmic Time: อัลกอริทึมเรียงลำดับที่มีประสิทธิภาพ เช่น Merge Sort, Quick Sort',
          'O(n^2) - Quadratic Time: วนลูปซ้อนกัน 2 ชั้น เช่น Bubble Sort, Selection Sort',
          'กฎทั่วไป: ยิ่งเส้นกราฟชันน้อย ประสิทธิภาพการทำงานยิ่งดีเยี่ยม'
        ]
      },
      {
        title: 'เปรียบเทียบ Array vs Linked List',
        desc: 'ข้อดี-ข้อจำกัดและการเลือกใช้โครงสร้างข้อมูลให้เหมาะสม',
        items: [
          'Array: ข้อมูลเรียงติดกันในหน่วยความจำ (Contiguous Memory)',
          '   - เข้าถึงข้อมูลผ่าน Index ได้เร็วมาก O(1)',
          '   - แทรก/ลบข้อมูลที่หัวหรือกลางแถวช้า O(n) เพราะต้องเลื่อนข้อมูล',
          'Linked List: เก็บข้อมูลแยกเป็น Node เชื่อมกันด้วย Pointer',
          '   - ขนาดยืดหยุ่น (Dynamic Size) ไม่ต้องจองขนาดล่วงหน้า',
          '   - แทรกหรือลบที่หัวได้เร็ว O(1)',
          '   - ค้นหาข้อมูลช้า O(n) เพราะต้องกระโดดตาม Pointer ทีละตัว'
        ]
      },
      {
        title: 'Stack & Queue: โครงสร้างข้อมูลพื้นฐาน',
        desc: 'หลักการทำงาน LIFO vs FIFO ที่พบบ่อยในระบบซอฟต์แวร์',
        items: [
          'Stack (LIFO - Last In, First Out): เข้าทีหลัง ออกก่อน',
          '   - คำสั่งหลัก: push(item), pop(), peek() ทั้งหมดทำงานในเวลา O(1)',
          '   - ตัวอย่างการใช้งาน: Undo/Redo ในโปรแกรม, Call Stack การเรียกฟังก์ชัน',
          'Queue (FIFO - First In, First Out): เข้าก่อน ออกก่อน',
          '   - คำสั่งหลัก: enqueue(item), dequeue(), front()',
          '   - ตัวอย่างการใช้งาน: คิวพิมพ์งาน Printer, Task Queue ในระบบ Back-end'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: การวิเคราะห์ความซับซ้อนของอัลกอริทึม (Asymptotic Analysis)',
        content: `
          <h3>1.1 ความสำคัญของ Big-O Notation</h3>
          <p>ในการเขียนโปรแกรม เราไม่ได้วัดประสิทธิภาพด้วยเวลาจริงเป็นวินาที เพราะขึ้นอยู่กับสเปกฮาร์ดแวร์ แต่เราวัดด้วย "จำนวนรอบการทำงานตามขนาด Input n"</p>
          <div class="box">
            <strong>นิยามทางคณิตศาสตร์:</strong> f(n) = O(g(n)) เมื่อมีค่าคงที่ c > 0 และ n_0 ที่ทำให้ f(n) ≤ c · g(n) สำหรับทุก n ≥ n_0
          </div>
          <h3>1.2 ลำดับความเร็วของ Big-O จากดีที่สุดไปแย่ที่สุด</h3>
          <p>O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!)</p>
        `
      },
      {
        heading: 'บทที่ 2: ต้นไม้ค้นหาแบบทวิภาค (Binary Search Tree - BST)',
        content: `
          <h3>2.1 คุณสมบัติของ BST</h3>
          <p>BST คือโครงสร้างข้อมูลแบบ Tree ที่ในแต่ละ Node จะมีคุณสมบัติ:</p>
          <ul>
            <li>ข้อมูลใน Node ลูกทางซ้ายทั้งหมด จะมีค่าน้อยกว่า Node ปัจจุบัน</li>
            <li>ข้อมูลใน Node ลูกทางขวาทั้งหมด จะมีค่ามากกว่า Node ปัจจุบัน</li>
          </ul>
          <div class="box">
            <strong>Time Complexity ของ BST:</strong><br>
            กรณีทั่วไป (Balanced): การค้นหา แทรก ลบ ใช้เวลา O(log n)<br>
            กรณีแย่ที่สุด (Degenerate กลายเป็นเส้นตรง): ใช้เวลา O(n) จึงจำเป็นต้องมี Self-Balancing Trees เช่น AVL Tree หรือ Red-Black Tree
          </div>
        `
      }
    ]
  },
  {
    id: 'post-5-english',
    title: 'สรุป 12 Tenses ภาษาอังกฤษ ฉบับเข้าใจง่าย ใช้งานได้จริง',
    subject: 'ภาษาอังกฤษ',
    grade: 'มัธยมศึกษาตอนปลาย',
    color: { primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', bg: '#fff7ed' },
    coverIcon: '🇬🇧 Grammar',
    coverSubtitle: 'Complete 12 Tenses Guide: โครงสร้าง ตัวบอกเวลา และเทคนิคทำข้อสอบ Error Identification',
    badge: 'English Grammar / TCAS & TOEIC',
    gallery: [
      {
        title: 'ตารางสรุป 4 โครงสร้างหลัก (Simple, Cont, Perf, Perf Cont)',
        desc: 'หลักการรวมกริยา 3 ช่วงเวลา (Present, Past, Future)',
        items: [
          'Simple: บอกข้อเท็จจริง นิสัย หรือเหตุการณ์ที่เกิดขึ้นทั่วไป (S + V.1 / V.2 / will+V.inf)',
          'Continuous: กำลังเกิดขึ้น ณ จุดเวลาใดเวลาหนึ่ง (S + is/am/are/was/were/will be + V.ing)',
          'Perfect: เหตุการณ์เกิดขึ้นแล้ว มีผลต่อเนื่องหรือเชื่อมโยง (S + has/have/had/will have + V.3)',
          'Perfect Continuous: เน้นย้ำความต่อเนื่องของเวลาที่ทำมาอย่างไม่หยุดพัก (S + have/had/will have been + V.ing)',
          'Tip: จำแกนหลัก 4 รูปแบบนี้ แล้วคูณด้วย 3 กาลเวลา จะได้ครบ 12 รูปแบบพอดี!'
        ]
      },
      {
        title: 'Time Markers & Signal Words บอกกาลเวลา',
        desc: 'คำบอกเวลาที่เจอในข้อสอบแล้วตอบได้ทันที',
        items: [
          'Present Simple: always, usually, often, seldom, never, every day/month',
          'Present Continuous: now, right now, at the moment, Listen!, Look!',
          'Present Perfect: since, for, already, yet, just, ever, never, so far',
          'Past Simple: yesterday, ago, last week/night, in 1999',
          'Past Continuous (คู่ Past Simple): while, as, when (เหตุการณ์เกิดแทรก)',
          'Future Simple: tomorrow, next week, soon, in the future'
        ]
      },
      {
        title: 'Past Simple vs Present Perfect ต่างกันอย่างไร?',
        desc: 'จุดที่คนไทยสับสนบ่อยที่สุดในการใช้งานจริง',
        items: [
          'Past Simple: เหตุการณ์ "จบลงแล้วในอดีตอย่างเด็ดขาด" มีเวลาระบุชัดเจน',
          '   - ตัวอย่าง: I lived in London in 2020. (ตอนนี้ไม่ได้อยู่แล้ว)',
          'Present Perfect: เหตุการณ์ "เริ่มต้นในอดีต แต่มีผลหรือยังทำอยู่ถึงปัจจุบัน"',
          '   - ตัวอย่าง: I have lived in London since 2020. (ปัจจุบันยังคงอาศัยอยู่)',
          '   - ประสบการณ์ชีวิต (ไม่ระบุเวลาแน่นอน): I have visited Japan twice.'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'Chapter 1: The Present Tense Family',
        content: `
          <h3>1.1 Present Simple vs Present Continuous</h3>
          <p><strong>Present Simple (S + V.1):</strong> ใช้กับความจริงตามธรรมชาติ, กิจวัตรประจำวัน, หรือตารางเวลาที่แน่นอน</p>
          <p><strong>Present Continuous (S + is/am/are + V.ing):</strong> ใช้กับสิ่งที่กำลังเกิดขึ้นขณะพูด หรือแนวโน้มการเปลี่ยนแปลงชั่วคราว</p>
          <div class="box">
            <strong>ข้อควรระวัง (Stative Verbs):</strong> กริยาที่แสดงความรู้สึก การรับรู้ ความเป็นเจ้าของ ห้ามใช้ในรูป Continuous เช่น like, love, hate, know, believe, belong to, understand
          </div>
        `
      },
      {
        heading: 'Chapter 2: The Perfect Aspect & Past Tenses',
        content: `
          <h3>2.1 โครงสร้างและการใช้งาน Past Perfect (S + had + V.3)</h3>
          <p>ใช้เพื่อบอกว่ามีเหตุการณ์หนึ่งเกิดขึ้นและสิ้นสุดลง <em>ก่อน</em> อีกเหตุการณ์หนึ่งในอดีต</p>
          <ul>
            <li><strong>เหตุการณ์เกิดก่อน (Past Perfect):</strong> When I arrived at the station, the train <em>had already left</em>.</li>
            <li><strong>เหตุการณ์เกิดทีหลัง (Past Simple):</strong> I <em>arrived</em> at the station.</li>
          </ul>
          <div class="box">
            <strong>เทคนิคการจำ:</strong> เกิดก่อนใช้ Had + V.3, เกิดทีหลังใช้ V.2 เสมอ!
          </div>
        `
      }
    ]
  }
];

function generateCoverHtml(post) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700;800&family=Sarabun:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1280px;
      height: 720px;
      background: linear-gradient(135deg, ${post.color.primary} 0%, ${post.color.secondary} 100%);
      font-family: 'Prompt', 'Leelawadee UI', sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 70px;
      color: #ffffff;
      position: relative;
      overflow: hidden;
    }
    .circle-bg {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 70%);
    }
    .c1 { width: 500px; height: 500px; top: -150px; right: -100px; }
    .c2 { width: 400px; height: 400px; bottom: -100px; left: -100px; }
    
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .brand-logo {
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      padding: 8px 18px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      font-size: 20px;
      font-weight: 800;
    }
    .badge {
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      padding: 8px 22px;
      border-radius: 9999px;
      font-size: 18px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.35);
    }
    .content {
      z-index: 2;
      max-width: 950px;
    }
    .icon-badge {
      display: inline-block;
      font-size: 32px;
      font-weight: 800;
      color: ${post.color.accent};
      background: rgba(255, 255, 255, 0.95);
      padding: 10px 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    h1 {
      font-size: 48px;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 20px;
      text-shadow: 0 4px 12px rgba(0,0,0,0.25);
    }
    p {
      font-size: 22px;
      line-height: 1.5;
      color: rgba(255, 255, 255, 0.92);
      font-family: 'Sarabun', sans-serif;
      font-weight: 400;
    }
    .bottom-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
      border-top: 1px solid rgba(255, 255, 255, 0.25);
      padding-top: 24px;
      font-size: 18px;
      color: rgba(255, 255, 255, 0.85);
    }
    .meta-tags {
      display: flex;
      gap: 16px;
    }
    .meta-tag {
      background: rgba(0, 0, 0, 0.2);
      padding: 6px 16px;
      border-radius: 8px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="circle-bg c1"></div>
  <div class="circle-bg c2"></div>
  <div class="top-bar">
    <div class="brand">
      <div class="brand-logo">SHARE-ED</div>
      <span>คลังสื่อการเรียนรู้แบ่งปัน</span>
    </div>
    <div class="badge">${post.badge}</div>
  </div>
  <div class="content">
    <div class="icon-badge">${post.coverIcon}</div>
    <h1>${post.title}</h1>
    <p>${post.coverSubtitle}</p>
  </div>
  <div class="bottom-bar">
    <div class="meta-tags">
      <span class="meta-tag">หมวด: ${post.subject}</span>
      <span class="meta-tag">ระดับ: ${post.grade}</span>
      <span class="meta-tag">มีเอกสาร PDF แนบ</span>
    </div>
    <div>share-ed.online</div>
  </div>
</body>
</html>`;
}

function generateGalleryHtml(post, item, index) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&family=Sarabun:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1080px;
      height: 1080px;
      background: #ffffff;
      font-family: 'Prompt', 'Leelawadee UI', sans-serif;
      display: flex;
      flex-direction: column;
      padding: 50px 60px;
      color: #1e293b;
      position: relative;
    }
    .header {
      border-bottom: 3px solid ${post.color.primary};
      padding-bottom: 24px;
      margin-bottom: 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .topic-tag {
      display: inline-block;
      background: ${post.color.bg};
      color: ${post.color.primary};
      font-size: 16px;
      font-weight: 700;
      padding: 6px 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      border: 1px solid ${post.color.accent};
    }
    h2 {
      font-size: 34px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
    }
    .desc {
      font-size: 19px;
      color: #64748b;
      font-family: 'Sarabun', sans-serif;
      margin-top: 8px;
    }
    .page-num {
      background: ${post.color.primary};
      color: #ffffff;
      font-weight: 700;
      font-size: 18px;
      padding: 8px 18px;
      border-radius: 20px;
    }
    .items-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
      flex: 1;
    }
    .item-card {
      background: #f8fafc;
      border-left: 6px solid ${post.color.primary};
      border-radius: 0 12px 12px 0;
      padding: 18px 24px;
      font-family: 'Sarabun', sans-serif;
      font-size: 20px;
      line-height: 1.5;
      color: #334155;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="topic-tag">${post.subject} • แผ่นที่ ${index + 1}</div>
      <h2>${item.title}</h2>
      <div class="desc">${item.desc}</div>
    </div>
    <div class="page-num">${index + 1}/3</div>
  </div>
  <div class="items-container">
    ${item.items.map(it => `<div class="item-card">${it}</div>`).join('')}
  </div>
  <div class="footer">
    <span>SHARE-ED สื่อการเรียนรู้ฟรีเพื่อทุกคน</span>
    <span>www.share-ed.online</span>
  </div>
</body>
</html>`;
}

function generatePdfHtml(post) {
  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@400;600;700&family=Sarabun:wght@400;600&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Sarabun', 'Leelawadee UI', sans-serif;
      color: #1e293b;
      line-height: 1.6;
      background: #ffffff;
    }
    .page {
      padding: 40px 50px;
      page-break-after: always;
      min-height: 980px;
      position: relative;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .header {
      border-bottom: 2px solid ${post.color.primary};
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-title {
      font-family: 'Prompt', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: ${post.color.primary};
    }
    .header-meta {
      font-size: 13px;
      color: #64748b;
    }
    h1 {
      font-family: 'Prompt', sans-serif;
      font-size: 26px;
      color: #0f172a;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    h2 {
      font-family: 'Prompt', sans-serif;
      font-size: 20px;
      color: ${post.color.primary};
      margin: 20px 0 10px 0;
    }
    h3 {
      font-family: 'Prompt', sans-serif;
      font-size: 16px;
      color: #334155;
      margin: 16px 0 8px 0;
    }
    p {
      font-size: 15px;
      margin-bottom: 10px;
    }
    ul, ol {
      margin-left: 24px;
      margin-bottom: 14px;
      font-size: 14.5px;
    }
    li {
      margin-bottom: 6px;
    }
    .box {
      background: ${post.color.bg};
      border-left: 4px solid ${post.color.primary};
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      font-size: 14.5px;
    }
    .footer {
      position: absolute;
      bottom: 30px;
      left: 50px;
      right: 50px;
      border-top: 1px solid #e2e8f0;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  ${post.pdfPages.map((pg, idx) => `
    <div class="page">
      <div class="header">
        <div class="header-title">SHARE-ED เอกสารประกอบการเรียนรู้: ${post.subject}</div>
        <div class="header-meta">ระดับ: ${post.grade} | หน้า ${idx + 1}</div>
      </div>
      ${idx === 0 ? `<h1>${post.title}</h1><p><strong>บทสรุปย่อ:</strong> ${post.coverSubtitle}</p><hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />` : ''}
      <h2>${pg.heading}</h2>
      ${pg.content}
      <div class="footer">
        <span>คลังความรู้เสรี SHARE-ED (https://share-ed.online)</span>
        <span>จัดทำเพื่อการศึกษา • ห้ามจำหน่าย</span>
      </div>
    </div>
  `).join('')}
</body>
</html>`;
}

async function main() {
  console.log('Starting Educational Media Asset Generation...');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const post of posts) {
    console.log(`\nGenerating assets for: ${post.title} (${post.id})`);
    const postDir = path.join(OUTPUT_DIR, post.id);
    if (!fs.existsSync(postDir)) {
      fs.mkdirSync(postDir, { recursive: true });
    }

    // 1. Generate Cover Image (1280x720)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setContent(generateCoverHtml(post), { waitUntil: 'load' });
    const coverPath = path.join(postDir, 'cover.png');
    await page.screenshot({ path: coverPath, type: 'png' });
    console.log(`  ✓ Created Cover: ${coverPath}`);

    // 2. Generate Gallery Images (1080x1080)
    for (let i = 0; i < post.gallery.length; i++) {
      await page.setViewportSize({ width: 1080, height: 1080 });
      await page.setContent(generateGalleryHtml(post, post.gallery[i], i), { waitUntil: 'load' });
      const galleryPath = path.join(postDir, `gallery-${i + 1}.png`);
      await page.screenshot({ path: galleryPath, type: 'png' });
      console.log(`  ✓ Created Gallery ${i + 1}: ${galleryPath}`);
    }

    // 3. Generate PDF Document
    await page.setContent(generatePdfHtml(post), { waitUntil: 'load' });
    const pdfPath = path.join(postDir, 'handbook.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
    });
    console.log(`  ✓ Created PDF: ${pdfPath}`);
  }

  await browser.close();
  console.log('\nAll educational media assets generated successfully!');
}

main().catch(err => {
  console.error('Error generating educational media:', err);
  process.exit(1);
});
