# ใช้ Playwright image ให้ตรงกับเวอร์ชันใน package-lock.json
FROM mcr.microsoft.com/playwright:v1.63.0-noble

# โฟลเดอร์ทำงานภายใน Container
WORKDIR /app

# ให้ Playwright รู้ว่ากำลังทำงานบนระบบ CI
ENV CI=true

# ติดตั้ง Packages ก่อน เพื่อให้ Docker ใช้ Cache ได้
COPY package.json package-lock.json ./
RUN npm ci

# คัดลอกไฟล์ Test และ Config เข้า Container
COPY . .

# เตรียมโฟลเดอร์สำหรับ Session และผลการทดสอบ
RUN mkdir -p playwright/.auth test-results playwright-report

# รัน Test การสร้างโพสต์ทั้งหมดด้วย Chromium
CMD ["npx", "playwright", "test", "tests/post/create-post.spec.js", "--project=chromium"]
