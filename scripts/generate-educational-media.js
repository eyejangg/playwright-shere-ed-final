const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../test-data/educational');

const posts = [
  {
    id: 'post-1-equation',
    title: 'สมการเชิงเส้นตัวแปรเดียว: สรุปหลักการแก้สมการและโจทย์ปัญหา',
    subject: 'คณิตศาสตร์',
    grade: 'มัธยมศึกษาตอนต้น',
    color: { primary: '#2563eb', secondary: '#1d4ed8', accent: '#38bdf8', bg: '#eff6ff' },
    coverIcon: 'ax + b = 0',
    coverSubtitle: 'Linear Equations in One Variable - คู่มือทบทวนและเทคนิคแก้สมการ ม.ต้น',
    badge: 'คณิต ม.ต้น / พื้นฐาน',
    gallery: [
      {
        title: 'นิยามและสมบัติการเท่ากัน',
        desc: 'พื้นฐานสำคัญที่สุดในการแก้สมการเชิงเส้นตัวแปรเดียว',
        items: [
          'รูปแบบทั่วไป: ax + b = 0 เมื่อ a และ b เป็นค่าคงตัว (a ≠ 0)',
          'สมบัติการบวกและลบ: นำจำนวนเท่ากันมาบวกหรือลบทั้ง 2 ข้าง',
          'สมบัติการคูณและหาร: นำจำนวนเท่ากันที่ไม่เป็นศูนย์มาคูณหรือหารทั้ง 2 ข้าง',
          'เทคนิคการย้ายข้าง: บวกย้ายไปลบ ลบย้ายไปบวก คูณย้ายไปหาร หารย้ายไปคูณ',
          'ข้อควรระวัง: เมื่อมีวงเล็บ ให้ใช้สมบัติการแจกแจงกระจายเข้าไปก่อนเสมอ'
        ]
      },
      {
        title: 'ขั้นตอนการแก้สมการเชิงเส้นที่มีตัวแปรสองข้าง',
        desc: 'ลำดับขั้นตอนการจัดรูปสมการให้ตัวแปรอยู่ข้างเดียวกัน',
        items: [
          '1. กำจัดเศษส่วน (ถ้ามี): หา ค.ร.น. ของตัวส่วนแล้วคูณตลอดทั้งสมการ',
          '2. กระจายวงเล็บ: ใช้สมบัติการแจกแจงเปิดวงเล็บออกให้หมด',
          '3. รวมพจน์ที่คล้ายกัน: ย้ายพจน์ที่มีตัวแปร x ไปไว้ข้างเดียวกัน (ซ้าย)',
          '4. ย้ายค่าคงที่: ย้ายตัวเลขทั้งหมดไปไว้อีกข้างหนึ่ง (ขวา)',
          '5. หาค่าตัวแปร: นำสัมประสิทธิ์หน้า x ไปหารทั้งสองข้างเพื่อให้ได้ค่า x'
        ]
      },
      {
        title: '5 สเต็ปแก้โจทย์ปัญหาสมการ',
        desc: 'เปลี่ยนข้อความภาษาไทยให้เป็นประโยคสัญลักษณ์คณิตศาสตร์',
        items: [
          '1. อ่านโจทย์ให้เข้าใจ: ดูว่าโจทย์ถามหาอะไร และกำหนดข้อมูลอะไรมาบ้าง',
          '2. กำหนดตัวแปร: ให้ x แทนปริมาณที่โจทย์ต้องการทราบ',
          '3. สร้างสมการ: แปลงความสัมพันธ์ในโจทย์เป็นเครื่องหมาย +, -, ×, ÷ และ =',
          '4. ดำเนินการแก้สมการ: ใช้สมบัติการเท่ากันหาค่าตัวแปร x',
          '5. ตรวจคำตอบ: นำค่า x ที่ได้กลับไปแทนในเงื่อนไขของโจทย์ทุกข้อ'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: พื้นฐานและสมบัติของการแก้สมการ',
        content: `
          <h3>1.1 นิยามของสมการและคำตอบของสมการ</h3>
          <p>สมการ (Equation) คือ ประโยคสัญลักษณ์ที่มีเครื่องหมายเท่ากับ (=) แสดงความเท่ากันของสองข้าง คำตอบของสมการคือจำนวนที่เมื่อนำไปแทนตัวแปรแล้วทำให้สมการเป็นจริง</p>
          <div class="box">
            <strong>รูปแบบมาตรฐาน:</strong> ax + b = 0 โดยที่ a ≠ 0 มีคำตอบเพียงค่าเดียวเสมอ คือ x = -b/a
          </div>
          <h3>1.2 การแก้สมการที่มีเครื่องหมายวงเล็บและเศษส่วน</h3>
          <ul>
            <li><strong>สมบัติการแจกแจง:</strong> a(b + c) = ab + ac</li>
            <li><strong>การกำจัดตัวส่วน:</strong> นำ ค.ร.น. ของตัวส่วนทุกตัวคูณทั้งสองข้างของสมการ จะทำให้ตัวส่วนหมดไปและคิดเลขได้ง่ายขึ้น</li>
          </ul>
        `
      },
      {
        heading: 'บทที่ 2: การประยุกต์โจทย์ปัญหาสมการเชิงเส้นตัวแปรเดียว',
        content: `
          <h3>2.1 ตัวอย่างโจทย์อายุและจำนวนเงิน</h3>
          <p><em>โจทย์:</em> ปัจจุบันคุณพ่อมีอายุเป็น 3 เท่าของลูก อีก 10 ปีข้างหน้า ทั้งสองคนจะมีอายุรวมกันได้ 76 ปี ปัจจุบันลูกอายุเท่าใด?</p>
          <div class="box">
            <strong>วิธีทำ:</strong><br>
            ให้ปัจจุบันลูกอายุ x ปี ดังนั้นคุณพ่ออายุ 3x ปี<br>
            อีก 10 ปีข้างหน้า: ลูกอายุ x + 10, พ่ออายุ 3x + 10<br>
            ตั้งสมการ: (x + 10) + (3x + 10) = 76<br>
            4x + 20 = 76 => 4x = 56 => x = 14<br>
            <strong>ตอบ:</strong> ปัจจุบันลูกมีอายุ 14 ปี
          </div>
        `
      }
    ]
  },
  {
    id: 'post-2-solar-system',
    title: 'ระบบสุริยะ: สรุปข้อมูลดาวเคราะห์และวัตถุท้องฟ้าในระบบสุริยะ',
    subject: 'วิทยาศาสตร์',
    grade: 'มัธยมศึกษาตอนต้น',
    color: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', bg: '#f0f9ff' },
    coverIcon: '🪐 Sun & Planets',
    coverSubtitle: 'The Solar System Guide - ดวงอาทิตย์ ดาวเคราะห์ 8 ดวง และวัตถุท้องฟ้า',
    badge: 'วิทยาศาสตร์ ม.ต้น / ดาราศาสตร์',
    gallery: [
      {
        title: 'ดาวเคราะห์ชั้นใน (Terrestrial Planets)',
        desc: 'ดาวเคราะห์หิน 4 ดวงแรกที่อยู่ใกล้ดวงอาทิตย์',
        items: [
          'ดาวพุธ (Mercury): ดาวเคราะห์ที่เล็กที่สุด ไร้บรรยากาศ อุณหภูมิกลางวัน-กลางคืนต่างกันสุดขั้ว',
          'ดาวศุกร์ (Venus): ดาวฝาแฝดของโลก มีเรือนกระจกหนาทึบ ร้อนที่สุดในระบบสุริยะ',
          'โลก (Earth): ดาวเคราะห์สีน้ำเงินดวงเดียวที่พบสิ่งมีชีวิต มีน้ำในสถานะของเหลว',
          'ดาวอังคาร (Mars): ดาวเคราะห์สีแดงจากสนิมเหล็ก มีภูเขาไฟโอลิมปัสและร่องรอยน้ำแข็ง',
          'ลักษณะร่วม: มีพื้นผิวเป็นหินแข็ง ขนาดค่อนข้างเล็ก และไม่มีระบบวงแหวน'
        ]
      },
      {
        title: 'ดาวเคราะห์ชั้นนอก (Giant Planets)',
        desc: 'ดาวเคราะห์แก๊สและน้ำแข็งขนาดยักษ์พ้นแนวแถบดาวเคราะห์น้อย',
        items: [
          'ดาวพฤหัสบดี (Jupiter): ดาวเคราะห์ใหญ่ที่สุด มีจุดแดงใหญ่ (พายุหมุนยักษ์) และดวงจันทร์กาลิเลียน',
          'ดาวเสาร์ (Saturn): เด่นด้วยระบบวงแหวนน้ำแข็งและหินที่สวยงาม ความหนาแน่นน้อยกว่าน้ำ',
          'ดาวยูเรนัส (Uranus): ดาวเคราะห์น้ำแข็งยักษ์สีฟ้าอมเขียว แกนหมุนเอียงระนาบแทบขนานกับวงโคจร',
          'ดาวเนปจูน (Neptune): ดาวเคราะห์สีน้ำเงินเข้ม ไกลที่สุด มีลมพายุพัดเร็วที่สุดในระบบสุริยะ',
          'แถบไคเปอร์ (Kuiper Belt): ดินแดนน้ำแข็งของดาวเคราะห์แคระ เช่น พลูโต'
        ]
      },
      {
        title: 'วัตถุขนาดเล็กในระบบสุริยะ',
        desc: 'ชิ้นส่วนและซากที่หลงเหลือจากการก่อกำเนิดระบบสุริยะ',
        items: [
          'แถบดาวเคราะห์น้อย (Asteroid Belt): ก้อนหินและโลหะนับล้านอยู่ระหว่างดาวอังคารและพฤหัสบดี',
          'ดาวหาง (Comet): ก้อนน้ำแข็งสกปรกและฝุ่น เมื่อเข้าใกล้ดวงอาทิตย์จะระเหิดเกิดหางแก๊สและฝุ่น',
          'ดาวตกและอุกกาบาต: สะเก็ดดาวที่พุ่งเข้าสู่ชั้นบรรยากาศโลก เกิดการเสียดสีลุกไหม้สว่างวาบ',
          'ดวงอาทิตย์ (The Sun): ดาวฤกษ์ศูนย์กลาง สร้างพลังงานจากปฏิกิริยานิวเคลียร์ฟิวชัน'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: กำเนิดและโครงสร้างของระบบสุริยะ',
        content: `
          <h3>1.1 ทฤษฎีเนบิวลาสุริยะ (Solar Nebula Theory)</h3>
          <p>ระบบสุริยะกำเนิดขึ้นเมื่อประมาณ 4,600 ล้านปีก่อน จากการยุบตัวของกลุ่มเมฆฝุ่นและแก๊สขนาดใหญ่ โดยมวลสารส่วนใหญ่รวมตัวกันตรงกลางกลายเป็นดวงอาทิตย์</p>
          <div class="box">
            <strong>องค์ประกอบมวล:</strong> ดวงอาทิตย์มีมวลคิดเป็น 99.86% ของระบบสุริยะทั้งหมด ดาวพฤหัสบดีคิดเป็นส่วนใหญ่ของมวลที่เหลือ
          </div>
          <h3>1.2 แถบดาวเคราะห์น้อยและขอบเขตของระบบสุริยะ</h3>
          <ul>
            <li><strong>Asteroid Belt:</strong> แบ่งระหว่างดาวเคราะห์ชั้นในและชั้นนอก</li>
            <li><strong>Kuiper Belt & Oort Cloud:</strong> แหล่งกำเนิดของดาวหางคาบสั้นและคาบยาว</li>
          </ul>
        `
      },
      {
        heading: 'บทที่ 2: คุณสมบัติเปรียบเทียบของดาวเคราะห์ทั้ง 8 ดวง',
        content: `
          <h3>2.1 ตารางเปรียบเทียบระยะทางและบริวาร</h3>
          <p>ดาวพุธและดาวศุกร์เป็นดาวเคราะห์สองดวงที่ไม่มีดวงจันทร์บริวาร โลกมี 1 ดวง ดาวอังคารมี 2 ดวง ในขณะที่ดาวพฤหัสบดีและดาวเสาร์มีดวงจันทร์บริวารมากกว่า 80-140 ดวง</p>
          <div class="box">
            <strong>นิยามดาวเคราะห์ของสมาพันธ์ดาราศาสตร์สากล (IAU 2006):</strong><br>
            1. โคจรรอบดวงอาทิตย์<br>
            2. มีมวลมากพอจนแรงโน้มถ่วงดึงให้มีรูปร่างทรงกลม<br>
            3. มีแรงโน้มถ่วงกวาดวัตถุในวงโคจรข้างเคียงออกไปหมด (Clear the neighborhood)
          </div>
        `
      }
    ]
  },
  {
    id: 'post-3-english-tenses',
    title: '12 Tenses ภาษาอังกฤษ: สรุปหลักการใช้ โครงสร้าง และตัวบอกเวลา',
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
  },
  {
    id: 'post-4-newton-laws',
    title: 'กฎการเคลื่อนที่ของนิวตัน: สรุปแรง กลศาสตร์ และการเขียน FBD',
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
        heading: 'บทที่ 2: กฎของนิวตันและแรงเสียดทาน',
        content: `
          <h3>2.1 แรงเสียดทานสถิต vs แรงเสียดทานจลน์</h3>
          <p>แรงเสียดทานเป็นแรงต้านการเคลื่อนที่ระหว่างผิวสัมผัส แรงเสียดทานสถิตมีค่าแปรผันตามแรงที่มากระทำจนถึงจุดสูงสุด fs(max) = μs·N ส่วนแรงเสียดทานจลน์เกิดขึ้นเมื่อวัตถุเริ่มไถล fk = μk·N</p>
          <div class="box">
            <strong>กฎข้อที่ 3 ของนิวตัน:</strong> แรงกิริยาและปฏิกิริยาไม่สามารถหักล้างกันจนเป็นศูนย์ได้ เพราะกระทำต่อวัตถุคนละชิ้น เช่น แรงที่โลกดึงคน และแรงที่คนดึงโลก
          </div>
        `
      }
    ]
  },
  {
    id: 'post-5-cell-structure',
    title: 'โครงสร้างเซลล์: สรุปหน้าที่ออร์แกเนลล์ เซลล์พืชและเซลล์สัตว์',
    subject: 'ชีววิทยา',
    grade: 'มัธยมศึกษาตอนปลาย',
    color: { primary: '#059669', secondary: '#047857', accent: '#10b981', bg: '#ecfdf5' },
    coverIcon: '🧬 Cell',
    coverSubtitle: 'Cell Organelles & Cell Biology ฉบับเตรียมสอบ สอวน. และ A-Level',
    badge: 'ชีววิทยา ม.ปลาย / เตรียมสอบ',
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
        title: 'ตารางเปรียบเทียบเซลล์พืช vs เซลล์สัตว์',
        desc: 'จุดแตกต่างหลักที่ข้อสอบชอบนำมาออกเป็นประจำ',
        items: [
          'ผนังเซลล์ (Cell Wall): เซลล์พืชมี (เซลลูโลส) vs เซลล์สัตว์ไม่มี',
          'คลอโรพลาสต์ (Chloroplast): เซลล์พืชมี vs เซลล์สัตว์ไม่มี',
          'แวคิวโอล (Vacuole): เซลล์พืชมี Central Vacuole ขนาดใหญ่ vs เซลล์สัตว์มีขนาดเล็กชั่วคราว',
          'เซนทริโอล (Centriole): เซลล์สัตว์มี vs เซลล์พืชชั้นสูงไม่มี',
          'รูปร่าง: เซลล์พืชเป็นเหลี่ยมแน่นอน vs เซลล์สัตว์รูปร่างค่อนข้างกลมหรือยืดหยุ่น'
        ]
      },
      {
        title: 'การลำเลียงสารผ่านเยื่อหุ้มเซลล์',
        desc: 'กลไกนำสารเข้าและออกจากเซลล์เพื่อรักษาสมดุล',
        items: [
          'Passive Transport: ไม่ใช้พลังงาน ATP (การแพร่ธรรมดา, ออสโมซิส, การแพร่แบบฟาซิลลิเทต)',
          'Active Transport: ใช้พลังงาน ATP ขนส่งสารจากความเข้มข้นต่ำไปสูงผ่านโปรตีนตัวพา',
          'Bulk Transport: การลำเลียงสารโมเลกุลใหญ่ผ่านถุง Vesicle (Endocytosis และ Exocytosis)',
          'Phagocytosis (การกินของเซลล์) vs Pinocytosis (การดื่มของเซลล์)'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: โครงสร้างของเยื่อหุ้มเซลล์และออร์แกเนลล์',
        content: `
          <h3>1.1 แบบจำลอง Fluid Mosaic Model</h3>
          <p>เยื่อหุ้มเซลล์ประกอบด้วย Phospholipid Bilayer เรียงตัวเป็นสองชั้น โดยหันส่วนชอบน้ำ (Hydrophilic head) ออกด้านนอก และส่วนไม่ชอบน้ำ (Hydrophobic tail) เข้าหากัน มีโปรตีนแทรกตัวอยู่</p>
          <div class="box">
            <strong>คุณสมบัติเยื่อเลือกผ่าน (Semi-permeable Membrane):</strong> สารไม่มีขั้วและแก๊สขนาดเล็กผ่านได้ง่าย สารมีขั้วหรือประจุต้องอาศัยโปรตีนช่อง (Channel protein)
          </div>
        `
      },
      {
        heading: 'บทที่ 2: ความร่วมมือของออร์แกเนลล์ในกระบวนการหลั่งสาร',
        content: `
          <h3>2.1 เส้นทางการสังเคราะห์และส่งออกโปรตีน (Endomembrane System)</h3>
          <p>นิวเคลียสส่งรหัส mRNA -> ไรโบโซมที่ RER สังเคราะห์โปรตีน -> ขนส่งผ่าน Transport Vesicle -> เข้าสู่ Golgi Apparatus เพื่อตกแต่ง -> บรรจุลง Secretory Vesicle -> หลั่งออกนอกเซลล์ผ่าน Exocytosis</p>
        `
      }
    ]
  },
  {
    id: 'post-6-web-architecture',
    title: 'Frontend Backend Database และ API: พื้นฐานสถาปัตยกรรมเว็บ',
    subject: 'คอมพิวเตอร์และเทคโนโลยี',
    grade: 'มหาวิทยาลัย',
    color: { primary: '#4f46e5', secondary: '#4338ca', accent: '#6366f1', bg: '#eef2ff' },
    coverIcon: '</> FullStack',
    coverSubtitle: 'Web Architecture: Client-Server, REST API, Database & Full-Stack System Design',
    badge: 'Computer Science / Web Architecture',
    gallery: [
      {
        title: 'Client-Server Architecture',
        desc: 'การแบ่งหน้าที่การทำงานระหว่างฝั่งผู้ใช้และฝั่งเซิร์ฟเวอร์',
        items: [
          'Frontend (Client): ส่วนติดต่อผู้ใช้งาน ออกแบบ UI/UX รองรับการแสดงผลทุกหน้าจอ',
          'Backend (Server): ระบบประมวลผล Business Logic, ตรวจสอบสิทธิ์ (Auth) และจัดการความปลอดภัย',
          'Database: ศูนย์กลางจัดเก็บข้อมูลอย่างเป็นระบบ มีทั้ง SQL (Relational) และ NoSQL',
          'API (Bridge): ช่องทางเชื่อมต่อให้ Frontend และ Backend แลกเปลี่ยนข้อมูลกัน'
        ]
      },
      {
        title: 'REST API & HTTP Methods',
        desc: 'มาตรฐานการออกแบบช่องทางการสื่อสารสำหรับเว็บแอปพลิเคชัน',
        items: [
          'GET: ดึงข้อมูลจากเซิร์ฟเวอร์ (เช่น รายการโพสต์, โปรไฟล์ผู้ใช้)',
          'POST: ส่งข้อมูลใหม่ไปสร้างบนเซิร์ฟเวอร์ (เช่น สร้างโพสต์, สมัครสมาชิก)',
          'PUT / PATCH: แก้ไขปรับปรุงข้อมูลเดิม (PUT แทนที่ทั้งหมด, PATCH แก้ไขบางฟิลด์)',
          'DELETE: ขอลบข้อมูลออกจากระบบ',
          'Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found'
        ]
      },
      {
        title: 'Database: SQL vs NoSQL',
        desc: 'การเลือกโครงสร้างฐานข้อมูลให้เหมาะกับลักษณะของข้อมูล',
        items: [
          'SQL (Relational): PostgreSQL, MySQL ข้อมูลมีโครงสร้างชัดเจน (Schema) รองรับ ACID Transactions',
          'NoSQL (Document): MongoDB ข้อมูลยืดหยุ่นในรูปแบบ JSON เอกสาร จัดเก็บได้หลากหลาย',
          'In-Memory Database: Redis สำหรับแคชข้อมูลที่เรียกใช้บ่อย ลดภาระการสืบค้นฐานข้อมูลหลัก'
        ]
      }
    ],
    pdfPages: [
      {
        heading: 'บทที่ 1: วงจรชีวิตของ Web Request (Life of a Request)',
        content: `
          <h3>1.1 ขั้นตอนเมื่อผู้ใช้งานคลิกปุ่มบนหน้าเว็บ</h3>
          <p>1. ผู้ใช้กดส่งฟอร์มบน Frontend -> JavaScript สร้าง HTTP Request พร้อมแนบ JSON Payload และ Auth Token</p>
          <p>2. Request เดินทางผ่านเครือข่ายไปยัง Backend Server -> API Gateway ตรวจสอบความถูกต้องและสิทธิ์</p>
          <p>3. Controller และ Service ดำเนินการ Business Logic และติดต่อ Database เพื่อ Query หรือ Save ข้อมูล</p>
          <p>4. Backend แปลงผลลัพธ์เป็น JSON Response ส่งกลับมายัง Frontend เพื่ออัปเดต UI ทันที</p>
          <div class="box">
            <strong>Security Best Practices:</strong> ใช้ HTTPS เสมอ, เก็บความลับด้วย Environment Variables, ป้องกัน SQL Injection และ XSS
          </div>
        `
      },
      {
        heading: 'บทที่ 2: การออกแบบ API และ State Management',
        content: `
          <h3>2.1 Stateless vs Stateful Communication</h3>
          <p>REST API ออกแบบให้เป็น Stateless นั่นคือแต่ละ Request ต้องมีข้อมูลเพียงพอสำหรับการประมวลผล (เช่น Bearer JWT Token) โดยที่ Server ไม่ต้องเก็บสถานะ Session ไว้ใน Memory ทำให้ระบบสามารถ Scale Out แนวนอนได้ง่าย</p>
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
      max-width: 980px;
    }
    .icon-badge {
      display: inline-block;
      font-size: 32px;
      font-weight: 800;
      color: ${post.color.primary};
      background: rgba(255, 255, 255, 0.95);
      padding: 10px 24px;
      border-radius: 16px;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
    h1 {
      font-size: 46px;
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
    <div class="page-num">${index + 1}/${post.gallery.length}</div>
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
  console.log('Starting Educational Media Asset Generation for 6 Posts...');
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

    // 1. Generate Cover Image (1280x720 PNG)
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.setContent(generateCoverHtml(post), { waitUntil: 'load' });
    const coverPath = path.join(postDir, 'cover.png');
    await page.screenshot({ path: coverPath, type: 'png' });
    console.log(`  ✓ Created Cover (1280x720 PNG): ${coverPath}`);

    // 2. Generate Gallery Images (1080x1080 PNG)
    for (let i = 0; i < post.gallery.length; i++) {
      await page.setViewportSize({ width: 1080, height: 1080 });
      await page.setContent(generateGalleryHtml(post, post.gallery[i], i), { waitUntil: 'load' });
      const galleryPath = path.join(postDir, `gallery-${i + 1}.png`);
      await page.screenshot({ path: galleryPath, type: 'png' });
      console.log(`  ✓ Created Gallery ${i + 1} (PNG): ${galleryPath}`);
    }

    // 3. Generate PDF Document (A4)
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
  console.log('\nAll 6 educational media assets generated successfully!');
}

main().catch(err => {
  console.error('Error generating educational media:', err);
  process.exit(1);
});
