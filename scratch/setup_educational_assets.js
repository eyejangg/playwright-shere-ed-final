const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/ptwpt/.gemini/antigravity-ide/brain/920d71e6-3413-49ca-be4b-1ab57ffc903e';
const targetBase = path.resolve(__dirname, '../test-data/educational');

const posts = [
  {
    dir: 'post-1-socketio',
    cover: 'socketio_cover_banner_1790805064771.jpg',
    gallery1: 'socketio_rooms_diagram_1790805121147.jpg',
    gallery2: 'react_socket_hook_1790805139792.jpg',
    gallery3: 'share_ed_realtime_ui_1790805163552.jpg',
  },
  {
    dir: 'post-2-frontend',
    cover: 'frontend_arch_cover_1790805080788.jpg',
    gallery1: 'share_ed_realtime_ui_1790805163552.jpg',
    gallery2: 'react_socket_hook_1790805139792.jpg',
    gallery3: 'websocket_vs_http_1790805099504.jpg',
  },
  {
    dir: 'post-3-realtime-protocol',
    cover: 'websocket_vs_http_1790805099504.jpg',
    gallery1: 'socketio_rooms_diagram_1790805121147.jpg',
    gallery2: 'react_socket_hook_1790805139792.jpg',
    gallery3: 'share_ed_realtime_ui_1790805163552.jpg',
  }
];

const samplePdf = path.join(targetBase, 'post-4-computer/handbook.pdf');

for (const p of posts) {
  const destDir = path.join(targetBase, p.dir);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(path.join(brainDir, p.cover), path.join(destDir, 'cover.jpg'));
  fs.copyFileSync(path.join(brainDir, p.gallery1), path.join(destDir, 'gallery-1.jpg'));
  fs.copyFileSync(path.join(brainDir, p.gallery2), path.join(destDir, 'gallery-2.jpg'));
  fs.copyFileSync(path.join(brainDir, p.gallery3), path.join(destDir, 'gallery-3.jpg'));
  fs.copyFileSync(samplePdf, path.join(destDir, 'handbook.pdf'));

  console.log(`Copied assets for ${p.dir}`);
}
