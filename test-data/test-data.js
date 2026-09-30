const path = require('path');
const { randomUUID } = require('node:crypto');

const images = {
    coverPng: path.resolve(__dirname, 'images/cover.png'),
    coverJpg: path.resolve(__dirname, 'images/cover.jpg'),
    coverOver2MB: path.resolve(__dirname, 'images/cover-over-2mb.png'),

    image01: path.resolve(__dirname, 'images/image01.png'),
};

const pdf = {
    normal: path.resolve(__dirname, 'pdf/document.pdf'),
};

/**
 * ฟังก์ชันสร้าง "ชื่อโพสต์ที่ไม่ซ้ำกัน" (Unique Title) สำหรับใช้ในการทดสอบ
 * ป้องกันปัญหาชื่อโพสต์ชนกับโพสต์เก่าในระบบ หรือรันซ้ำแล้วหา Element ไม่เจอ
 * 
 * ตัวอย่างผลลัพธ์:
 * - รันในเครื่องตัวเอง: "TC-POST01-038 ทบทวนแคลคูลัส local-a1b2c3d4"
 * - รันบน GitHub Actions: "TC-POST01-038 ทบทวนแคลคูลัส 12345678-a1b2c3d4"
 * 
 * @param {string} prefix คำนำหน้าชื่อโพสต์ (ถ้าไม่ระบุ จะใช้ 'AutoTest')
 * @returns {string} ชื่อโพสต์ที่ไม่ซ้ำกัน ความยาวไม่เกิน 100 ตัวอักษร
 */
function generateUniqueTitle(prefix = 'AutoTest') {
    // 1. ตรวจสอบว่ารันอยู่ที่ไหน: ถ้ารันบน GitHub จะได้เลขรอบรัน (Run ID) ถ้ารันในเครื่องจะได้คำว่า 'local'
    const run = process.env.GITHUB_RUN_ID || 'local';

    // 2. randomUUID().slice(0, 8) คือสุ่มรหัสตัวอักษรภาษาอังกฤษ/ตัวเลข 8 ตัว เช่น '9b1deb4d' เพื่อไม่ให้ซ้ำกัน
    // 3. นำ (คำนำหน้า) + (รอบการรัน) + (รหัสสุ่ม 8 ตัว) มาต่อกัน
    // 4. .slice(0, 100) ตัดความยาวไม่ให้เกิน 100 ตัวอักษร เพื่อไม่ให้เกินข้อจำกัดของช่องกรอกชื่อในเว็บ
    return `${prefix} ${run}-${randomUUID().slice(0, 8)}`.slice(0, 100);
}

module.exports = {
    images,
    pdf,
    generateUniqueTitle,
};
