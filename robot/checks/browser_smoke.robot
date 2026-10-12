*** Settings ***
Documentation    ตรวจ Browser Library กับ localhost โดยไม่เข้าเว็บ SHARE-ED
Resource    ../resources/share_ed.resource
Library    LocalFixture.py
Suite Setup    Start Local Browser
Suite Teardown    Stop Local Browser
Test Setup    Open Local Page
Test Teardown    Capture Failure

*** Test Cases ***
Playwright Selectors And Form Actions
    Wait For Url Matching    /$
    Wait For Elements State    internal:role=heading[name="สร้างโพสต์สรุปความรู้"i]    visible
    Wait For Elements State    internal:text=/บทสรุปย่อ \\(Summary\\)/i    visible
    Wait For Elements State    internal:text="คณิตศาสตร์"s >> nth=-1    visible
    Click    ${CONFIRM_CATEGORY}
    Click    internal:role=button >> internal:has="internal:role=img[name=/^Profile$/]"
    Get Element Count    internal:role=img[name=/^img-\\d+$/]    ==    3
    Get Element Count    internal:role=img[name="img-5"s]    ==    1
    Fill Text    [test-data="post-title-input"]    ทบทวนแคลคูลัส
    Get Property    [test-data="post-title-input"]    value    ==    ทบทวนแคลคูลัส
    Select Options By    [test-data="education-level-select"]    label    มัธยมศึกษาตอนปลาย
    Set Environment Variable    TEST_PASSWORD    local-smoke-secret
    Fill Login Password
    ${length}=    Evaluate JavaScript    internal:role=textbox[name="รหัสผ่าน"i]    element => element.value.length
    Should Be Equal As Integers    ${length}    18
    Fill Text    ${EDITOR}    เนื้อหาทดสอบ
    Get Text    ${EDITOR}    contains    เนื้อหาทดสอบ
    Upload File By Selector    [test-data="cover-file-input"]    ${COVER_PNG}
    ${name}=    Evaluate JavaScript    [test-data="cover-file-input"]    element => element.files[0].name
    Should Be Equal    ${name}    cover.png
    Upload File By Selector    [test-data="supporting-images-file-input"]    @{IMAGES_06}
    ${count}=    Evaluate JavaScript    [test-data="supporting-images-file-input"]    element => element.files.length
    Should Be Equal As Integers    ${count}    6
    Wait For Elements State    internal:role=heading[name="บทสรุปย่อ"s] >> xpath=.. >> internal:text="สรุปสูตรอนุพันธ์ smoke"s    visible

Session State Isolated Across Contexts
    Evaluate JavaScript    ${None}    () => localStorage.setItem('smoke-session', 'member')
    ${state}=    Save Storage State    ${OUTPUTDIR}/browser/state/smoke.json
    New Context    baseURL=${LOCAL_URL}    storageState=${state}
    New Page    /
    ${value}=    Evaluate JavaScript    ${None}    () => localStorage.getItem('smoke-session')
    Should Be Equal    ${value}    member
    New Context    baseURL=${LOCAL_URL}
    New Page    /
    ${value}=    Evaluate JavaScript    ${None}    () => localStorage.getItem('smoke-session')
    Should Be Equal    ${value}    ${None}

Response Wait Checks Method And Saves Current Record
    Set Suite Variable    ${CREATED_RECORD}    ${OUTPUTDIR}/created-post-038.json
    ${id}=    Publish And Remember Current Post    TC-POST01-038 smoke
    Should Be Equal    ${id}    11111111-1111-4111-8111-111111111111
    Should Be Equal    ${CREATED_POST}[title]    TC-POST01-038 smoke
    File Should Exist    ${CREATED_RECORD}
    ${promise}=    Promise To    Wait For Response
    ...    matcher=response => response.request().method() === 'DELETE' && new URL(response.url()).pathname === '/api/v1/posts/${id}'
    ...    timeout=5 seconds
    Click    id=delete
    ${response}=    Wait For    ${promise}
    Should Be Equal    ${response}[ok]    ${True}
    Should Be Equal    ${response}[request][method]    DELETE

Cleanup Without Current Run Post Is Skipped
    Set Suite Variable    ${CREATED_POST}    ${None}
    Delete Current Test Post

Cleanup Can Be Disabled
    Set Test Variable    ${DELETE_TEST_POST}    0
    Delete Current Test Post

Expected Elements Are Scrolled Into View
    Expect Element Visible    id=expected-bottom
    ${in_view}=    Evaluate JavaScript    id=expected-bottom    element => { const r = element.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }
    Should Be Equal    ${in_view}    ${True}
    Evaluate JavaScript    ${None}    () => window.scrollTo(0, 0)
    Expect Property    id=expected-value    value    ==    scroll-value
    ${in_view}=    Evaluate JavaScript    id=expected-value    element => { const r = element.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }
    Should Be Equal    ${in_view}    ${True}
    Evaluate JavaScript    ${None}    () => window.scrollTo(0, 0)
    Expect Text    id=expected-bottom    ==    Expected footer
    ${in_view}=    Evaluate JavaScript    id=expected-bottom    element => { const r = element.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; }
    Should Be Equal    ${in_view}    ${True}

Expected Scrolling Can Be Disabled
    Set Test Variable    ${SCROLL_TO_EXPECT}    ${False}
    Expect Element Visible    id=expected-bottom
    Expect Property    id=expected-value    value    ==    scroll-value
    Expect Text    id=expected-bottom    ==    Expected footer
    ${scroll_y}=    Evaluate JavaScript    ${None}    () => window.scrollY
    Should Be Equal As Numbers    ${scroll_y}    0

*** Keywords ***
Start Local Browser
    ${url}=    Start Local Fixture
    Set Suite Variable    ${LOCAL_URL}    ${url}
    Launch Configured Browser

Open Local Page
    New Context    baseURL=${LOCAL_URL}    tracing=${True}
    New Page    /

Stop Local Browser
    TRY
        Close Browser    ALL
    FINALLY
        Stop Local Fixture
    END
