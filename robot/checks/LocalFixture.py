"""Local HTTP fixture for Browser integration checks; no production calls."""
import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

from robot.api.deco import keyword, library

HTML = """<!doctype html><meta charset="utf-8">
<h1>สร้างโพสต์สรุปความรู้</h1><p>บทสรุปย่อ (Summary)</p>
<p>คณิตศาสตร์</p><p>คณิตศาสตร์</p>
<label>อีเมล <input type="email"></label>
<label>รหัสผ่าน <input type="password"></label>
<input test-data="post-title-input">
<select test-data="education-level-select"><option>มัธยมศึกษาตอนปลาย</option></select>
<div test-data="post-content-input"><div contenteditable="true"></div></div>
<input test-data="cover-file-input" type="file" hidden>
<input test-data="supporting-images-file-input" type="file" multiple hidden>
<button test-data="confirm-category-tags-button">เสร็จสิ้น</button>
<button>#สรุปย่อ</button><button><img alt="Profile"></button>
<img alt="img-0"><img alt="img-1"><img alt="img-5">
<section><h2>บทสรุปย่อ</h2><p>สรุปสูตรอนุพันธ์ smoke</p></section>
<button test-data="publish-post-button" onclick="publish()">เผยแพร่</button>
<button id="delete" onclick="fetch('/api/v1/posts/11111111-1111-4111-8111-111111111111', {method:'DELETE'})">ลบ</button>
<div style="height:1800px"></div>
<p id="expected-bottom">Expected footer</p>
<input id="expected-value" value="scroll-value">
<script>
async function publish() {
  await fetch('/api/v1/posts'); // Wrong method must not satisfy the response wait.
  await fetch('/api/v1/posts/', {method: 'POST'});
}
</script>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path.startswith('/api/'):
            self.reply({'wrong_method': True})
        else:
            content = HTML.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(content)))
            self.end_headers()
            self.wfile.write(content)

    def do_POST(self):
        self.reply({'success': True, 'data': {
            'id': '11111111-1111-4111-8111-111111111111',
            'post_status': 'ACTIVE',
        }}, status=201)

    def do_DELETE(self):
        self.reply({'success': True})

    def reply(self, data, status=200):
        content = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)


@library(scope='SUITE', auto_keywords=False)
class LocalFixture:
    @keyword
    def start_local_fixture(self):
        self.server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        return f'http://127.0.0.1:{self.server.server_port}'

    @keyword
    def stop_local_fixture(self):
        if hasattr(self, 'server'):
            self.server.shutdown()
            self.server.server_close()
            self.thread.join(timeout=2)
