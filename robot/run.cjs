// Select the installed Python environment and forward Robot CLI arguments.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const projectRoot = path.resolve(__dirname, '..');
const [source, ...robotArgs] = process.argv.slice(2);
if (!source) {
  console.error('Usage: node robot/run.cjs robot/tests [Robot options]');
  process.exit(1);
}
const candidates = [
  path.join(projectRoot, '.venv-robot', 'Scripts', 'python.exe'),
  path.join(projectRoot, '.venv-robot', 'bin', 'python'),
  path.resolve(projectRoot, '..', 'playwright-shareed-robot', '.venv-robot-313', 'Scripts', 'python.exe'),
];
const python = process.env.ROBOT_PYTHON || candidates.find(candidate => fs.existsSync(candidate)) || 'python';
// Robot parses options before the source path; npm adds user options at the end.
const result = spawnSync(python, ['-m', 'robot', ...robotArgs, source], {
  cwd: projectRoot,
  stdio: 'inherit',
  shell: false,
});
if (result.error) {
  console.error('ไม่พบ Python สำหรับ Robot: สร้าง .venv-robot ตาม robot/README.md หรือกำหนด ROBOT_PYTHON เป็น path ของ python.exe');
  process.exit(1);
}
process.exit(result.status ?? 1);
