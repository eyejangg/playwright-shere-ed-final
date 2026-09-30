const fs = require('fs');

const workflows = JSON.parse(fs.readFileSync('scratch/n8n_workflows.json', 'utf8'));

for (const wf of workflows) {
  if (wf.name === 'Playwright Result') {
    for (const node of wf.nodes) {
      if (node.name === 'AI Failure Analysis') {
        let text = node.parameters.text;
        text = text.replace(
          /3\.\s*หาก failure_type เป็น demo[\s\S]*?5\.\s*หากมีหลาย error/,
          '3. ประเมินจาก error, stack trace และหลักฐานจริงของระบบ\n4. หากมีหลาย error'
        );
        text = text.replace(
          /- Trivial: ผลกระทบเล็กน้อย หรือความล้มเหลวที่ตั้งใจจำลองสำหรับ Demo/,
          '- Trivial: ผลกระทบเล็กน้อยมากต่อการแสดงผลหรือไม่กระทบกระบวนการหลัก'
        );
        text = text.replace(/\"severity\": \"Trivial\"/, '"severity": "Minor"');
        node.parameters.text = text;
      }

      if (node.name === 'Build Failure Email') {
        let code = node.parameters.jsCode;
        code = code.replace(
          /\/\/ 4\. แยกความล้มเหลวจำลองจากความล้มเหลวอื่น[\s\S]*?const allDemo = rows\.length > 0 && demoCount === rows\.length;/,
          '// 4. สรุปความล้มเหลว'
        );
        code = code.replace(
          /const demo = test\.failure_type === 'demo';\n/,
          ''
        );
        code = code.replace(
          /\$\{demo \? 'Demo — ตั้งใจจำลองความล้มเหลว' : 'ความล้มเหลวของการทดสอบ — ต้องตรวจสอบ'\}/g,
          'ความล้มเหลวของการทดสอบ — ต้องตรวจสอบ'
        );
        code = code.replace(
          /background:\$\{demo \? '#eff6ff' : '#fef2f2'\};border-left:4px solid \$\{demo \? '#2563eb' : '#dc2626'\};/,
          'background:#fef2f2;border-left:4px solid #dc2626;'
        );
        code = code.replace(
          /\$\{paragraph\(demo \? 'เหตุผลของ Demo' : 'สาเหตุที่เป็นไปได้', test\.possible_cause\)\}/,
          "${paragraph('สาเหตุที่เป็นไปได้', test.possible_cause)}"
        );
        code = code.replace(
          /const subject = allDemo[\s\S]*?`SHARE-ED QA \| ผ่าน \$\{passed\}\/\$\{total\} \| Failed \$\{failed\} เคส \| \$\{runSeverity\}`;/,
          'const subject = `SHARE-ED QA | ผ่าน ${passed}/${total} | Failed ${failed} เคส | ${runSeverity}`;'
        );
        code = code.replace(
          /\$\{allDemo \? 'รอบสาธิต: เคส Failed ที่รายงานทั้งหมดเกิดจากจุดจำลอง Demo' : 'สรุปผลทดสอบและรายละเอียดขั้นตอนที่ล้มเหลว'\}/,
          'สรุปผลทดสอบและรายละเอียดขั้นตอนที่ล้มเหลว'
        );
        code = code.replace(
          /<p>ความล้มเหลวจำลอง: <b>\$\{demoCount\}<\/b> เคส · ความล้มเหลวอื่นที่ต้องตรวจสอบ: <b>\$\{otherCount\}<\/b> เคส<\/p>\n/,
          ''
        );
        code = code.replace(/demo_count: demoCount,\n\s*non_demo_count: otherCount,\n/, '');
        node.parameters.jsCode = code;
      }
    }
  }

  if (wf.name === 'Recurring Failure & Test Health Analysis') {
    for (const node of wf.nodes) {
      if (node.name === 'Aggregate & Count Failures') {
        let code = node.parameters.jsCode;
        code = code.replace(
          /\/\/ แยกกลุ่มด้วยชื่อเคส \+ ประเภทความล้มเหลว[\s\S]*?\/\/ Demo ของเคสเดียวกันจะไม่ปนกับความล้มเหลวจริง/,
          '// แยกกลุ่มด้วยชื่อเคส + ประเภทความล้มเหลว'
        );
        code = code.replace(
          /\/\/ ใช้ failure_type ที่ส่งมาเป็นหลัก[\s\S]*?: 'test';/,
          `// กรองข้อมูลเก่าที่ไม่ใช่การทดสอบจริงออก ไม่ให้นับรวมกับรอบจริง
  if (declaredType === 'demo' || error.includes('DEMO_ONLY:') || error.includes('CONTROLLED_TEST_FAILURE') || title.includes('[Demo]')) {
    continue;
  }
  const failureType = declaredType || 'test';`
        );
        code = code.replace(
          /result\.failure_type === 'demo'[\s\S]*?: 'FAILURE_HISTORY'/,
          "'FAILURE_HISTORY'"
        );
        node.parameters.jsCode = code;
      }

      if (node.name === 'Gemini Health Agent') {
        let text = node.parameters.text;
        text = text.replace(
          /- หาก failure_type เป็น demo ให้ระบุว่าเป็น Demo เกิดซ้ำจากการตั้งใจจำลอง ไม่ใช่หลักฐานว่าระบบมีบั๊กเกิดซ้ำ\n/,
          ''
        );
        text = text.replace(
          /- สำหรับ Demo แนะนำให้คงจุดจำลองไว้เมื่อใช้สาธิต และปิดจุดจำลองเมื่อจะวัดผลการทดสอบปกติ\n/,
          ''
        );
        text = text.replace(
          /- หากไม่ใช่ Demo ให้เสนอเฉพาะสาเหตุที่เป็นไปได้/,
          '- เสนอเฉพาะสาเหตุที่เป็นไปได้'
        );
        text = text.replace(
          /\"possible_cause\": \"สาเหตุที่เป็นไปได้ หรือเหตุผลของ Demo\"/,
          '"possible_cause": "สาเหตุที่เป็นไปได้"'
        );
        text = text.replace(
          /- สำหรับ Demo ให้ระบุว่าไม่ใช่หลักฐานของบั๊กระบบ ห้ามสรุปว่าระบบทั้งหมดไม่มีปัญหาหรือไม่มีผลกระทบ\n?/,
          ''
        );
        node.parameters.text = text;

        if (node.parameters.options?.systemMessage) {
          let sm = node.parameters.options.systemMessage;
          sm = sm.replace(
            /- หาก failure_type เป็น demo ให้รายงานว่าเป็นความล้มเหลวจำลองที่พบซ้ำ ห้ามสรุปว่าเป็นบั๊กของระบบหรือปัญหาคุณภาพระบบจริง\n/,
            ''
          );
          sm = sm.replace(
            /- สำหรับ Demo ให้แนะนำคงจุดจำลองไว้เมื่อใช้สาธิต และปิดจุดจำลองเมื่อวัดผลทดสอบปกติ\n/,
            ''
          );
          sm = sm.replace(
            /- หากไม่ใช่ Demo ให้เสนอแนวทางตรวจสอบโดยอ้างอิง error และขั้นตอนที่ล้มเหลว/,
            '- เสนอแนวทางตรวจสอบโดยอ้างอิง error และขั้นตอนที่ล้มเหลว'
          );
          node.parameters.options.systemMessage = sm;
        }
      }

      if (node.name === 'Prepare Developer Recommendation') {
        let code = node.parameters.jsCode;
        code = code.replace(
          /const recurringStatus =\n\s*failureType === 'demo'\n\s*\? 'DEMO_RECURRING'\n\s*: 'RECURRING';/,
          "const recurringStatus = 'RECURRING';"
        );
        code = code.replace(
          /2\. สาเหตุที่เป็นไปได้ หรือเหตุผลของ Demo/,
          '2. สาเหตุที่เป็นไปได้'
        );
        node.parameters.jsCode = code;
      }

      if (node.name === 'Send a message') {
        node.parameters.subject = "={{ '[Test Failure เกิดซ้ำ] SHARE-ED QA | ' + $('Prepare Developer Recommendation').item.json.test_title + ' | ' + $('Prepare Developer Recommendation').item.json.latest_severity }}";
        let msg = node.parameters.message;
        msg = msg.replace(/const isDemo = test\.failure_type === 'demo';\n/, '');
        msg = msg.replace(/\$\{isDemo\n\s*\? 'รายงาน Demo เกิดซ้ำ'\n\s*: 'รายงาน Test Failure เกิดซ้ำ'\}/g, 'รายงาน Test Failure เกิดซ้ำ');
        msg = msg.replace(/\$\{isDemo\n\s*\? 'ความล้มเหลวจำลองสำหรับการสาธิต ไม่ใช่หลักฐานว่าระบบมีบั๊กเกิดซ้ำ'\n\s*: 'ประวัติความล้มเหลวสำหรับทีม QA และ Developer ตรวจสอบต่อ'\}/g, 'ประวัติความล้มเหลวสำหรับทีม QA และ Developer ตรวจสอบต่อ');
        msg = msg.replace(/\$\{isDemo \? 'Demo' : 'Test Failure'\}/g, 'Test Failure');
        msg = msg.replace(/\$\{isDemo \? 'DEMO_RECURRING' : 'RECURRING'\}/g, 'RECURRING');
        msg = msg.replace(/background:\$\{isDemo \? '#eff6ff' : '#fef2f2'\};/g, 'background:#fef2f2;');
        msg = msg.replace(/border-left:4px solid \$\{isDemo \? '#2563eb' : '#dc2626'\};/g, 'border-left:4px solid #dc2626;');
        msg = msg.replace(/\$\{section\(\n\s*isDemo \? 'เหตุผลของ Demo' : 'สาเหตุที่เป็นไปได้',\n\s*test\.possible_cause\n\s*\)\}/g, "${section('สาเหตุที่เป็นไปได้', test.possible_cause)}");
        node.parameters.message = msg;
      }
    }
  }
}

fs.writeFileSync('scratch/n8n_workflows_cleaned.json', JSON.stringify(workflows, null, 2));
console.log('Successfully created scratch/n8n_workflows_cleaned.json');
