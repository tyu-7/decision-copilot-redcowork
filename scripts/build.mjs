import { copyFile, mkdir, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
const assets = ['index.html', 'app.js', 'style.css'];
await mkdir(output, { recursive: true });
for (const asset of assets) await copyFile(path.join(root, asset), path.join(output, asset));
const actual = await readdir(output);
if (actual.some(name => !assets.includes(name))) throw new Error('dist 中含有旧文件，请使用干净的输出目录。');
const html = await readFile(path.join(output, 'index.html'), 'utf8');
for (const asset of ['app.js', 'style.css']) {
  if (!html.includes(`./${asset}`)) throw new Error(`缺少本地资源引用：${asset}`);
}
console.log('纯前端构建完成：dist/index.html、app.js、style.css；无需安装依赖。');
