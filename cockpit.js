/* =========================================================
   乐乐学习舱 · 效率学习 App 风
   cockpit.js · v1.0  2026-11-25
   结构：1 常量  2 工具  3 图标  4 演示数据  5 存储/迁移
        6 星星账户  7 应用框架/角色/路由  8 页面渲染
        9 交互  10 计时/录音/语音/识别  11 初始化
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. 常量 ---------- */
  var STORE_KEY = 'lc_cockpit_v1';
  var LEGACY_KEY = 'lc_v3';
  var VERSION = 1;
  var PAGES = ['today', 'exam', 'mastery', 'stars', 'rewards'];
  var PAGE_TITLES = { today: '今天要做', exam: '考试赚星星', mastery: '初二必掌握', stars: '我的星星', rewards: '我的要兑换' };
  var SUB_ORDER = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '道法', '地理', '阅读', '习惯', '运动', '体育'];
  var SUB_SHORT = { 语文: '语', 数学: '数', 英语: '英', 物理: '物', 化学: '化', 生物: '生', 历史: '史', 道法: '道', 地理: '地', 阅读: '阅', 习惯: '惯', 运动: '动', 体育: '体' };
  var TASK_SUBJECTS = ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '道法', '地理', '阅读', '习惯', '运动', '体育'];
  var REWARD_CATS = ['全部', '游戏', '零食', '出行', '文具', '心愿', '电脑'];
  var CATALOG_VERSION = 3;
  var PC_PRICE_PER_STAR = 20;
  var CHAT_AI_URL = 'https://jiajia-study-d6gjyod13d77728d6-1483465315.ap-shanghai.app.tcloudbase.com/ai';
  var CLOUD_REST = 'https://jiajia-study-d6gjyod13d77728d6.api.tcloudbasegateway.com/v1/rdb/rest/study_data';
  var CLOUD_KEY = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhNjk3Y2I2LWRjMDMtNGFkMi04ZGQ2LTFkMWNjNjZhNGQ5MSJ9.eyJpc3MiOiJodHRwczovL2ppYWppYS1zdHVkeS1kNmdqeW9kMTNkNzc3MjhkNi5hcC1zaGFuZ2hhaS50Y2ItYXBpLnRlbmNlbnRjbG91ZGFwaS5jb20iLCJzdWIiOiJhbm9uIiwiYXVkIjoiamlhamlhLXN0dWR5LWQ2Z2p5b2QxM2Q3NzcyOGQ2IiwiZXhwIjo0MDkyNTI4NDk2LCJpYXQiOjE3ODg4NDUyOTYsIm5vbmNlIjoiODhqMEJEQV9Tci1qTVNMT1BhVWFBZyIsImF0X2hhc2giOiI4OGowQkRBX1NyLWpNU0xPUGFVYUFnIiwibmFtZSI6IkFub255bW91cyIsInNjb3BlIjoiYW5vbnltb3VzIiwicHJvamVjdF9pZCI6ImppYWppYS1zdHVkeS1kNmdqeW9kMTNkNzc3MjhkNiIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.Mp-ZotDDKuzD-fXrSi9TvnFQLh_HhZqfy3ZHON4TWnhbuG6y2atGQSk6fjYMJqNX3QYajY5ZaQ3gAcrLYUF_Sx3CFRj3Ugeask5lKlWFnlEkn7PpY9joBFcSP7-TXeNwssT4FoiuqlzoEetJw8pQFtTo8iB3vOYLBsWAw5O3uNPysNWRN9YKA3RXSvcqQOOMMWXjmVEJsuTLzK_w0VmuahW_RyXIvJk_mpnZ-PeAA21uWhGJws5spytiKEyG9OXen4_SeICfTUYBxLncReGrluLxRU9nyDnPTyq3aKemz0I5AbPJdngwsRtxk3W17Os6OxvUBwbWfGbeJOwFn74O8Q';
  var CLOUD_ID = 2;
  function cloudRowId() {
    var sid = state && state.meta ? String(state.meta.syncId || '') : '';
    return /^\d{6,12}$/.test(sid) ? sid : String(CLOUD_ID);
  }
  function newSyncId() {
    try {
      var a = new Uint32Array(1);
      crypto.getRandomValues(a);
      return String(100000000 + (a[0] % 900000000));
    } catch (e) {
      return String(100000000 + Math.floor(Math.random() * 900000000));
    }
  }
  var SYNC_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function normalizeSyncCode(raw) {
    var s = String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (s.indexOf('LC') === 0) s = s.slice(2);
    if (s.length !== 12) return '';
    for (var i = 0; i < s.length; i++) if (SYNC_ALPHABET.indexOf(s.charAt(i)) < 0) return '';
    return 'LC-' + s.slice(0, 4) + '-' + s.slice(4, 8) + '-' + s.slice(8, 12);
  }
  function newSyncCode() {
    var raw = '';
    try {
      var a = new Uint32Array(12);
      crypto.getRandomValues(a);
      for (var i = 0; i < 12; i++) raw += SYNC_ALPHABET.charAt(a[i] % SYNC_ALPHABET.length);
    } catch (e) {
      for (var j = 0; j < 12; j++) raw += SYNC_ALPHABET.charAt(Math.floor(Math.random() * SYNC_ALPHABET.length));
    }
    return 'LC-' + raw.slice(0, 4) + '-' + raw.slice(4, 8) + '-' + raw.slice(8, 12);
  }
  function syncCodeToId(code) {
    var s = String(code || '').replace(/[^A-Z0-9]/g, '');
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return String(100000000 + ((h >>> 0) % 900000000));
  }
  var cloud = { enabled: false, busy: false, applying: false, timer: null, last: 0, pending: false, err: '', fail: 0, ver: null };
  var WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];
  var WEEK_FULL = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  var MASTERY_GROUPS = {
    语文: { label: '古诗文 · 文言文', desc: '默写不丢分，重点篇目逐句过关', ico: 'book' },
    英语: { label: '核心词汇 · 短语', desc: '会读会写会用，听写一次过', ico: 'volume' },
    数学: { label: '公式定理', desc: '判定、性质、公式，先懂再记', ico: 'chart' },
    物理: { label: '重点概念', desc: '光学与密度，实验现象说清楚', ico: 'sparkles' }
  };

  /* ---------- 2. 工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function uid(prefix) { return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function num(v, fallback) { var n = Number(v); return isFinite(n) ? n : (fallback || 0); }
  function fmtNum(n) { try { return Number(n).toLocaleString('zh-CN'); } catch (e) { return String(n); } }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function dayKey(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
  }
  function tsDaysAgo(days, hour, minute) {
    var d = new Date();
    d.setHours(hour == null ? 19 : hour, minute == null ? 0 : minute, 0, 0);
    d.setDate(d.getDate() - days);
    return d.getTime();
  }
  function dateLabel(ts) {
    var d = new Date(ts), n = new Date();
    var diff = Math.round((startOfDay(n) - startOfDay(d)) / 86400000);
    var hm = pad2(d.getHours()) + ':' + pad2(d.getMinutes());
    if (diff === 0) return '今天 ' + hm;
    if (diff === 1) return '昨天 ' + hm;
    if (diff > 1 && diff < 7) return diff + ' 天前 ' + hm;
    return (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + hm;
  }
  function fullDateCN(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + WEEK_FULL[d.getDay()];
  }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return pad2(Math.floor(sec / 60)) + ':' + pad2(sec % 60); }

  /* ---------- 3. 图标 ---------- */
  var ICONS = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    cap: '<path d="M2.5 9.2 12 4.5l9.5 4.7L12 13.9 2.5 9.2Z"/><path d="M6.5 11.2v4.6c0 1.6 2.5 3 5.5 3s5.5-1.4 5.5-3v-4.6"/><path d="M21.5 9.2v5.3"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0V4Z"/><path d="M8 6H5a3 3 0 0 0 3 5M16 6h3a3 3 0 0 1-3 5"/><path d="M12 13v4M8.5 20h7M10 17h4"/>',
    gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1.2"/><path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5M12 8.5V20.5"/><path d="M12 8.5C12 6 10.6 4 8.6 4a2.4 2.4 0 0 0 0 4.5H12ZM12 8.5C12 6 13.4 4 15.4 4a2.4 2.4 0 0 1 0 4.5H12Z"/>',
    camera: '<path d="M3.5 8.5h3l1.5-2h8l1.5 2h3A1.5 1.5 0 0 1 22 10v8.5A1.5 1.5 0 0 1 20.5 20h-17A1.5 1.5 0 0 1 2 18.5V10a1.5 1.5 0 0 1 1.5-1.5Z"/><circle cx="12" cy="14" r="3.6"/>',
    sparkles: '<path d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3Z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
    check: '<path d="m20 6.5-11 11-5-5"/>',
    chevron: '<path d="m6 9 6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    star: '<path d="m12 3.4 2.6 5.4 5.9.9-4.3 4.2 1 5.9L12 17l-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3.4Z"/>',
    flame: '<path d="M12 21c3.6 0 6-2.3 6-5.4 0-2.6-1.7-4.4-3.2-6.1C13.3 7.7 12 5.7 12 3c-2.7 2-4.3 4.3-4.3 6.5 0 1.3.4 2.3 1 3.1-1.4.4-2.7 1.9-2.7 4C6 19 8.4 21 12 21Z"/><path d="M12 21c1.8 0 3-1.2 3-2.8 0-1.6-1.2-2.5-2-3.6-.5-.7-.9-1.5-1-2.6-1.3 1-2 2.2-2 3.5 0 1.1.5 1.8 1 2.3-.6.2-1 1-1 1.8 0 .8.6 1.4 2 1.4Z"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"/>',
    play: '<path d="M8 5.5v13l10-6.5-10-6.5Z"/>',
    pause: '<path d="M8.5 5.5v13M15.5 5.5v13"/>',
    reset: '<path d="M4 10a8 8 0 1 1 2.3 6.3"/><path d="M4 4.5V10h5.5"/>',
    volume: '<path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="M16.5 9a4.2 4.2 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z"/><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22V5.5Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M7.8 13h2M11 13h2M14.2 13h2M7.8 16.6h2M11 16.6h2"/>',
    arrowLeft: '<path d="M15 5l-7 7 7 7"/>',
    arrowRight: '<path d="m9 5 7 7-7 7"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16 4.8a3.4 3.4 0 0 1 0 6.4M17.5 14.2A5.4 5.4 0 0 1 21.2 19"/>',
    chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18"/><path d="M16.5 14.5h.01"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="2.2"/><circle cx="8.8" cy="9.8" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/>',
    shield: '<path d="M12 3 5 6v5.4c0 4.3 2.9 7.6 7 9.6 4.1-2 7-5.3 7-9.6V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    edit: '<path d="M4 20h4.2L20 8.2a2.3 2.3 0 0 0-3.2-3.2L5 16.8 4 20Z"/><path d="m14.5 6.5 3 3"/>',
    home: '<path d="m3 10.5 9-7 9 7V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20V10.5Z"/><path d="M9 21v-6.5h6V21"/>',
    lock: '<rect x="4.5" y="10" width="15" height="10.5" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
    refresh: '<path d="M20 12a8 8 0 0 1-13.6 5.7M4 12a8 8 0 0 1 13.6-5.7"/><path d="M17.6 3v3.4h-3.4M6.4 21v-3.4h3.4"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>'
  };
  function icon(name, cls) {
    var path = ICONS[name] || ICONS.sparkles;
    return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + path + '</svg>';
  }

  /* ---------- 4. 演示数据 ---------- */
  function seedTasks() {
    return [
      { id: 't1', subject: '语文', title: '背诵《三峡》全文', type: 'recite', stars: 1, minutes: 10, done: false, passage: '自三峡七百里中，两岸连山，略无阙处。重岩叠嶂，隐天蔽日，自非亭午夜分，不见曦月。' },
      { id: 't2', subject: '数学', title: '5 分钟口算 · 全等三角形判定', type: 'timer', stars: 1, seconds: 300, done: false, hint: '先求稳，再求快，写完自己检查一遍。' },
      { id: 't3', subject: '英语', title: '朗读 Unit 5 核心单词', type: 'words', stars: 1, done: false, words: ['environment', 'pollution', 'invention', 'achievement', 'knowledge', 'improve'] },
      { id: 't4', subject: '英语', title: '不规则动词听写 8 组', type: 'dictation', stars: 1, done: false, pairs: [['go', 'went'], ['take', 'took'], ['buy', 'bought'], ['teach', 'taught'], ['write', 'wrote'], ['see', 'saw'], ['give', 'gave'], ['swim', 'swam']] },
      { id: 't5', subject: '数学', title: '订正期中错题 3 道', type: 'homework', stars: 1, done: false },
      { id: 't6', subject: '英语', title: '15 分钟英语阅读', type: 'timer', stars: 1, seconds: 900, done: false, hint: '读的时候把不认识的词圈出来，读完再查。' },
      { id: 't7', subject: '物理', title: '复习光的折射实验', type: 'read', stars: 1, done: false, passage: '光从空气斜射入水中时，折射光线向法线偏折，折射角小于入射角；光从水中斜射入空气时，折射角大于入射角。' },
      { id: 't8', subject: '阅读', title: '睡前阅读 20 分钟', type: 'timer', stars: 1, seconds: 1200, done: false, hint: '手机放远一点，读完在脑子里回放一遍。' },
      { id: 't9', subject: '习惯', title: '收拾书包，准备明天的书', type: 'habit', stars: 1, done: true, doneAt: tsDaysAgo(0, 19, 2) },
      { id: 't10', subject: '运动', title: '跳绳 300 个', type: 'habit', stars: 1, done: false },
      { id: 't11', subject: '语文', title: '完成《藤野先生》课后练习', type: 'homework', stars: 1, done: false }
    ];
  }
  function seedExam() {
    return [
      { id: 'e1', subject: '语文', title: '期末语文目标', target: 90, stars: 5, done: false },
      { id: 'e2', subject: '数学', title: '期末数学目标', target: 95, stars: 8, done: false },
      { id: 'e3', subject: '英语', title: '期末英语目标', target: 92, stars: 6, done: false },
      { id: 'e4', subject: '物理', title: '期末物理目标', target: 88, stars: 6, done: false },
      { id: 'e5', subject: '道法', title: '期末道法目标', target: 85, stars: 4, done: false },
      { id: 'e6', subject: '历史', title: '期末历史目标', target: 85, stars: 4, done: false }
    ];
  }
  function seedMastery() {
    return [
      { id: 'm1', subject: '语文', title: '《三峡》· 郦道元', detail: '自三峡七百里中，两岸连山，略无阙处。', known: true },
      { id: 'm2', subject: '语文', title: '《答谢中书书》· 陶弘景', detail: '山川之美，古来共谈。高峰入云，清流见底。', known: false },
      { id: 'm3', subject: '语文', title: '《记承天寺夜游》· 苏轼', detail: '庭下如积水空明，水中藻、荇交横，盖竹柏影也。', known: true },
      { id: 'm4', subject: '语文', title: '《野望》· 王绩', detail: '树树皆秋色，山山唯落晖。', known: false },
      { id: 'm5', subject: '语文', title: '《黄鹤楼》· 崔颢', detail: '晴川历历汉阳树，芳草萋萋鹦鹉洲。', known: false },
      { id: 'm6', subject: '语文', title: '《使至塞上》· 王维', detail: '大漠孤烟直，长河落日圆。', known: false },
      { id: 'm7', subject: '英语', title: 'environment', detail: '/ɪnˈvaɪrənmənt/ n. 环境', known: true, lang: 'en-US' },
      { id: 'm8', subject: '英语', title: 'pollution', detail: '/pəˈluːʃn/ n. 污染', known: false, lang: 'en-US' },
      { id: 'm9', subject: '英语', title: 'invention', detail: '/ɪnˈvenʃn/ n. 发明', known: false, lang: 'en-US' },
      { id: 'm10', subject: '英语', title: 'achievement', detail: '/əˈtʃiːvmənt/ n. 成就', known: false, lang: 'en-US' },
      { id: 'm11', subject: '英语', title: 'knowledge', detail: '/ˈnɒlɪdʒ/ n. 知识', known: true, lang: 'en-US' },
      { id: 'm12', subject: '英语', title: 'improve', detail: '/ɪmˈpruːv/ v. 改进；提高', known: false, lang: 'en-US' },
      { id: 'm13', subject: '数学', title: '全等三角形判定', detail: 'SSS、SAS、ASA、AAS、HL，注意对应关系。', known: true },
      { id: 'm14', subject: '数学', title: '等腰三角形性质', detail: '等边对等角；三线合一。', known: false },
      { id: 'm15', subject: '数学', title: '线段垂直平分线', detail: '到线段两端点距离相等的点在线段的垂直平分线上。', known: false },
      { id: 'm16', subject: '数学', title: '勾股定理', detail: '直角三角形中，a² + b² = c²。', known: true },
      { id: 'm17', subject: '数学', title: '平方差公式', detail: '(a + b)(a − b) = a² − b²。', known: false },
      { id: 'm18', subject: '数学', title: '完全平方公式', detail: '(a ± b)² = a² ± 2ab + b²。', known: false },
      { id: 'm19', subject: '物理', title: '光的直线传播', detail: '光在同种均匀介质中沿直线传播。', known: false },
      { id: 'm20', subject: '物理', title: '光的反射定律', detail: '三线共面、两线分居、反射角等于入射角。', known: false },
      { id: 'm21', subject: '物理', title: '平面镜成像', detail: '正立、等大的虚像，像与物关于镜面对称。', known: true },
      { id: 'm22', subject: '物理', title: '光的折射规律', detail: '空气斜射入水或玻璃，折射角小于入射角。', known: false },
      { id: 'm23', subject: '物理', title: '凸透镜成像', detail: 'u > 2f 倒立缩小实像；u < f 正立放大虚像。', known: false },
      { id: 'm24', subject: '物理', title: '质量与密度', detail: 'ρ = m / V，密度是物质的一种特性。', known: false }
    ];
  }
  function seedRewards() {
    return [
      { id: 'r1', name: '奶茶一杯', icon: '🧋', cost: 15, cat: '零食' },
      { id: 'r2', name: '30 分钟游戏时间', icon: '🎮', cost: 20, cat: '游戏' },
      { id: 'r3', name: '一包薯片', icon: '🍟', cost: 10, cat: '零食' },
      { id: 'r4', name: '一场电影', icon: '🎬', cost: 50, cat: '出行' },
      { id: 'r5', name: '一本课外书', icon: '📚', cost: 25, cat: '文具' },
      { id: 'r6', name: '1 小时游戏时间', icon: '🕹️', cost: 35, cat: '游戏' },
      { id: 'r7', name: '一次炸鸡', icon: '🍗', cost: 30, cat: '零食' },
      { id: 'r8', name: '周末游乐园半日', icon: '🎡', cost: 120, cat: '出行' },
      { id: 'r9', name: '新的乐高小盒', icon: '🧱', cost: 80, cat: '文具' },
      { id: 'r10', name: '心愿基金 20 元', icon: '💝', cost: 40, cat: '心愿' },
      { id: 'r11', name: '一次好友聚会', icon: '🫂', cost: 70, cat: '心愿' },
      { id: 'r12', name: '免做一次家务', icon: '🧹', cost: 10, cat: '心愿' },
      { id: 'r13', name: '和同学打篮球', icon: '🏀', cost: 18, cat: '出行' }
    ].concat(legacyComputerRewards());
  }
  function priceToStars(price) { return Math.max(1, Math.round(num(price) / PC_PRICE_PER_STAR)); }
  function legacyComputerRewards() {
    return [
      { id: 'pc_mousepad', name: '鼠标垫', icon: '🖱️', price: 30, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_mouse', name: '鼠标', icon: '🐭', price: 200, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_powerstrip', name: '排插', icon: '🔌', price: 100, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_keyboard', name: '键盘', icon: '⌨️', price: 400, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_headset', name: '耳机', icon: '🎧', price: 350, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_webcam', name: '摄像头', icon: '🎥', price: 200, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_speaker', name: '音响', icon: '🔊', price: 400, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_case', name: '机箱', icon: '🎒', price: 350, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_gamepad', name: '游戏手柄', icon: '🕹️', price: 350, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_ssd', name: 'SSD 1TB', icon: '💾', price: 500, cat: '电脑', detail: '初二下期末 · 总分≥538' },
      { id: 'pc_cooler', name: '散热器', icon: '❄️', price: 300, cat: '电脑', detail: '初二下期末 · 总分≥538' },
      { id: 'pc_psu', name: '电源 750W', icon: '⚡', price: 500, cat: '电脑', detail: '初三上期中 · 总分≥580' },
      { id: 'pc_hdd', name: '机械硬盘', icon: '💽', price: 500, cat: '电脑', detail: '初三上期中 · 总分≥580' },
      { id: 'pc_ram', name: '内存 32G', icon: '🧠', price: 600, cat: '电脑', detail: '初三上期末 · 总分≥610' },
      { id: 'pc_motherboard', name: '主板', icon: '🔧', price: 1000, cat: '电脑', detail: '一模≥600 · 初三下开学' },
      { id: 'pc_monitor', name: '显示器 2K', icon: '📺', price: 1200, cat: '电脑', detail: '二模≥610 · 初三下期中' },
      { id: 'pc_cpu', name: 'CPU', icon: '🧮', price: 1500, cat: '电脑', detail: '三模≥615 · 中考前冲刺' },
      { id: 'pc_gpu', name: '显卡', icon: '🎮', price: 2500, cat: '电脑', detail: '中考≥625 · 中考达标' },
      { id: 'game_switch', name: 'Switch 游戏机', icon: '🎮', price: 3508, cat: '游戏', detail: '积分兑换 · 游戏机大奖' },
      { id: 'game_zelda', name: '塞尔达游戏', icon: '🗡️', price: 287, cat: '游戏', detail: '积分兑换 · Switch 游戏卡带' }
    ].map(function (r) { r.cost = priceToStars(r.price); return r; });
  }
  function seedState() {
    var rnd = mulberry32(20261125);
    var log = [];
    var n = 0;
    function addLog(ts, delta, reason, kind) {
      n += 1;
      log.push({ id: 'lg_seed' + n, ts: ts, delta: delta, reason: reason, kind: kind || 'task' });
    }
    var reasons = ['完成数学作业', '英语单词听写全对', '语文背诵打卡', '物理实验笔记整理', '阅读 20 分钟', '口算练习全对', '整理错题本', '跳绳 300 个', '课堂笔记整理', '英语朗读 10 分钟', '默写古诗一首'];
    addLog(tsDaysAgo(0, 19, 2), 1, '完成 · 收拾书包，准备明天的书', 'task');
    for (var d = 1; d <= 44; d++) {
      if (d <= 15 || rnd() < 0.62) {
        var count = rnd() < 0.26 ? 2 : 1;
        for (var k = 0; k < count; k++) {
          var stars = 1 + Math.floor(rnd() * 4);
          var reason = reasons[Math.floor(rnd() * reasons.length)];
          addLog(tsDaysAgo(d, 17 + Math.floor(rnd() * 4), Math.floor(rnd() * 50)), stars, '完成 · ' + reason, 'task');
        }
      }
    }
    addLog(tsDaysAgo(2, 20, 30), 10, '连续打卡 16 天奖励', 'bonus');
    addLog(tsDaysAgo(12, 20, 15), -15, '兑换 · 奶茶一杯', 'reward');
    addLog(tsDaysAgo(28, 18, 40), -20, '兑换 · 30 分钟游戏时间', 'reward');
    log.sort(function (a, b) { return b.ts - a.ts; });

    var earned = 0, used = 0;
    for (var i = 0; i < log.length; i++) { if (log[i].delta > 0) earned += log[i].delta; else used -= log[i].delta; }
    if (earned - used < 45) {
      addLog(tsDaysAgo(3, 20, 0), 45 - (earned - used), '开学进步奖励', 'bonus');
      log.sort(function (a, b) { return b.ts - a.ts; });
    }

    var todayKeyNow = dayKey(Date.now());
    var seedTaskList = seedTasks();
    seedTaskList.forEach(function (t) { t.date = todayKeyNow; t.createdAt = Date.now(); });

    return {
      v: VERSION,
      createdAt: Date.now(),
      profile: { nick: '乐乐', grade: '初二上' },
      role: 'student',
      tasks: seedTaskList,
      examGoals: seedExam(),
      mastery: seedMastery(),
      rewards: seedRewards(),
      redemptions: [
        { id: 'rd_seed1', ts: tsDaysAgo(12, 20, 15), rewardId: 'r1', name: '奶茶一杯', icon: '🧋', cost: 15 },
        { id: 'rd_seed2', ts: tsDaysAgo(28, 18, 40), rewardId: 'r2', name: '30 分钟游戏时间', icon: '🎮', cost: 20 }
      ],
      log: log,
      settings: { starGoal: 200 },
      chat: [],
      chatMem: [],
      _del: {},
      meta: { demo: true, demoTasks: true, legacy: false, legacyTasks: 0, lastRoll: todayKeyNow, noticeDismissed: false, parentPin: '', parentPinAt: 0, catalogV: CATALOG_VERSION, goalsImported: 0, recordsImported: 0, chatImported: 0, requireApproval: false, cloudEnabled: false, syncId: '', syncCode: '', syncEnc: false, deviceId: '', devices: [], updatedAt: Date.now() }
    };
  }

  /* ---------- 5. 存储 / 迁移 ---------- */
  var state = null;
  var ui = { page: 'today', tab: '全部', viewDate: dayKey(Date.now()), rewardCat: '全部', openTask: null, doneOpen: true, masteryOpen: { 语文: true, 英语: false, 数学: false, 物理: false }, calMonth: null, answers: {}, recog: null, recogBusy: false, recogCands: null, demoDismissed: false };
  var rt = { timers: {}, recordings: {}, recording: null, judgeTask: null, judge: {}, speakSeq: 0, confirm: null, lastFocus: null, modalOpen: false, chatOffline: false, chatImage: null };
  var saveWarned = false;
  var pendingImport = null;

  function safeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); return true; } catch (e) { return false; }
  }
  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSessionSet(key, val) {
    try { sessionStorage.setItem(key, val); return true; } catch (e) { return false; }
  }
  function safeSessionRemove(key) {
    try { sessionStorage.removeItem(key); } catch (e) { }
  }
  function save() {
    if (!state) return false;
    if (state.meta) state.meta.updatedAt = Date.now();
    var ok = safeSet(STORE_KEY, JSON.stringify(state));
    if (!ok && !saveWarned) {
      saveWarned = true;
      try { toast('本地存储失败，请尽快在「更多」里导出备份', 'warn'); } catch (e) { }
    }
    cloudSchedule();
    return ok;
  }
  function markDel(kind, id) {
    if (!state) return;
    if (!state._del || typeof state._del !== 'object') state._del = {};
    state._del[kind + ':' + id] = Date.now();
  }
  function deviceName() {
    var ua = navigator.userAgent || '';
    if (/iPhone/i.test(ua)) return 'iPhone';
    if (/iPad/i.test(ua)) return 'iPad';
    if (/Android/i.test(ua)) return 'Android';
    if (/Mac/i.test(ua)) return 'Mac';
    if (/Windows/i.test(ua)) return 'Windows';
    return '本机';
  }
  function ensureDevice() {
    if (!state || !state.meta) return;
    if (!state.meta.deviceId) state.meta.deviceId = uid('dev');
    if (!Array.isArray(state.meta.devices)) state.meta.devices = [];
    var d = state.meta.devices.filter(function (x) { return x && x.id === state.meta.deviceId; })[0];
    var now = Date.now();
    if (d) { d.lastSeen = now; d.name = d.name || deviceName(); }
    else state.meta.devices.push({ id: state.meta.deviceId, name: deviceName(), lastSeen: now });
    state.meta.devices = state.meta.devices.slice(-10);
  }
  function cloudDevicesHTML() {
    var list = (state.meta.devices || []).slice().sort(function (a, b) { return num(b.lastSeen) - num(a.lastSeen); });
    if (!list.length) return '';
    return '<div class="cloud-devices"><div class="cloud-devices-title">已加入设备 <b>' + list.length + '</b></div>' + list.map(function (d) {
      var me = d.id === state.meta.deviceId;
      var t = d.lastSeen ? new Date(d.lastSeen) : null;
      return '<div class="cloud-device"><span class="cloud-device-dot' + (me ? ' is-me' : '') + '"></span><strong>' + esc(d.name || '设备') + (me ? '（本机）' : '') + '</strong><span>' + (t ? (t.getMonth() + 1) + '月' + t.getDate() + '日 ' + pad2(t.getHours()) + ':' + pad2(t.getMinutes()) : '') + '</span></div>';
    }).join('') + '</div>';
  }
  function cloudRevokeDevices() {
    if (!requireParent('切换到家长端才能撤销设备')) return;
    openModal({
      title: '撤销其他设备？', icon: 'shield',
      sub: '会重置家庭同步码',
      body: '<p>重置后，除了这台设备，其他设备都需要用新同步码重新加入。</p><p class="form-note" style="margin-top:10px">云端旧数据不会删除，但旧设备无法再解密新数据。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="cloud-reset">重置同步码</button>'
    });
  }
  function cloudOn() { return !!(state && state.meta && state.meta.cloudEnabled); }
  function cloudStatusText() {
    if (!cloudOn()) return navigator.onLine ? '本地模式' : '离线 · 数据在本机';
    if (!navigator.onLine) return '离线 · 待联网同步';
    if (cloud.busy) return '同步中…';
    if (cloud.err) return '同步失败：' + cloud.err;
    if (cloud.pending) return '待同步';
    if (cloud.last) return '已同步 ' + pad2(new Date(cloud.last).getHours()) + ':' + pad2(new Date(cloud.last).getMinutes());
    return '已开启，等待同步';
  }
  function cloudRenderBadge() {
    var b = $('#effCloudBadge');
    if (!b) return;
    var on = cloudOn();
    b.className = 'eff-cloud-badge' + (on ? ' is-on' : '') + (cloud.err ? ' is-err' : '');
    b.innerHTML = '<span class="cloud-dot"></span><span class="cloud-label">' + esc(on ? cloudStatusText() : '本地模式') + '</span>';
    b.title = on ? '多端同步：' + cloudStatusText() : '多端同步未开启，点开设置';
  }
  function cloudHeaders(extra) {
    var h = { 'Authorization': 'Bearer ' + CLOUD_KEY, 'Accept': 'application/json' };
    if (extra) for (var k in extra) h[k] = extra[k];
    return h;
  }
  function bytesToB64(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function b64ToBytes(str) {
    var bin = atob(String(str || ''));
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  var syncKeyCache = {};
  function syncCryptoKey(code, id) {
    var key = String(code || '') + '|' + String(id || '');
    if (syncKeyCache[key]) return syncKeyCache[key];
    if (!window.crypto || !crypto.subtle) return Promise.reject(new Error('当前浏览器不支持加密'));
    var raw = new TextEncoder().encode(String(code || '').replace(/[^A-Z0-9]/g, ''));
    var salt = new TextEncoder().encode('lc-sync-v1|' + String(id || ''));
    syncKeyCache[key] = crypto.subtle.importKey('raw', raw, 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: salt, iterations: 120000, hash: 'SHA-256' },
        base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
      );
    });
    return syncKeyCache[key];
  }
  async function encryptCloudData(data, code, id) {
    var key = await syncCryptoKey(code, id);
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(JSON.stringify(data)));
    return { enc: 1, v: 1, iv: bytesToB64(iv), ct: bytesToB64(new Uint8Array(ct)) };
  }
  async function decryptCloudData(data, code, id) {
    if (!data || !data.enc) return data;
    var key = await syncCryptoKey(code, id);
    var pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(data.iv) }, key, b64ToBytes(data.ct));
    return JSON.parse(new TextDecoder().decode(pt));
  }
  async function cloudFetchRow() {
    var rid = cloudRowId();
    var r = await fetch(CLOUD_REST + '?id=eq.' + rid + '&select=id,data,updated_at', { headers: cloudHeaders(), cache: 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    var arr = await r.json();
    return (Array.isArray(arr) && arr[0]) ? arr[0] : null;
  }
  function cloudItemTs(x) { return num(x && (x.updatedAt || x.ts || x.at || x.createdAt)); }
  function cloudKeyTask(t) {
    if (!t) return '';
    if (t.source && String(t.source).indexOf('legacy') === 0) return 'lgt:' + t.date + '|' + t.subject + '|' + t.title;
    return 'id:' + t.id;
  }
  function cloudKeyExam(g) {
    if (!g) return '';
    if (g.source === 'legacy-goal') return 'lgg:' + g.subject + '|' + g.target + '|' + g.title;
    return 'id:' + g.id;
  }
  function cloudKeyLog(e) {
    if (!e) return '';
    if (e.ref) return 'ref:' + e.ref;
    return 'lg:' + num(e.ts) + '|' + num(e.delta) + '|' + String(e.reason || '') + '|' + String(e.kind || '');
  }
  function cloudKeyChat(m) {
    if (!m) return '';
    return 'ct:' + num(m.ts) + '|' + (m.role === 'u' ? 'u' : 'a') + '|' + String(m.text || '');
  }
  function cloudMergeList(a, b, keyFn, tsFn, preferA) {
    var map = {}, order = [];
    function add(item, isA) {
      if (!item) return;
      var k = keyFn(item);
      if (!k) return;
      if (!map[k]) { map[k] = { item: item, ts: tsFn(item), a: isA }; order.push(k); return; }
      var cur = map[k], ti = tsFn(item), tc = cur.ts;
      if (ti > tc || (ti === tc && ((isA && preferA) || (!isA && !preferA)))) map[k] = { item: item, ts: ti, a: isA };
    }
    (b || []).forEach(function (x) { add(x, false); });
    (a || []).forEach(function (x) { add(x, true); });
    return order.map(function (k) { return map[k].item; });
  }
  function cloudMerge(local, remote, localNewer) {
    var l = local, r = remote;
    var out = JSON.parse(JSON.stringify(localNewer ? l : r));
    out.tasks = cloudMergeList(l.tasks, r.tasks, cloudKeyTask, cloudItemTs, localNewer);
    out.examGoals = cloudMergeList(l.examGoals, r.examGoals, cloudKeyExam, cloudItemTs, localNewer);
    out.rewards = cloudMergeList(l.rewards, r.rewards, function (x) { return 'id:' + x.id; }, cloudItemTs, localNewer);
    out.mastery = cloudMergeList(l.mastery, r.mastery, function (x) { return 'id:' + x.id; }, cloudItemTs, localNewer);
    out.log = cloudMergeList(l.log, r.log, cloudKeyLog, cloudItemTs, localNewer);
    out.redemptions = cloudMergeList(l.redemptions, r.redemptions, function (x) { return 'id:' + x.id; }, cloudItemTs, localNewer);
    out.chat = cloudMergeList(l.chat, r.chat, cloudKeyChat, cloudItemTs, localNewer);
    out.chatMem = cloudMergeList(l.chatMem, r.chatMem, function (x) { return 'cm:' + x.text; }, cloudItemTs, localNewer);
    var del = {};
    [l, r].forEach(function (x) {
      var d = (x && x._del) || {};
      Object.keys(d).forEach(function (k) { del[k] = Math.max(del[k] || 0, num(d[k])); });
    });
    out._del = del;
    out.log.sort(function (a, b) { return num(b.ts) - num(a.ts); });
    out.chat.sort(function (a, b) { return num(a.ts) - num(b.ts); });
    out.chat = out.chat.slice(-300);
    out.chatMem = out.chatMem.slice(-40);
    out.tasks = out.tasks.filter(function (t) { var d = del['task:' + t.id]; return !(d && d >= cloudItemTs(t)); });
    out.rewards = out.rewards.filter(function (x) { var d = del['reward:' + x.id]; return !(d && d >= cloudItemTs(x)); });
    out.examGoals = out.examGoals.filter(function (g) { var d = del['exam:' + g.id]; return !(d && d >= cloudItemTs(g)); });
    out.meta = Object.assign({}, (localNewer ? r : l).meta || {}, (localNewer ? l : r).meta || {});
    var baseMeta = (localNewer ? l : r).meta || {};
    out.meta.parentPin = baseMeta.parentPin || l.meta.parentPin || r.meta.parentPin || '';
    out.meta.syncId = l.meta.syncId || r.meta.syncId || '';
    out.meta.syncCode = l.meta.syncCode || r.meta.syncCode || '';
    out.meta.syncEnc = !!l.meta.syncEnc;
    out.meta.deviceId = l.meta.deviceId || r.meta.deviceId || '';
    var devMap = {};
    [l, r].forEach(function (x) {
      (x.meta && Array.isArray(x.meta.devices) ? x.meta.devices : []).forEach(function (d) {
        if (!d || !d.id) return;
        if (!devMap[d.id] || num(d.lastSeen) > num(devMap[d.id].lastSeen)) devMap[d.id] = { id: d.id, name: d.name || '设备', lastSeen: num(d.lastSeen) };
      });
    });
    out.meta.devices = Object.keys(devMap).map(function (k) { return devMap[k]; }).sort(function (a, b) { return num(b.lastSeen) - num(a.lastSeen); }).slice(0, 10);
    var lp = num(l.meta.parentPinAt), rp = num(r.meta.parentPinAt);
    if (lp || rp) out.meta.parentPin = lp >= rp ? l.meta.parentPin : r.meta.parentPin;
    out.meta.parentPinAt = Math.max(lp, rp);
    out.meta.cloudEnabled = !!l.meta.cloudEnabled;
    out.meta.demo = !!(l.meta.demo && r.meta.demo);
    out.meta.demoTasks = !!(l.meta.demoTasks && r.meta.demoTasks);
    out.meta.legacy = !!(l.meta.legacy || r.meta.legacy);
    out.meta.legacyTasks = Math.max(num(l.meta.legacyTasks), num(r.meta.legacyTasks));
    out.meta.catalogV = Math.max(num(l.meta.catalogV), num(r.meta.catalogV));
    out.meta.goalsImported = Math.max(num(l.meta.goalsImported), num(r.meta.goalsImported));
    out.meta.recordsImported = Math.max(num(l.meta.recordsImported), num(r.meta.recordsImported));
    out.meta.chatImported = Math.max(num(l.meta.chatImported), num(r.meta.chatImported));
    out.meta.updatedAt = Math.max(num(l.meta.updatedAt), num(r.meta.updatedAt));
    out.profile = (localNewer ? l : r).profile || l.profile;
    out.settings = (localNewer ? l : r).settings || l.settings;
    out.role = l.role;
    out.v = l.v;
    return out;
  }
  function cloudApply(merged) {
    cloud.applying = true;
    state = normalizeState(merged);
    state.meta.cloudEnabled = true;
    safeSet(STORE_KEY, JSON.stringify(state));
    cloud.applying = false;
    render();
    cloudRenderBadge();
  }
  async function cloudPull(manual) {
    if (!cloudOn()) { if (manual) toast('先开启多端同步', 'warn'); return false; }
    if (cloud.busy) return false;
    cloud.busy = true; cloud.pending = false; cloudRenderBadge();
    try {
      var localAtStart = num(state.meta.updatedAt);
      var row = await cloudFetchRow();
      var code = state.meta.syncCode || state.meta.syncId || '';
      var rid = cloudRowId();
      var remote = null;
      if (row && row.data) remote = normalizeState(await decryptCloudData(row.data, code, rid));
      if (!remote) { if (manual) toast('云端还没有数据，本机会先上传一份', 'info'); return false; }
      var local = state;
      if (local.meta.demo && !remote.meta.demo) {
        if (num(state.meta.updatedAt) !== localAtStart) { cloudSchedule(); return false; }
        cloudApply(remote);
        cloud.last = Date.now(); cloud.err = ''; cloud.pending = false;
        toast('已载入云端的真实数据', 'success');
        return true;
      }
      if (remote.meta.demo && !local.meta.demo) {
        if (manual) toast('云端是演示数据，已保留本机真实数据', 'info');
        cloudSchedule();
        return false;
      }
      if (num(state.meta.updatedAt) !== localAtStart) { cloudSchedule(); return false; }
      var merged = cloudMerge(local, remote, num(local.meta.updatedAt) >= num(remote.meta.updatedAt));
      var normalized = normalizeState(merged);
      var changed = JSON.stringify(normalized) !== JSON.stringify(local);
      if (changed) cloudApply(merged);
      cloud.last = Date.now(); cloud.err = ''; cloud.pending = false;
      if (JSON.stringify(normalized) !== JSON.stringify(remote)) cloudSchedule();
      if (manual) toast(changed ? '已拉取云端并合并' : '云端已是最新', 'success');
      return changed;
    } catch (e) {
      cloud.err = String((e && e.message) || e).slice(0, 80);
      cloud.pending = true;
      if (manual) toast('云端读取失败：' + cloud.err, 'warn');
      return false;
    } finally {
      cloud.busy = false;
      cloudRenderBadge();
    }
  }
  async function cloudPush(manual) {
    if (!cloudOn()) { if (manual) toast('先开启多端同步', 'warn'); return false; }
    if (cloud.busy) { cloud.pending = true; return false; }
    cloud.busy = true; cloud.pending = false; cloudRenderBadge();
    var ok = false, merged = null;
    try {
      for (var attempt = 0; attempt < 3 && !ok; attempt++) {
        var localAtStart = num(state.meta.updatedAt);
        var rid = cloudRowId();
        var code = state.meta.syncCode || state.meta.syncId || '';
        var row = await cloudFetchRow();
        var remote = null;
        if (row && row.data) remote = normalizeState(await decryptCloudData(row.data, code, rid));
        var local = state;
        var localNewer = num(local.meta.updatedAt) >= num(remote && remote.meta.updatedAt);
        var m;
        if (!remote) m = local;
        else if (local.meta.demo && !remote.meta.demo) m = remote;
        else if (remote.meta.demo && !local.meta.demo) m = local;
        else m = cloudMerge(local, remote, localNewer);
        m.meta.cloudEnabled = true;
        m.meta.updatedAt = Date.now();
        merged = m;
        if (remote && JSON.stringify(normalizeState(m)) === JSON.stringify(remote)) { ok = true; break; }
        var payload = state.meta.syncEnc ? await encryptCloudData(m, code, rid) : m;
        var iso = new Date().toISOString();
        var r;
        if (row && row.updated_at) {
          r = await fetch(CLOUD_REST + '?id=eq.' + rid + '&updated_at=eq.' + encodeURIComponent(row.updated_at) + '&select=id', {
            method: 'PATCH',
            headers: cloudHeaders({ 'Content-Type': 'application/json', 'Prefer': 'return=representation' }),
            body: JSON.stringify({ data: payload, updated_at: iso })
          });
          if (r.ok) {
            var arr = await r.json().catch(function () { return null; });
            if (arr && arr.length) ok = true;
            else continue;
          } else if (r.status === 409) continue;
          else throw new Error('HTTP ' + r.status + ' ' + String(await r.text().catch(function () { return ''; })).slice(0, 90));
        } else if (row) {
          r = await fetch(CLOUD_REST + '?id=eq.' + rid, {
            method: 'PATCH',
            headers: cloudHeaders({ 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }),
            body: JSON.stringify({ data: payload, updated_at: iso })
          });
          if (r.ok) ok = true;
          else throw new Error('HTTP ' + r.status);
        } else {
          r = await fetch(CLOUD_REST, {
            method: 'POST',
            headers: cloudHeaders({ 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }),
            body: JSON.stringify({ id: Number(rid), data: payload, updated_at: iso })
          });
          if (r.ok) ok = true;
          else if (r.status === 409) continue;
          else throw new Error('HTTP ' + r.status);
        }
      }
      if (!ok) throw new Error('并发冲突，稍后自动重试');
      cloud.last = Date.now(); cloud.err = ''; cloud.pending = false; cloud.fail = 0;
      if (cloud.timer) { clearTimeout(cloud.timer); cloud.timer = null; }
      if (num(state.meta.updatedAt) !== localAtStart) cloud.pending = true;
      else if (merged && JSON.stringify(normalizeState(merged)) !== JSON.stringify(state)) cloudApply(merged);
      if (manual) toast(cloud.pending ? '已同步，正在补传刚才的新修改' : '已同步到云端', 'success');
      return true;
    } catch (e) {
      cloud.err = String((e && e.message) || e).slice(0, 90);
      cloud.pending = true;
      cloud.fail++;
      if (manual) toast('云端同步失败：' + cloud.err, 'warn');
      return false;
    } finally {
      cloud.busy = false;
      cloudRenderBadge();
      if (cloud.pending && !cloud.timer) cloudSchedule();
    }
  }
  function cloudSyncNow(manual) {
    if (!cloudOn()) { if (manual) toast('先开启多端同步', 'warn'); return Promise.resolve(false); }
    return cloudPull(manual).then(function () { return cloudPush(manual); });
  }
  function cloudSchedule() {
    if (!cloudOn() || cloud.applying) return;
    cloud.pending = true;
    cloudRenderBadge();
    if (cloud.timer) clearTimeout(cloud.timer);
    var delay = cloud.fail ? Math.min(60000, 8000 * Math.pow(2, Math.min(3, cloud.fail))) : 1500;
    cloud.timer = setTimeout(function () { cloud.timer = null; cloudPush(false); }, delay);
  }
  function openJudgeRecords() {
    if (!requireParent('切换到家长端才能看判题记录')) return;
    var recs = state.tasks.filter(function (t) { return t.judge && (t.judge.text || t.judge.thumb); }).sort(function (a, b) {
      return num(b.judge.ts) - num(a.judge.ts);
    });
    var body;
    if (!recs.length) {
      body = '<div class="judge-empty"><span>📸</span><strong>还没有判题记录</strong><p>在作业任务里点「拍照 / 让小搭分析」，分析文字和照片缩略图会保存在这里，也会随云同步。</p></div>';
    } else {
      body = '<div class="judge-list">' + recs.map(function (t) {
        var j = t.judge, d = new Date(num(j.ts) || Date.now());
        return '<div class="judge-row">' +
          (j.thumb ? '<img class="judge-thumb" src="' + esc(j.thumb) + '" alt="作业照片">' : '<div class="judge-thumb is-empty">📄</div>') +
          '<div class="judge-main"><div class="judge-title">' + subjectChip(t.subject, true) + ' ' + esc(t.title) + '</div>' +
          '<div class="judge-meta">' + (d.getMonth() + 1) + '月' + d.getDate() + '日 ' + pad2(d.getHours()) + ':' + pad2(d.getMinutes()) +
          ' · ' + (j.ok ? '小搭已分析' : '仅保存照片') + '</div>' +
          '<div class="judge-text">' + esc(j.text || '没有文字结果。') + '</div></div></div>';
      }).join('') + '</div>';
    }
    openModal({
      title: '判题记录', icon: 'camera',
      sub: '小搭分析过的作业 · ' + recs.length + ' 条',
      body: body,
      footer: '<span class="foot-note">记录随任务保存，不会单独丢失</span><button class="btn btn-ghost" type="button" data-close>关闭</button>'
    });
  }
  function openCloudModal() {
    var on = cloudOn();
    var code = state.meta && (state.meta.syncCode || state.meta.syncId) ? String(state.meta.syncCode || state.meta.syncId) : '';
    openModal({
      title: '多端同步', icon: 'cloud',
      sub: on ? cloudStatusText() : '只给自家设备同步，用家庭同步码配对',
      body: '<div class="cloud-panel"><span class="cloud-big-dot' + (on && !cloud.err ? ' is-on' : '') + '"></span><div><strong>' + esc(cloudStatusText()) + '</strong>' +
        '<p>' + (on ? '本机修改会自动合并上传；另一台设备输入同一个同步码即可加入。' : '开启后会生成一个加密家庭同步码；另一台设备输入同一个码加入。') + '</p></div></div>' +
        (on
          ? '<div class="cloud-code"><span>家庭同步码</span><b>' + esc(code) + '</b><button class="btn btn-ghost btn-xs" type="button" data-act="cloud-copy">复制</button></div>' +
            '<p class="form-note" style="margin-top:8px">' + (state.meta.syncEnc ? '数据已用这个同步码端到端加密。' : '这是旧版数字码，数据未加密；建议重置为加密码。') + '重置同步码后，旧设备需要重新加入。</p>' + cloudDevicesHTML()
          : '<div class="field" style="margin-top:11px"><label for="cloudCode">已有家庭同步码（没有就点「新建加密同步」）</label><input id="cloudCode" maxlength="24" placeholder="LC-XXXX-XXXX-XXXX 或旧 9 位数字"></div>') +
        '<p class="form-note" style="margin-top:11px">数据存到家庭独立的腾讯云行。新同步码使用 AES-GCM 端到端加密，包含任务、星星、奖励、成绩目标、小搭聊天/判题缩略图和家长 PIN 哈希。</p>' +
        (cloud.err ? '<p class="form-note" style="color:#b44">最近错误：' + esc(cloud.err) + '</p>' : ''),
      footer: on
        ? '<button class="btn btn-soft" type="button" data-act="cloud-revoke">撤销其他设备</button><button class="btn btn-ghost" type="button" data-act="cloud-off">关闭同步</button><button class="btn btn-primary" type="button" data-act="cloud-now">立即同步</button>'
        : '<button class="btn btn-ghost" type="button" data-close>取消</button><button class="btn btn-soft" type="button" data-act="cloud-join">加入已有</button><button class="btn btn-primary" type="button" data-act="cloud-on">新建加密同步</button>'
    });
  }
  function enableCloud() {
    if (!requireParent('切换到家长端才能开启多端同步')) return;
    var migrated = false;
    if (!state.meta.syncId && !state.meta.syncCode) {
      state.meta.syncCode = newSyncCode();
      state.meta.syncId = syncCodeToId(state.meta.syncCode);
      state.meta.syncEnc = true;
      migrated = true;
    }
    state.meta.cloudEnabled = true;
    state.meta.updatedAt = Date.now();
    save();
    cloud.enabled = true;
    closeModal();
    cloudRenderBadge();
    toast('已开启加密同步，正在和云端合并…', 'info');
    var run = function () { cloudSyncNow(true); };
    if (migrated) migrateLegacyCloudRow(state.meta.syncId).then(run, run);
    else run();
  }
  function joinCloud() {
    if (!requireParent('切换到家长端才能加入多端同步')) return;
    var raw = (($('#cloudCode') || {}).value || '').trim();
    var code = normalizeSyncCode(raw);
    if (code) {
      state.meta.syncCode = code;
      state.meta.syncId = syncCodeToId(code);
      state.meta.syncEnc = true;
    } else if (/^\d{6,12}$/.test(raw)) {
      state.meta.syncCode = '';
      state.meta.syncId = raw;
      state.meta.syncEnc = false;
    } else {
      toast('同步码格式不对：应像 LC-XXXX-XXXX-XXXX，或旧 9 位数字', 'warn');
      return;
    }
    state.meta.cloudEnabled = true;
    state.meta.updatedAt = Date.now();
    save();
    closeModal();
    cloudRenderBadge();
    toast('已加入同步，正在拉取云端数据…', 'info');
    cloudPull(true).then(function (ok) {
      if (!ok) cloudPush(true);
    });
  }
  function copyCloudCode() {
    var code = state.meta && (state.meta.syncCode || state.meta.syncId) ? String(state.meta.syncCode || state.meta.syncId) : '';
    if (!code) return;
    try {
      navigator.clipboard.writeText(code).then(function () { toast('同步码已复制', 'success'); }, function () { toast('同步码：' + code, 'info'); });
    } catch (e) { toast('同步码：' + code, 'info'); }
  }
  function resetCloudCode() {
    if (!requireParent('切换到家长端才能重置同步码')) return;
    state.meta.syncCode = newSyncCode();
    state.meta.syncId = syncCodeToId(state.meta.syncCode);
    state.meta.syncEnc = true;
    state.meta.updatedAt = Date.now();
    state.meta.devices = (state.meta.devices || []).filter(function (d) { return d && d.id === state.meta.deviceId; });
    save();
    closeModal();
    cloudRenderBadge();
    toast('已重置加密同步码，旧设备需要重新加入', 'info');
    cloudSyncNow(true);
  }
  async function migrateLegacyCloudRow(newId) {
    if (!newId || String(newId) === String(CLOUD_ID)) return false;
    try {
      var old = await fetch(CLOUD_REST + '?id=eq.' + CLOUD_ID + '&select=id,data,updated_at', { headers: cloudHeaders(), cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; });
      var oldRow = Array.isArray(old) && old[0] ? old[0] : null;
      if (!oldRow || !oldRow.data) return false;
      var target = await fetch(CLOUD_REST + '?id=eq.' + newId + '&select=id', { headers: cloudHeaders(), cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : null; });
      if (Array.isArray(target) && target.length) return false;
      var iso = new Date().toISOString();
      var payload = state.meta.syncEnc ? await encryptCloudData(oldRow.data, state.meta.syncCode, newId) : oldRow.data;
      var r = await fetch(CLOUD_REST, {
        method: 'POST', headers: cloudHeaders({ 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }),
        body: JSON.stringify({ id: Number(newId), data: payload, updated_at: iso })
      });
      return !!r.ok;
    } catch (e) { return false; }
  }
  function disableCloud() {
    if (!requireParent('切换到家长端才能关闭多端同步')) return;
    state.meta.cloudEnabled = false;
    state.meta.updatedAt = Date.now();
    save();
    cloud.enabled = false;
    cloud.pending = false;
    if (cloud.timer) { clearTimeout(cloud.timer); cloud.timer = null; }
    closeModal();
    cloudRenderBadge();
    toast('已关闭多端同步，数据只留在本机', 'info');
  }
  function cloudInit() {
    cloud.enabled = cloudOn();
    if (cloud.enabled && !state.meta.syncId) {
      if (state.meta.syncCode) {
        state.meta.syncId = syncCodeToId(state.meta.syncCode);
        state.meta.syncEnc = true;
      } else {
        state.meta.syncCode = newSyncCode();
        state.meta.syncId = syncCodeToId(state.meta.syncCode);
        state.meta.syncEnc = true;
      }
      save();
    }
    cloudRenderBadge();
    if (cloud.enabled) {
      setTimeout(function () {
        cloudPull(false).then(function (ok) { if (!ok) cloudPush(false); });
      }, 900);
    }
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && cloudOn() && Date.now() - cloud.last > 60000) cloudPull(false);
    });  }

  function importLegacy() {
    var raw = safeGet(LEGACY_KEY);
    if (!raw) return null;
    var o;
    try { o = JSON.parse(raw); } catch (e) { return null; }
    if (!o || typeof o !== 'object') return null;
    var log = [], i, p, pts, ts, type;
    if (Array.isArray(o.points)) {
      for (i = 0; i < o.points.length; i++) {
        p = o.points[i] || {};
        pts = Number(p.points != null ? p.points : (p.n != null ? p.n : p.delta));
        if (!pts) continue;
        ts = p.ts ? Number(p.ts) : (p.date ? new Date(p.date + 'T12:00:00').getTime() : 0);
        if (!ts || !isFinite(ts)) continue;
        type = p.type || (pts < 0 ? 'use' : 'earn');
        log.push({ id: uid('lg'), ts: ts, delta: (type === 'use' || pts < 0) ? -Math.abs(pts) : Math.abs(pts), reason: p.source || p.reason || '旧版星星记录', kind: 'legacy' });
      }
    }
    if (!log.length && !(Array.isArray(o.hw) && o.hw.length) && !(Array.isArray(o.tasks) && o.tasks.length) && !(Array.isArray(o.checks) && o.checks.length) && !(Array.isArray(o.smallGoals) && o.smallGoals.length) && !(Array.isArray(o._chat) && o._chat.length) && !(Array.isArray(o._mem) && o._mem.length)) return null;
    log.sort(function (a, b) { return b.ts - a.ts; });
    /* 旧数据可能很多：保留最近 1200 条，早年的净额合并成一条，保证余额不丢 */
    if (log.length > 1200) {
      var totalDelta = 0, keptDelta = 0;
      for (i = 0; i < log.length; i++) totalDelta += log[i].delta;
      for (i = 0; i < 1200; i++) keptDelta += log[i].delta;
      log = log.slice(0, 1200);
      if (totalDelta !== keptDelta) {
        log.push({ id: uid('lg'), ts: log[log.length - 1].ts - 1, delta: totalDelta - keptDelta, reason: '历史星星合并', kind: 'legacy' });
      }
    }

    /* 旧版任务 / 作业清单 / 打卡记录 → 新版任务 */
    var legacyTasks = [], seenTask = {}, linked = {}, checkById = {};
    function normSub(s) {
      s = String(s == null ? '' : s).trim();
      return SUB_SHORT[s] ? s : '习惯';
    }
    function validDate(s) {
      return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
    }
    function dateTs(s) {
      s = validDate(s);
      return s ? new Date(s + 'T20:00:00').getTime() : 0;
    }
    function addLegacyTask(t) {
      if (!t || !t.title) return;
      if (legacyTasks.length >= 300 && t.source === 'legacy-check') return;
      var key = (t.date || '') + '|' + t.subject + '|' + t.title;
      if (seenTask[key]) return;
      seenTask[key] = 1;
      legacyTasks.push(t);
    }
    function checkType(tp) {
      return tp === 'homework' ? 'homework' : tp === 'word' ? 'words' : tp === 'recite' ? 'recite' : tp === 'note' ? 'read' : 'habit';
    }
    function hwType(k) {
      return k === 'recite' ? 'recite' : k === 'written' ? 'homework' : (k === 'read' || k === 'reading') ? 'read' : 'habit';
    }
    if (Array.isArray(o.checks)) {
      o.checks.forEach(function (c) { if (c && c.id != null) checkById[String(c.id)] = c; });
    }
    if (Array.isArray(o.hw)) {
      o.hw.forEach(function (job) { if (job && job.recId != null) linked[String(job.recId)] = 1; });
    }
    if (Array.isArray(o.checks)) {
      o.checks.forEach(function (c) {
        if (!c || c.status === 'rejected' || linked[String(c.id)]) return;
        var doneAt = Number(c.at || c.ts || 0);
        addLegacyTask({
          id: uid('lt'), subject: normSub(c.subject),
          title: (normSub(c.subject) !== '习惯' ? normSub(c.subject) + ' · ' : '') + String(c.typeName || c.type || '学习记录').slice(0, 40),
          type: checkType(c.type), stars: 1, date: validDate(c.date) || dayKey(Date.now()),
          done: c.status === 'approved', doneAt: doneAt || dateTs(c.date) || Date.now(),
          source: 'legacy-check', createdAt: Date.now()
        });
      });
    }
    if (Array.isArray(o.hw)) {
      o.hw.forEach(function (job) {
        if (!job || !job.text) return;
        var c = job.recId != null ? checkById[String(job.recId)] : null;
        addLegacyTask({
          id: uid('lt'), subject: normSub(job.subj), title: String(job.text).slice(0, 60),
          type: hwType(job.kind), stars: 1, date: validDate(job.date) || dayKey(Date.now()),
          done: !!(c && c.status === 'approved'), doneAt: c ? Number(c.at || c.ts || 0) : 0,
          source: 'legacy-hw', createdAt: Date.now()
        });
      });
    }
    if (Array.isArray(o.tasks)) {
      o.tasks.forEach(function (t) {
        if (!t || !t.text) return;
        addLegacyTask({
          id: uid('lt'), subject: '习惯', title: String(t.text).slice(0, 60), type: 'habit',
          stars: 1, date: validDate(t.date) || dayKey(Date.now()), done: !!t.done,
          doneAt: t.doneAt ? Number(t.doneAt) : (t.done ? dateTs(t.date) : 0),
          source: 'legacy-task', createdAt: Date.now()
        });
      });
    }
    var legacyGoals = [];
    if (Array.isArray(o.smallGoals)) {
      o.smallGoals.forEach(function (g) {
        if (!g) return;
        var to = Number(g.to), from = Number(g.from);
        if (!isFinite(to)) return;
        var subj = String(g.subject || '成绩').trim() || '成绩';
        legacyGoals.push({
          id: uid('lg_goal'), subject: SUB_SHORT[subj] ? subj : '语文',
          title: subj + ' 小目标', target: Math.max(0, Math.round(to)),
          from: isFinite(from) ? from : null, stars: 10,
          done: !!g.done, doneAt: g.done ? Date.now() : 0,
          source: 'legacy-goal'
        });
      });
    }
    var legacyChat = [], legacyMem = [];
    if (Array.isArray(o._chat)) {
      o._chat.slice(-300).forEach(function (m) {
        if (!m || !m.text) return;
        var txt = String(m.text).replace(/\[\[[^\]]*\]\]/g, '').replace(/\s+/g, ' ').trim();
        if (!txt) return;
        var ts = Number(m.ts) || (m.date ? new Date(m.date + 'T20:00:00').getTime() : Date.now());
        legacyChat.push({
          id: uid('c'), ts: ts, role: m.role === 'u' ? 'u' : 'a', text: txt.slice(0, 1200),
          img: (typeof m.img === 'string' && /^https?:\/\//.test(m.img)) ? m.img : ''
        });
      });
    }
    if (Array.isArray(o._mem)) {
      o._mem.slice(-40).forEach(function (m) {
        var tex = m && (typeof m === 'string' ? m : m.text);
        if (!tex) return;
        legacyMem.push({ id: uid('cm'), text: String(tex).slice(0, 120), tags: (m && m.tags) || [], at: Number(m && m.at) || Date.now() });
      });
    }
    return {
      nick: typeof o.nick === 'string' && o.nick.trim() ? o.nick.trim() : '',
      grade: /^初[一二三][上下]$/.test(String(o.sem || '')) ? String(o.sem) : '',
      log: log,
      tasks: legacyTasks,
      goals: legacyGoals,
      chat: legacyChat,
      chatMem: legacyMem
    };
  }
  function normalizeState(s) {
    var base = seedState();
    if (!s || typeof s !== 'object') s = {};
    s.v = VERSION;
    if (!s.profile || typeof s.profile !== 'object') s.profile = base.profile;
    if (typeof s.profile.nick !== 'string' || !s.profile.nick.trim()) s.profile.nick = '乐乐';
    if (typeof s.profile.grade !== 'string' || !s.profile.grade.trim()) s.profile.grade = '初二上';
    if (s.role !== 'parent' && s.role !== 'student') s.role = 'student';
    s.tasks = Array.isArray(s.tasks) ? s.tasks : base.tasks;
    s.examGoals = Array.isArray(s.examGoals) ? s.examGoals : base.examGoals;
    s.mastery = Array.isArray(s.mastery) ? s.mastery : base.mastery;
    s.rewards = Array.isArray(s.rewards) ? s.rewards : base.rewards;
    s.redemptions = Array.isArray(s.redemptions) ? s.redemptions : [];
    s.log = Array.isArray(s.log) ? s.log : [];
    s.chat = Array.isArray(s.chat) ? s.chat : [];
    s.chatMem = Array.isArray(s.chatMem) ? s.chatMem : [];
    s._del = s._del && typeof s._del === 'object' && !Array.isArray(s._del) ? s._del : {};
    s.settings = s.settings && typeof s.settings === 'object' ? s.settings : { starGoal: 200 };
    s.meta = s.meta && typeof s.meta === 'object' ? s.meta : {};
    if (typeof s.meta.demo !== 'boolean') s.meta.demo = false;
    if (typeof s.meta.demoTasks !== 'boolean') s.meta.demoTasks = false;
    if (typeof s.meta.legacy !== 'boolean') s.meta.legacy = false;
    if (typeof s.meta.legacyTasks !== 'number' || !isFinite(s.meta.legacyTasks)) s.meta.legacyTasks = 0;
    if (typeof s.meta.noticeDismissed !== 'boolean') s.meta.noticeDismissed = false;
    if (typeof s.meta.parentPin !== 'string') s.meta.parentPin = '';
    if (typeof s.meta.parentPinAt !== 'number') s.meta.parentPinAt = 0;
    if (typeof s.meta.goalsImported !== 'number') s.meta.goalsImported = 0;
    if (typeof s.meta.recordsImported !== 'number') s.meta.recordsImported = 0;
    if (typeof s.meta.chatImported !== 'number') s.meta.chatImported = 0;
    if (typeof s.meta.requireApproval !== 'boolean') s.meta.requireApproval = false;
    if (typeof s.meta.cloudEnabled !== 'boolean') s.meta.cloudEnabled = false;
    if (typeof s.meta.syncId !== 'string' || !/^\d{6,12}$/.test(s.meta.syncId)) s.meta.syncId = '';
    if (typeof s.meta.syncCode !== 'string') s.meta.syncCode = '';
    if (typeof s.meta.syncEnc !== 'boolean') s.meta.syncEnc = false;
    if (typeof s.meta.deviceId !== 'string') s.meta.deviceId = '';
    if (!Array.isArray(s.meta.devices)) s.meta.devices = [];
    s.meta.devices = s.meta.devices.filter(function (d) { return d && typeof d.id === 'string'; }).slice(-10);
    if (typeof s.meta.updatedAt !== 'number') s.meta.updatedAt = Date.now();
    if (!s.meta.lastRoll) s.meta.lastRoll = dayKey(Date.now());
    var i, t, todayKey = dayKey(Date.now());
    for (i = 0; i < s.tasks.length; i++) {
      t = s.tasks[i]; if (!t || typeof t !== 'object') continue;
      t.id = t.id || uid('t');
      t.subject = SUB_SHORT[t.subject] ? t.subject : '习惯';
      t.title = String(t.title || '未命名任务');
      t.type = t.type || 'habit';
      t.stars = Math.max(1, Math.round(num(t.stars, 1)));
      t.date = typeof t.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) ? t.date : todayKey;
      t.done = !!t.done;
      t.pendingApproval = !!t.pendingApproval;
      if (t.pendingApproval) t.done = false;
      if (!t.pendingApproval) delete t.submittedAt;
      t.awardSeq = Math.max(0, Math.round(num(t.awardSeq, 0)));
      if (t.repeat && Array.isArray(t.repeat.days)) {
        t.repeat = { days: t.repeat.days.map(function (d) { return Math.round(num(d, -1)); }).filter(function (d) { return d >= 0 && d <= 6; }).filter(function (d, i, a) { return a.indexOf(d) === i; }) };
        if (!t.repeat.days.length) delete t.repeat;
      } else delete t.repeat;
      if (t.repeatOf) t.repeatOf = String(t.repeatOf); else delete t.repeatOf;
      if (t.done) {
        if (t.awardedStars == null) t.awardedStars = t.stars;
        else t.awardedStars = Math.max(1, Math.round(num(t.awardedStars, t.stars)));
      } else delete t.awardedStars;
      if (!t.done) delete t.doneAt;
      if (t.carriedFrom && !/^\d{4}-\d{2}-\d{2}$/.test(t.carriedFrom)) delete t.carriedFrom;
    }
    for (i = 0; i < s.examGoals.length; i++) {
      t = s.examGoals[i]; if (!t || typeof t !== 'object') continue;
      t.id = t.id || uid('e');
      t.target = Math.max(0, Math.round(num(t.target, 90)));
      t.stars = Math.max(1, Math.round(num(t.stars, 5)));
      t.done = !!t.done;
      t.awardSeq = Math.max(0, Math.round(num(t.awardSeq, 0)));
      if (t.done) {
        if (t.awardedStars == null) t.awardedStars = t.stars;
        else t.awardedStars = Math.max(1, Math.round(num(t.awardedStars, t.stars)));
      } else delete t.awardedStars;
      if (t.from != null && isFinite(Number(t.from))) t.from = Number(t.from); else delete t.from;
    }
    for (i = 0; i < s.rewards.length; i++) {
      t = s.rewards[i]; if (!t || typeof t !== 'object') continue;
      t.id = t.id || uid('r');
      t.name = String(t.name || '奖励');
      t.icon = String(t.icon || '🎁');
      t.cost = Math.max(1, Math.round(num(t.cost, 10)));
      t.cat = REWARD_CATS.indexOf(t.cat) > 0 ? t.cat : '心愿';
      t.detail = String(t.detail || '');
      if (t.price != null && isFinite(Number(t.price))) t.price = Number(t.price); else delete t.price;
    }
    ensureCatalogRewards(s);
    for (i = 0; i < s.mastery.length; i++) {
      t = s.mastery[i]; if (!t || typeof t !== 'object') continue;
      t.id = t.id || uid('m');
      t.subject = MASTERY_GROUPS[t.subject] ? t.subject : '语文';
      t.title = String(t.title || '未命名知识点');
      t.detail = String(t.detail || '');
      t.known = !!t.known;
      t.grade = typeof t.grade === 'string' ? t.grade : '初二上';
    }
    s.chat = s.chat.filter(function (m) { return m && typeof m === 'object' && (m.text || m.pending); }).map(function (m) {
      var txt = String(m.text || '');
      if (m.pending) { txt = txt || '（刚才那条没回完，你再说一次？）'; }
      var img = (typeof m.img === 'string' && (/^https?:\/\//.test(m.img) || (/^data:image\//.test(m.img) && m.img.length <= 60000))) ? m.img : '';
      return {
        id: m.id || uid('c'), ts: Number(m.ts) || Date.now(),
        role: m.role === 'u' ? 'u' : 'a', text: txt.slice(0, 1200), img: img
      };
    }).slice(-300);
    /* 聊天图片最多保留最近 20 张，避免 localStorage 被缩略图撑爆 */
    (function () {
      var imgKept = 0;
      for (var ci = s.chat.length - 1; ci >= 0; ci--) {
        if (!s.chat[ci].img) continue;
        if (imgKept >= 20) s.chat[ci].img = '';
        else imgKept++;
      }
    })();
    s.chatMem = s.chatMem.filter(function (m) { return m && (typeof m === 'string' || m.text); }).map(function (m) {
      var tex = typeof m === 'string' ? m : m.text;
      return { id: (m && m.id) || uid('cm'), text: String(tex).slice(0, 120), tags: (m && m.tags) || [], at: Number(m && m.at) || Date.now() };
    }).slice(-40);
    var delNow = Date.now();
    Object.keys(s._del).forEach(function (k) {
      var tv = num(s._del[k]);
      if (!tv || delNow - tv > 90 * 24 * 3600 * 1000) delete s._del[k];
    });
    s.tasks = s.tasks.filter(function (t) { return !(s._del['task:' + t.id] && s._del['task:' + t.id] >= num(t.updatedAt || t.createdAt)); });
    s.rewards = s.rewards.filter(function (r) { return !(s._del['reward:' + r.id] && s._del['reward:' + r.id] >= num(r.updatedAt)); });
    s.examGoals = s.examGoals.filter(function (g) { return !(s._del['exam:' + g.id] && s._del['exam:' + g.id] >= num(g.updatedAt)); });
    return s;
  }
  function ensureCatalogRewards(s) {
    if (!s || !Array.isArray(s.rewards)) return;
    var oldV = num(s.meta && s.meta.catalogV);
    if (oldV >= CATALOG_VERSION) return;
    var ids = {}, names = {};
    s.rewards.forEach(function (r) { if (!r) return; ids[r.id] = 1; names[r.name] = 1; });
    legacyComputerRewards().forEach(function (r) {
      var ex = ids[r.id] ? s.rewards.filter(function (x) { return x && x.id === r.id; })[0] : null;
      if (ex) {
        ex.price = r.price;
        ex.cost = r.cost;
        ex.updatedAt = Date.now();
        return;
      }
      if (oldV >= 2 || names[r.name]) return;
      s.rewards.push({ id: r.id, name: r.name, icon: r.icon, price: r.price, cost: r.cost, cat: r.cat, detail: r.detail });
    });
    if (!s.meta) s.meta = {};
    s.meta.catalogV = CATALOG_VERSION;
  }
  function mergeLegacyExtras(s) {
    if (!s || !s.meta) return false;
    if (!safeGet(LEGACY_KEY)) return false;
    var legacy;
    try { legacy = importLegacy(); } catch (e) { return false; }
    if (!legacy) return false;
    var changed = false;
    if (!num(s.meta.goalsImported)) {
      if (legacy.goals && legacy.goals.length) {
        var demoGoals = s.examGoals.length === 6 && s.examGoals.every(function (g) { return /^e[1-6]$/.test(g.id); });
        if (demoGoals) {
          s.examGoals = legacy.goals.slice();
        } else {
          legacy.goals.forEach(function (g) {
            if (!s.examGoals.some(function (x) { return x.subject === g.subject && x.target === g.target && x.title === g.title; })) s.examGoals.push(g);
          });
        }
        changed = true;
      }
      s.meta.goalsImported = 1;
      changed = true;
    }
    if (!num(s.meta.recordsImported)) {
      if (num(s.meta.legacyTasks) > 0) {
        s.meta.recordsImported = 1;
        changed = true;
      } else if (legacy.tasks && legacy.tasks.length) {
        var demo = !!(s.meta.demo || s.meta.demoTasks) || s.tasks.every(function (t) { return /^t\d+$/.test(t.id); });
        if (demo) {
          s.tasks = legacy.tasks.slice();
          s.log = (legacy.log || []).slice();
          s.redemptions = [];
        } else {
          legacy.tasks.forEach(function (t) {
            if (!s.tasks.some(function (x) { return x.date === t.date && x.subject === t.subject && x.title === t.title; })) s.tasks.push(t);
          });
        }
        s.meta.demo = false;
        s.meta.demoTasks = false;
        s.meta.legacy = true;
        s.meta.legacyTasks = s.tasks.length;
        s.meta.recordsImported = 1;
        changed = true;
      } else {
        if (legacy.log && legacy.log.length && (s.meta.demo || s.meta.demoTasks || !s.log.length)) {
          s.log = legacy.log.slice();
          s.redemptions = [];
          changed = true;
        }
        s.meta.recordsImported = 1;
        changed = true;
      }
    }
    if (!num(s.meta.chatImported)) {
      if (legacy.chat && legacy.chat.length) {
        var wasDemoChat = !!(s.meta.demo || s.meta.demoTasks) || s.chat.length === 0;
        if (wasDemoChat) {
          s.chat = legacy.chat.slice();
        } else {
          legacy.chat.forEach(function (m) {
            if (!s.chat.some(function (x) { return x.ts === m.ts && x.role === m.role && x.text === m.text; })) s.chat.push(m);
          });
        }
        s.chat = s.chat.slice(-300);
        changed = true;
      }
      if (legacy.chatMem && legacy.chatMem.length) {
        legacy.chatMem.forEach(function (m) {
          if (!s.chatMem.some(function (x) { return x.text === m.text; })) s.chatMem.push(m);
        });
        s.chatMem = s.chatMem.slice(-40);
        changed = true;
      }
      s.meta.chatImported = 1;
      changed = true;
    }
    return changed;
  }
  function loadState() {
    var raw = safeGet(STORE_KEY);
    if (raw) {
      try {
        var saved = JSON.parse(raw);
        if (saved && saved.v === VERSION) {
          var st = normalizeState(saved);
          mergeLegacyExtras(st);
          return normalizeState(st);
        }
      } catch (e) { /* 损坏则重建 */ }
    }
    var legacy = importLegacy();
    var s = seedState();
    if (legacy) {
      s.log = legacy.log;
      s.redemptions = [];
      s.profile.nick = legacy.nick || s.profile.nick;
      if (legacy.grade) s.profile.grade = legacy.grade;
      if (legacy.tasks && legacy.tasks.length) {
        s.tasks = legacy.tasks;
        s.meta.demoTasks = false;
        s.meta.legacyTasks = legacy.tasks.length;
      } else {
        s.tasks = s.tasks.map(function (t) { t.done = false; delete t.doneAt; return t; });
        s.meta.demoTasks = true;
        s.meta.legacyTasks = 0;
      }
      s.examGoals = legacy.goals || [];
      s.chat = legacy.chat || [];
      s.chatMem = legacy.chatMem || [];
      s.meta.goalsImported = 1;
      s.meta.recordsImported = 1;
      s.meta.chatImported = 1;
      s.meta.demo = false;
      s.meta.legacy = true;
      var totals = logTotals(s.log);
      if (totals.balance < 0) {
        s.log.unshift({ id: uid('lg'), ts: Date.now(), delta: -totals.balance, reason: '旧版星星余额校正', kind: 'bonus' });
      }
    }
    return normalizeState(s);
  }
  function todayTasks() {
    if (!state) return [];
    var key = dayKey(Date.now());
    return state.tasks.filter(function (t) { return (t.date || key) === key; });
  }
  function viewTasks() {
    if (!state) return [];
    var key = ui.viewDate || dayKey(Date.now());
    return state.tasks.filter(function (t) { return (t.date || dayKey(Date.now())) === key; });
  }
  function shortDayLabel(key) {
    if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return '';
    var p = key.split('-');
    return Number(p[1]) + '月' + Number(p[2]) + '日';
  }
  function repeatLabel(r) {
    if (!r || !Array.isArray(r.days) || !r.days.length) return '';
    var names = ['日', '一', '二', '三', '四', '五', '六'];
    if (r.days.length === 7) return '每天';
    if (r.days.length === 5 && [1, 2, 3, 4, 5].every(function (d) { return r.days.indexOf(d) >= 0; })) return '工作日';
    if (r.days.length === 2 && r.days.indexOf(0) >= 0 && r.days.indexOf(6) >= 0) return '周末';
    return '每周' + r.days.slice().sort(function (a, b) { return a - b; }).map(function (d) { return names[d]; }).join('、');
  }
  function ensureRecurringTasks() {
    if (!state || !Array.isArray(state.tasks)) return false;
    var today = dayKey(Date.now()), wd = new Date().getDay(), changed = false;
    state.tasks.filter(function (t) { return t && t.repeat && !t.repeatOf && t.date <= today; }).forEach(function (t) {
      if (t.repeat.days.indexOf(wd) < 0) return;
      if (t.date === today) return;
      var cid = t.id + '@' + today;
      if (state.tasks.some(function (x) { return x.id === cid; })) return;
      var c = {
        id: cid, subject: t.subject, title: t.title, type: t.type, stars: t.stars,
        date: today, done: false, repeatOf: t.id, createdAt: Date.now(), updatedAt: Date.now()
      };
      if (t.minutes) c.minutes = t.minutes;
      if (t.seconds) c.seconds = t.seconds;
      if (t.words) c.words = t.words.slice();
      if (t.pairs) c.pairs = t.pairs.map(function (p) { return p.slice(); });
      if (t.passage) c.passage = t.passage;
      if (t.hint) c.hint = t.hint;
      state.tasks.push(c);
      changed = true;
    });
    return changed;
  }
  function rollTasksOver() {
    if (!state) return false;
    var today = dayKey(Date.now()), changed = false;
    state.tasks.forEach(function (t) {
      if (!t || typeof t !== 'object') return;
      if (!t.date) { t.date = today; changed = true; }
      if (!t.done && t.date < today) {
        t.carriedFrom = t.carriedFrom || t.date;
        t.date = today;
        t.updatedAt = Date.now();
        changed = true;
      }
    });
    if (ensureRecurringTasks()) changed = true;
    if (state.meta && state.meta.lastRoll !== today) {
      state.meta.lastRoll = today;
      changed = true;
    }
    if (changed) save();
    return changed;
  }
  function logTotals(log) {
    var earned = 0, used = 0;
    for (var i = 0; i < log.length; i++) {
      var d = num(log[i].delta);
      if (d > 0) earned += d; else used += -d;
    }
    return { earned: earned, used: used, balance: earned - used };
  }
  var totalCache = { log: null, len: -1, first: '', last: '', val: null };
  function starTotals() {
    var l = state.log;
    var first = l.length ? (l[0].id || (l[0].ts + ':' + l[0].delta)) : '';
    var last = l.length ? (l[l.length - 1].id || (l[l.length - 1].ts + ':' + l[l.length - 1].delta)) : '';
    if (totalCache.log === l && totalCache.len === l.length && totalCache.first === first && totalCache.last === last) return totalCache.val;
    var v = logTotals(l);
    totalCache = { log: l, len: l.length, first: first, last: last, val: v };
    return v;
  }
  function starsForDay(key) {
    var sum = 0;
    for (var i = 0; i < state.log.length; i++) {
      var e = state.log[i];
      if (dayKey(e.ts) !== key) continue;
      if (e.delta > 0) sum += e.delta;
      else if (e.kind === 'undo' || e.kind === 'exam') sum += e.delta;
    }
    return Math.max(0, sum);
  }
  function todayStars() { return starsForDay(dayKey(Date.now())); }
  function checkinCount() {
    var set = {};
    for (var i = 0; i < state.log.length; i++) {
      if (state.log[i].delta > 0) set[dayKey(state.log[i].ts)] = 1;
    }
    return Object.keys(set).length;
  }
  function streakDays() {
    var set = {};
    for (var i = 0; i < state.log.length; i++) {
      if (state.log[i].delta > 0) set[dayKey(state.log[i].ts)] = 1;
    }
    var cursor = new Date(); cursor.setHours(12, 0, 0, 0);
    if (!set[dayKey(cursor.getTime())]) cursor.setDate(cursor.getDate() - 1);
    var streak = 0;
    while (set[dayKey(cursor.getTime())] && streak < 999) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }
  function changeStars(delta, reason, kind, ref) {
    if (!delta) return;
    var entry = { id: uid('lg'), ts: Date.now(), delta: Math.round(delta), reason: String(reason || '星星调整'), kind: kind || 'task' };
    if (ref) entry.ref = String(ref);
    state.log.unshift(entry);
    if (state.log.length > 1500) {
      var cut = state.log.slice(1500), carry = 0, ci;
      for (ci = 0; ci < cut.length; ci++) carry += num(cut[ci].delta);
      state.log = state.log.slice(0, 1500);
      if (carry) state.log.push({ id: uid('lg'), ts: cut[cut.length - 1].ts - 1, delta: carry, reason: '历史星星合并', kind: 'legacy' });
    }
    save();
    renderChrome();
  }

  /* ---------- 6. 应用框架 / 角色 / 路由 ---------- */
  function currentPage() {
    var h = (location.hash || '').replace(/^#/, '');
    if (PAGES.indexOf(h) >= 0) return h;
    var q = new URLSearchParams(location.search).get('page');
    if (PAGES.indexOf(q) >= 0) return q;
    return 'today';
  }
  function setPage(page, push) {
    if (PAGES.indexOf(page) < 0) return;
    ui.page = page;
    if (push !== false) {
      try { history.pushState({ page: page }, '', '#' + page); }
      catch (e) { location.hash = page; }
    }
    render();
    try { window.scrollTo(0, 0); } catch (e) { }
  }
  function updateTitle() {
    document.title = '乐乐学习舱 · ' + (PAGE_TITLES[ui.page] || '今天要做');
  }
  function renderChrome() {
    if (!state) return;
    var totals = starTotals();
    var balance = totals.balance;
    var undone = todayTasks().filter(function (t) { return !t.done; }).length;
    var activeGoals = state.examGoals.filter(function (g) { return !g.done; }).length;
    var isParent = state.role === 'parent';
    var nick = state.profile.nick || '乐乐';
    var streak = streakDays();
    var goal = Math.max(50, num(state.settings.starGoal, 200));

    var roleName = $('#effRoleName'), roleDesc = $('#effRoleDesc');
    if (roleName) roleName.textContent = isParent ? '家长端' : '学生端';
    if (roleDesc) roleDesc.textContent = isParent ? '布置 · 确认' : '打卡 · 兑换';
    var sideBalance = $('#effSideBalance');
    if (sideBalance) sideBalance.textContent = fmtNum(balance);
    var mBalance = $('#effMobileBalance');
    if (mBalance) mBalance.textContent = fmtNum(balance);
    var sideStreak = $('#effSideStreak');
    if (sideStreak) sideStreak.textContent = streak > 0 ? '连续 ' + streak + ' 天' : '今天开始打卡';
    var bar = $('#effSideBar');
    if (bar) bar.style.width = clamp(balance / goal * 100, 0, 100).toFixed(1) + '%';
    var user = $('#effUserName'), ustreak = $('#effUserStreak');
    if (user) user.textContent = isParent ? nick + '家长' : nick;
    if (ustreak) ustreak.textContent = '已打卡 ' + checkinCount() + ' 次';
    var navTodo = $('#effNavTodo'), navExam = $('#effNavExam');
    if (navTodo) navTodo.textContent = undone > 0 ? String(undone) : '';
    if (navExam) navExam.textContent = activeGoals > 0 ? String(activeGoals) : '';
    var mLabel = $('#effNavMasteryLabel');
    if (mLabel) mLabel.textContent = String(state.profile.grade || '初二上').replace(/[上下]$/, '') + '必掌握';
    $$('#effNav .eff-nav-btn').forEach(function (btn) {
      var on = btn.getAttribute('data-page') === ui.page;
      btn.classList.toggle('is-active', on);
      if (on) btn.setAttribute('aria-current', 'page'); else btn.removeAttribute('aria-current');
    });
    document.body.setAttribute('data-role', state.role);
    updateTitle();
  }
  function render() {
    if (!state) return;
    var html = '';
    if (ui.page === 'today') html = renderToday();
    else if (ui.page === 'exam') html = renderExam();
    else if (ui.page === 'mastery') html = renderMastery();
    else if (ui.page === 'stars') html = renderStars();
    else if (ui.page === 'rewards') html = renderRewards();
    var pageEl = $('#effPage');
    if (!pageEl) return;
    pageEl.innerHTML = html;
    pageEl.setAttribute('data-page', ui.page);
    renderChrome();
    cloudRenderBadge();
  }

  /* ---------- 7. 页面渲染 · 今天要做 ---------- */
  function subjectChip(subject, small) {
    var cls = 'subject-chip sub-' + (SUB_SHORT[subject] ? subject : '习惯');
    return '<span class="' + cls + '" aria-hidden="true">' + (small ? (SUB_SHORT[subject] || '习') : (SUB_SHORT[subject] || '习')) + '</span>';
  }
  function typeTag(type) {
    return { timer: '计时', recite: '背诵', words: '朗读', dictation: '听写', homework: '作业', habit: '打卡', read: '复习' }[type] || '任务';
  }
  function pageHead(page, opts) {
    opts = opts || {};
    var d = new Date();
    var student = state.role !== 'parent';
    var html = '<header class="page-head">' +
      '<div class="page-head-main">' +
      '<div class="date-tile" aria-hidden="true"><b>' + d.getDate() + '</b><span>' + (d.getMonth() + 1) + '月</span></div>' +
      '<div><h1>' + (opts.icon ? icon(opts.icon) : '') + esc(opts.title || PAGE_TITLES[page]) + '</h1>' +
      '<p class="page-sub">' + (opts.sub || '') + '</p></div>' +
      '</div>' +
      '<div class="page-head-side' + (page === 'today' ? ' has-date' : '') + '">' +
      '<span class="date-text">' + fullDateCN(d.getTime()) + '</span>' +
      (opts.side || '') +
      '</div></header>';
    return html;
  }
  function renderToday() {
    var today = dayKey(Date.now());
    var viewDate = ui.viewDate || today;
    var isToday = viewDate === today;
    var isFuture = viewDate > today;
    var tasks = viewTasks();
    var doneTasks = tasks.filter(function (t) { return t.done; });
    var pendingTasks = tasks.filter(function (t) { return t.pendingApproval; });
    var pendingCount = pendingTasks.length;
    var undone = tasks.length - doneTasks.length - pendingCount;
    var earned = starsForDay(viewDate);
    var subjects = [];
    SUB_ORDER.forEach(function (s) { if (tasks.some(function (t) { return t.subject === s; })) subjects.push(s); });
    tasks.forEach(function (t) { if (subjects.indexOf(t.subject) < 0) subjects.push(t.subject); });
    var tab = ui.tab && (ui.tab === '全部' || subjects.indexOf(ui.tab) >= 0) ? ui.tab : '全部';
    ui.tab = tab;

    var h = pageHead('today', {
      title: isToday ? '今天要做' : (isFuture ? '提前布置' : '历史任务'),
      icon: isToday ? 'sun' : 'calendar',
      sub: isToday
        ? (state.meta && state.meta.requireApproval ? '完成任务后由家长确认，确认后加星' : '按分类添加今天的任务，完成一个就 <b>+1</b> ⭐')
        : (isFuture ? '这是提前布置的任务，到这天会自动出现在今天' : '查看 ' + viewDate + ' 的任务，只能回看/撤销，不能补打卡'),
      side: '<div class="date-view"><input id="effViewDate" type="date" value="' + viewDate + '" aria-label="查看日期"><button class="btn btn-ghost btn-sm" type="button" data-act="view-today">今天</button></div>'
    });

    var meta = state.meta || {};
    var hasLegacyTasks = num(meta.legacyTasks) > 0;
    if (isToday && (meta.demo || meta.demoTasks || hasLegacyTasks) && !meta.noticeDismissed && !ui.demoDismissed) {
      var demoText, demoTitle, demoBadge, demoActions;
      if (hasLegacyTasks) {
        demoTitle = '旧版任务和星星已导入';
        demoBadge = '导入';
        demoText = '已从旧版导入 ' + meta.legacyTasks + ' 条任务和 ' + fmtNum(starTotals().balance) + ' 颗星星。请检查今天的任务、科目和余额；这是真实数据，建议先导出一份备份。';
        demoActions = '<button class="btn btn-ghost btn-xs" type="button" data-act="demo-dismiss">知道了</button>' +
          '<button class="btn btn-primary btn-xs" type="button" data-act="export-data">导出备份</button>';
      } else if (meta.legacy) {
        demoTitle = '旧版星星已导入，任务还是示例';
        demoBadge = '演示';
        demoText = '已导入旧版星星（当前余额 ' + fmtNum(starTotals().balance) + ' 颗）。今天这 11 条是示例任务，不是孩子的真实作业；清空示例后可以让家长添加，或拍照识别。';
        demoActions = '<button class="btn btn-ghost btn-xs" type="button" data-act="demo-dismiss">先看看</button>' +
          '<button class="btn btn-primary btn-xs" type="button" data-act="demo-clean">清空示例</button>';
      } else {
        demoTitle = '你正在看演示数据';
        demoBadge = '演示';
        demoText = '当前是演示数据：11 条示例任务、演示星星和流水，只保存在本机。开始使用会清空演示任务与星星，保留奖励目录。';
        demoActions = '<button class="btn btn-ghost btn-xs" type="button" data-act="demo-dismiss">先看看</button>' +
          '<button class="btn btn-primary btn-xs" type="button" data-act="demo-clean">开始使用</button>';
      }
      h += '<div class="demo-banner" role="status">' +
        '<span class="demo-badge">' + demoBadge + '</span>' +
        '<div class="demo-copy"><strong>' + demoTitle + '</strong><p>' + esc(demoText) + '</p></div>' +
        '<div class="demo-actions">' + demoActions + '</div>' +
        '</div>';
    }

    h += '<div class="stat-row">' +
      '<div class="stat"><b>' + tasks.length + '</b><span>当日任务</span></div>' +
      '<div class="stat is-primary"><b>' + doneTasks.length + '</b><span>已完成</span></div>' +
      '<div class="stat is-gold"><b>' + earned + '</b><span>' + (isToday ? '今日获得' : '当日获得') + ' <i class="star-mini">★</i></span></div>' +
      '</div>';
    if (pendingCount) {
      h += '<div class="approval-banner">' + icon('clock') +
        '<span><strong>' + pendingCount + ' 条任务等家长确认</strong>' +
        (state.role === 'parent' ? '，确认后才会加星星' : '，确认后星星才会到账') + '</span>' +
        (state.role === 'parent' ? '<span class="approval-actions"><button class="btn btn-primary btn-xs" type="button" data-act="approve-all">全部确认</button><button class="btn btn-ghost btn-xs" type="button" data-act="reject-all">全部退回</button></span>' : '') +
        '</div>';
    }

    /* 拍照识别 */
    h += '<section class="recog-card' + (ui.recogBusy ? ' is-busy' : '') + '" aria-label="拍照识别生成任务">' +
      '<div class="recog-ico">' + icon('camera') + '</div>' +
      '<div class="recog-body"><h3>拍照识别 · 生成任务 <span class="badge badge-primary">AI</span></h3>' +
      '<p>拍下老师布置的作业、课程表或通知，自动拆成可打卡的分类任务，可反复使用。</p>';
    if (ui.recog && !ui.recogCands) {
      h += '<div class="recog-preview">' +
        (ui.recog.dataUrl ? '<img class="recog-thumb" src="' + ui.recog.dataUrl + '" alt="待识别图片">' : '') +
        '<span class="recog-file">' + esc(ui.recog.name || '已选择图片') + '</span>' +
        (ui.recogBusy ? '<span class="recog-status"><span class="spinner"></span><b>AI 正在识别…</b></span>' : '') +
        '</div>';
    }
    h += '</div><div class="recog-actions">' +
      '<span class="recog-status">已识别添加 <b>' + tasks.filter(function (t) { return t.isNew; }).length + '</b> 条</span>' +
      '<button class="btn btn-primary" type="button" data-act="pick-photo">' + icon('camera') + '拍照 / 选择图片</button>' +
      '</div>';
    if (ui.recogCands) {
      h += '<div class="recog-result">' +
        '<div class="recog-result-head"><strong>' + icon('sparkles') + 'AI 识别到 ' + ui.recogCands.length + ' 条任务</strong><span class="tiny">确认后加入今天的清单</span></div>' +
        '<div class="recog-result-body">' +
        (ui.recog && ui.recog.dataUrl ? '<img class="recog-shot" src="' + ui.recog.dataUrl + '" alt="上传的作业照片">' : '') +
        '<div class="recog-cands">';
      ui.recogCands.forEach(function (c, i) {
        h += '<label class="recog-item"><input type="checkbox" data-cand="' + i + '" checked><span>' + esc(c.subject + ' · ' + c.title) + '</span><span class="star-pill">+' + c.stars + ' <i>★</i></span></label>';
      });
      h += '</div></div>' +
        '<div class="btn-row"><button class="btn btn-ghost btn-sm" type="button" data-act="cancel-recog">取消</button>' +
        '<button class="btn btn-primary btn-sm" type="button" data-act="confirm-recog">确认添加</button></div></div>';
    }
    h += '</section>';

    /* 分类清单 */
    h += '<section class="section" id="taskListSection">' +
      '<div class="section-head"><div class="section-title">' + icon('book') + '分类任务清单 <small>' + undone + ' 条待完成' + (pendingCount ? ' · ' + pendingCount + ' 条待确认' : '') + '</small></div>' +
      '<div class="section-sub"><span>' + (!isToday ? (isFuture ? '提前布置' : '历史记录') : (state.meta && state.meta.requireApproval ? '提交后等家长确认' : '完成一个 +1 ⭐')) + '</span><span class="meta-dot"></span><button class="section-link" type="button" data-act="open-history">历史完成</button></div></div>';
    if (tasks.length) {
      h += '<div class="chip-row task-tabs" role="tablist" aria-label="按科目筛选">';
      h += '<button class="chip' + (tab === '全部' ? ' is-active' : '') + '" type="button" data-act="tab" data-tab="全部" role="tab" aria-selected="' + (tab === '全部') + '">全部 <span class="chip-num">' + tasks.length + '</span></button>';
      subjects.forEach(function (s) {
        var total = tasks.filter(function (t) { return t.subject === s; }).length;
        h += '<button class="chip' + (tab === s ? ' is-active' : '') + '" type="button" data-act="tab" data-tab="' + esc(s) + '" role="tab" aria-selected="' + (tab === s) + '">' + esc(s) + ' <span class="chip-num">' + total + '</span></button>';
      });
      h += '</div>';

      var groups = (tab === '全部' ? subjects : [tab]).map(function (s) {
        return { subject: s, items: tasks.filter(function (t) { return t.subject === s; }) };
      }).filter(function (g) { return g.items.length; });
      h += '<div class="task-groups">';
      groups.forEach(function (g) {
        var gDone = g.items.filter(function (t) { return t.done; }).length;
        h += '<div class="task-group" data-subject="' + esc(g.subject) + '">' +
          '<div class="task-group-head">' + subjectChip(g.subject) +
          '<div><div class="task-group-name">' + esc(g.subject) + '任务</div>' +
          '<div class="task-group-meta">' + gDone + '/' + g.items.length + ' 已完成</div></div>' +
          '<div class="task-group-right"><div class="mini-progress' + (gDone === g.items.length ? ' is-done' : '') + '"><i style="width:' + Math.round(gDone / g.items.length * 100) + '%"></i></div>' +
          '<span class="task-group-count">' + Math.round(gDone / g.items.length * 100) + '%</span></div></div>' +
          '<div class="task-list">';
        h += g.items.map(function (t) { return taskItemHTML(t); }).join('');
        h += '</div></div>';
      });
      h += '</div>';
    } else {
      h += emptyState(isFuture ? '🗓️' : '🌤️', isToday ? '今天还没有任务' : (isFuture ? '这天还没有提前布置' : '这天没有任务'), isToday ? '点上面的「拍照 / 选择图片」，让 AI 帮你把作业拆成一条条小任务。' : (isFuture ? '点「添加任务」，把作业提前放到这一天。' : '可以回看其他日期，或回到今天。'), state.role === 'parent' && (isToday || isFuture) ? '<button class="btn btn-primary btn-sm" type="button" data-act="add-task">' + icon('plus') + '手动添加任务</button>' : '');
    }
    h += '</section>';

    /* 已完成 */
    if (doneTasks.length) {
      h += '<section class="done-section">' +
        '<button class="done-toggle" type="button" data-act="done-toggle" aria-expanded="' + ui.doneOpen + '">' + icon('chevron') + '已完成 <b>' + doneTasks.length + '</b></button>';
      if (ui.doneOpen) {
        h += '<div class="done-list">' + doneTasks.slice().sort(function (a, b) { return (b.doneAt || 0) - (a.doneAt || 0); }).map(function (t) {
          return '<div class="done-row">' + subjectChip(t.subject, true) +
            '<span class="done-title">' + esc(t.title) + '</span>' +
            '<time>' + (t.doneAt ? pad2(new Date(t.doneAt).getHours()) + ':' + pad2(new Date(t.doneAt).getMinutes()) : '') + '</time>' +
            '<span class="badge badge-gold">+' + t.stars + ' ★</span>' +
            (state.role === 'student' ? '<button class="undo" type="button" data-act="undo-task" data-id="' + esc(t.id) + '">撤销</button>' : '') + '</div>';
        }).join('') + '</div>';
      }
      h += '</section>';
    }

    h += '<p class="hint-line">' + icon('shield') + (state.role === 'parent' ? '家长端可以布置任务、添加奖励、确认考试目标' : '完成情况会自动保存，家长端也能看到你的记录') + '</p>';
    if (state.role === 'parent') {
      h += '<div style="text-align:center;margin-top:12px"><button class="btn btn-ghost btn-sm" type="button" data-act="add-task">' + icon('plus') + '添加一条任务</button></div>';
    }
    return h;
  }

  function taskItemHTML(t) {
    var open = ui.openTask === t.id;
    var isParent = state.role === 'parent';
    var pending = !!t.pendingApproval;
    var h = '<div class="task-item" data-id="' + esc(t.id) + '">' +
      '<div class="task-row' + (t.done ? ' is-done' : '') + (pending ? ' is-pending' : '') + '">' +
      '<button class="tick" type="button" data-act="toggle-task" data-id="' + esc(t.id) + '" aria-label="' + (pending ? '等待家长确认' : (t.done ? '已完成' : '完成任务 ' + t.title)) + '" aria-pressed="' + (t.done || pending) + '"' + (pending ? ' disabled' : '') + '>' + icon(pending ? 'clock' : 'check') + '</button>' +
      '<div class="task-main" data-act="expand-task" data-id="' + esc(t.id) + '" role="button" tabindex="0" aria-expanded="' + open + '" aria-label="展开 ' + esc(t.title) + ' 的学习工具">' +
      '<div class="task-title">' + esc(t.title) + (t.isNew ? '<i class="task-new">AI</i>' : '') + (t.carriedFrom ? '<span class="task-carry">结转</span>' : '') + '</div>' +
      '<div class="task-meta"><span class="tag">' + typeTag(t.type) + '</span>' +
      (t.minutes ? '<span class="meta-dot"></span><span>' + t.minutes + ' 分钟</span>' : '') +
      (t.judge ? '<span class="meta-dot"></span><span>已判题</span>' : '') +
      (t.carriedFrom ? '<span class="meta-dot"></span><span>从 ' + shortDayLabel(t.carriedFrom) + ' 结转</span>' : '') +
      (t.repeat ? '<span class="meta-dot"></span><span>' + repeatLabel(t.repeat) + '</span>' : '') +
      (t.repeatOf ? '<span class="meta-dot"></span><span>重复任务</span>' : '') +
      (pending ? '<span class="meta-dot"></span><span class="pending-text">等家长确认</span>' : '') +
      '</div></div>' +
      '<div class="task-right">' +
      (pending
        ? (isParent
          ? '<div class="pending-actions"><button class="btn btn-primary btn-xs" type="button" data-act="approve-task" data-id="' + esc(t.id) + '">确认 +' + t.stars + '</button><button class="btn btn-ghost btn-xs" type="button" data-act="reject-task" data-id="' + esc(t.id) + '">退回</button></div>'
          : '<span class="badge badge-gold">待确认</span>')
        : '<span class="star-pill">+' + t.stars + ' <i>★</i></span>') +
      '<button class="task-expand" type="button" data-act="expand-task" data-id="' + esc(t.id) + '" aria-expanded="' + open + '" aria-label="' + (open ? '收起' : '展开') + '学习工具">' + icon('chevron') + '</button></div>' +
      '</div>';
    if (open && !t.done) h += taskToolsHTML(t);
    return h + '</div>';
  }

  function taskToolsHTML(t) {
    var h = '<div class="task-tools" data-tools="' + esc(t.id) + '">';
    if (t.type === 'timer') {
      var limit = Math.max(30, num(t.seconds, 300));
      var timer = rt.timers[t.id];
      var remaining = timer ? timer.remaining : limit;
      var pct = clamp(remaining / limit * 100, 0, 100);
      h += '<div class="tools-head"><span class="tools-title">' + icon('clock') + (limit >= 600 ? '专注倒计时' : '口算计时器') + '</span>' +
        '<span class="badge ' + (timer && timer.ended ? 'badge-sage' : 'badge-lilac') + '">' + (timer && timer.ended ? '时间到' : timer && timer.running ? '计时中' : '准备开始') + '</span></div>' +
        '<div class="tools-row">' +
        '<div><div class="timer-display' + (timer && timer.running ? ' is-running' : timer && timer.ended ? ' is-done' : '') + '" data-timer="' + esc(t.id) + '">' + mmss(remaining) + '</div><div class="timer-sub">' + (timer && timer.ended ? '休息一下，可以打勾啦' : '完成后记得回来打勾') + '</div></div>' +
        '<div class="timer-bar"><i data-timerbar="' + esc(t.id) + '" style="width:' + pct + '%"></i></div>' +
        '<button class="btn btn-primary btn-sm" type="button" data-act="timer-start" data-id="' + esc(t.id) + '">' + icon('play') + (timer && timer.running ? '继续' : '开始') + '</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-act="timer-pause" data-id="' + esc(t.id) + '">' + icon('pause') + '暂停</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-act="timer-reset" data-id="' + esc(t.id) + '">' + icon('reset') + '重置</button>' +
        '</div>' +
        '<div class="tools-tip">' + icon('info') + '<span>' + esc(t.hint || '把手机放到一边，专注这一小段时间，结束再打勾。') + '</span></div>';
    } else if (t.type === 'recite') {
      var rec = rt.recording && rt.recording.id === t.id;
      var audio = rt.recordings[t.id];
      h += '<div class="tools-head"><span class="tools-title">' + icon('mic') + '背诵录音</span>' +
        '<span class="badge ' + (rec ? 'badge-primary' : audio ? 'badge-sage' : 'badge-muted') + '">' + (rec ? '录音中' : audio ? '已录音 · 可回放' : '未录音') + '</span></div>';
      if (t.passage) h += '<div class="passage">' + esc(t.passage) + '</div>';
      h += '<div class="tools-row" style="margin-top:9px">' +
        '<span class="rec-dot' + (rec ? ' is-live' : '') + '"></span>' +
        '<span class="rec-state' + (rec ? ' is-live' : '') + '">' + (rec ? '正在录音，读完点停止' : '先读一遍，再录一遍') + '</span>' +
        '<button class="btn btn-soft btn-sm" type="button" data-act="record-start" data-id="' + esc(t.id) + '"' + (rec ? ' disabled' : '') + '>' + icon('mic') + '开始录音</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-act="record-stop" data-id="' + esc(t.id) + '"' + (rec ? '' : ' disabled') + '>' + icon('pause') + '停止</button>';
      if (audio) h += '<audio controls src="' + audio + '" style="height:32px;max-width:200px"></audio>';
      h += '<button class="btn btn-ghost btn-sm" type="button" data-act="speak-task" data-id="' + esc(t.id) + '">' + icon('volume') + '听一遍</button>' +
        '</div><div class="tools-tip">' + icon('info') + '<span>麦克风不可用时可以直接打勾完成，家长端仍能看到记录。</span></div>';
    } else if (t.type === 'words') {
      h += '<div class="tools-head"><span class="tools-title">' + icon('volume') + '朗读单词</span>' +
        '<button class="btn btn-soft btn-xs" type="button" data-act="speak-words" data-id="' + esc(t.id) + '">' + icon('play') + '连续播放</button></div>' +
        '<div class="word-grid">' + (t.words || []).map(function (w) {
          return '<span class="word-chip">' + esc(w) + '<button type="button" data-act="speak-text" data-text="' + esc(w) + '" data-lang="en-US" aria-label="朗读 ' + esc(w) + '">' + icon('volume') + '</button></span>';
        }).join('') + '</div>' +
        '<div class="tools-tip">' + icon('info') + '<span>先听一遍，再自己读一遍，最后打勾完成。</span></div>';
    } else if (t.type === 'dictation') {
      var show = !!ui.answers[t.id];
      h += '<div class="tools-head"><span class="tools-title">' + icon('volume') + '听写练习</span>' +
        '<div class="tools-row"><button class="btn btn-soft btn-xs" type="button" data-act="speak-pairs" data-id="' + esc(t.id) + '">' + icon('play') + '逐个播放</button>' +
        '<button class="btn btn-ghost btn-xs" type="button" data-act="toggle-answer" data-id="' + esc(t.id) + '">' + (show ? '隐藏答案' : '显示答案') + '</button></div></div>' +
        '<div class="word-grid">' + (t.pairs || []).map(function (p) {
          return '<span class="word-chip">' + esc(p[0]) + '<button type="button" data-act="speak-text" data-text="' + esc(p[0]) + '" data-lang="en-US" aria-label="朗读 ' + esc(p[0]) + '">' + icon('volume') + '</button>' +
            (show ? '<span class="word-answer">→ ' + esc(p[1]) + '</span>' : '') + '</span>';
        }).join('') + '</div>' +
        '<div class="tools-tip">' + icon('info') + '<span>先盖住答案听写，写完再点「显示答案」自己批改。</span></div>';
    } else if (t.type === 'homework') {
      var j = rt.judge[t.id] || t.judge;
      h += '<div class="tools-head"><span class="tools-title">' + icon('camera') + '作业拍照 · 小搭分析</span>' +
        '<span class="badge ' + (j && !j.busy ? (j.ok ? 'badge-sage' : 'badge-gold') : 'badge-muted') + '">' + (j && j.busy ? '小搭正在看…' : j ? (j.ok ? '已分析' : '已保存照片') : '未上传') + '</span></div>' +
        '<div class="tools-row"><button class="btn btn-primary btn-sm" type="button" data-act="judge-homework" data-id="' + esc(t.id) + '">' + icon('camera') + '拍照 / 让小搭分析</button>' +
        '<span class="tiny muted">结果会保存在任务里，家长端可见</span></div>';
      if (j && !j.busy) {
        h += '<div class="homework-result">' +
          (j.thumb ? '<img class="homework-shot" src="' + esc(j.thumb) + '" alt="作业照片">' : '') +
          '<div class="homework-copy">' + (j.ok ? icon('check') : icon('info')) +
          '<span>' + esc(j.text || '已上传照片，但没有可分析的文字结果。') + '</span></div></div>';
      }
      h += '<div class="tools-tip">' + icon('info') + '<span>拍清楚题面再上传，小搭会先识别科目/题号，再指出空题或可疑错误，只给思路和第一步。</span></div>';
    } else if (t.type === 'read') {
      if (t.passage) h += '<div class="passage">' + esc(t.passage) + '</div>';
      h += '<div class="tools-row" style="margin-top:9px">' +
        '<button class="btn btn-soft btn-sm" type="button" data-act="speak-task" data-id="' + esc(t.id) + '">' + icon('volume') + '朗读知识点</button>' +
        '<button class="btn btn-ghost btn-sm" type="button" data-act="judge-homework" data-id="' + esc(t.id) + '">' + icon('camera') + '拍笔记检查</button></div>' +
        '<div class="tools-tip">' + icon('info') + '<span>读完后用自己的话讲一遍，讲得清楚再打勾。</span></div>';
    } else {
      h += '<div class="tools-head"><span class="tools-title">' + icon('check') + '生活习惯打卡</span>' +
        '<span class="badge badge-sage">完成后 +' + t.stars + ' ★</span></div>' +
        '<div class="tools-row"><span class="rec-note">' + (t.subject === '运动' ? '运动前先热身，量力而行，做完记得补水。' : '做完自己的事，再回来打勾，家长端会看到记录。') + '</span>' +
        '<button class="btn btn-primary btn-sm" type="button" data-act="toggle-task" data-id="' + esc(t.id) + '">' + icon('check') + '完成打卡</button></div>';
    }
    if (state.role === 'parent') {
      h += '<div class="tools-admin"><span class="tiny muted">家长操作</span>' +
        '<button class="btn btn-ghost btn-xs" type="button" data-act="edit-task" data-id="' + esc(t.id) + '">' + icon('edit') + '编辑</button>' +
        '<button class="btn btn-ghost btn-xs" type="button" data-act="delete-task" data-id="' + esc(t.id) + '">' + icon('trash') + '删除</button></div>';
    }
    return h + '</div>';
  }

  function emptyState(emoji, title, desc, action) {
    return '<div class="empty"><span class="empty-emoji" aria-hidden="true">' + emoji + '</span><strong>' + esc(title) + '</strong><p>' + esc(desc) + '</p>' + (action || '') + '</div>';
  }
  function openTaskHistory() {
    var today = dayKey(Date.now());
    var hist = state.tasks.filter(function (t) { return t.done && t.date && t.date < today; })
      .sort(function (a, b) { return (b.doneAt || 0) - (a.doneAt || 0); });
    var body;
    if (!hist.length) {
      body = '<div class="empty" style="padding:24px"><span class="empty-emoji">🗂️</span><strong>还没有历史完成</strong><p>任务完成后会在第二天进入这里，方便回看。</p></div>';
    } else {
      body = '<div class="history-list">' + hist.slice(0, 60).map(function (t) {
        return '<div class="history-row"><span class="history-ico" aria-hidden="true">★</span>' +
          '<div class="history-main"><strong>' + esc(t.title) + '</strong><small>' + shortDayLabel(t.date) + ' · ' + esc(t.subject) + '</small></div>' +
          '<span class="history-cost">+' + t.stars + ' ★</span></div>';
      }).join('') + '</div>' +
        (hist.length > 60 ? '<p class="hint-line">只显示最近 60 条</p>' : '');
    }
    openModal({
      title: '历史完成', icon: 'calendar',
      sub: '按完成日期倒序，最多显示最近 60 条',
      body: body,
      footer: '<button class="btn btn-ghost" type="button" data-close>关闭</button>'
    });
  }

  /* ---------- 8. 页面渲染 · 考试赚星星 ---------- */
  function renderExam() {
    var goals = state.examGoals;
    var done = goals.filter(function (g) { return g.done; });
    var earned = 0;
    state.log.forEach(function (e) { if (e.kind === 'exam') earned += num(e.delta); });
    earned = Math.max(0, earned);
    var isParent = state.role === 'parent';
    var h = pageHead('exam', {
      title: '考试赚星星',
      icon: 'target',
      sub: '给自己定一个期末目标，达成后家长确认，星星就到账',
      side: '<span class="badge badge-lilac">' + (isParent ? '家长端 · 可确认' : '学生端 · 等家长确认') + '</span>'
    });
    h += '<div class="exam-summary">' +
      '<div class="exam-stat is-lilac"><span class="exam-stat-ico">' + icon('target') + '</span><b>' + goals.length + '</b><span>目标总数</span></div>' +
      '<div class="exam-stat is-sage"><span class="exam-stat-ico">' + icon('check') + '</span><b>' + done.length + '</b><span>已达成</span></div>' +
      '<div class="exam-stat is-gold"><span class="exam-stat-ico">' + icon('star') + '</span><b>' + earned + '</b><span>获得星星 ★</span></div>' +
      '</div>';
    h += '<section class="section" style="margin-top:0"><div class="section-head">' +
      '<div class="section-title">' + icon('target') + '期末目标清单 <small>' + goals.length + ' 个科目</small></div>' +
      (isParent ? '<button class="btn btn-ghost btn-sm" type="button" data-act="add-exam">' + icon('plus') + '添加目标</button>' : '<span class="section-sub">达成后由家长确认</span>') +
      '</div>';
    if (!goals.length) {
      h += emptyState('🎯', '还没有考试目标', '和家长一起定一个跳一跳够得着的分数，达成就能拿星星。', isParent ? '<button class="btn btn-primary btn-sm" type="button" data-act="add-exam">添加目标</button>' : '');
    } else {
      h += '<div class="exam-list">';
      goals.forEach(function (g) {
        h += '<div class="exam-row' + (g.done ? ' is-done' : '') + '" data-goal="' + esc(g.id) + '">' + subjectChip(g.subject) +
          '<div class="exam-info">' +
          '<div class="exam-name">' + esc(g.title) + ' <span class="score">' + g.target + ' 分</span>' +
          (g.done ? '<span class="badge badge-sage">已达成</span>' : '<span class="badge badge-muted">进行中</span>') + '</div>' +
          '<div class="exam-meta"><span class="star-pill">+' + g.stars + ' <i>★</i></span><span>奖励星星</span>' +
          (g.from != null ? '<span class="meta-dot"></span><span>起点 ' + esc(g.from) + ' 分</span>' : '') +
          '<span class="meta-dot"></span><span>' + (g.done ? '已发放' : '家长确认后发放') + '</span></div>' +
          '</div>' +
          '<div class="exam-actions">';
        if (isParent) {
          h += '<button class="icon-btn" type="button" data-act="edit-exam" data-id="' + esc(g.id) + '" aria-label="编辑考试目标" title="编辑考试目标">' + icon('edit') + '</button>';
          h += g.done
            ? '<button class="btn btn-ghost btn-xs" type="button" data-act="exam-undo" data-id="' + esc(g.id) + '">' + icon('reset') + '撤销</button>'
            : '<button class="btn btn-gold btn-sm" type="button" data-act="exam-done" data-id="' + esc(g.id) + '">' + icon('check') + '标记达成</button>';
        } else {
          h += g.done
            ? '<span class="exam-done-mark">' + icon('check') + '已获得 +' + g.stars + ' ★</span>'
            : '<span class="tiny muted">' + icon('lock') + ' 等家长确认</span>';
        }
        h += '</div></div>';
      });
      h += '</div>';
    }
    h += '<div class="exam-foot"><div class="exam-tip">' + icon('sparkles') + '<span>目标要具体：写清科目、目标分数和奖励星星，达成时家长点一下就能发放。</span></div>' +
      (isParent ? '<button class="btn btn-primary btn-sm" type="button" data-act="add-exam">' + icon('plus') + '添加目标</button>' : '') + '</div>';
    h += '</section>';
    return h;
  }

  /* ---------- 9. 页面渲染 · 必掌握 ---------- */
  function renderMastery() {
    var grade = state.profile.grade || '初二上';
    var items = state.mastery.filter(function (m) { return (m.grade || '初二上') === grade; });
    var known = items.filter(function (m) { return m.known; }).length;
    var total = items.length;
    var pct = total ? Math.round(known / total * 100) : 0;
    var h = pageHead('mastery', {
      title: String(grade).replace(/[上下]$/, '') + '必掌握',
      icon: 'cap',
      sub: '本学期古诗文、单词、公式和物理概念，点开一组逐个过关',
      side: '<span class="badge badge-lilac">' + known + ' / ' + total + ' 已掌握</span>'
    });
    h += '<div class="mastery-hero">' +
      '<div class="mastery-ring" style="--p:' + pct + '" role="img" aria-label="已掌握 ' + pct + '%"><div><b>' + pct + '%</b><small>掌握度</small></div></div>' +
      '<div class="mastery-hero-body"><h3>' + (pct >= 80 ? '已经很稳了，再巩固一下细节' : pct >= 40 ? '继续推进，把薄弱项补上' : '从今天开始，一次攻一个小点') + '</h3>' +
      '<p>点击卡片右边的 ✓ 标记掌握，点小喇叭可以朗读。</p>' +
      '<div class="progress"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="mastery-hero-side"><span class="badge badge-gold">' + Math.max(0, total - known) + ' 项待掌握</span></div>' +
      '</div>';
    if (!items.length) {
      h += emptyState('📚', '这个年级还没有必掌握内容', '目前只配置了初二上（24 项）。可以在「更多 → 修改昵称 / 年级」里切回初二上。');
      return h;
    }

    var subjects = ['语文', '英语', '数学', '物理'];
    items.forEach(function (m) { if (subjects.indexOf(m.subject) < 0) subjects.push(m.subject); });
    h += '<div class="mastery-groups">';
    subjects.forEach(function (sub) {
      var list = items.filter(function (m) { return m.subject === sub; });
      if (!list.length) return;
      var gKnown = list.filter(function (m) { return m.known; }).length;
      var meta = MASTERY_GROUPS[sub] || { label: '必掌握', desc: '逐个过关', ico: 'book' };
      var open = !!ui.masteryOpen[sub];
      h += '<div class="mastery-group">' +
        '<button class="mastery-head" type="button" data-act="mastery-group" data-subject="' + esc(sub) + '" aria-expanded="' + open + '">' + subjectChip(sub) +
        '<div class="mastery-head-copy"><strong>' + esc(meta.label) + ' <span class="badge badge-muted">' + esc(sub) + '</span></strong><small>' + esc(meta.desc) + '</small></div>' +
        '<div class="mastery-head-right"><div class="mini-progress' + (gKnown === list.length ? ' is-done' : '') + '"><i style="width:' + Math.round(gKnown / list.length * 100) + '%"></i></div>' +
        '<span class="tiny muted">' + gKnown + '/' + list.length + '</span><span class="mastery-chev">' + icon('chevron') + '</span></div></button>';
      if (open) {
        h += '<div class="mastery-body"><div class="mastery-grid">' + list.map(function (m) {
          var speakText = m.lang === 'en-US' ? m.title : (m.title + (m.detail ? '。' + m.detail : ''));
          return '<div class="know-card' + (m.known ? ' is-known' : '') + '" data-know="' + esc(m.id) + '">' +
            '<div class="know-main"><div class="know-title">' + (m.known ? '<span class="known-dot"></span>' : '') + esc(m.title) + '</div>' +
            '<div class="know-detail">' + esc(m.detail || '') + '</div></div>' +
            '<div class="know-actions">' +
            '<button class="icon-btn" type="button" data-act="speak-text" data-text="' + esc(speakText) + '" data-lang="' + (m.lang || 'zh-CN') + '" aria-label="朗读 ' + esc(m.title) + '">' + icon('volume') + '</button>' +
            '<button class="icon-btn' + (m.known ? ' is-on' : '') + '" type="button" data-act="mastery-toggle" data-id="' + esc(m.id) + '" aria-label="' + (m.known ? '取消掌握' : '标记掌握') + '" aria-pressed="' + !!m.known + '">' + icon(m.known ? 'check' : 'plus') + '</button>' +
            '</div></div>';
        }).join('') + '</div></div>';
      }
      h += '</div>';
    });
    h += '</div>';
    h += '<p class="hint-line">' + icon('info') + '标记会保存在本机，家长端也可以看到你的掌握进度。</p>';
    return h;
  }

  /* ---------- 10. 页面渲染 · 我的星星 ---------- */
  function starMapByDay() {
    var map = {};
    for (var i = 0; i < state.log.length; i++) {
      var e = state.log[i];
      if (e.delta > 0) {
        var k = dayKey(e.ts);
        map[k] = (map[k] || 0) + e.delta;
      }
    }
    return map;
  }
  function renderStars() {
    var totals = starTotals();
    var streak = streakDays();
    var checkins = checkinCount();
    var h = pageHead('stars', {
      title: '我的星星',
      icon: 'trophy',
      sub: '每一颗星星都是认真换来的，看看这个月的收获',
      side: '<span class="badge badge-gold">连续打卡 ' + streak + ' 天</span>'
    });
    h += '<div class="star-overview">' +
      '<div class="star-stat is-earned"><div class="star-stat-ico">' + icon('sparkles') + '</div><b>' + fmtNum(totals.earned) + '<small>颗</small></b><span class="star-stat-label">累计星星</span></div>' +
      '<div class="star-stat is-used"><div class="star-stat-ico">' + icon('gift') + '</div><b>' + fmtNum(totals.used) + '<small>颗</small></b><span class="star-stat-label">已用星星</span></div>' +
      '<div class="star-stat is-left"><div class="star-stat-ico">' + icon('wallet') + '</div><b>' + fmtNum(totals.balance) + '<small>颗</small></b><span class="star-stat-label">剩余星星</span></div>' +
      '</div>';
    h += '<div class="streak-banner"><span class="streak-flame" aria-hidden="true">🔥</span>' +
      '<div class="streak-copy"><strong>连续打卡 <b>' + streak + '</b> 天</strong><small>累计打卡 ' + checkins + ' 次 · 今天也来完成一件小事吧</small></div>' +
      '<div class="streak-dots" aria-hidden="true">';
    for (var i = 6; i >= 0; i--) {
      var dt = new Date(); dt.setDate(dt.getDate() - i);
      var on = state.log.some(function (e) { return e.delta > 0 && dayKey(e.ts) === dayKey(dt.getTime()); });
      h += '<span class="streak-dot' + (on ? ' is-on' : '') + '"></span>';
    }
    h += '</div></div>';

    if (!ui.calMonth) {
      var now = new Date();
      ui.calMonth = { y: now.getFullYear(), m: now.getMonth() };
    }
    var y = ui.calMonth.y, m = ui.calMonth.m;
    var first = new Date(y, m, 1);
    var offset = first.getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var starMap = starMapByDay();
    var todayKey = dayKey(Date.now());
    var cells = [];
    var i2;
    for (i2 = 0; i2 < offset; i2++) cells.push('<div class="cal-day is-blank" aria-hidden="true"></div>');
    for (var day = 1; day <= daysInMonth; day++) {
      var dObj = new Date(y, m, day);
      var k = dayKey(dObj.getTime());
      var s = starMap[k] || 0;
      var isToday = k === todayKey;
      var future = dObj.getTime() > startOfDay(new Date()).getTime();
      cells.push('<div class="cal-day' + (s > 0 ? ' has-star' : '') + (isToday ? ' is-today' : '') + (future ? ' is-future' : '') + '" title="' + (m + 1) + '月' + day + '日 · ' + (s > 0 ? s + ' 颗星星' : '暂无星星') + '">' +
        (isToday ? '<span class="cal-today-tag">今天</span>' : '') +
        '<span class="cal-num">' + day + '</span>' +
        (s > 0 ? '<span class="cal-stars"><i>★</i>' + s + '</span>' : '') + '</div>');
    }
    var tail = (7 - (cells.length % 7)) % 7;
    for (i2 = 0; i2 < tail; i2++) cells.push('<div class="cal-day is-blank" aria-hidden="true"></div>');

    h += '<div class="star-layout">' +
      '<section class="calendar-card" aria-label="星星月历">' +
      '<div class="cal-head"><div class="cal-title">' + icon('calendar') + y + '年' + (m + 1) + '月</div>' +
      '<div class="cal-nav"><button class="cal-nav-btn" type="button" data-act="cal-prev" aria-label="上个月">' + icon('arrowLeft') + '</button>' +
      '<button class="cal-today-btn" type="button" data-act="cal-today">回本月</button>' +
      '<button class="cal-nav-btn" type="button" data-act="cal-next" aria-label="下个月">' + icon('arrowRight') + '</button></div></div>' +
      '<div class="cal-week">' + WEEK_CN.map(function (w) { return '<span>' + w + '</span>'; }).join('') + '</div>' +
      '<div class="cal-grid">' + cells.join('') + '</div>' +
      '<div class="cal-legend"><span><i></i>当天有星星</span><span class="lg-today"><i></i>今天</span><span class="lg-empty"><i></i>未打卡</span></div>' +
      '</section>' +
      '<section class="flow-card" aria-label="星星流水"><div class="flow-head"><div class="card-title">' + icon('sparkles') + '星星流水</div><span class="tiny muted">最近 ' + Math.min(60, state.log.length) + ' 条</span></div>' +
      '<div class="flow-list">';
    if (!state.log.length) {
      h += '<div class="flow-empty">还没有星星记录，去「今天要做」完成第一个任务吧。</div>';
    } else {
      state.log.slice(0, 60).forEach(function (e) {
        var pos = e.delta > 0;
        var ico = e.kind === 'reward' ? '🎁' : e.kind === 'exam' ? '🏆' : e.kind === 'bonus' ? '🎉' : e.kind === 'undo' ? '↩️' : '⭐';
        h += '<div class="flow-item"><span class="flow-ico ' + (pos ? 'is-earn' : 'is-use') + '" aria-hidden="true">' + ico + '</span>' +
          '<div class="flow-main"><strong>' + esc(e.reason) + '</strong><small>' + dateLabel(e.ts) + '</small></div>' +
          '<span class="flow-delta ' + (pos ? 'pos' : 'neg') + '">' + (pos ? '+' : '−') + Math.abs(e.delta) + ' ★</span></div>';
      });
    }
    h += '</div></section></div>';
    return h;
  }

  /* ---------- 11. 页面渲染 · 我的要兑换 ---------- */
  function renderRewards() {
    var totals = starTotals();
    var balance = totals.balance;
    var cats = REWARD_CATS;
    var cat = cats.indexOf(ui.rewardCat) > 0 ? ui.rewardCat : '全部';
    ui.rewardCat = cat;
    var list = state.rewards.filter(function (r) { return cat === '全部' || r.cat === cat; });
    var isParent = state.role === 'parent';
    var h = pageHead('rewards', {
      title: '我的要兑换',
      icon: 'gift',
      sub: '用努力换来的星星，兑换喜欢的小奖励吧'
    });
    h += '<div class="reward-hero">' +
      '<div class="reward-hero-ico" aria-hidden="true">🎁</div>' +
      '<div class="reward-hero-copy"><strong>可用星星 <b>' + fmtNum(balance) + '</b> 颗</strong><small>累计获得 ' + fmtNum(totals.earned) + ' 颗 · 已用 ' + fmtNum(totals.used) + ' 颗</small></div>' +
      '<div class="reward-hero-side">' +
      (isParent ? '<button class="btn btn-ghost btn-sm" type="button" data-act="add-reward">' + icon('plus') + '添加奖励</button>' : '<span class="badge badge-gold">完成 1 个任务 = 1 颗起</span>') +
      '</div></div>';
    h += '<div class="section" style="margin-top:0"><div class="section-head">' +
      '<div class="section-title">' + icon('gift') + '可兑换的奖励 <small>' + state.rewards.length + ' 个</small></div>' +
      '<div class="section-sub">星星够了就能兑换</div></div>';
    h += '<div class="chip-row reward-cats" role="tablist" aria-label="奖励分类">' + cats.map(function (c) {
      var n = c === '全部' ? state.rewards.length : state.rewards.filter(function (r) { return r.cat === c; }).length;
      return '<button class="chip' + (cat === c ? ' is-active' : '') + '" type="button" data-act="reward-cat" data-cat="' + esc(c) + '" role="tab" aria-selected="' + (cat === c) + '">' + esc(c) + ' <span class="chip-num">' + n + '</span></button>';
    }).join('') + '</div>';

    if (!list.length) {
      h += emptyState('🎁', '这个分类还没有奖励', '换个分类看看，或者让家长添加一个想要的心愿奖励。', isParent ? '<button class="btn btn-primary btn-sm" type="button" data-act="add-reward">添加奖励</button>' : '');
    } else {
      h += '<div class="reward-grid">' + list.map(function (r) {
        var short = balance < r.cost;
        var times = state.redemptions.filter(function (x) { return x.rewardId === r.id; }).length;
        return '<div class="reward-card' + (times ? ' has-times' : '') + '" data-reward="' + esc(r.id) + '">' +
          (isParent ? '<button class="reward-admin" type="button" data-act="edit-reward" data-id="' + esc(r.id) + '" aria-label="编辑奖励" title="编辑奖励">' + icon('edit') + '</button>' : '') +
          (times ? '<div class="reward-times">已兑换 ' + times + ' 次</div>' : '') +
          '<div class="reward-ico cat-' + esc(r.cat) + '" aria-hidden="true">' + esc(r.icon) + '</div>' +
          '<div class="reward-name" title="' + esc(r.detail || '') + '">' + esc(r.name) + '</div>' +
          (r.detail ? '<div class="reward-detail" title="' + esc(r.detail) + '">' + esc(r.detail) + '</div>' : '') +
          '<div class="reward-cost" title="' + (r.price ? '真实价 ¥' + esc(r.price) + ' · 20 元 = 1 颗星' : '') + '"><i>★</i>' + r.cost + ' 颗</div>' +
          '<button class="reward-btn' + (short ? ' is-short' : '') + '" type="button" data-act="redeem" data-id="' + esc(r.id) + '">' + (short ? '还差 ' + (r.cost - balance) + ' ★' : '立即兑换') + '</button>' +
          '</div>';
      }).join('') + '</div>';
    }
    h += '</div>';

    h += '<section class="reward-history"><div class="section-head"><div class="section-title">' + icon('clock') + '兑换记录</div><span class="section-sub">兑换后请找家长领取</span></div>';
    if (!state.redemptions.length) {
      h += '<div class="empty" style="padding:24px"><span class="empty-emoji">🧾</span><strong>还没有兑换记录</strong><p>攒够星星后，来这里换第一个奖励。</p></div>';
    } else {
      h += '<div class="history-list">' + state.redemptions.slice(0, 10).map(function (x) {
        return '<div class="history-row"><span class="history-ico" aria-hidden="true">' + esc(x.icon || '🎁') + '</span>' +
          '<div class="history-main"><strong>' + esc(x.name) + '</strong><small>' + dateLabel(x.ts) + ' · 已找家长领取</small></div>' +
          '<span class="history-cost">−' + x.cost + ' ★</span></div>';
      }).join('') + '</div>';
    }
    h += '</section>';
    return h;
  }

  /* ---------- 12. 弹窗 / 提示 / 反馈 ---------- */
  var toastTimer = null;
  function toast(msg, type) {
    var el = $('#effToast');
    if (!el) return;
    var glyph = type === 'success' ? '✅' : type === 'warn' ? '⚠️' : type === 'gold' ? '⭐' : '💬';
    el.className = 'eff-toast is-show' + (type ? ' is-' + type : '');
    el.innerHTML = '<span class="toast-ico" aria-hidden="true">' + glyph + '</span><span class="toast-text">' + esc(msg) + '</span>';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-show'); }, 2800);
  }
  function openModal(opts) {
    opts = opts || {};
    var root = $('#effModalRoot');
    if (!root) return;
    rt.lastFocus = document.activeElement;
    root.innerHTML = '<div class="modal-backdrop" data-close></div>' +
      '<div class="modal' + (opts.wide ? ' is-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="effModalTitle">' +
      '<div class="modal-head"><div class="modal-head-copy"><h3 id="effModalTitle">' + (opts.icon ? icon(opts.icon) : '') + esc(opts.title || '') + '</h3>' +
      (opts.sub ? '<p>' + esc(opts.sub) + '</p>' : '') + '</div>' +
      '<button class="modal-x" type="button" data-close aria-label="关闭弹窗">×</button></div>' +
      '<div class="modal-body">' + (opts.body || '') + '</div>' +
      (opts.footer ? '<div class="modal-foot">' + opts.footer + '</div>' : '') +
      '</div>';
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    rt.modalOpen = true;
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var f = root.querySelector('input, select, textarea, .modal-foot .btn-primary, .modal-foot .btn');
      if (f) { try { f.focus(); } catch (e) { } }
    }, 30);
  }
  function closeModal() {
    var root = $('#effModalRoot');
    if (!root) return;
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '';
    rt.modalOpen = false;
    rt.confirm = null;
    pendingImport = null;
    rt.chatImage = null;
    document.body.style.overflow = '';
    if (rt.lastFocus && typeof rt.lastFocus.focus === 'function') { try { rt.lastFocus.focus(); } catch (e) { } }
    rt.lastFocus = null;
  }
  function burstAt(x, y, count) {
    var layer = $('#effBurstLayer');
    if (!layer || !isFinite(x) || !isFinite(y)) return;
    var ring = document.createElement('span');
    ring.className = 'burst-ring';
    ring.style.left = (x - 11) + 'px';
    ring.style.top = (y - 11) + 'px';
    layer.appendChild(ring);
    setTimeout(function () { if (ring.parentNode) ring.parentNode.removeChild(ring); }, 800);
    var chars = ['★', '✦', '✧', '⭐', '✧'];
    var n = count || 9;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var s = document.createElement('span');
        s.className = 'burst-star' + (i % 3 === 0 ? ' accent' : i % 3 === 1 ? ' lilac' : '');
        s.textContent = chars[i % chars.length];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        var ang = (-Math.PI / 2) + (Math.random() - 0.5) * 2.6;
        var dist = 46 + Math.random() * 96;
        s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(1) + 'px');
        s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(1) + 'px');
        s.style.setProperty('--rot', (Math.random() * 360 - 180).toFixed(0) + 'deg');
        s.style.setProperty('--sc', (0.7 + Math.random() * 0.7).toFixed(2));
        s.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
        layer.appendChild(s);
        setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1200);
      })(i);
    }
  }
  function burstAtEl(el, count) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  /* ---------- 13. 角色 / 资料 / 更多 ---------- */
  function setRole(role) {
    if (role === 'parent') { grantParent(); return; }
    state.role = 'student';
    safeSessionRemove('lc_parent_ok');
    save();
    closeModal();
    render();
    toast('已切换到学生端：完成任务赚星星吧', 'success');
  }
  function simplePinHash(pin) {
    var h = 5381;
    var s = 'lc_pin_v1:' + pin;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'f' + (h >>> 0).toString(16);
  }
  function hashPin(pin) {
    return new Promise(function (resolve) {
      try {
        if (window.crypto && window.crypto.subtle && window.TextEncoder) {
          window.crypto.subtle.digest('SHA-256', new TextEncoder().encode('lc_pin_v1:' + pin)).then(function (buf) {
            var arr = Array.prototype.slice.call(new Uint8Array(buf));
            resolve(arr.map(function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''));
          }).catch(function () { resolve(simplePinHash(pin)); });
          return;
        }
      } catch (e) { }
      resolve(simplePinHash(pin));
    });
  }
  function grantParent() {
    state.role = 'parent';
    safeSessionSet('lc_parent_ok', '1');
    save();
    closeModal();
    render();
    toast('已进入家长端：可以布置任务和确认奖励', 'success');
  }
  function requestParentAccess() {
    if (state.role === 'parent') return;
    if (state.meta && state.meta.parentPin) openPinEntry();
    else openPinSetup();
  }
  function openPinSetup() {
    openModal({
      title: state.meta && state.meta.parentPin ? '修改家长 PIN' : '设置家长 PIN', icon: 'lock',
      sub: '用于切换家长端、发放奖励和确认考试',
      body: '<div class="form-grid">' +
        '<div class="field field-full"><label for="pin1">4–6 位数字 PIN</label><input id="pin1" type="password" inputmode="numeric" maxlength="6" placeholder="例如 1234"></div>' +
        '<div class="field field-full"><label for="pin2">再输一次</label><input id="pin2" type="password" inputmode="numeric" maxlength="6" placeholder="再输一次"></div>' +
        '</div><p class="form-note" style="margin-top:11px">PIN 只保存在这台设备（加盐哈希）。忘记 PIN 只能清除本机数据重来，请记好。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="save-pin">' + icon('check') + '保存 PIN</button>'
    });
  }
  function submitPinSetup() {
    var p1 = (($('#pin1') || {}).value || '').trim();
    var p2 = (($('#pin2') || {}).value || '').trim();
    if (!/^\d{4,6}$/.test(p1)) { toast('PIN 需要 4–6 位数字', 'warn'); return; }
    if (p1 !== p2) { toast('两次输入的 PIN 不一致', 'warn'); return; }
    hashPin(p1).then(function (h) {
      state.meta.parentPin = h;
    state.meta.parentPinAt = Date.now();
      save();
      grantParent();
      toast('家长 PIN 已保存', 'success');
    });
  }
  function openPinEntry() {
    openModal({
      title: '家长验证', icon: 'lock',
      sub: '输入家长 PIN 才能进入家长端',
      body: '<div class="field"><label for="pinEntry">家长 PIN</label><input id="pinEntry" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="请输入 4–6 位 PIN"></div>' +
        '<p class="form-note" style="margin-top:11px">忘记 PIN 只能在设备上清除本机数据后重来；旧版数据不会受影响。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="verify-pin">' + icon('lock') + '验证并进入</button>'
    });
  }
  function submitPinVerify() {
    var v = (($('#pinEntry') || {}).value || '').trim();
    if (!v) { toast('请输入家长 PIN', 'warn'); return; }
    hashPin(v).then(function (h) {
      if (h === (state.meta.parentPin || '')) {
        grantParent();
      } else {
        toast('PIN 不对，再试一次', 'warn');
        var el = $('#pinEntry');
        if (el) { el.value = ''; el.focus(); }
      }
    });
  }
  function openRoleModal() {
    var s = state.role === 'parent';
    var body = '<div class="role-grid">' +
      '<button class="role-option' + (!s ? ' is-active' : '') + '" type="button" data-act="set-role" data-role="student">' +
      '<span class="role-ico">🧒</span><strong>学生端</strong><span>完成任务、打卡赚星、兑换奖励</span>' + (!s ? '<em class="role-now">当前</em>' : '') + '</button>' +
      '<button class="role-option' + (s ? ' is-active' : '') + '" type="button" data-act="choose-parent">' +
      '<span class="role-ico">👩</span><strong>家长端</strong><span>布置任务、添加奖励、确认考试达成</span>' + (s ? '<em class="role-now">当前</em>' : '') + '</button>' +
      '</div>' +
      '<p class="form-note" style="margin-top:11px">进入家长端需要 PIN' + (state.meta && state.meta.parentPin ? '；PIN 已设置。' : '，第一次进入会先设置。') + '</p>';
    openModal({
      title: '切换身份', icon: 'users',
      sub: '学生完成任务，家长布置与确认',
      body: body,
      footer: (s ? '<button class="btn btn-ghost" type="button" data-act="open-pin">修改家长 PIN</button>' : '') +
        '<button class="btn btn-ghost" type="button" data-close>取消</button>'
    });
  }
  function chatToken() {
    return safeGet('lc_tok') || safeGet('lc_demo_tok') || '';
  }
  function chatTime(ts) {
    var d = new Date(ts);
    return pad2(d.getHours()) + ':' + pad2(d.getMinutes());
  }
  function chatMessagesHTML() {
    var msgs = state.chat.slice(-80);
    if (!msgs.length) {
      return '<div class="chat-empty"><span>☁️</span><strong>我是小搭</strong><p>题不会、今天有点累、想说说学校的事，都可以跟我说。<br>旧版的聊天记录已经搬过来了。</p></div>';
    }
    return msgs.map(function (m) {
      if (m.pending) {
        return '<div class="chat-msg is-a"><div class="chat-bubble chat-typing">小搭正在想…</div></div>';
      }
      var body = '<div class="chat-bubble">' + esc(m.text) + (m.img ? '<img class="chat-img" src="' + esc(m.img) + '" alt="聊天图片">' : '') + '</div>' +
        '<div class="chat-time">' + chatTime(m.ts) + '</div>';
      return '<div class="chat-msg ' + (m.role === 'u' ? 'is-u' : 'is-a') + '">' + body + '</div>';
    }).join('');
  }
  function chatMemHTML() {
    if (!state.chatMem.length) return '';
    return '<details class="chat-mem"><summary>小搭记得的事 <b>' + state.chatMem.length + '</b></summary><div class="chat-mem-list">' +
      state.chatMem.map(function (m) { return '<span class="chat-mem-item">' + esc(m.text) + '</span>'; }).join('') +
      '</div></details>';
  }
  function chatModeHTML() {
    var online = !!chatToken();
    var label = online ? (rt.chatOffline ? '在线暂时不可用，已用离线回复' : '在线小搭') : '离线陪聊';
    return '<div class="chat-mode" id="chatMode"><span class="chat-dot ' + (online && !rt.chatOffline ? 'is-on' : '') + '"></span>' + label +
      (online ? '' : '<span class="chat-mode-tip">在「更多 → AI 口令」设置后可在线</span>') + '</div>';
  }
  function chatPreviewHTML() {
    if (!rt.chatImage) return '';
    return '<div class="chat-image-card"><img src="' + esc(rt.chatImage.thumb) + '" alt="待发送的作业照片"><span>' + esc(rt.chatImage.name) + '</span>' +
      '<button type="button" data-act="chat-remove-image" aria-label="移除图片">×</button></div>';
  }
  function refreshChatPreview() {
    var box = $('#chatImagePreview');
    if (box) box.innerHTML = chatPreviewHTML();
  }
  function compressImageFile(file, maxDim, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          try {
            var scale = Math.min(1, maxDim / Math.max(img.width, img.height));
            var cv = document.createElement('canvas');
            cv.width = Math.max(1, Math.round(img.width * scale));
            cv.height = Math.max(1, Math.round(img.height * scale));
            cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
            resolve(cv.toDataURL('image/jpeg', quality));
          } catch (e) { reject(e); }
        };
        img.onerror = reject;
        img.src = reader.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  function prepareChatImage(file) {
    return compressImageFile(file, 1000, 0.72).then(function (full) {
      if (full.length > 82000) {
        return compressImageFile(file, 720, 0.58).then(function (f2) {
          return f2.length > 82000 ? compressImageFile(file, 540, 0.5) : f2;
        });
      }
      return full;
    }).then(function (full) {
      return compressImageFile(file, 360, 0.55).then(function (thumb) {
        return { full: full, thumb: thumb, name: file.name || '作业照片' };
      });
    });
  }
  function pickChatImage() {
    var input = $('#chatImageInput');
    if (input) { input.value = ''; input.click(); }
  }
  function handleChatImage(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件', 'warn'); return; }
    toast('正在压缩作业照片…', 'info');
    prepareChatImage(file).then(function (img) {
      rt.chatImage = img;
      refreshChatPreview();
      toast('照片已就绪，可以发送或补充一句话', 'success');
      var inp = $('#chatInput');
      if (inp) { try { inp.focus(); } catch (e) { } }
    }).catch(function () {
      toast('图片处理失败，换一张试试', 'warn');
    });
  }
  function chatShellHTML() {
    return '<div class="chat-shell">' +
      chatModeHTML() + chatMemHTML() +
      '<div class="chat-messages" id="chatMessages">' + chatMessagesHTML() + '</div>' +
      '<div class="chat-image-preview" id="chatImagePreview">' + chatPreviewHTML() + '</div>' +
      '<div class="chat-compose"><button class="chat-tool" type="button" data-act="chat-pick-image" aria-label="上传作业照片" title="上传作业照片">' + icon('camera') + '</button>' +
      '<input id="chatInput" maxlength="500" autocomplete="off" placeholder="跟小搭说点什么…" aria-label="给小搭发消息">' +
      '<button class="btn btn-primary btn-sm" type="button" data-act="chat-send">发送</button></div>' +
      '</div>';
  }
  function openChat() {
    openModal({
      title: '小搭', icon: 'users',
      sub: '陪你做题、听你说说话',
      body: chatShellHTML(),
      footer: '<span class="foot-note">聊天记录保存在本机；有旧版 AI 口令时可在线回复</span>' +
        '<button class="btn btn-ghost" type="button" data-close>关闭</button>'
    });
    setTimeout(function () {
      scrollChat();
      var inp = $('#chatInput');
      if (inp) { try { inp.focus(); } catch (e) { } }
    }, 80);
  }
  function refreshChat() {
    var box = $('#chatMessages');
    if (!box) return;
    box.innerHTML = chatMessagesHTML();
    var mode = $('#chatMode');
    if (mode) mode.outerHTML = chatModeHTML();
    var mem = $('.chat-mem');
    if (mem) {
      var wrap = mem.parentNode;
      var html = chatMemHTML();
      if (html) mem.outerHTML = html; else mem.remove();
    } else if (state.chatMem.length) {
      var shell = $('.chat-shell');
      if (shell) shell.insertAdjacentHTML('afterbegin', chatMemHTML());
    }
    scrollChat();
  }
  function scrollChat() {
    var box = $('#chatMessages');
    if (box) box.scrollTop = box.scrollHeight;
  }
  function localChatReply(text) {
    var t = String(text || '').trim();
    var mk = t.match(/^(?:帮我)?记住[，,：: ]*(.{1,60})$/);
    if (mk && mk[1]) {
      var memo = mk[1].trim();
      if (!state.chatMem.some(function (m) { return m.text === memo; })) {
        state.chatMem.push({ id: uid('cm'), text: memo, tags: [], at: Date.now() });
        state.chatMem = state.chatMem.slice(-40);
      }
      return '记住了：' + memo + '。以后我会记得这件事。';
    }
    if (/累|烦|难受|不想|困|崩溃|压力/.test(t)) return '先歇两分钟，喝口水。今天不用把所有事都做完，挑最小的一件开始就行。';
    if (/不会|不懂|怎么做|题|数学|英语|语文|物理/.test(t)) return '先别急着看答案。把题目里已知的条件圈出来，告诉我你卡在哪一步？我陪你找第一步。';
    if (/你好|在吗|小搭|hi|hello/i.test(t)) return '我在。今天想先聊哪件事？';
    if (/谢谢|知道了|好的/.test(t)) return '嗯，我在。需要的时候再叫我。';
    return '我在听。是作业、考试，还是今天心情？说具体一点，我好接住。';
  }
  function aiChat(text, image) {
    var token = chatToken();
    if (!token) return Promise.resolve(null);
    var hist = state.chat.filter(function (m) { return !m.pending && m.text; }).slice(-8).map(function (m) {
      return (m.role === 'u' ? '他：' : '你：') + m.text;
    }).join('\n');
    var prompt;
    if (image) {
      prompt = '这是乐乐上传的作业/试卷照片。请按下面结构简短分析，不要编：\n' +
        '1) 先说你看到的科目和大致内容；\n' +
        '2) 列出能看清的题号/题目；\n' +
        '3) 指出空题或可疑错误；\n' +
        '4) 每道需要讲的问题只给思路和第一步，不给最终答案；\n' +
        '5) 看不清就明确说“照片看不清”，不要猜。\n' +
        '最后用一句话告诉他下一步做什么。用 1-2-3 列，语气像小搭，短一点。' +
        (text ? '\n他同时说：' + String(text).slice(0, 300) : '') +
        '\n【最近对话】\n' + hist;
    } else {
      prompt = '你是「小搭」，一个比初二学生大两届的高中男生，是他的同龄学习搭档，不是老师也不是家长。用微信口气，1-3 句话，不超过 80 字；只给思路和第一步，不给最终答案；不评判、不提成绩、不催；他情绪低落时先接住情绪。\n【最近对话】\n' + hist + '\n他：' + String(text).slice(0, 500);
    }
    return fetch(CHAT_AI_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, prompt: prompt, image: image || '', kbq: '' })
    }).then(function (r) { return r.json(); }).then(function (j) {
      return (j && j.ok && j.text) ? String(j.text).replace(/\s+/g, ' ').trim().slice(0, 1200) : null;
    }).catch(function () { return null; });
  }
  function sendChat() {
    var inp = $('#chatInput');
    if (!inp) return;
    var text = String(inp.value || '').trim();
    var image = rt.chatImage;
    if (!text && !image) return;
    if (state.chat.some(function (m) { return m.pending; })) return;
    var shown = text || '（发了张作业照片）';
    state.chat.push({ id: uid('c'), ts: Date.now(), role: 'u', text: shown.slice(0, 500), img: image ? image.thumb : '' });
    if (state.chat.length > 300) state.chat = state.chat.slice(-300);
    var pending = { id: uid('c'), ts: Date.now(), role: 'a', text: '', pending: true };
    state.chat.push(pending);
    rt.chatImage = null;
    inp.value = '';
    refreshChatPreview();
    save();
    refreshChat();
    aiChat(text, image ? image.full : '').then(function (reply) {
      if (!reply) {
        rt.chatOffline = !!chatToken();
        if (image) {
          reply = chatToken()
            ? '在线分析暂时没成功，照片我先留在这条消息里。你可以先自己圈出不会的题，等网络好了再发我一次。'
            : '我现在没有 AI 口令，也没有联网，读不了图片里的字。让家长在「更多 → AI 口令」里设置一下；这次我先只记下你上传了作业。';
        } else {
          reply = localChatReply(text);
        }
      }
      pending.text = reply;
      pending.pending = false;
      pending.ts = Date.now();
      save();
      refreshChat();
    }).catch(function () {
      rt.chatOffline = !!chatToken();
      pending.text = image ? '这张作业照片我暂时没分析出来。你可以先说说卡在哪一题，我陪你理思路。' : localChatReply(text);
      pending.pending = false;
      save();
      refreshChat();
    });
  }
  function openAiTokenModal() {
    if (!requireParent('切换到家长端才能设置 AI 口令')) return;
    var has = !!chatToken();
    openModal({
      title: 'AI 口令', icon: 'lock',
      sub: '用于小搭在线回复和作业分析',
      body: '<div class="field"><label for="aiTok">旧版 AI 口令</label><input id="aiTok" type="password" autocomplete="off" placeholder="' + (has ? '已设置，输入新口令可替换' : '粘贴旧版小搭的 AI 口令') + '"></div>' +
        '<p class="form-note" style="margin-top:10px">' + (has ? '已检测到本机有口令，小搭可在线。' : '当前是本机离线陪聊；口令只保存在这台设备，不会写进备份。') + ' 口令与经典版共用同一个浏览器本地存储。</p>',
      footer: (has ? '<button class="btn btn-soft" type="button" data-act="clear-ai-token">清除口令</button>' : '') +
        '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="save-ai-token">保存口令</button>'
    });
  }
  function saveAiToken() {
    if (!requireParent('切换到家长端才能设置 AI 口令')) return;
    var v = (($('#aiTok') || {}).value || '').trim();
    if (!v) { toast('先粘贴 AI 口令', 'warn'); return; }
    safeSet('lc_tok', v);
    rt.chatOffline = false;
    closeModal();
    toast('AI 口令已保存，小搭现在可以在线分析作业了', 'success');
    if (rt.modalOpen) refreshChat();
  }
  function clearAiToken() {
    if (!requireParent('切换到家长端才能清除 AI 口令')) return;
    try { localStorage.removeItem('lc_tok'); localStorage.removeItem('lc_demo_tok'); } catch (e) { }
    rt.chatOffline = false;
    closeModal();
    toast('已清除 AI 口令，小搭切回离线陪聊', 'info');
  }
  function openProfileModal() {
    openModal({
      title: '我的资料', icon: 'edit',
      sub: '昵称和年级会显示在学习舱里',
      body: '<div class="form-grid">' +
        '<div class="field field-full"><label for="pfNick">昵称</label><input id="pfNick" maxlength="12" value="' + esc(state.profile.nick) + '" placeholder="乐乐"></div>' +
        '<div class="field field-full"><label for="pfGrade">年级</label><select id="pfGrade">' +
        ['初一上', '初一下', '初二上', '初二下', '初三上', '初三下'].map(function (g) {
          return '<option value="' + g + '"' + (g === state.profile.grade ? ' selected' : '') + '>' + g + '</option>';
        }).join('') + '</select></div></div>' +
        '<p class="form-note" style="margin-top:11px">年级决定「必掌握」页面的标题和内容；目前只配置了初二上，切到其他年级会显示空状态。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="save-profile">保存</button>'
    });
  }
  function openMoreModal() {
    openModal({
      title: '更多', icon: 'home',
      sub: '旧版入口与演示工具',
      body: '<div class="more-list">' +
        '<a class="more-link" href="classic.html"><span class="more-ico">🗂️</span><span><strong>打开经典版工作台</strong><small>旧版完整功能仍保留</small></span>' + icon('arrowRight') + '</a>' +
        '<button class="more-link" type="button" data-act="open-profile"><span class="more-ico">👤</span><span><strong>修改昵称 / 年级</strong><small>同步侧边栏和必掌握标题</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="open-role"><span class="more-ico">🔄</span><span><strong>切换学生端 / 家长端</strong><small>当前：' + (state.role === 'parent' ? '家长端' : '学生端') + '</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="export-data"><span class="more-ico">📤</span><span><strong>导出数据备份</strong><small>下载 JSON，换设备/清缓存前先备份</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="import-data"><span class="more-ico">📥</span><span><strong>导入数据备份</strong><small>用 JSON 覆盖本机数据</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="open-chat"><span class="more-ico">💬</span><span><strong>打开小搭</strong><small>聊天记录已从旧版导入</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="open-judge-records"><span class="more-ico">📸</span><span><strong>判题记录</strong><small>小搭分析过的作业，家长可回看</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="toggle-approval"><span class="more-ico">✅</span><span><strong>完成需家长确认</strong><small>' + (state.meta && state.meta.requireApproval ? '已开启：孩子提交，家长确认后加星' : '已关闭：孩子点完成立即加星') + '</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="open-cloud"><span class="more-ico">☁️</span><span><strong>多端同步</strong><small>' + esc(cloudStatusText()) + '</small></span>' + icon('arrowRight') + '</button>' +
        '<button class="more-link" type="button" data-act="open-ai-token"><span class="more-ico">🔑</span><span><strong>AI 口令</strong><small>' + (chatToken() ? '已检测到口令，小搭可在线分析作业' : '未设置；设置后小搭可在线分析作业') + '</small></span>' + icon('arrowRight') + '</button>' +
        '<a class="more-link" href="preview.html"><span class="more-ico">🧪</span><span><strong>打开本地测试台</strong><small>旧版双端预览工具</small></span>' + icon('arrowRight') + '</a>' +
        '<button class="more-link is-danger" type="button" data-act="open-reset"><span class="more-ico">🧹</span><span><strong>重置演示数据</strong><small>恢复初始任务、星星和奖励</small></span>' + icon('arrowRight') + '</button>' +
        '</div>' +
        '<p class="form-note" style="margin-top:11px">新版本数据保存在 lc_cockpit_v1，旧版数据仍保存在 lc_v3，两者互不覆盖。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>关闭</button>'
    });
  }
  function openDemoClean() {
    var isLegacy = !!(state.meta && state.meta.legacy);
    openModal({
      title: isLegacy ? '清空示例任务？' : '开始使用？', icon: 'sparkles',
      sub: isLegacy ? '旧版星星会保留，只清空示例任务' : '会清空演示任务、演示星星和流水',
      body: '<p>' + (isLegacy
        ? '已导入的旧版星星余额会保留；今天这 11 条示例任务、示例考试目标会清空，奖励目录保留。之后让家长添加任务，或直接拍照识别。'
        : '会清空 11 条演示任务、演示星星、流水和兑换记录；奖励目录和「必掌握」内容保留。') +
        '</p><p class="form-note" style="margin-top:10px">删除后不可恢复。如果只是想先看看，点「先看看」即可；建议先导出备份。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-demo-clean">' + icon('check') + '确认开始</button>'
    });
  }
  function doDemoClean() {
    var isLegacy = !!(state.meta && state.meta.legacy);
    state.tasks = [];
    if (!isLegacy) state.examGoals = [];
    state.mastery.forEach(function (m) { m.known = false; });
    if (!isLegacy) {
      state.log = [];
      state.redemptions = [];
    }
    state.meta.demo = false;
    state.meta.demoTasks = false;
    state.meta.legacyTasks = 0;
    state.meta.goalsImported = 1;
    state.meta.recordsImported = 1;
    state.meta.chatImported = 1;
    state.meta.noticeDismissed = true;
    state.meta.legacy = false;
    ui.demoDismissed = true;
    ui.tab = '全部';
    ui.openTask = null;
    save();
    closeModal();
    render();
    toast(isLegacy ? '已清空示例任务，旧版星星和成绩目标已保留' : '已清空演示数据，可以开始记录自己的任务了', 'success');
  }
  function dismissDemo() {
    ui.demoDismissed = true;
    if (state.meta && num(state.meta.legacyTasks) > 0) {
      state.meta.noticeDismissed = true;
      save();
    }
    render();
  }
  function exportData() {
    try {
      var data = JSON.stringify(state, null, 2);
      var blob = new Blob([data], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = '乐乐学习舱备份_' + dayKey(Date.now()) + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { try { URL.revokeObjectURL(url); a.remove(); } catch (e) { } }, 600);
      toast('已导出 JSON 备份，请保存好', 'success');
    } catch (e) {
      toast('导出失败，请换浏览器重试', 'warn');
    }
  }
  function triggerImport() {
    var input = $('#effImportInput');
    if (input) { input.value = ''; input.click(); }
  }
  function handleImportFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var obj;
      try { obj = JSON.parse(String(reader.result || '')); } catch (e) { toast('文件不是有效的 JSON', 'warn'); return; }
      if (!obj || typeof obj !== 'object' || !Array.isArray(obj.tasks) || !Array.isArray(obj.log)) {
        toast('备份格式不对，至少需要 tasks 和 log', 'warn');
        return;
      }
      pendingImport = obj;
      openModal({
        title: '导入备份？', icon: 'download',
        sub: '会覆盖本机当前数据',
        body: '<p>备份里包含 <strong>' + obj.tasks.length + '</strong> 条任务、<strong>' + obj.log.length + '</strong> 条星星流水。</p>' +
          '<p class="form-note" style="margin-top:10px">导入会覆盖这台设备上的当前数据；建议先把当前数据导出一份。旧版 <code>lc_v3</code> 不会被改动。</p>',
        footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
          '<button class="btn btn-primary" type="button" data-act="do-import">' + icon('check') + '确认导入</button>'
      });
    };
    reader.onerror = function () { toast('文件读取失败', 'warn'); };
    reader.readAsText(file);
  }
  function doImport() {
    if (!pendingImport) { closeModal(); return; }
    try {
      state = normalizeState(pendingImport);
      pendingImport = null;
      state.meta.goalsImported = 1;
      state.meta.recordsImported = 1;
      state.meta.chatImported = 1;
      save();
      closeModal();
      ui.openTask = null;
      render();
      toast('导入成功，已恢复备份数据', 'success');
    } catch (e) {
      pendingImport = null;
      toast('导入失败：备份内容不完整', 'warn');
    }
  }
  function openResetModal() {
    openModal({
      title: '重置演示数据？', icon: 'refresh',
      sub: '会清空新版本里的任务、星星流水和兑换记录',
      body: '<p>重置后恢复到初始演示状态：11 条今日任务、6 个考试目标、33 个奖励。旧版 <code>lc_v3</code> 数据不会被删除。</p>' +
        '<p class="form-note" style="margin-top:10px">如果只是想换回学生端，点侧边栏的「切换」即可，不需要重置。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-reset">' + icon('refresh') + '确认重置</button>'
    });
  }
  function openLogoutModal() {
    openModal({
      title: '退出当前演示？', icon: 'lock',
      sub: '会回到学生端首页，数据仍然保留',
      body: '<p>学习记录不会丢失。再次打开页面会继续上次的身份和进度。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-logout">回到学生端</button>'
    });
  }

  /* ---------- 14. 添加任务 / 奖励 / 考试目标 ---------- */
  function openAddTask() {
    if (!requireParent('切换到家长端才能布置任务')) return;
    var subjOpts = TASK_SUBJECTS.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');
    var typeOpts = [['habit', '普通打卡'], ['timer', '计时 / 倒计时'], ['recite', '背诵录音'], ['words', '单词朗读'], ['dictation', '听写练习'], ['homework', '作业拍照检查'], ['read', '知识点复习']].map(function (t) { return '<option value="' + t[0] + '">' + t[1] + '</option>'; }).join('');
    openModal({
      title: '添加今日任务', icon: 'plus',
      sub: '家长端可以按老师的要求补充任务',
      body: '<div class="form-grid">' +
        '<div class="field"><label for="atSubject">科目</label><select id="atSubject">' + subjOpts + '</select></div>' +
        '<div class="field"><label for="atType">任务类型</label><select id="atType">' + typeOpts + '</select></div>' +
        '<div class="field field-full"><label for="atTitle">任务标题 <em>*</em></label><input id="atTitle" maxlength="40" placeholder="例如：背诵《答谢中书书》并录音"></div>' +
        '<div class="field"><label for="atStars">奖励星星</label><input id="atStars" type="number" min="1" max="20" step="1" value="1"></div>' +
        '<div class="field"><label for="atDate">日期</label><input id="atDate" type="date" value="' + (ui.viewDate || dayKey(Date.now())) + '"></div>' +
        '<div class="field"><label for="atMinutes">预计分钟</label><input id="atMinutes" type="number" min="0" max="180" step="5" placeholder="10"></div>' +
        '<div class="field field-full"><label>重复</label><div class="repeat-days">' +
        [[1, '一'], [2, '二'], [3, '三'], [4, '四'], [5, '五'], [6, '六'], [0, '日']].map(function (d) {
          return '<label><input type="checkbox" name="atRepeatDay" value="' + d[0] + '"><span>' + d[1] + '</span></label>';
        }).join('') +
        '</div><p class="form-note" style="margin-top:5px">不勾选 = 单次；勾选 = 每周这些天自动生成一条。</p></div>' +
        '</div><p class="form-note" style="margin-top:11px">计时类任务会按「预计分钟」生成倒计时；留空则默认 5 分钟。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-task">' + icon('plus') + '添加任务</button>'
    });
  }
  function submitTask() {
    if (!requireParent('切换到家长端才能布置任务')) return;
    var title = (($('#atTitle') || {}).value || '').trim();
    if (!title) { toast('先写一个任务标题', 'warn'); var el = $('#atTitle'); if (el) el.focus(); return; }
    var subject = ($('#atSubject') || {}).value || '习惯';
    var type = ($('#atType') || {}).value || 'habit';
    var stars = clamp(Math.round(num(($('#atStars') || {}).value, 1)), 1, 20);
    var minutes = Math.max(0, Math.round(num(($('#atMinutes') || {}).value, 0)));
    var taskDate = ($('#atDate') || {}).value || '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(taskDate)) taskDate = dayKey(Date.now());
    var task = { id: uid('t'), subject: subject, title: title, type: type, stars: stars, done: false, isNew: true, date: taskDate, createdAt: Date.now(), updatedAt: Date.now() };
    if (minutes > 0) task.minutes = minutes;
    if (type === 'timer') task.seconds = Math.max(60, (minutes || 5) * 60);
    if (type === 'words') task.words = ['study', 'practice', 'improve', 'knowledge', 'progress'];
    if (type === 'dictation') task.pairs = [['go', 'went'], ['take', 'took'], ['see', 'saw'], ['write', 'wrote']];
    if (type === 'recite' || type === 'read') task.passage = '';
    var rdays = $$('input[name="atRepeatDay"]:checked').map(function (x) { return Number(x.value); }).filter(function (d) { return d >= 0 && d <= 6; });
    if (rdays.length) task.repeat = { days: rdays };
    state.tasks.unshift(task);
    save();
    closeModal();
    ui.viewDate = taskDate;
    setPage('today');
    toast('已添加「' + title + '」' + (taskDate !== dayKey(Date.now()) ? '到 ' + taskDate : '') + (rdays.length ? '，' + repeatLabel(task.repeat) + '自动生成' : ''), 'success');
  }
  function taskFormHTML(prefix, task) {
    var subjects = TASK_SUBJECTS;
    var types = [['habit', '普通打卡'], ['timer', '计时 / 倒计时'], ['recite', '背诵录音'], ['words', '单词朗读'], ['dictation', '听写练习'], ['homework', '作业拍照检查'], ['read', '知识点复习']];
    var minutes = task && task.minutes ? task.minutes : (task && task.seconds ? Math.round(task.seconds / 60) : '');
    return '<div class="form-grid">' +
      '<div class="field"><label for="' + prefix + 'Subject">科目</label><select id="' + prefix + 'Subject">' + subjects.map(function (s) {
        return '<option value="' + s + '"' + (task && task.subject === s ? ' selected' : '') + '>' + s + '</option>';
      }).join('') + '</select></div>' +
      '<div class="field"><label for="' + prefix + 'Type">任务类型</label><select id="' + prefix + 'Type">' + types.map(function (tp) {
        return '<option value="' + tp[0] + '"' + (task && task.type === tp[0] ? ' selected' : '') + '>' + tp[1] + '</option>';
      }).join('') + '</select></div>' +
      '<div class="field field-full"><label for="' + prefix + 'Title">任务标题 <em>*</em></label><input id="' + prefix + 'Title" maxlength="40" value="' + esc(task ? task.title : '') + '" placeholder="例如：背诵《答谢中书书》并录音"></div>' +
      '<div class="field"><label for="' + prefix + 'Stars">奖励星星</label><input id="' + prefix + 'Stars" type="number" min="1" max="20" step="1" value="' + (task ? task.stars : 1) + '"></div>' +
      '<div class="field"><label for="' + prefix + 'Minutes">预计分钟</label><input id="' + prefix + 'Minutes" type="number" min="0" max="180" step="5" value="' + minutes + '" placeholder="10"></div>' +
      '</div><p class="form-note" style="margin-top:11px">计时类任务会按「预计分钟」生成倒计时；留空则默认 5 分钟。</p>';
  }
  function readTaskForm(prefix) {
    var title = (($('#' + prefix + 'Title') || {}).value || '').trim();
    if (!title) { toast('先写一个任务标题', 'warn'); var el = $('#' + prefix + 'Title'); if (el) el.focus(); return null; }
    var subject = ($('#' + prefix + 'Subject') || {}).value || '习惯';
    var type = ($('#' + prefix + 'Type') || {}).value || 'habit';
    var stars = clamp(Math.round(num(($('#' + prefix + 'Stars') || {}).value, 1)), 1, 20);
    var minutes = Math.max(0, Math.round(num(($('#' + prefix + 'Minutes') || {}).value, 0)));
    return { title: title, subject: subject, type: type, stars: stars, minutes: minutes };
  }
  function openEditTask(id) {
    if (!requireParent('切换到家长端才能编辑任务')) return;
    var t = findTask(id);
    if (!t) return;
    openModal({
      title: '编辑任务', icon: 'edit',
      sub: '改科目、类型、星星或预计分钟',
      body: taskFormHTML('et', t),
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-edit-task" data-id="' + esc(id) + '">' + icon('check') + '保存修改</button>'
    });
  }
  function submitEditTask(id) {
    if (!requireParent('切换到家长端才能编辑任务')) return;
    var t = findTask(id);
    if (!t) return;
    var v = readTaskForm('et');
    if (!v) return;
    t.subject = v.subject; t.type = v.type; t.stars = v.stars;
    t.title = v.title;
    if (v.minutes > 0) t.minutes = v.minutes; else delete t.minutes;
    if (v.type === 'timer') t.seconds = Math.max(60, (v.minutes || 5) * 60);
    if (v.type === 'words' && (!t.words || !t.words.length)) t.words = ['study', 'practice', 'improve', 'knowledge', 'progress'];
    if (v.type === 'dictation' && (!t.pairs || !t.pairs.length)) t.pairs = [['go', 'went'], ['take', 'took'], ['see', 'saw'], ['write', 'wrote']];
    t.updatedAt = Date.now();
    save();
    closeModal();
    render();
    toast('任务已更新', 'success');
  }
  function openDeleteTask(id) {
    if (!requireParent('切换到家长端才能删除任务')) return;
    var t = findTask(id);
    if (!t) return;
    openModal({
      title: '删除这条任务？', icon: 'trash',
      sub: '删除后不可恢复',
      body: '<p><strong>' + esc(t.title) + '</strong></p>' +
        '<p class="form-note" style="margin-top:10px">' + (t.done ? '这条任务已经完成，已获得的星星不会自动退回；如要退星，请先在已完成区撤销。' : '任务还没完成，删除不会影响星星余额。') + '</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-delete-task" data-id="' + esc(id) + '">' + icon('trash') + '确认删除</button>'
    });
  }
  function doDeleteTask(id) {
    if (!requireParent('切换到家长端才能删除任务')) return;
    var t = findTask(id);
    if (!t) { closeModal(); return; }
    stopTimer(id, true);
    markDel('task', id);
    state.tasks = state.tasks.filter(function (x) { return x.id !== id; });
    if (ui.openTask === id) ui.openTask = null;
    save();
    closeModal();
    render();
    toast('已删除「' + t.title + '」', 'success');
  }
  function openAddReward() {
    if (!requireParent('切换到家长端才能添加奖励')) return;
    var cats = REWARD_CATS.slice(1).map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    openModal({
      title: '添加奖励', icon: 'gift',
      sub: '和孩子一起定一个想要的小目标',
      body: '<div class="form-grid">' +
        '<div class="field field-full"><label for="arName">奖励名称 <em>*</em></label><input id="arName" maxlength="24" placeholder="例如：周末去看一场电影"></div>' +
        '<div class="field"><label for="arIcon">图标（一个 emoji）</label><input id="arIcon" maxlength="4" value="🎁"></div>' +
        '<div class="field"><label for="arPrice">真实价格（元，可选）</label><input id="arPrice" type="number" min="0" max="99999" step="1" placeholder="例如：30"></div>' +
        '<div class="field"><label for="arCost">所需星星</label><input id="arCost" type="number" min="1" max="999" step="1" value="30"></div>' +
        '<div class="field"><label for="arCat">分类</label><select id="arCat">' + cats + '</select></div>' +
        '</div><p class="form-note" style="margin-top:11px">填真实价格会按「20 元 = 1 颗星」自动算星星；留空就用手动星星。真实价格只作说明，不影响兑换判断。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-reward">' + icon('plus') + '添加奖励</button>'
    });
  }
  function submitReward() {
    if (!requireParent('切换到家长端才能添加奖励')) return;
    var name = (($('#arName') || {}).value || '').trim();
    if (!name) { toast('给奖励起个名字吧', 'warn'); var el = $('#arName'); if (el) el.focus(); return; }
    var emoji = (($('#arIcon') || {}).value || '🎁').trim().slice(0, 4) || '🎁';
    var price = Math.max(0, Math.round(num(($('#arPrice') || {}).value, 0)));
    var cost = price > 0 ? priceToStars(price) : clamp(Math.round(num(($('#arCost') || {}).value, 30)), 1, 999);
    var cat = ($('#arCat') || {}).value || '心愿';
    var reward = { id: uid('r'), name: name, icon: emoji, cost: cost, cat: cat, updatedAt: Date.now() };
    if (price > 0) reward.price = price;
    state.rewards.unshift(reward);
    save();
    closeModal();
    ui.rewardCat = '全部';
    setPage('rewards');
    toast('已添加奖励「' + name + '」', 'success');
  }
  function openEditReward(id) {
    if (!requireParent('切换到家长端才能编辑奖励')) return;
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var cats = REWARD_CATS.slice(1).map(function (c) {
      return '<option value="' + c + '"' + (r.cat === c ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    openModal({
      title: '编辑奖励', icon: 'edit',
      sub: '修改后会立即生效',
      body: '<div class="form-grid">' +
        '<div class="field field-full"><label for="erName">奖励名称 <em>*</em></label><input id="erName" maxlength="24" value="' + esc(r.name) + '"></div>' +
        '<div class="field"><label for="erIcon">图标（emoji）</label><input id="erIcon" maxlength="4" value="' + esc(r.icon) + '"></div>' +
        '<div class="field"><label for="erPrice">真实价格（元，可选）</label><input id="erPrice" type="number" min="0" max="99999" step="1" value="' + (r.price || '') + '" placeholder="留空=手动星星"></div>' +
        '<div class="field"><label for="erCost">所需星星</label><input id="erCost" type="number" min="1" max="999" step="1" value="' + r.cost + '"></div>' +
        '<div class="field"><label for="erCat">分类</label><select id="erCat">' + cats + '</select></div>' +
        '</div>' + (r.detail ? '<p class="form-note" style="margin-top:11px">旧版条件：' + esc(r.detail) + '（仅展示，不参与兑换判断）</p>' : '') +
        (r.price ? '<p class="form-note" style="margin-top:11px">真实价格 ¥' + esc(r.price) + '，按 20 元 = 1 颗星换算；手动改星星会覆盖换算价。</p>' : '') +
        '<p class="form-note" style="margin-top:11px">删除奖励不会删除已产生的兑换记录。</p>',
      footer: '<button class="btn btn-soft" type="button" data-act="delete-reward" data-id="' + esc(id) + '">' + icon('trash') + '删除</button>' +
        '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-edit-reward" data-id="' + esc(id) + '">保存</button>'
    });
  }
  function submitEditReward(id) {
    if (!requireParent('切换到家长端才能编辑奖励')) return;
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var name = (($('#erName') || {}).value || '').trim();
    if (!name) { toast('奖励名称不能为空', 'warn'); return; }
    r.name = name;
    r.icon = (($('#erIcon') || {}).value || '🎁').trim().slice(0, 4) || '🎁';
    var price = Math.max(0, Math.round(num(($('#erPrice') || {}).value, 0)));
    if (price > 0) {
      r.price = price;
      r.cost = priceToStars(price);
    } else {
      delete r.price;
      r.cost = clamp(Math.round(num(($('#erCost') || {}).value, 10)), 1, 999);
    }
    r.cat = ($('#erCat') || {}).value || '心愿';
    r.updatedAt = Date.now();
    save();
    closeModal();
    ui.rewardCat = '全部';
    render();
    toast('奖励已更新', 'success');
  }
  function openDeleteReward(id) {
    if (!requireParent('切换到家长端才能删除奖励')) return;
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    openModal({
      title: '删除奖励？', icon: 'trash',
      sub: '已产生的兑换记录会保留',
      body: '<p><strong>' + esc(r.name) + '</strong>（' + r.cost + ' 颗星星）</p><p class="form-note" style="margin-top:10px">删除后孩子将看不到这个奖励；已兑换的历史记录不会消失。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-delete-reward" data-id="' + esc(id) + '">' + icon('trash') + '确认删除</button>'
    });
  }
  function doDeleteReward(id) {
    if (!requireParent('切换到家长端才能删除奖励')) return;
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) { closeModal(); return; }
    markDel('reward', id);
    state.rewards = state.rewards.filter(function (x) { return x.id !== id; });
    save();
    closeModal();
    ui.rewardCat = '全部';
    render();
    toast('已删除奖励「' + r.name + '」', 'success');
  }
  function openAddExam() {
    if (!requireParent('切换到家长端才能添加考试目标')) return;
    var subjOpts = ['语文', '数学', '英语', '物理', '道法', '历史'].map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('');
    openModal({
      title: '添加考试目标', icon: 'target',
      sub: '目标写具体，达成就发星星',
      body: '<div class="form-grid">' +
        '<div class="field"><label for="aeSubject">科目</label><select id="aeSubject">' + subjOpts + '</select></div>' +
        '<div class="field"><label for="aeTarget">目标分数</label><input id="aeTarget" type="number" min="0" max="150" step="1" value="90"></div>' +
        '<div class="field"><label for="aeStars">奖励星星</label><input id="aeStars" type="number" min="1" max="50" step="1" value="5"></div>' +
        '<div class="field"><label for="aeTitle">目标名称（可空）</label><input id="aeTitle" maxlength="20" placeholder="默认：期末XX目标"></div>' +
        '</div><p class="form-note" style="margin-top:11px">达成后由家长在「考试赚星星」页点「标记达成」发放星星。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-exam">' + icon('plus') + '添加目标</button>'
    });
  }
  function submitExam() {
    if (!requireParent('切换到家长端才能添加考试目标')) return;
    var subject = ($('#aeSubject') || {}).value || '语文';
    var target = clamp(Math.round(num(($('#aeTarget') || {}).value, 90)), 0, 150);
    var stars = clamp(Math.round(num(($('#aeStars') || {}).value, 5)), 1, 50);
    var title = (($('#aeTitle') || {}).value || '').trim() || '期末' + subject + '目标';
    state.examGoals.push({ id: uid('e'), subject: subject, title: title, target: target, stars: stars, done: false, updatedAt: Date.now() });
    save();
    closeModal();
    setPage('exam');
    toast('已添加目标：' + title + ' ' + target + ' 分', 'success');
  }
  function openEditExam(id) {
    if (!requireParent('切换到家长端才能编辑考试目标')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    var subjOpts = TASK_SUBJECTS.map(function (s) {
      return '<option value="' + s + '"' + (g.subject === s ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
    openModal({
      title: '编辑考试目标', icon: 'target',
      sub: g.done ? '已达成目标的星星不会因修改而重算' : '修改立即生效',
      body: '<div class="form-grid">' +
        '<div class="field"><label for="eeSubject">科目</label><select id="eeSubject">' + subjOpts + '</select></div>' +
        '<div class="field"><label for="eeTarget">目标分数</label><input id="eeTarget" type="number" min="0" max="150" step="1" value="' + g.target + '"></div>' +
        '<div class="field"><label for="eeStars">奖励星星</label><input id="eeStars" type="number" min="1" max="50" step="1" value="' + g.stars + '"></div>' +
        '<div class="field"><label for="eeTitle">目标名称</label><input id="eeTitle" maxlength="20" value="' + esc(g.title) + '"></div>' +
        '</div><p class="form-note" style="margin-top:11px">删除已达成目标不会扣回已发放的星星；如需退星请先点「撤销」。</p>',
      footer: '<button class="btn btn-soft" type="button" data-act="delete-exam" data-id="' + esc(id) + '">' + icon('trash') + '删除</button>' +
        '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-edit-exam" data-id="' + esc(id) + '">保存</button>'
    });
  }
  function submitEditExam(id) {
    if (!requireParent('切换到家长端才能编辑考试目标')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    var subject = ($('#eeSubject') || {}).value || g.subject;
    var target = clamp(Math.round(num(($('#eeTarget') || {}).value, g.target)), 0, 150);
    var stars = clamp(Math.round(num(($('#eeStars') || {}).value, g.stars)), 1, 50);
    var title = (($('#eeTitle') || {}).value || '').trim() || '期末' + subject + '目标';
    g.subject = subject; g.target = target; g.stars = stars; g.title = title;
    g.updatedAt = Date.now();
    save();
    closeModal();
    render();
    toast('考试目标已更新', 'success');
  }
  function openDeleteExam(id) {
    if (!requireParent('切换到家长端才能删除考试目标')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g) return;
    openModal({
      title: '删除考试目标？', icon: 'trash',
      sub: '删除后不可恢复',
      body: '<p><strong>' + esc(g.title) + '</strong>（' + g.target + ' 分）</p>' +
        '<p class="form-note" style="margin-top:10px">' + (g.done ? '该目标已达成，已发放的星星不会自动退回；需要退星请先点「撤销」。' : '目标还没达成，删除不会影响星星余额。') + '</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="do-delete-exam" data-id="' + esc(id) + '">' + icon('trash') + '确认删除</button>'
    });
  }
  function doDeleteExam(id) {
    if (!requireParent('切换到家长端才能删除考试目标')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g) { closeModal(); return; }
    markDel('exam', id);
    state.examGoals = state.examGoals.filter(function (x) { return x.id !== id; });
    save();
    closeModal();
    render();
    toast('已删除考试目标', 'success');
  }

  /* ---------- 15. 兑换 ---------- */
  function openRedeem(id) {
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) return;
    var totals = starTotals();
    if (totals.balance < r.cost) {
      toast('还差 ' + (r.cost - totals.balance) + ' 颗星星，再完成几个任务吧', 'warn');
      return;
    }
    openModal({
      title: '确认兑换', icon: 'gift',
      sub: '兑换后星星会从账户扣除',
      body: '<div class="modal-reward-preview"><div class="reward-ico cat-' + esc(r.cat) + '" aria-hidden="true">' + esc(r.icon) + '</div>' +
        '<strong>' + esc(r.name) + '</strong><div class="cost">' + r.cost + ' 颗星星</div>' +
        (r.price ? '<div class="detail">真实价 ¥' + esc(r.price) + ' · 按 20 元 = 1 颗星</div>' : '') +
        (r.detail ? '<div class="detail">' + esc(r.detail) + '</div>' : '') +
        '<div class="after">兑换后剩余 ' + (totals.balance - r.cost) + ' 颗</div></div>' +
        '<div class="confirm-hint">' + icon('info') + '<span>兑换后请找家长领取奖励，兑换记录会保存在「我的要兑换」页面。</span></div>',
      footer: '<span class="foot-note">当前可用 ' + totals.balance + ' 颗</span>' +
        '<button class="btn btn-ghost" type="button" data-close>再想想</button>' +
        '<button class="btn btn-gold" type="button" data-act="confirm-redeem" data-id="' + esc(r.id) + '">确认兑换</button>'
    });
  }
  function confirmRedeem(id) {
    var r = state.rewards.filter(function (x) { return x.id === id; })[0];
    if (!r) { closeModal(); return; }
    var totals = starTotals();
    if (totals.balance < r.cost) {
      closeModal();
      toast('星星不够了，先去完成任务吧', 'warn');
      return;
    }
    state.redemptions.unshift({ id: uid('rd'), ts: Date.now(), rewardId: r.id, name: r.name, icon: r.icon, cost: r.cost });
    if (state.redemptions.length > 80) state.redemptions = state.redemptions.slice(0, 80);
    changeStars(-r.cost, '兑换 · ' + r.name, 'reward');
    save();
    closeModal();
    render();
    var anchor = $('#effMobileBalance');
    var r2 = anchor ? anchor.getBoundingClientRect() : null;
    if (!r2 || r2.width === 0) anchor = $('#effSideBalance');
    burstAtEl(anchor, 12);
    toast('兑换成功！记得找家长领取 🎁', 'success');
  }

  /* ---------- 16. 任务 / 考试 / 掌握 ---------- */
  function findTask(id) { return state.tasks.filter(function (t) { return t.id === id; })[0]; }
  function requireStudent(msg) {
    if (state.role !== 'student') { toast(msg || '切换到学生端才能打卡', 'warn'); return false; }
    return true;
  }
  function requireParent(msg) {
    if (state.role !== 'parent') { toast(msg || '切换到家长端才能操作', 'warn'); return false; }
    return true;
  }
  function toggleTask(id, el) {
    var t = findTask(id);
    if (!t) return;
    if (!requireStudent('家长端不能代打卡，切到学生端完成吧')) return;
    if (ui.viewDate && ui.viewDate !== dayKey(Date.now())) { toast('只能完成今天的任务；提前布置的请到当天再打卡', 'warn'); return; }
    if (t.pendingApproval) { toast('已经提交了，等家长确认就行', 'info'); return; }
    if (t.done) { toast('这条已完成，可以在「已完成」里撤销', 'warn'); return; }
    if (state.meta && state.meta.requireApproval) {
      t.pendingApproval = true;
      t.submittedAt = Date.now();
      t.updatedAt = Date.now();
      save();
      render();
      toast('已提交，等家长确认后加星', 'success');
      return;
    }
    t.done = true;
    t.doneAt = Date.now();
    t.awardedStars = t.stars;
    t.awardSeq = num(t.awardSeq, 0) + 1;
    t.updatedAt = Date.now();
    changeStars(t.stars, '完成 · ' + t.title, 'task', 'task:' + t.id + ':' + t.awardSeq);
    save();
    if (ui.openTask === id) ui.openTask = null;
    stopTimer(id, true);
    var rect = el ? el.getBoundingClientRect() : null;
    render();
    if (rect) burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 11);
    else burstAtEl($('#effSideBalance'), 9);
    toast('太棒了！+' + t.stars + ' 颗星星', 'success');
  }
  function approveTask(id) {
    if (!requireParent('切换到家长端才能确认')) return;
    var t = findTask(id);
    if (!t || !t.pendingApproval) return;
    t.pendingApproval = false;
    delete t.submittedAt;
    t.done = true;
    t.doneAt = Date.now();
    t.awardedStars = t.stars;
    t.awardSeq = num(t.awardSeq, 0) + 1;
    t.updatedAt = Date.now();
    changeStars(t.stars, '完成 · ' + t.title, 'task', 'task:' + t.id + ':' + t.awardSeq);
    save();
    render();
    toast('已确认，+' + t.stars + ' 颗星星', 'success');
  }
  function rejectTask(id) {
    if (!requireParent('切换到家长端才能退回')) return;
    var t = findTask(id);
    if (!t || !t.pendingApproval) return;
    t.pendingApproval = false;
    delete t.submittedAt;
    t.updatedAt = Date.now();
    save();
    render();
    toast('已退回，让孩子再检查一下', 'info');
  }
  function approveAllPending() {
    if (!requireParent('切换到家长端才能确认')) return;
    var list = state.tasks.filter(function (t) { return t.pendingApproval; });
    if (!list.length) return;
    list.forEach(function (t) {
      t.pendingApproval = false;
      delete t.submittedAt;
      t.done = true;
      t.doneAt = Date.now();
      t.awardedStars = t.stars;
      t.awardSeq = num(t.awardSeq, 0) + 1;
      t.updatedAt = Date.now();
      changeStars(t.stars, '完成 · ' + t.title, 'task', 'task:' + t.id + ':' + t.awardSeq);
    });
    save();
    render();
    toast('已确认 ' + list.length + ' 条任务', 'success');
  }
  function rejectAllPending() {
    if (!requireParent('切换到家长端才能退回')) return;
    var list = state.tasks.filter(function (t) { return t.pendingApproval; });
    if (!list.length) return;
    list.forEach(function (t) {
      t.pendingApproval = false;
      delete t.submittedAt;
      t.updatedAt = Date.now();
    });
    save();
    render();
    toast('已退回 ' + list.length + ' 条任务', 'info');
  }
  function toggleApproval() {
    if (!requireParent('切换到家长端才能设置确认方式')) return;
    state.meta.requireApproval = !state.meta.requireApproval;
    save();
    closeModal();
    render();
    toast(state.meta.requireApproval ? '已开启：孩子提交后需要家长确认才加星' : '已关闭：孩子点完成立即加星', 'info');
  }
  function undoTask(id) {
    var t = findTask(id);
    if (!t || !t.done) return;
    if (!requireStudent('切换到学生端才能撤销打卡')) return;
    var undoAmount = Math.max(1, Math.round(num(t.awardedStars, t.stars)));
    if (starTotals().balance - undoAmount < 0) { toast('星星已经花掉了，暂时不能撤销这条', 'warn'); return; }
    t.done = false;
    delete t.doneAt;
    delete t.awardedStars;
    t.updatedAt = Date.now();
    changeStars(-undoAmount, '撤销 · ' + t.title, 'undo', 'task-undo:' + t.id + ':' + num(t.awardSeq, 0));
    save();
    render();
    toast('已撤销，' + undoAmount + ' 颗星星已扣回', 'info');
  }
  function expandTask(id) {
    ui.openTask = ui.openTask === id ? null : id;
    render();
  }
  function markExam(id, el) {
    if (!requireParent('考试目标需要家长确认发放')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g || g.done) return;
    g.done = true;
    g.doneAt = Date.now();
    g.awardedStars = g.stars;
    g.awardSeq = num(g.awardSeq, 0) + 1;
    g.updatedAt = Date.now();
    changeStars(g.stars, '达成考试目标 · ' + g.title + ' ' + g.target + ' 分', 'exam', 'exam:' + g.id + ':' + g.awardSeq);
    save();
    var rect = el ? el.getBoundingClientRect() : null;
    render();
    if (rect) burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
    toast('目标达成！+' + g.stars + ' 颗星星已发放', 'success');
  }
  function undoExam(id) {
    if (!requireParent('只有家长端可以撤销')) return;
    var g = state.examGoals.filter(function (x) { return x.id === id; })[0];
    if (!g || !g.done) return;
    var undoExamAmount = Math.max(1, Math.round(num(g.awardedStars, g.stars)));
    if (starTotals().balance - undoExamAmount < 0) { toast('星星已经花掉了，暂时不能撤销', 'warn'); return; }
    g.done = false;
    delete g.doneAt;
    delete g.awardedStars;
    g.updatedAt = Date.now();
    changeStars(-undoExamAmount, '撤销考试奖励 · ' + g.title, 'exam', 'exam-undo:' + g.id + ':' + num(g.awardSeq, 0));
    save();
    render();
    toast('已撤销，星星已扣回', 'info');
  }
  function toggleMastery(id) {
    var m = state.mastery.filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    m.known = !m.known;
    m.updatedAt = Date.now();
    save();
    render();
    if (m.known) toast('已标记掌握：' + m.title, 'success');
  }

  /* ---------- 17. 计时器 / 录音 / 朗读 / 拍照 ---------- */
  function startTimer(id) {
    var t = findTask(id);
    if (!t) return;
    var limit = Math.max(30, num(t.seconds, 300));
    var tm = rt.timers[id];
    if (!tm || tm.ended) tm = { remaining: limit, limit: limit, running: false, ended: false, handle: null, endAt: 0 };
    if (tm.running) return;
    tm.running = true;
    tm.ended = false;
    tm.endAt = Date.now() + tm.remaining * 1000;
    tm.handle = setInterval(function () { tickTimer(id); }, 200);
    rt.timers[id] = tm;
    render();
  }
  function tickTimer(id) {
    var tm = rt.timers[id];
    if (!tm || !tm.running) return;
    var rem = Math.max(0, (tm.endAt - Date.now()) / 1000);
    tm.remaining = rem;
    var disp = $('[data-timer="' + id + '"]');
    if (disp) disp.textContent = mmss(rem);
    var bar = $('[data-timerbar="' + id + '"]');
    if (bar) bar.style.width = clamp(rem / tm.limit * 100, 0, 100) + '%';
    if (rem <= 0) {
      tm.running = false;
      tm.ended = true;
      tm.remaining = 0;
      if (tm.handle) clearInterval(tm.handle);
      tm.handle = null;
      render();
      toast('时间到！休息一下，回来打勾 ⏰', 'gold');
    }
  }
  function pauseTimer(id) {
    var tm = rt.timers[id];
    if (!tm || !tm.running) return;
    tm.remaining = Math.max(0, (tm.endAt - Date.now()) / 1000);
    tm.running = false;
    if (tm.handle) clearInterval(tm.handle);
    tm.handle = null;
    render();
    toast('已暂停，休息好再继续', 'info');
  }
  function resetTimer(id) {
    var tm = rt.timers[id];
    if (tm && tm.handle) clearInterval(tm.handle);
    delete rt.timers[id];
    render();
  }
  function stopTimer(id, silent) {
    var tm = rt.timers[id];
    if (tm && tm.handle) clearInterval(tm.handle);
    delete rt.timers[id];
    if (!silent) render();
  }

  function startRecord(id) {
    var t = findTask(id);
    if (!t) return;
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function' || typeof window.MediaRecorder === 'undefined') {
      toast('当前浏览器不支持录音，直接打勾也可以完成', 'warn');
      return;
    }
    if (rt.recording) { toast('正在录音，先停止上一段', 'warn'); return; }
    toast('正在打开麦克风…', 'info');
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      var rec;
      try { rec = new MediaRecorder(stream); }
      catch (e) {
        stream.getTracks().forEach(function (tr) { try { tr.stop(); } catch (e2) { } });
        toast('录音启动失败，可以直接打勾完成', 'warn');
        return;
      }
      var chunks = [];
      rec.ondataavailable = function (ev) { if (ev.data && ev.data.size) chunks.push(ev.data); };
      rec.onstop = function () {
        stream.getTracks().forEach(function (tr) { try { tr.stop(); } catch (e2) { } });
        if (chunks.length) {
          if (rt.recordings[id]) { try { URL.revokeObjectURL(rt.recordings[id]); } catch (e3) { } }
          var blob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
          rt.recordings[id] = URL.createObjectURL(blob);
        }
        rt.recording = null;
        render();
        toast(rt.recordings[id] ? '录音完成，可以回放啦' : '没有录到声音，再试一次', rt.recordings[id] ? 'success' : 'warn');
      };
      try { rec.start(); } catch (e4) { rt.recording = null; toast('录音启动失败，可以直接打勾', 'warn'); return; }
      rt.recording = { id: id, rec: rec, startedAt: Date.now() };
      render();
      toast('开始录音，读完点「停止」', 'info');
    }).catch(function () {
      rt.recording = null;
      toast('麦克风不可用，直接打勾也可以完成', 'warn');
      render();
    });
  }
  function stopRecord(id) {
    var cur = rt.recording;
    if (!cur || cur.id !== id) return;
    try { cur.rec.stop(); } catch (e) { }
    rt.recording = null;
    render();
  }
  function speak(text, lang, queue) {
    if (!text) return;
    if (typeof window.speechSynthesis === 'undefined' || typeof window.SpeechSynthesisUtterance === 'undefined') {
      toast('当前浏览器不支持朗读，可以自己读一遍', 'warn');
      return;
    }
    try {
      if (!queue) window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang || 'zh-CN';
      u.rate = lang === 'en-US' ? 0.88 : 0.95;
      u.pitch = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      toast('朗读暂时不可用，可以自己读一遍', 'warn');
    }
  }
  function speakTask(id) {
    var t = findTask(id);
    if (!t) return;
    speak([t.title, t.passage || ''].filter(Boolean).join('。'), 'zh-CN');
  }
  function speakWords(id) {
    var t = findTask(id);
    if (!t || !t.words || !t.words.length) return;
    var seq = ++rt.speakSeq;
    try { window.speechSynthesis.cancel(); } catch (e) { }
    t.words.forEach(function (w, i) {
      setTimeout(function () {
        if (rt.speakSeq !== seq) return;
        speak(w, 'en-US', true);
      }, i * 950);
    });
    toast('连续播放 ' + t.words.length + ' 个单词', 'info');
  }
  function speakPairs(id) {
    var t = findTask(id);
    if (!t || !t.pairs || !t.pairs.length) return;
    var seq = ++rt.speakSeq;
    try { window.speechSynthesis.cancel(); } catch (e) { }
    t.pairs.forEach(function (p, i) {
      setTimeout(function () {
        if (rt.speakSeq !== seq) return;
        speak(p[0], 'en-US', true);
      }, i * 1000);
    });
    toast('逐个播放 ' + t.pairs.length + ' 组，先听再写', 'info');
  }

  function pickPhoto() {
    var input = $('#effPhotoInput');
    if (input) { input.value = ''; input.click(); }
  }
  function handlePhoto(file) {
    if (!file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件', 'warn'); return; }
    var reader = new FileReader();
    reader.onload = function () {
      ui.recog = { dataUrl: String(reader.result || ''), name: file.name || '图片' };
      ui.recogBusy = true;
      ui.recogCands = null;
      render();
      setTimeout(function () {
        if (!ui.recog) return;
        ui.recogBusy = false;
        ui.recogCands = buildRecogCandidates();
        render();
        toast('识别完成：找到 3 条任务，确认后加入清单', 'success');
      }, 950);
    };
    reader.onerror = function () { toast('图片读取失败，换一张试试', 'warn'); };
    reader.readAsDataURL(file);
  }
  function buildRecogCandidates() {
    return [
      { subject: '语文', title: '朗读并背诵《答谢中书书》', type: 'recite', stars: 1, minutes: 10, passage: '山川之美，古来共谈。高峰入云，清流见底。两岸石壁，五色交辉。' },
      { subject: '数学', title: '完成课本 P78 习题 1—3', type: 'homework', stars: 1 },
      { subject: '英语', title: '朗读 Unit 6 单词 3 遍', type: 'words', stars: 1, words: ['famous', 'appear', 'become', 'rich', 'successful'] }
    ];
  }
  function confirmRecog() {
    if (!ui.recogCands) return;
    var boxes = $$('#effPage [data-cand]');
    var picked = boxes.filter(function (b) { return b.checked; }).map(function (b) { return num(b.getAttribute('data-cand'), -1); }).filter(function (i) { return i >= 0; });
    if (!picked.length) { toast('至少勾选一条任务', 'warn'); return; }
    picked.forEach(function (i) {
      var c = ui.recogCands[i];
      if (!c) return;
      var t = { id: uid('t'), subject: c.subject, title: c.title, type: c.type, stars: c.stars, done: false, isNew: true, date: dayKey(Date.now()), createdAt: Date.now(), updatedAt: Date.now() };
      if (c.minutes) t.minutes = c.minutes;
      if (c.passage) t.passage = c.passage;
      if (c.words) t.words = c.words.slice();
      if (c.pairs) t.pairs = c.pairs.map(function (p) { return p.slice(); });
      state.tasks.unshift(t);
    });
    ui.recog = null;
    ui.recogCands = null;
    ui.recogBusy = false;
    save();
    render();
    toast('已添加 ' + picked.length + ' 条任务，继续拍照还能识别', 'success');
  }
  function cancelRecog() {
    ui.recog = null;
    ui.recogCands = null;
    ui.recogBusy = false;
    render();
    toast('已取消这次识别', 'info');
  }
  function judgeHomework(id) {
    var t = findTask(id);
    if (!t) return;
    rt.judgeTask = id;
    var input = $('#effJudgeInput');
    if (input) { input.value = ''; input.click(); }
  }
  function handleJudge(file) {
    var id = rt.judgeTask;
    if (!id || !file) return;
    if (!/^image\//.test(file.type || '')) { toast('请选择图片文件', 'warn'); return; }
    rt.judge[id] = { busy: true };
    render();
    toast('小搭正在看这张作业…', 'info');
    prepareChatImage(file).then(function (img) {
      var task = findTask(id);
      if (task) { task.judge = { ts: Date.now(), busy: true, thumb: img.thumb }; save(); }
      rt.judge[id] = { busy: true, thumb: img.thumb };
      render();
      return aiChat('请分析这张作业/笔记照片：先识别科目和题号，指出空题或可疑错误，只给思路和第一步，不要直接给答案；看不清就直说。', img.full).then(function (reply) {
        var text = reply || (chatToken()
          ? '在线分析暂时没成功，照片已保存。可以先说说你卡在哪一题，我陪你理思路。'
          : '现在没有 AI 口令，读不了图片里的字。照片已保存；家长可在「更多 → AI 口令」设置后重新拍一次。');
        var result = { busy: false, ok: !!reply, text: text, thumb: img.thumb, ts: Date.now() };
        rt.judge[id] = result;
        var t2 = findTask(id);
        if (t2) {
          t2.judge = { ts: result.ts, ok: !!reply, text: text.slice(0, 1200), thumb: img.thumb };
          t2.updatedAt = Date.now();
          save();
        }
        state.chat.push({ id: uid('c'), ts: Date.now(), role: 'u', text: '（上传了作业照片）', img: img.thumb });
        state.chat.push({ id: uid('c'), ts: Date.now() + 1, role: 'a', text: text.slice(0, 1200) });
        state.chat = state.chat.slice(-300);
        save();
        render();
        toast(reply ? '小搭分析完成，结果已记在任务里' : '照片已保存，配置 AI 口令后可重新分析', reply ? 'success' : 'warn');
      });
    }).catch(function () {
      rt.judge[id] = { busy: false, ok: false, text: '图片处理失败，换一张试试。', ts: Date.now() };
      render();
      toast('图片处理失败，换一张试试', 'warn');
    });
  }

  /* ---------- 18. 事件绑定 ---------- */
  function toggleDrawer(open) {
    var sb = $('#effSidebar'), scrim = $('#effScrim');
    if (!sb) return;
    sb.classList.toggle('is-open', !!open);
    if (scrim) scrim.classList.toggle('is-show', !!open);
    document.body.classList.toggle('is-drawer-open', !!open);
    var btn = $('#effMenuBtn');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function isMobileDrawer() { return window.matchMedia && window.matchMedia('(max-width: 960px)').matches; }

  function shiftMonth(delta) {
    var y = ui.calMonth.y, m = ui.calMonth.m + delta;
    while (m < 0) { m += 12; y -= 1; }
    while (m > 11) { m -= 12; y += 1; }
    ui.calMonth = { y: y, m: m };
    render();
  }

  function onClick(e) {
    var closer = e.target.closest('[data-close]');
    if (closer) { closeModal(); return; }
    var nav = e.target.closest('.eff-nav-btn[data-page]');
    if (nav) { setPage(nav.getAttribute('data-page')); if (isMobileDrawer()) toggleDrawer(false); return; }
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    var id = el.getAttribute('data-id');

    switch (act) {
      case 'set-role': setRole(el.getAttribute('data-role')); break;
      case 'choose-parent': closeModal(); setTimeout(requestParentAccess, 80); break;
      case 'save-pin': submitPinSetup(); break;
      case 'verify-pin': submitPinVerify(); break;
      case 'open-pin': closeModal(); setTimeout(function () { if (state.role === 'parent') openPinSetup(); else requestParentAccess(); }, 80); break;
      case 'open-role': closeModal(); setTimeout(openRoleModal, 60); break;
      case 'open-profile': closeModal(); setTimeout(openProfileModal, 60); break;
      case 'save-profile': {
        var nick = (($('#pfNick') || {}).value || '').trim().slice(0, 12);
        if (!nick) { toast('昵称不能为空', 'warn'); return; }
        state.profile.nick = nick;
        var grade = ($('#pfGrade') || {}).value;
        if (grade) state.profile.grade = grade;
        save(); closeModal(); render(); toast('资料已保存', 'success');
        break;
      }
      case 'more': openMoreModal(); break;
      case 'demo-dismiss': dismissDemo(); break;
      case 'demo-clean': openDemoClean(); break;
      case 'do-demo-clean': doDemoClean(); break;
      case 'open-history': openTaskHistory(); break;
      case 'open-chat': closeModal(); setTimeout(openChat, 60); break;
      case 'chat-send': sendChat(); break;
      case 'chat-pick-image': pickChatImage(); break;
      case 'chat-remove-image': rt.chatImage = null; refreshChatPreview(); break;
      case 'open-ai-token': closeModal(); setTimeout(openAiTokenModal, 60); break;
      case 'save-ai-token': saveAiToken(); break;
      case 'clear-ai-token': clearAiToken(); break;
      case 'open-cloud': closeModal(); setTimeout(openCloudModal, 60); break;
      case 'cloud-on': enableCloud(); break;
      case 'cloud-join': joinCloud(); break;
      case 'cloud-copy': copyCloudCode(); break;
      case 'cloud-reset': resetCloudCode(); break;
      case 'cloud-revoke': closeModal(); setTimeout(cloudRevokeDevices, 60); break;
      case 'cloud-off': disableCloud(); break;
      case 'cloud-now': closeModal(); cloudSyncNow(true); break;
      case 'open-judge-records': closeModal(); setTimeout(openJudgeRecords, 60); break;
      case 'export-data': exportData(); break;
      case 'import-data': triggerImport(); break;
      case 'do-import': doImport(); break;
      case 'open-reset': openResetModal(); break;
      case 'do-reset': {
        try { localStorage.removeItem(STORE_KEY); } catch (err) { }
        state = normalizeState(seedState());
        state.meta.goalsImported = 1;
        state.meta.recordsImported = 1;
        state.meta.chatImported = 1;
        save();
        ui.page = 'today'; ui.tab = '全部'; ui.openTask = null; ui.recog = null; ui.recogCands = null; ui.recogBusy = false;
        ui.rewardCat = '全部'; ui.calMonth = null; ui.answers = {};
        rt.timers = {}; rt.recordings = {}; rt.recording = null; rt.judge = {};
        closeModal(); render(); toast('演示数据已重置', 'success');
        break;
      }
      case 'logout': openLogoutModal(); break;
      case 'do-logout': {
        state.role = 'student'; save(); closeModal(); setPage('today');
        toast('已回到学生端首页', 'success');
        break;
      }
      case 'view-today': ui.viewDate = dayKey(Date.now()); render(); break;
      case 'scroll-tasks': {
        var sec = $('#taskListSection');
        if (sec) { try { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) { } }
        break;
      }
      case 'tab': ui.tab = el.getAttribute('data-tab') || '全部'; render(); break;
      case 'pick-photo': pickPhoto(); break;
      case 'cancel-recog': cancelRecog(); break;
      case 'confirm-recog': confirmRecog(); break;
      case 'toggle-task': toggleTask(id, el.closest('.tick') || el); break;
      case 'expand-task': expandTask(id); break;
      case 'edit-task': openEditTask(id); break;
      case 'submit-edit-task': submitEditTask(id); break;
      case 'delete-task': openDeleteTask(id); break;
      case 'do-delete-task': doDeleteTask(id); break;
      case 'undo-task': undoTask(id); break;
      case 'done-toggle': ui.doneOpen = !ui.doneOpen; render(); break;
      case 'timer-start': startTimer(id); break;
      case 'timer-pause': pauseTimer(id); break;
      case 'timer-reset': resetTimer(id); break;
      case 'record-start': startRecord(id); break;
      case 'record-stop': stopRecord(id); break;
      case 'speak-task': speakTask(id); break;
      case 'speak-words': speakWords(id); break;
      case 'speak-pairs': speakPairs(id); break;
      case 'speak-text': speak(el.getAttribute('data-text'), el.getAttribute('data-lang') || 'zh-CN'); break;
      case 'toggle-answer': ui.answers[id] = !ui.answers[id]; render(); break;
      case 'judge-homework': judgeHomework(id); break;
      case 'add-task': openAddTask(); break;
      case 'submit-task': submitTask(); break;
      case 'add-reward': openAddReward(); break;
      case 'submit-reward': submitReward(); break;
      case 'edit-reward': openEditReward(id); break;
      case 'submit-edit-reward': submitEditReward(id); break;
      case 'delete-reward': openDeleteReward(id); break;
      case 'do-delete-reward': doDeleteReward(id); break;
      case 'add-exam': openAddExam(); break;
      case 'submit-exam': submitExam(); break;
      case 'edit-exam': openEditExam(id); break;
      case 'submit-edit-exam': submitEditExam(id); break;
      case 'delete-exam': openDeleteExam(id); break;
      case 'do-delete-exam': doDeleteExam(id); break;
      case 'redeem': openRedeem(id); break;
      case 'confirm-redeem': confirmRedeem(id); break;
      case 'exam-done': markExam(id, el); break;
      case 'exam-undo': undoExam(id); break;
      case 'approve-task': approveTask(id); break;
      case 'reject-task': rejectTask(id); break;
      case 'approve-all': approveAllPending(); break;
      case 'reject-all': rejectAllPending(); break;
      case 'toggle-approval': toggleApproval(); break;
      case 'mastery-group': {
        var sub = el.getAttribute('data-subject');
        ui.masteryOpen[sub] = !ui.masteryOpen[sub];
        render();
        break;
      }
      case 'mastery-toggle': toggleMastery(id); break;
      case 'cal-prev': shiftMonth(-1); break;
      case 'cal-next': shiftMonth(1); break;
      case 'cal-today': {
        var n = new Date(); ui.calMonth = { y: n.getFullYear(), m: n.getMonth() }; render(); break;
      }
      case 'reward-cat': ui.rewardCat = el.getAttribute('data-cat') || '全部'; render(); break;
      default: break;
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      if (rt.modalOpen) { closeModal(); return; }
      if ($('#effSidebar') && $('#effSidebar').classList.contains('is-open')) { toggleDrawer(false); return; }
    }
    if (rt.modalOpen && e.key === 'Tab') {
      var f = $$('#effModalRoot input, #effModalRoot select, #effModalRoot textarea, #effModalRoot button, #effModalRoot a').filter(function (x) { return !x.disabled && x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (rt.modalOpen && e.key === 'Enter' && e.target && e.target.tagName === 'INPUT') {
      if (e.target.id === 'chatInput') { e.preventDefault(); sendChat(); return; }
      var submit = $('#effModalRoot [data-act^="submit-"]');
      if (submit) { e.preventDefault(); submit.click(); }
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('task-main')) {
      if (e.target.getAttribute('data-act') === 'expand-task') {
        e.preventDefault();
        expandTask(e.target.getAttribute('data-id'));
      }
    }
  }

  function onChange(e) {
    var t = e.target;
    if (!t) return;
    if (t.id === 'effViewDate') {
      var vd = t.value;
      if (/^\d{4}-\d{2}-\d{2}$/.test(vd)) { ui.viewDate = vd; render(); }
      return;
    }
    if (t.id === 'effPhotoInput') {
      var f = t.files && t.files[0];
      t.value = '';
      handlePhoto(f);
    } else if (t.id === 'effJudgeInput') {
      var j = t.files && t.files[0];
      t.value = '';
      handleJudge(j);
    } else if (t.id === 'effImportInput') {
      var b = t.files && t.files[0];
      t.value = '';
      handleImportFile(b);
    } else if (t.id === 'chatImageInput') {
      var ci = t.files && t.files[0];
      t.value = '';
      handleChatImage(ci);
    }
  }

  function watchDayChange() {
    var check = function () {
      if (!state) return;
      if (dayKey(Date.now()) !== state.meta.lastRoll) {
        var changed = rollTasksOver();
        render();
        if (changed) toast('新的一天，未完成任务已结转到今天', 'info');
      }
    };
    setInterval(check, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
  }
  function registerSW() {
    try {
      if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
        navigator.serviceWorker.register('sw.js').then(function (reg) {
          function notify() {
            if (navigator.serviceWorker.controller) toast('新版本已就绪，重新打开后生效', 'info');
          }
          if (reg.waiting) notify();
          reg.addEventListener('updatefound', function () {
            var nw = reg.installing;
            if (!nw) return;
            nw.addEventListener('statechange', function () {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) notify();
            });
          });
        }).catch(function () { });
      }
    } catch (e) { }
  }

  function bindEvents() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('change', onChange);
    var menuBtn = $('#effMenuBtn'), closeBtn = $('#effMobileClose'), scrim = $('#effScrim');
    if (menuBtn) menuBtn.addEventListener('click', function () { toggleDrawer(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { toggleDrawer(false); });
    if (scrim) scrim.addEventListener('click', function () { toggleDrawer(false); });
    var roleSwitch = $('#effRoleSwitch');
    if (roleSwitch) roleSwitch.addEventListener('click', openRoleModal);
    var mobileStars = $('#effMobileStars');
    if (mobileStars) mobileStars.addEventListener('click', function () { setPage('stars'); });
    var user = $('#effUser');
    if (user) user.addEventListener('click', openProfileModal);
    var more = $('#effExit');
    if (more) more.addEventListener('click', openMoreModal);
    var logout = $('#effLogout');
    if (logout) logout.addEventListener('click', openLogoutModal);
    window.addEventListener('popstate', function () {
      var p = currentPage();
      if (p !== ui.page) { ui.page = p; render(); }
    });
    window.addEventListener('hashchange', function () {
      var p = currentPage();
      if (p !== ui.page) { ui.page = p; render(); }
    });
    window.addEventListener('storage', function (e) {
      if (e.key !== STORE_KEY || !e.newValue) return;
      try {
        state = normalizeState(JSON.parse(e.newValue));
        rollTasksOver();
        render();
        toast('已同步另一个标签页的修改', 'info');
      } catch (err) { }
    });
    var mq = window.matchMedia ? window.matchMedia('(max-width: 960px)') : null;
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function (ev) { if (!ev.matches) toggleDrawer(false); });
    }
  }

  /* ---------- 19. 初始化 ---------- */
  function injectShell() {
    var map = { sun: 'sun', target: 'target', cap: 'cap', trophy: 'trophy', gift: 'gift' };
    $$('.eff-nav-ico').forEach(function (el) {
      el.innerHTML = icon(map[el.getAttribute('data-ico')] || 'sparkles');
    });
    if (!$('#effPhotoInput')) {
      var p = document.createElement('input');
      p.type = 'file'; p.id = 'effPhotoInput'; p.accept = 'image/*'; p.style.display = 'none';
      document.body.appendChild(p);
    }
    if (!$('#effJudgeInput')) {
      var j = document.createElement('input');
      j.type = 'file'; j.id = 'effJudgeInput'; j.accept = 'image/*'; j.style.display = 'none';
      document.body.appendChild(j);
    }
    if (!$('#effImportInput')) {
      var b = document.createElement('input');
      b.type = 'file'; b.id = 'effImportInput'; b.accept = 'application/json,.json'; b.style.display = 'none';
      document.body.appendChild(b);
    }
    if (!$('#effXiaodaFab')) {
      var fab = document.createElement('button');
      fab.type = 'button'; fab.id = 'effXiaodaFab'; fab.className = 'eff-xiaoda-fab';
      fab.setAttribute('aria-label', '打开小搭');
      fab.innerHTML = '<span class="fab-ico">' + icon('sparkles') + '</span><span>小搭</span>';
      fab.addEventListener('click', openChat);
      document.body.appendChild(fab);
    }
    if (!$('#chatImageInput')) {
      var chatImg = document.createElement('input');
      chatImg.type = 'file'; chatImg.id = 'chatImageInput'; chatImg.accept = 'image/*'; chatImg.style.display = 'none';
      document.body.appendChild(chatImg);
    }
    if (!$('#effCloudBadge')) {
      var cb = document.createElement('button');
      cb.type = 'button'; cb.id = 'effCloudBadge'; cb.className = 'eff-cloud-badge';
      cb.addEventListener('click', openCloudModal);
      var foot = $('#effSidebar .eff-side-foot');
      var sb = $('#effSidebar');
      if (foot && foot.parentNode) foot.parentNode.insertBefore(cb, foot);
      else if (sb) sb.appendChild(cb);
    }
  }

  function init() {
    var params = new URLSearchParams(location.search);
    var resetRequested = params.get('reset') === '1';
    if (resetRequested) {
      try { localStorage.removeItem(STORE_KEY); } catch (e) { }
      params.delete('reset');
      try {
        var q = params.toString();
        history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + (location.hash || ''));
      } catch (e2) { }
    }
    state = resetRequested ? normalizeState(seedState()) : loadState();
    ensureDevice();
    if (resetRequested) {
      state.meta.goalsImported = 1;
      state.meta.recordsImported = 1;
      state.meta.chatImported = 1;
      save();
    }
    rollTasksOver();
    save();
    var parentAuthed = safeSessionGet('lc_parent_ok') === '1';
    if (state.role === 'parent' && !parentAuthed && !params.has('parent')) {
      state.role = 'student';
      save();
    }
    if (params.has('parent')) {
      if (safeSessionGet('lc_parent_ok') === '1' || !state.meta.parentPin) state.role = 'parent';
      else { state.role = 'student'; setTimeout(requestParentAccess, 500); }
    }
    else if (params.has('view')) state.role = 'student';
    ui.page = currentPage();
    var now = new Date();
    ui.calMonth = { y: now.getFullYear(), m: now.getMonth() };
    ui.tab = '全部';
    ui.rewardCat = '全部';
    injectShell();
    bindEvents();
    render();
    cloudInit();
    window.addEventListener('offline', function () {
      cloudRenderBadge();
      try { toast('已离线，任务和星星仍保存在本机', 'warn'); } catch (e) { }
    });
    window.addEventListener('online', function () {
      cloudRenderBadge();
      try { toast('网络已恢复', 'success'); } catch (e) { }
      if (cloudOn()) cloudSyncNow(false);
    });
    registerSW();
    watchDayChange();
    window.__effReady = true;
    window.__eff = {
      version: '1.1',
      getState: function () { return state; },
      totals: function () { return starTotals(); },
      today: todayTasks,
      roll: function () { var c = rollTasksOver(); render(); return c; },
      exportJSON: function () { return JSON.stringify(state); },
      go: function (p) { setPage(p); },
      render: render,
      cloudSync: cloudSyncNow,
      cloudState: function () { return { enabled: cloudOn(), busy: cloud.busy, pending: cloud.pending, last: cloud.last, err: cloud.err }; },
      cloudMergeTest: function (a, b, preferA) { return cloudMerge(a, b, preferA === undefined ? true : !!preferA); },
      cryptTest: function () {
        var code = newSyncCode();
        var id = syncCodeToId(code);
        return encryptCloudData({ ok: 42 }, code, id).then(function (enc) {
          return decryptCloudData(enc, code, id).then(function (dec) {
            return { code: code, id: id, enc: enc.enc, ok: dec.ok };
          });
        });
      }
    };
    if (ui.page !== 'today') {
      try { window.scrollTo(0, 0); } catch (e3) { }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
