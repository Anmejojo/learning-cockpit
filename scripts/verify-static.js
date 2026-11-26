#!/usr/bin/env node
/* 乐乐学习舱 · 静态发布校验（无依赖，GitHub Actions / 本地都能跑） */
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const raw = (f) => fs.readFileSync(path.join(root, f));
let ok = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { ok++; console.log('✓ ' + name); }
  else { fail++; console.log('✗ ' + name + (detail ? ' :: ' + detail : '')); }
}
const index = read('index.html');
const copy = read('学习驾驶舱.html');
const js = read('cockpit.js');
const css = read('cockpit.css');
const manifest = JSON.parse(read('manifest.json'));
const sw = read('sw.js');

check('index.html 与 学习驾驶舱.html 字节一致', Buffer.compare(raw('index.html'), raw('学习驾驶舱.html')) === 0);
const cssV = (index.match(/cockpit\.css\?v=([\w.-]+)/) || [])[1];
const jsV = (index.match(/cockpit\.js\?v=([\w.-]+)/) || [])[1];
check('CSS/JS 版本号一致', !!cssV && cssV === jsV, cssV + ' / ' + jsV);
check('入口含 manifest', /rel="manifest" href="manifest\.json"/.test(index));
check('入口含苹果图标', /apple-touch-icon/.test(index));
check('入口有主内容 role', /id="effPage"[^>]*role="main"/.test(index));
check('入口有 skip link', /class="skip-link"[^>]*href="#effPage"/.test(index));
check('PWA manifest 横屏', manifest.orientation === 'landscape');
check('PWA 图标存在', (manifest.icons || []).every(i => { try { return fs.existsSync(path.join(root, i.src.replace(/^\.\//, ''))); } catch (e) { return false; } }));
check('JS 无明显模板残留', !/<\/script>/i.test(js));
check('CSS 花括号平衡', (css.match(/{/g) || []).length === (css.match(/}/g) || []).length);
check('SW 缓存版本存在', /const CACHE\s*=\s*['"]lc-shell-v\d+['"]/.test(sw));
check('关键页面函数存在', /function renderToday\(/.test(js) && /function renderExam\(/.test(js) && /function renderRewards\(/.test(js));
check('加密同步代码存在', /AES-GCM/.test(js) && /PBKDF2/.test(js));
check('周期任务代码存在', /ensureRecurringTasks/.test(js));
check('家长确认代码存在', /approveAllPending/.test(js));
console.log('\n静态校验 ' + ok + '/' + (ok + fail));
process.exit(fail ? 1 : 0);
