import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const shell = process.platform === 'win32';

function run(command, args) {
  return spawn(command, args, { cwd: root, stdio: 'inherit', shell });
}

const api = run('npm', ['run', 'dev:api']);
const web = run('npm', ['run', 'dev:web']);

function shutdown() {
  for (const child of [api, web]) {
    if (!child.killed) child.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

[api, web].forEach((child) => {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      console.error(`Dev process exited with code ${code}`);
      shutdown();
    }
  });
});
