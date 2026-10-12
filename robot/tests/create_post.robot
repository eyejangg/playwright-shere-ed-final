*** Settings ***
Documentation    แปลงจาก playwright/tests/post/create-post.spec.js commit 202f918 ของชุด Playwright
Resource    ../resources/share_ed.resource
Suite Setup    Start Share Ed Suite
Suite Teardown    Close Browser    ALL
Test Setup    Open Create Post Page
Test Teardown    Capture Failure
Test Timeout    120 seconds
Test Tags    post

*** Test Cases ***

TC-POST01-001: สมาชิกเข้าสู่หน้าสร้างโพสต์
    [Tags]    TC-POST01-001
    [Setup]    Open Guest Page
    Go To    /
    Click    internal:role=link[name="เข้าสู่ระบบ"i]
    Fill Text    internal:role=textbox[name="อีเมล"i]    ${TEST_EMAIL}
    Fill Login Password
    Click    internal:role=button[name="เข้าสู่ระบบ"s]
    Wait For Url Matching    \\/home\\/?$
    Expect Element Visible    internal:role=heading[name="ยินดีต้อนรับสู่ SHARE-ED"i]
    Expect Element Visible    [test-data="create-post-button"]
    Click    [test-data="create-post-button"]
    Wait For Url Matching    \\/create\\/?$
    Expect Element Visible    internal:role=heading[name="สร้างโพสต์สรุปความรู้"i]

TC-POST01-002: ตรวจสอบฟิลด์ในหน้าสร้างโพสต์
    [Tags]    TC-POST01-002
    Expect Element Visible    internal:role=heading[name="สร้างโพสต์สรุปความรู้"i]
    Wait For Elements State    [test-data="cover-file-input"]    attached
    Expect Element Visible    [test-data="post-title-input"]
    Expect Element Visible    [test-data="education-level-select"]
    Expect Element Visible    [test-data="post-summary-input"]
    Expect Element Visible    [test-data="category-tags-settings-button"]
    Expect Element Visible    [test-data="post-content-input"]
    Wait For Elements State    [test-data="pdf-file-input"]    attached
    Wait For Elements State    [test-data="supporting-images-file-input"]    attached
    Expect Element Visible    [test-data="cancel-create-post-button"]
    Expect Element Visible    [test-data="save-draft-button"]
    Expect Element Visible    [test-data="publish-post-button"]
    Expect Element Visible    internal:text="รูปปก *"s
    Expect Element Visible    internal:text="ไม่เกิน 2 MB"s >> nth=0
    Expect Element Visible    internal:text=/ชื่อหัวข้อสรุป/i
    Expect Element Visible    internal:text="ระดับชั้น *"s
    Expect Element Visible    internal:text=/บทสรุปย่อ \\(Summary\\)/i
    Expect Element Visible    internal:text=/หมวดหมู่วิชาและแฮชแท็ก/i
    Expect Element Visible    [test-data="category-tags-settings-button"]
    Expect Element Visible    internal:text="รายละเอียดเพิ่มเติม *"s
    Expect Element Visible    internal:text=/ไฟล์เอกสาร PDF/i
    Expect Element Visible    internal:text=/รูปภาพประกอบ/i

TC-POST01-003: กรอกข้อมูลโพสต์ครบถ้วนและแนบไฟล์
    [Tags]    TC-POST01-003
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    internal:role=button[name="#สรุปย่อ"s]
    Click    ${CONFIRM_CATEGORY}
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_NORMAL}
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Expect Property    [test-data="post-title-input"]    value    ==    ทบทวนแคลคูลัส
    Expect Property    [test-data="post-summary-input"]    value    ==    สรุปสูตรอนุพันธ์
    Expect Text    [test-data="post-content-input"] >> [contenteditable="true"]    contains    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Expect Element Visible    internal:text=/คณิตศาสตร์/ >> nth=-1
    Expect Element Visible    internal:text=/สรุปย่อ/ >> nth=-1
    Expect Element Visible    internal:role=img[name="Cover"i]
    Expect Element Visible    internal:text=/document\\.pdf/i
    Expect Element Visible    internal:role=img[name="img-0"i]

TC-POST01-004: เลือกหมวดหมู่วิชา 1 หมวด
    [Tags]    TC-POST01-004
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Expect Element Visible    internal:text="คณิตศาสตร์"s >> nth=-1

TC-POST01-005: แนบรูปหน้าปก PNG
    [Tags]    TC-POST01-005
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Expect Element Visible    internal:role=img[name="Cover"i]
    Expect Property    internal:role=img[name="Cover"i]    naturalWidth    >    ${0}
    Expect Element Visible    [test-data="remove-cover-button"]

TC-POST01-006: แนบรูปหน้าปก JPG
    [Tags]    TC-POST01-006
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_JPG}
    Expect Element Visible    internal:role=img[name="Cover"i]
    Expect Property    internal:role=img[name="Cover"i]    naturalWidth    >    ${0}
    Expect Element Visible    [test-data="remove-cover-button"]

TC-POST01-007: แนบรูปหน้าปกขนาดเท่ากับ 2 MB
    [Tags]    TC-POST01-007
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Expect Element Visible    internal:role=img[name="Cover"i]
    Expect Property    internal:role=img[name="Cover"i]    naturalWidth    >    ${0}
    Expect Element Visible    [test-data="remove-cover-button"]

TC-POST01-008: แนบรูปภาพประกอบ 1 รูป
    [Tags]    TC-POST01-008
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Expect Element Visible    internal:text="รูปภาพประกอบ (1/5) *"s
    Expect Element Visible    internal:role=img[name="img-0"i]
    Expect Element Visible    [test-data="remove-supporting-image-button-0"]

TC-POST01-009: แนบรูปภาพประกอบครบ 5 รูป
    [Tags]    TC-POST01-009
    Upload File By Selector    [test-data="supporting-images-file-input"]    @{IMAGES_05}
    Expect Element Visible    internal:text="รูปภาพประกอบ (5/5) *"s
    Expect Element Visible    internal:role=img[name="img-0"i]
    Expect Element Visible    internal:role=img[name="img-4"i]
    Expect Element Visible    [test-data="remove-supporting-image-button-0"]
    Expect Element Visible    [test-data="remove-supporting-image-button-4"]

TC-POST01-010: แนบไฟล์ PDF 1 ไฟล์
    [Tags]    TC-POST01-010
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_NORMAL}
    Expect Element Visible    internal:text=/document\\.pdf/i

TC-POST01-011: แนบไฟล์ PDF ขนาดเท่ากับ 20 MB
    [Tags]    TC-POST01-011
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_20MB}
    Expect Element Visible    internal:text=/document-20mb\\.pdf/i

TC-POST01-012: ไม่กรอกชื่อหัวข้อสรุป
    [Tags]    TC-POST01-012
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Property    [test-data="post-title-input"]    value    ==    ${EMPTY}
    Expect Element Visible    internal:text="กรุณากรอกชื่อหัวข้อสรุปความรู้"i
    Get Url    matches    \\/create

TC-POST01-013: ไม่เลือกระดับชั้น
    [Tags]    TC-POST01-013
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Property    [test-data="education-level-select"]    value    ==    ${EMPTY}
    Expect Element Visible    internal:text="กรุณาเลือกระดับชั้น"i
    Get Url    matches    \\/create

TC-POST01-014: ไม่กรอกบทสรุปย่อ
    [Tags]    TC-POST01-014
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Property    [test-data="post-summary-input"]    value    ==    ${EMPTY}
    Expect Element Visible    internal:text="กรุณากรอกบทสรุปย่อ"i
    Get Url    matches    \\/create

TC-POST01-015: ไม่เลือกหมวดหมู่วิชา
    [Tags]    TC-POST01-015
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Element Visible    internal:text="กรุณาเลือกหมวดหมู่วิชา"i >> nth=-1
    Get Url    matches    \\/create

TC-POST01-016: ไม่กรอกรายละเอียดเพิ่มเติม
    [Tags]    TC-POST01-016
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Element Visible    internal:text="กรุณากรอกรายละเอียดเพิ่มเติม"i
    Get Url    matches    \\/create

TC-POST01-017: ไม่แนบรูปหน้าปก
    [Tags]    TC-POST01-017
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    สรุปสูตรอนุพันธ์
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    ${CONFIRM_CATEGORY}
    Fill Text    [test-data="post-content-input"] >> [contenteditable="true"]    ข้อความตัวอย่างสำหรับทบทวนบทเรียนเรื่องอนุพันธ์
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}
    Click    [test-data="publish-post-button"]
    Expect Element Visible    internal:text=/กรุณาอัปโหลดรูปภาพหน้าปก/i    timeout=5.0 seconds
    Get Url    matches    \\/create

TC-POST01-018: รูปหน้าปกมีขนาดเกิน 2 MB
    [Tags]    TC-POST01-018
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_OVER_2MB}
    Expect Element Visible    internal:text="คลิกเพื่ออัปโหลดรูปปก"s
    Get Element Count    internal:text="cover-over-2mb.png"s    ==    0
    Expect Text    internal:role=status    ==    รูปหน้าปกต้องมีขนาดไม่เกิน 2 MB
    Get Url    matches    \\/create

TC-POST01-019: รูปภาพประกอบมีขนาดเกิน 2 MB
    [Tags]    TC-POST01-019
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_OVER_2MB}
    Expect Element Visible    internal:text="รูปภาพประกอบ (0/5) *"s
    Get Element Count    internal:text="image-over-2mb.png"s    ==    0
    Expect Text    internal:role=status    ==    รูปภาพประกอบต้องมีขนาดไม่เกิน 2 MB
    Get Url    matches    \\/create

TC-POST01-020: ไฟล์ PDF มีขนาดเกิน 20 MB
    [Tags]    TC-POST01-020
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_OVER_20MB}
    Expect Element Visible    internal:text="อัปโหลดไฟล์ PDF"s
    Get Element Count    internal:text="document-over-20mb.pdf"s    ==    0
    Expect Element Visible    internal:text="ไฟล์ PDF ต้องไม่เกิน 20 MB"i
    Get Url    matches    \\/create

TC-POST01-021: รูปหน้าปกเป็นไฟล์ผิดประเภท
    [Tags]    TC-POST01-021
    Upload File By Selector    [test-data="cover-file-input"]    ${IMAGE_GIF}
    Expect Element Visible    internal:text="คลิกเพื่ออัปโหลดรูปปก"s
    Get Element Count    internal:text="image01.gif"s    ==    0
    Expect Text    internal:role=status    ==    รูปภาพหน้าปกต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น
    Get Url    matches    \\/create

TC-POST01-022: รูปภาพประกอบเป็นไฟล์ผิดประเภท
    [Tags]    TC-POST01-022
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_GIF}
    Expect Element Visible    internal:text="รูปภาพประกอบ (0/5) *"s
    Get Element Count    internal:text="image01.gif"s    ==    0
    Expect Text    internal:role=status    ==    รูปภาพต้องเป็นไฟล์ .jpg, .jpeg, .png, .apng เท่านั้น
    Get Url    matches    \\/create

TC-POST01-023: เลือกไฟล์ที่ไม่ใช่ PDF
    [Tags]    TC-POST01-023
    Upload File By Selector    [test-data="pdf-file-input"]    ${DOCX}
    Expect Element Visible    internal:text="อัปโหลดไฟล์ PDF"s
    Get Element Count    internal:text="document.docx"s    ==    0
    Expect Element Visible    internal:text="ไฟล์นี้ไม่ใช่ PDF ที่ถูกต้อง"i
    Get Url    matches    \\/create

TC-POST01-024: แนบรูปภาพประกอบรูปที่ 6
    [Tags]    TC-POST01-024
    Upload File By Selector    [test-data="supporting-images-file-input"]    @{IMAGES_06}
    Expect Text    internal:role=status    contains    อัปโหลดรูปภาพประกอบได้สูงสุด 5 รูป
    Expect Element Visible    internal:text="รูปภาพประกอบ (5/5) *"s
    Get Element Count    internal:role=img[name=/^img-\\d+$/]    ==    5
    Get Element Count    internal:role=img[name="img-5"s]    ==    0
    Get Url    matches    \\/create

TC-POST01-025: เพิ่มแท็กภาษาไทย
    [Tags]    TC-POST01-025
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#เรียนรู้
    Press Keys    [test-data="hashtag-input"]    Enter
    Expect Element Visible    internal:text="#เรียนรู้"s >> nth=0

TC-POST01-026: เพิ่มแท็กภาษาอังกฤษ
    [Tags]    TC-POST01-026
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#Learning
    Press Keys    [test-data="hashtag-input"]    Enter
    Expect Element Visible    internal:text="#Learning"s >> nth=0

TC-POST01-027: เพิ่มแท็กที่มีตัวเลข
    [Tags]    TC-POST01-027
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#Math123
    Press Keys    [test-data="hashtag-input"]    Enter
    Expect Element Visible    internal:text="#Math123"s >> nth=0

TC-POST01-028: ระบบเติมเครื่องหมาย # ให้แท็กอัตโนมัติ
    [Tags]    TC-POST01-028
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    เรียนรู้
    Press Keys    [test-data="hashtag-input"]    Enter
    Expect Element Visible    internal:text="#เรียนรู้"s >> nth=0

TC-POST01-029: แท็กมีเครื่องหมาย # อยู่แล้ว
    [Tags]    TC-POST01-029
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#เรียนรู้
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    internal:text="##เรียนรู้"s    ==    0
    Expect Element Visible    internal:text="#เรียนรู้"s >> nth=0

TC-POST01-030: เพิ่มแท็กครบ 3 แท็ก
    [Tags]    TC-POST01-030
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#คณิต
    Press Keys    [test-data="hashtag-input"]    Enter
    Fill Text    [test-data="hashtag-input"]    \#ม6
    Press Keys    [test-data="hashtag-input"]    Enter
    Fill Text    [test-data="hashtag-input"]    \#เรียนรู้
    Press Keys    [test-data="hashtag-input"]    Enter
    Click    ${CONFIRM_CATEGORY}
    Expect Element Visible    internal:text="#คณิต"s
    Expect Element Visible    internal:text="#ม6"s
    Expect Element Visible    internal:text="#เรียนรู้"s

TC-POST01-031: เพิ่มแท็กรายการที่ 4
    [Tags]    TC-POST01-031
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#คณิต
    Press Keys    [test-data="hashtag-input"]    Enter
    Fill Text    [test-data="hashtag-input"]    \#ม6
    Press Keys    [test-data="hashtag-input"]    Enter
    Fill Text    [test-data="hashtag-input"]    \#เรียนรู้
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    [test-data="hashtag-input"]    ==    0
    Expect Element Visible    internal:text="แฮชแท็ก (3/3)"s
    Click    internal:role=button[name="#สรุปย่อ"s]
    Expect Element Visible    internal:text="แฮชแท็ก (3/3)"s
    Click    internal:role=button[name="เสร็จสิ้น"s]
    Expect Element Visible    internal:text="#คณิต"s
    Expect Element Visible    internal:text="#ม6"s
    Expect Element Visible    internal:text="#เรียนรู้"s
    Get Element Count    internal:text="#สรุปย่อ"s    ==    0

TC-POST01-032: แท็กมีเครื่องหมายขีดกลาง
    [Tags]    TC-POST01-032
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#QA-Test
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    internal:text="#QA-Test"s    ==    0
    Expect Element Visible    internal:text=/แท็กต้องไม่มีอักษรพิเศษ/i

TC-POST01-033: แท็กมีเครื่องหมายขีดล่าง
    [Tags]    TC-POST01-033
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#QA_Test
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    internal:text="#QA_Test"s    ==    0
    Expect Element Visible    internal:text=/แท็กต้องไม่มีอักษรพิเศษ/i

TC-POST01-034: แท็กมีเครื่องหมาย @
    [Tags]    TC-POST01-034
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#QA@Test
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    internal:text="#QA@Test"s    ==    0
    Expect Element Visible    internal:text=/แท็กต้องไม่มีอักษรพิเศษ/i

TC-POST01-035: แท็กมีความยาว 10 ตัวอักษร (รวม #)
    [Tags]    TC-POST01-035
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#123456789
    Press Keys    [test-data="hashtag-input"]    Enter
    Expect Element Visible    internal:text="#123456789"s >> nth=0

TC-POST01-036: แท็กมีความยาว 11 ตัวอักษร (รวม #)
    [Tags]    TC-POST01-036
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Fill Text    [test-data="hashtag-input"]    \#1234567890
    Press Keys    [test-data="hashtag-input"]    Enter
    Get Element Count    internal:text="#1234567890"s    ==    0
    Expect Element Visible    internal:text="แท็กต้องมีความยาวไม่เกิน 10 ตัวอักษร"s

TC-POST01-037: แนบไฟล์ PDF จำนวน 1 ไฟล์
    [Tags]    TC-POST01-037
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_NORMAL}
    Expect Element Visible    internal:text="document.pdf"s
    Expect Element Visible    [test-data="remove-pdf-button"]

TC-POST01-038: เผยแพร่โพสต์สำเร็จเมื่อกรอกข้อมูลครบถ้วน
    [Tags]    TC-POST01-038    live-write
    ${run_id}=    Evaluate    str(uuid.uuid4())[:8]    modules=uuid
    ${title}=    Set Variable    TC-POST01-038 ทบทวนแคลคูลัส ${run_id}
    ${summary}=    Set Variable    สรุปสูตรอนุพันธ์ ${run_id}
    ${content}=    Set Variable    เนื้อหาตัวอย่างสำหรับทดสอบ TC-POST01-038 ${run_id}
    Fill Complete Post    ${title}    ${summary}    ${content}
    ${id}=    Publish And Remember Current Post    ${title}
    Expect Element Visible    internal:role=dialog[name="สำเร็จ!"s]    timeout=60 seconds
    Expect Element Visible    internal:role=dialog >> internal:text="สร้างโพสต์สรุปความรู้เรียบร้อยแล้ว"s
    Click    internal:role=button[name="OK"s]
    Open My Posts
    Expect Element Visible    internal:role=heading[name="${title}"s]
    Click    internal:role=heading[name="${title}"s]
    Get Url    matches    /post/${id}$
    Expect Element Visible    internal:role=heading[name="${title}"s]
    Expect Element Visible    internal:text="คณิตศาสตร์"s >> nth=0
    Expect Element Visible    internal:text="มัธยมศึกษาตอนปลาย"s >> nth=0
    Expect Element Visible    internal:role=heading[name="บทสรุปย่อ"s] >> xpath=.. >> internal:text="${summary}"s
    Expect Element Visible    internal:role=heading[name="รายละเอียดเพิ่มเติม"s] >> xpath=.. >> internal:text="${content}"s
    Expect Element Visible    internal:role=img[name="gallery-0"s]
    Expect Element Visible    internal:text="document.pdf"s
    Expect Element Visible    internal:role=button[name="ดาวน์โหลด"s]
    Expect Element Visible    internal:text="#สรุปย่อ"s

TC-POST01-039: ลบโพสต์ทดสอบที่สร้างจากเคส 038
    [Tags]    TC-POST01-039    live-write
    [Setup]    Open Member Page
    Delete Current Test Post
