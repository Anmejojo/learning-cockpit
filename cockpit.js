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
  var CATALOG_VERSION = 2;
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
  function legacyComputerRewards() {
    return [
      { id: 'pc_mousepad', name: '鼠标垫', icon: '🖱️', cost: 30, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_mouse', name: '鼠标', icon: '🐭', cost: 200, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_powerstrip', name: '排插', icon: '🔌', cost: 100, cat: '电脑', detail: '初二上期中 · 主科均分≥100' },
      { id: 'pc_keyboard', name: '键盘', icon: '⌨️', cost: 400, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_headset', name: '耳机', icon: '🎧', cost: 350, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_webcam', name: '摄像头', icon: '🎥', cost: 200, cat: '电脑', detail: '初二上期末 · 总分≥508' },
      { id: 'pc_speaker', name: '音响', icon: '🔊', cost: 400, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_case', name: '机箱', icon: '🎒', cost: 350, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_gamepad', name: '游戏手柄', icon: '🕹️', cost: 350, cat: '电脑', detail: '初二下期中 · 总分≥517' },
      { id: 'pc_ssd', name: 'SSD 1TB', icon: '💾', cost: 500, cat: '电脑', detail: '初二下期末 · 总分≥538' },
      { id: 'pc_cooler', name: '散热器', icon: '❄️', cost: 300, cat: '电脑', detail: '初二下期末 · 总分≥538' },
      { id: 'pc_psu', name: '电源 750W', icon: '⚡', cost: 500, cat: '电脑', detail: '初三上期中 · 总分≥580' },
      { id: 'pc_hdd', name: '机械硬盘', icon: '💽', cost: 500, cat: '电脑', detail: '初三上期中 · 总分≥580' },
      { id: 'pc_ram', name: '内存 32G', icon: '🧠', cost: 600, cat: '电脑', detail: '初三上期末 · 总分≥610' },
      { id: 'pc_motherboard', name: '主板', icon: '🔧', cost: 1000, cat: '电脑', detail: '一模≥600 · 初三下开学' },
      { id: 'pc_monitor', name: '显示器 2K', icon: '📺', cost: 1200, cat: '电脑', detail: '二模≥610 · 初三下期中' },
      { id: 'pc_cpu', name: 'CPU', icon: '🧮', cost: 1500, cat: '电脑', detail: '三模≥615 · 中考前冲刺' },
      { id: 'pc_gpu', name: '显卡', icon: '🎮', cost: 2500, cat: '电脑', detail: '中考≥625 · 中考达标' },
      { id: 'game_switch', name: 'Switch 游戏机', icon: '🎮', cost: 3508, cat: '游戏', detail: '积分兑换 · 游戏机大奖' },
      { id: 'game_zelda', name: '塞尔达游戏', icon: '🗡️', cost: 287, cat: '游戏', detail: '积分兑换 · Switch 游戏卡带' }
    ];
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
      meta: { demo: true, demoTasks: true, legacy: false, legacyTasks: 0, lastRoll: todayKeyNow, noticeDismissed: false, parentPin: '', catalogV: CATALOG_VERSION }
    };
  }

  /* ---------- 5. 存储 / 迁移 ---------- */
  var state = null;
  var ui = { page: 'today', tab: '全部', rewardCat: '全部', openTask: null, doneOpen: true, masteryOpen: { 语文: true, 英语: false, 数学: false, 物理: false }, calMonth: null, answers: {}, recog: null, recogBusy: false, recogCands: null, demoDismissed: false };
  var rt = { timers: {}, recordings: {}, recording: null, judgeTask: null, judge: {}, speakSeq: 0, confirm: null, lastFocus: null, modalOpen: false };
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
    var ok = safeSet(STORE_KEY, JSON.stringify(state));
    if (!ok && !saveWarned) {
      saveWarned = true;
      try { toast('本地存储失败，请尽快在「更多」里导出备份', 'warn'); } catch (e) { }
    }
    return ok;
  }
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
    if (!log.length && !(Array.isArray(o.hw) && o.hw.length) && !(Array.isArray(o.tasks) && o.tasks.length) && !(Array.isArray(o.checks) && o.checks.length) && !(Array.isArray(o.smallGoals) && o.smallGoals.length)) return null;
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
    return {
      nick: typeof o.nick === 'string' && o.nick.trim() ? o.nick.trim() : '',
      grade: /^初[一二三][上下]$/.test(String(o.sem || '')) ? String(o.sem) : '',
      log: log,
      tasks: legacyTasks,
      goals: legacyGoals
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
    s.settings = s.settings && typeof s.settings === 'object' ? s.settings : { starGoal: 200 };
    s.meta = s.meta && typeof s.meta === 'object' ? s.meta : {};
    if (typeof s.meta.demo !== 'boolean') s.meta.demo = false;
    if (typeof s.meta.demoTasks !== 'boolean') s.meta.demoTasks = false;
    if (typeof s.meta.legacy !== 'boolean') s.meta.legacy = false;
    if (typeof s.meta.legacyTasks !== 'number' || !isFinite(s.meta.legacyTasks)) s.meta.legacyTasks = 0;
    if (typeof s.meta.noticeDismissed !== 'boolean') s.meta.noticeDismissed = false;
    if (typeof s.meta.parentPin !== 'string') s.meta.parentPin = '';
    if (typeof s.meta.goalsImported !== 'number') s.meta.goalsImported = 0;
    if (typeof s.meta.recordsImported !== 'number') s.meta.recordsImported = 0;
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
      if (!t.done) delete t.doneAt;
      if (t.carriedFrom && !/^\d{4}-\d{2}-\d{2}$/.test(t.carriedFrom)) delete t.carriedFrom;
    }
    for (i = 0; i < s.examGoals.length; i++) {
      t = s.examGoals[i]; if (!t || typeof t !== 'object') continue;
      t.id = t.id || uid('e');
      t.target = Math.max(0, Math.round(num(t.target, 90)));
      t.stars = Math.max(1, Math.round(num(t.stars, 5)));
      t.done = !!t.done;
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
    return s;
  }
  function ensureCatalogRewards(s) {
    if (!s || !Array.isArray(s.rewards)) return;
    if (num(s.meta && s.meta.catalogV) >= CATALOG_VERSION) return;
    var ids = {}, names = {};
    s.rewards.forEach(function (r) { if (!r) return; ids[r.id] = 1; names[r.name] = 1; });
    legacyComputerRewards().forEach(function (r) {
      if (ids[r.id] || names[r.name]) return;
      s.rewards.push({ id: r.id, name: r.name, icon: r.icon, cost: r.cost, cat: r.cat, detail: r.detail });
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
      s.meta.goalsImported = 1;
      s.meta.recordsImported = 1;
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
  function shortDayLabel(key) {
    if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return '';
    var p = key.split('-');
    return Number(p[1]) + '月' + Number(p[2]) + '日';
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
  function starTotals() { return logTotals(state.log); }
  function todayStars() {
    var key = dayKey(Date.now()), sum = 0;
    for (var i = 0; i < state.log.length; i++) {
      var e = state.log[i];
      if (dayKey(e.ts) !== key) continue;
      if (e.delta > 0) sum += e.delta;
      else if (e.kind === 'undo' || e.kind === 'exam') sum += e.delta;
    }
    return Math.max(0, sum);
  }
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
  function changeStars(delta, reason, kind) {
    if (!delta) return;
    state.log.unshift({ id: uid('lg'), ts: Date.now(), delta: Math.round(delta), reason: String(reason || '星星调整'), kind: kind || 'task' });
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
      '<div class="page-head-side">' +
      '<span class="date-text">' + fullDateCN(d.getTime()) + '</span>' +
      (opts.side || '') +
      '</div></header>';
    return html;
  }
  function renderToday() {
    var tasks = todayTasks();
    var doneTasks = tasks.filter(function (t) { return t.done; });
    var undone = tasks.length - doneTasks.length;
    var earned = todayStars();
    var subjects = [];
    SUB_ORDER.forEach(function (s) { if (tasks.some(function (t) { return t.subject === s; })) subjects.push(s); });
    tasks.forEach(function (t) { if (subjects.indexOf(t.subject) < 0) subjects.push(t.subject); });
    var tab = ui.tab && (ui.tab === '全部' || subjects.indexOf(ui.tab) >= 0) ? ui.tab : '全部';
    ui.tab = tab;

    var h = pageHead('today', {
      title: '今天要做',
      icon: 'sun',
      sub: '按分类添加今天的任务，完成一个就 <b>+1</b> ⭐',
      side: '<button class="btn btn-ghost btn-sm" type="button" data-act="scroll-tasks">' + icon('home') + '今天</button>'
    });

    var meta = state.meta || {};
    var hasLegacyTasks = num(meta.legacyTasks) > 0;
    if ((meta.demo || meta.demoTasks || hasLegacyTasks) && !meta.noticeDismissed && !ui.demoDismissed) {
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
      '<div class="stat"><b>' + tasks.length + '</b><span>今日任务</span></div>' +
      '<div class="stat is-primary"><b>' + doneTasks.length + '</b><span>已完成</span></div>' +
      '<div class="stat is-gold"><b>' + earned + '</b><span>今日获得 <i class="star-mini">★</i></span></div>' +
      '</div>';

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
      '<div class="section-head"><div class="section-title">' + icon('book') + '分类任务清单 <small>' + undone + ' 条待完成</small></div>' +
      '<div class="section-sub"><span>完成一个 +1 ⭐</span><span class="meta-dot"></span><button class="section-link" type="button" data-act="open-history">历史完成</button></div></div>';
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
      h += emptyState('🌤️', '今天还没有任务', '点上面的「拍照 / 选择图片」，让 AI 帮你把作业拆成一条条小任务。', state.role === 'parent' ? '<button class="btn btn-primary btn-sm" type="button" data-act="add-task">' + icon('plus') + '手动添加任务</button>' : '');
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
    var h = '<div class="task-item" data-id="' + esc(t.id) + '">' +
      '<div class="task-row' + (t.done ? ' is-done' : '') + '">' +
      '<button class="tick" type="button" data-act="toggle-task" data-id="' + esc(t.id) + '" aria-label="' + (t.done ? '已完成' : '完成任务 ' + t.title) + '" aria-pressed="' + t.done + '">' + icon('check') + '</button>' +
      '<div class="task-main" data-act="expand-task" data-id="' + esc(t.id) + '" role="button" tabindex="0" aria-expanded="' + open + '" aria-label="展开 ' + esc(t.title) + ' 的学习工具">' +
      '<div class="task-title">' + esc(t.title) + (t.isNew ? '<i class="task-new">AI</i>' : '') + (t.carriedFrom ? '<span class="task-carry">结转</span>' : '') + '</div>' +
      '<div class="task-meta"><span class="tag">' + typeTag(t.type) + '</span>' +
      (t.minutes ? '<span class="meta-dot"></span><span>' + t.minutes + ' 分钟</span>' : '') +
      (t.judge ? '<span class="meta-dot"></span><span>已判题</span>' : '') +
      (t.carriedFrom ? '<span class="meta-dot"></span><span>从 ' + shortDayLabel(t.carriedFrom) + ' 结转</span>' : '') +
      '</div></div>' +
      '<div class="task-right"><span class="star-pill">+' + t.stars + ' <i>★</i></span>' +
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
      h += '<div class="tools-head"><span class="tools-title">' + icon('camera') + '作业拍照 · AI 检查</span>' +
        '<span class="badge ' + (j && !j.busy ? 'badge-sage' : 'badge-muted') + '">' + (j && j.busy ? '检查中…' : j ? '已判题' : '未检查') + '</span></div>' +
        '<div class="tools-row"><button class="btn btn-primary btn-sm" type="button" data-act="judge-homework" data-id="' + esc(t.id) + '">' + icon('camera') + '拍照 / 上传作业</button>' +
        '<span class="tiny muted">判题结果会同步给家长端</span></div>';
      if (j && !j.busy) {
        h += '<div class="homework-result">' + icon('check') + 'AI 检查完成：' + (j.count || 3) + ' 道题' + (j.ok === false ? '有 1 处需要订正' : '全部正确') + '，家长端可见</div>';
      }
      h += '<div class="tools-tip">' + icon('info') + '<span>拍清楚题面再上传，判题结果只是参考，订正后可以再拍一次。</span></div>';
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
          '<div class="reward-cost"><i>★</i>' + r.cost + ' 颗</div>' +
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
        '<div class="field"><label for="atMinutes">预计分钟</label><input id="atMinutes" type="number" min="0" max="180" step="5" placeholder="10"></div>' +
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
    var task = { id: uid('t'), subject: subject, title: title, type: type, stars: stars, done: false, isNew: true, date: dayKey(Date.now()), createdAt: Date.now(), updatedAt: Date.now() };
    if (minutes > 0) task.minutes = minutes;
    if (type === 'timer') task.seconds = Math.max(60, (minutes || 5) * 60);
    if (type === 'words') task.words = ['study', 'practice', 'improve', 'knowledge', 'progress'];
    if (type === 'dictation') task.pairs = [['go', 'went'], ['take', 'took'], ['see', 'saw'], ['write', 'wrote']];
    if (type === 'recite' || type === 'read') task.passage = '';
    state.tasks.unshift(task);
    save();
    closeModal();
    setPage('today');
    toast('已添加「' + title + '」，完成就能拿星星', 'success');
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
        '<div class="field"><label for="arCost">所需星星</label><input id="arCost" type="number" min="1" max="999" step="1" value="30"></div>' +
        '<div class="field field-full"><label for="arCat">分类</label><select id="arCat">' + cats + '</select></div>' +
        '</div><p class="form-note" style="margin-top:11px">奖励会出现在「我的要兑换」里，星星够时孩子可以自己兑换。</p>',
      footer: '<button class="btn btn-ghost" type="button" data-close>取消</button>' +
        '<button class="btn btn-primary" type="button" data-act="submit-reward">' + icon('plus') + '添加奖励</button>'
    });
  }
  function submitReward() {
    if (!requireParent('切换到家长端才能添加奖励')) return;
    var name = (($('#arName') || {}).value || '').trim();
    if (!name) { toast('给奖励起个名字吧', 'warn'); var el = $('#arName'); if (el) el.focus(); return; }
    var emoji = (($('#arIcon') || {}).value || '🎁').trim().slice(0, 4) || '🎁';
    var cost = clamp(Math.round(num(($('#arCost') || {}).value, 30)), 1, 999);
    var cat = ($('#arCat') || {}).value || '心愿';
    state.rewards.unshift({ id: uid('r'), name: name, icon: emoji, cost: cost, cat: cat });
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
        '<div class="field"><label for="erCost">所需星星</label><input id="erCost" type="number" min="1" max="999" step="1" value="' + r.cost + '"></div>' +
        '<div class="field field-full"><label for="erCat">分类</label><select id="erCat">' + cats + '</select></div>' +
        '</div>' + (r.detail ? '<p class="form-note" style="margin-top:11px">旧版条件：' + esc(r.detail) + '（仅展示，不参与兑换判断）</p>' : '') +
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
    r.cost = clamp(Math.round(num(($('#erCost') || {}).value, 10)), 1, 999);
    r.cat = ($('#erCat') || {}).value || '心愿';
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
    state.examGoals.push({ id: uid('e'), subject: subject, title: title, target: target, stars: stars, done: false });
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
    if (t.done) { toast('这条已完成，可以在「已完成」里撤销', 'warn'); return; }
    t.done = true;
    t.doneAt = Date.now();
    changeStars(t.stars, '完成 · ' + t.title, 'task');
    save();
    if (ui.openTask === id) ui.openTask = null;
    stopTimer(id, true);
    var rect = el ? el.getBoundingClientRect() : null;
    render();
    if (rect) burstAt(rect.left + rect.width / 2, rect.top + rect.height / 2, 11);
    else burstAtEl($('#effSideBalance'), 9);
    toast('太棒了！+' + t.stars + ' 颗星星', 'success');
  }
  function undoTask(id) {
    var t = findTask(id);
    if (!t || !t.done) return;
    if (!requireStudent('切换到学生端才能撤销打卡')) return;
    if (starTotals().balance - t.stars < 0) { toast('星星已经花掉了，暂时不能撤销这条', 'warn'); return; }
    t.done = false;
    delete t.doneAt;
    changeStars(-t.stars, '撤销 · ' + t.title, 'undo');
    save();
    render();
    toast('已撤销，' + t.stars + ' 颗星星已扣回', 'info');
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
    changeStars(g.stars, '达成考试目标 · ' + g.title + ' ' + g.target + ' 分', 'exam');
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
    if (starTotals().balance - g.stars < 0) { toast('星星已经花掉了，暂时不能撤销', 'warn'); return; }
    g.done = false;
    delete g.doneAt;
    changeStars(-g.stars, '撤销考试奖励 · ' + g.title, 'exam');
    save();
    render();
    toast('已撤销，星星已扣回', 'info');
  }
  function toggleMastery(id) {
    var m = state.mastery.filter(function (x) { return x.id === id; })[0];
    if (!m) return;
    m.known = !m.known;
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
      var t = { id: uid('t'), subject: c.subject, title: c.title, type: c.type, stars: c.stars, done: false, isNew: true };
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
    rt.judge[id] = { busy: true };
    render();
    toast('AI 正在检查作业…', 'info');
    setTimeout(function () {
      var task = findTask(id);
      var result = { busy: false, ok: true, count: 3, ts: Date.now() };
      rt.judge[id] = result;
      if (task) { task.judge = { ts: result.ts, ok: true, count: 3 }; save(); }
      render();
      toast('检查完成：3 道题全部正确 ✅ 家长端可见', 'success');
    }, 900);
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
      case 'export-data': exportData(); break;
      case 'import-data': triggerImport(); break;
      case 'do-import': doImport(); break;
      case 'open-reset': openResetModal(); break;
      case 'do-reset': {
        try { localStorage.removeItem(STORE_KEY); } catch (err) { }
        state = normalizeState(seedState());
        state.meta.goalsImported = 1;
        state.meta.recordsImported = 1;
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
        navigator.serviceWorker.register('sw.js').catch(function () { });
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
    if (resetRequested) {
      state.meta.goalsImported = 1;
      state.meta.recordsImported = 1;
      save();
    }
    rollTasksOver();
    save();
    var parentAuthed = safeSessionGet('lc_parent_ok') === '1';
    if (state.role === 'parent' && !parentAuthed && !params.has('parent')) {
      state.role = 'student';
      save();
    }
    if (params.has('parent')) state.role = 'parent';
    else if (params.has('view')) state.role = 'student';
    ui.page = currentPage();
    var now = new Date();
    ui.calMonth = { y: now.getFullYear(), m: now.getMonth() };
    ui.tab = '全部';
    ui.rewardCat = '全部';
    injectShell();
    bindEvents();
    render();
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
      render: render
    };
    if (ui.page !== 'today') {
      try { window.scrollTo(0, 0); } catch (e3) { }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
