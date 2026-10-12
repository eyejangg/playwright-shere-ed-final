*** Settings ***
Library    Browser    timeout=20 seconds    retry_assertions_for=5 seconds    auto_delete_passed_tracing=${True}
Library    OperatingSystem
Library    Collections
Variables    ../config/variables.py

*** Variables ***
${HEADLESS}    ${True}
${BROWSER}    chromium
${SCROLL_TO_EXPECT}    ${True}
${DELETE_TEST_POST}    %{DELETE_TEST_POST=1}
${DATA_DIR}    ${CURDIR}/../../test-data
${COVER_PNG}    ${DATA_DIR}/images/cover.png
${COVER_JPG}    ${DATA_DIR}/images/cover.jpg
${COVER_OVER_2MB}    ${DATA_DIR}/images/cover-over-2mb.png
${IMAGE_01}    ${DATA_DIR}/images/image01.png
${IMAGE_OVER_2MB}    ${DATA_DIR}/images/image-over-2mb.png
${IMAGE_GIF}    ${DATA_DIR}/images/image01.gif
${PDF_NORMAL}    ${DATA_DIR}/pdf/document.pdf
${PDF_20MB}    ${DATA_DIR}/pdf/document-20mb.pdf
${PDF_OVER_20MB}    ${DATA_DIR}/pdf/document-over-20mb.pdf
${DOCX}    ${DATA_DIR}/pdf/document.docx
@{IMAGES_05}    ${DATA_DIR}/images/image01.png    ${DATA_DIR}/images/image02.png    ${DATA_DIR}/images/image03.png    ${DATA_DIR}/images/image04.png    ${DATA_DIR}/images/image05.png
@{IMAGES_06}    @{IMAGES_05}    ${DATA_DIR}/images/image06.png
${CONFIRM_CATEGORY}    internal:role=button[name="เสร็จสิ้น"i] >> internal:or="[test-data='confirm-category-tags-button']" >> nth=0
${EDITOR}    [test-data="post-content-input"] >> [contenteditable="true"]

*** Keywords ***
Start Share Ed Suite
    Should Not Be Empty    ${TEST_EMAIL}    ใส่ email ใน robot/config/account.local.json ก่อนรัน หรือกำหนด TEST_EMAIL
    Should Match Regexp    ${TEST_EMAIL}    ^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$    msg=อีเมลไม่ถูกต้อง ให้ใส่อีเมลจริงใน robot/config/account.local.json
    ${has_password}=    Evaluate    bool(os.environ.get('TEST_PASSWORD'))    modules=os
    Should Be True    ${has_password}    ใส่ password ใน robot/config/account.local.json ก่อนรัน หรือกำหนด TEST_PASSWORD
    Set Suite Variable    ${CREATED_POST}    ${None}

    Set Suite Variable    ${CREATED_RECORD}    ${OUTPUTDIR}/created-post-038.json
    Launch Configured Browser
    New Context    baseURL=${BASE_URL}    viewport={'width': 1280, 'height': 720}
    New Page    /
    Login As Member
    ${state}=    Save Storage State    ${OUTPUTDIR}/browser/state/member.json
    Set Suite Variable    ${MEMBER_STATE}    ${state}
    Close Context

Launch Configured Browser
    ${supported}=    Create List    chromium    firefox    webkit    chrome    msedge
    Should Contain    ${supported}    ${BROWSER}    msg=BROWSER ต้องเป็น chromium, firefox, webkit, chrome หรือ msedge
    ${engine}=    Set Variable    ${BROWSER}
    ${channel}=    Set Variable    ${None}
    IF    $BROWSER in ('chrome', 'msedge')
        ${engine}=    Set Variable    chromium
        ${channel}=    Set Variable    ${BROWSER}
    END
    New Browser    ${engine}    headless=${HEADLESS}    channel=${channel}

Fill Login Password
    Fill Secret    internal:role=textbox[name="รหัสผ่าน"i]    %TEST_PASSWORD

Wait For Url Matching
    [Arguments]    ${pattern}    ${timeout}=20 seconds
    Wait Until Keyword Succeeds    ${timeout}    200 milliseconds    Get Url    matches    ${pattern}

Login As Member
    Click    internal:role=link[name="เข้าสู่ระบบ"i]
    Fill Text    internal:role=textbox[name="อีเมล"i]    ${TEST_EMAIL}
    Fill Login Password
    Click    internal:role=button[name="เข้าสู่ระบบ"s]
    Expect Element Visible    [test-data="create-post-button"]    timeout=20 seconds
    Get Url    matches    /home/?$

Open Guest Page
    New Context    baseURL=${BASE_URL}    viewport={'width': 1280, 'height': 720}    tracing=${True}
    New Page    /

Open Member Page
    New Context    baseURL=${BASE_URL}    storageState=${MEMBER_STATE}    viewport={'width': 1280, 'height': 720}    tracing=${True}
    New Page    /

Open Create Post Page
    Open Member Page
    Click    [test-data="create-post-button"]

Capture Failure
    IF    '${TEST STATUS}' == 'FAIL'
        Run Keyword And Ignore Error    Take Screenshot    filename=robot-failure-{index}    fullPage=${True}
    END
    # Browser's TEST auto-closing also finalizes traces after failed setup/teardown.

Open My Posts
    Go To    /home
    Click    internal:role=button >> internal:has="internal:role=img[name=/^Profile$/]"
    Click    internal:role=link[name="โปรไฟล์ของฉัน"i]
    Click    internal:role=button[name="โพสต์ของฉัน"s]

Fill Complete Post
    [Arguments]    ${title}    ${summary}    ${content}
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    Fill Text    [test-data="post-title-input"]    ${title}
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Fill Text    [test-data="post-summary-input"]    ${summary}
    Click    [test-data="category-tags-settings-button"]
    Select Options By    [test-data="category-select"]    label    คณิตศาสตร์
    Click    internal:role=button[name="#สรุปย่อ"s]
    Click    ${CONFIRM_CATEGORY}
    Fill Text    ${EDITOR}    ${content}
    Upload File By Selector    [test-data="pdf-file-input"]    ${PDF_NORMAL}
    Upload File By Selector    [test-data="supporting-images-file-input"]    ${IMAGE_01}

Publish And Remember Current Post
    [Arguments]    ${title}
    # Register the response wait BEFORE clicking; do not send a second API request.
    ${promise}=    Promise To    Wait For Response
    ...    matcher=response => response.request().method() === 'POST' && ['/api/v1/posts', '/api/v1/posts/'].includes(new URL(response.url()).pathname)
    ...    timeout=60 seconds
    Click    [test-data="publish-post-button"]
    ${response}=    Wait For    ${promise}
    Should Be Equal As Integers    ${response}[status]    201
    Should Be Equal    ${response}[body][success]    ${True}
    ${post}=    Set Variable    ${response}[body][data]
    ${id_is_string}=    Evaluate    isinstance($post['id'], str)
    Should Be True    ${id_is_string}
    Should Not Be Empty    ${post}[id]
    ${record}=    Create Dictionary    id=${post}[id]    title=${title}
    # The in-memory record belongs only to this suite run; cleanup never reads an old file.
    Set Suite Variable    ${CREATED_POST}    ${record}
    ${json}=    Evaluate    json.dumps($record, ensure_ascii=False)    modules=json
    Create File    ${CREATED_RECORD}    ${json}    encoding=UTF-8
    Should Be Equal    ${post}[post_status]    ACTIVE
    RETURN    ${post}[id]

Delete Current Test Post
    Skip If    '${DELETE_TEST_POST}' == '0'    ปิดการลบโพสต์ทดสอบ
    Skip If    $CREATED_POST is None    ไม่มีโพสต์จากเคส 038 ในรอบนี้ ให้รัน 038 และ 039 พร้อมกัน
    ${id}=    Set Variable    ${CREATED_POST}[id]
    ${title}=    Set Variable    ${CREATED_POST}[title]
    Should Match Regexp    ${id}    ^[0-9a-fA-F-]{36}$
    Should Start With    ${title}    TC-POST01-038${SPACE}
    Go To    /post/${id}
    Get Url    matches    /post/${id}$
    Expect Element Visible    internal:role=heading[name="${title}"s]
    Click    internal:role=button[name="ลบโพสต์"s]
    Expect Element Visible    internal:role=dialog[name=/คุณต้องการลบโพสต์/]
    ${promise}=    Promise To    Wait For Response
    ...    matcher=response => response.request().method() === 'DELETE' && new URL(response.url()).pathname === '/api/v1/posts/${id}'
    ...    timeout=20 seconds
    Click    internal:role=button[name="ใช่, ลบเลย"s]
    ${response}=    Wait For    ${promise}
    Should Be Equal    ${response}[ok]    ${True}
    Expect Element Visible    internal:role=dialog[name="ลบสำเร็จ!"s]
    Click    internal:role=button[name="OK"s]
    Open My Posts
    Get Element Count    internal:role=heading[name="${title}"s]    ==    0
    Remove File    ${CREATED_RECORD}
    Set Suite Variable    ${CREATED_POST}    ${None}

Show Expected Element
    [Arguments]    ${selector}
    IF    ${SCROLL_TO_EXPECT}
        Browser.Scroll To Element    ${selector}
    END

Expect Element Visible
    [Arguments]    ${selector}    ${timeout}=20 seconds
    # รอให้เป้าหมายแสดงก่อน แล้วเลื่อนให้เห็นในหน้าต่าง browser
    Browser.Wait For Elements State    ${selector}    visible    timeout=${timeout}
    Show Expected Element    ${selector}

Expect Property
    [Arguments]    ${selector}    ${property}    ${operator}    ${expected}
    Show Expected Element    ${selector}
    Browser.Get Property    ${selector}    ${property}    ${operator}    ${expected}

Expect Text
    [Arguments]    ${selector}    ${operator}    ${expected}
    Show Expected Element    ${selector}
    Browser.Get Text    ${selector}    ${operator}    ${expected}
