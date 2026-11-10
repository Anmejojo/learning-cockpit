/* ===================================================================
   乐乐学习驾驶舱 · 成绩墙（左墙）
   -------------------------------------------------------------------
   · 数据全部由 app.js 传进来（exams/subs/streak/mistakes/pts/certs/
     timeline），本文件不碰 D、不存业务数据。
   · 宽屏排成一面墙（3 列），窄屏排成竖排大卡（像刷一面墙）。
   · 只暴露 window.WALL.mount(host, data)。
   =================================================================== */
(function () {
  'use strict';

  /* ---------- 小工具 ---------- */
  function rr(x, y, w, h, r, fill, extra) {
    return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) +
      '" height="' + h.toFixed(1) + '" rx="' + r + '" fill="' + fill + '" ' + (extra || '') + '/>';
  }
  var TS = 1;   /* 文字缩放：宽屏卡片会被缩小，这里补回来 */
  function tx(x, y, s, size, fill, anchor, weight, ls) {
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + ((size || 11) * TS).toFixed(1) +
      '" fill="' + (fill || '#98a1b3') + '" text-anchor="' + (anchor || 'start') + '"' +
      (weight ? ' font-weight="' + weight + '"' : '') + (ls ? ' letter-spacing="' + ls + '"' : '') +
      ' font-family="-apple-system,Microsoft YaHei,sans-serif">' + s + '</text>';
  }
  function shadow(x, y, w, h, op) {
    return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) +
      '" fill="rgba(0,0,0,' + (op || .5) + ')" filter="url(#wlSoft)"/>';
  }
  function frame(x, y, w, h, title) {
    var s = shadow(x + 4, y + 6, w, h, .55);
    s += rr(x, y, w, h, 4, 'url(#wlWood)');
    s += rr(x + 8, y + 8, w - 16, h - 16, 2, '#1a1e25');
    if (title) s += tx(x + 16, y + 26, title, 11, '#8b93a5', 'start', '600', 1);
    return s;
  }

  /* ---------- 墙上的物件（都用局部坐标 0,0 起画） ---------- */
  var D = null;

  function chartWall(w, h) {
    var s = frame(0, 0, w, h, '成绩曲线 · 近 ' + D.exams.length + ' 次');
    if (!D.exams.length) return s + tx(w / 2, h / 2, '还没有成绩记录', 12, '#5f6a80', 'middle');
    var px = 26, py = 48, pw = w - 50, ph = h - 84;
    var vals = D.exams.map(function (e) { return e.v });
    var min = Math.min.apply(null, vals) - 20, max = Math.max.apply(null, vals) + 20;
    if (max - min < 40) { min -= 20; max += 20; }
    function X(i) { return px + pw * (D.exams.length < 2 ? .5 : i / (D.exams.length - 1)) }
    function Y(v) { return py + ph * (1 - (v - min) / (max - min)) }
    for (var g = 0; g <= 3; g++) {
      var gy = py + ph * g / 3;
      s += '<line x1="' + px + '" y1="' + gy + '" x2="' + (px + pw) + '" y2="' + gy + '" stroke="rgba(255,255,255,.06)"/>';
      s += tx(px - 6, gy + 4, Math.round(max - (max - min) * g / 3), 9, '#5f6a80', 'end');
    }
    // 三中线
    var refV = D.full * (D.ref || .78);
    if (refV > min && refV < max) {
      var ry = Y(refV);
      s += '<line x1="' + px + '" y1="' + ry + '" x2="' + (px + pw) + '" y2="' + ry + '" stroke="#34d399" stroke-dasharray="5 4" opacity=".7"/>';
      s += tx(px + pw, ry - 6, '三中线 ' + Math.round((D.ref || .78) * 100) + '%', 9, '#34d399', 'end');
    }
    var pts = [];
    D.exams.forEach(function (e, i) { pts.push([X(i), Y(e.v)]) });
    s += '<polyline points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1) }).join(' ') +
      '" fill="none" stroke="#818cf8" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>';
    pts.forEach(function (p, i) {
      s += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4" fill="#0b0d12" stroke="#a5b4fc" stroke-width="2.2"/>';
      s += tx(p[0], p[1] - 10, D.exams[i].v, 9, '#cfd6e4', 'middle', '600');
      s += tx(p[0], py + ph + 16, D.exams[i].d, 8.5, '#5f6a80', 'middle');
    });
    return s;
  }

  function medals(w, h) {
    var s = frame(0, 0, w, h, '各科 · 最近一次');
    if (!D.subs.length) return s + tx(w / 2, h / 2, '还没有成绩', 12, '#5f6a80', 'middle');
    var cols = 3, rows = Math.ceil(D.subs.length / cols);
    var cw = (w - 40) / cols, ch = (h - 60) / Math.max(1, rows);
    D.subs.forEach(function (sub, i) {
      var cx = 20 + cw * (i % cols) + cw / 2, cy = 46 + ch * Math.floor(i / cols) + ch / 2;
      var p = sub.f ? sub.s / sub.f : 0, r = Math.min(cw, ch) * 0.32;
      var g = p >= .9 ? 'url(#wlGold)' : p >= .8 ? 'url(#wlSilver)' : p >= .7 ? 'url(#wlBronze)' : '#3a4250';
      var tc = p >= .7 ? '#241d10' : '#96a0b1';
      s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + g + '"/>';
      s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (r - 4).toFixed(1) + '" fill="none" stroke="rgba(0,0,0,.25)"/>';
      s += tx(cx, cy - 2, sub.n, 10, tc, 'middle', '700');
      s += tx(cx, cy + 11, sub.s, 10, tc, 'middle', '600');
      if (D.role === 'p' && p < .7) s += tx(cx, cy + 23, '弱', 8, '#f87171', 'middle');
    });
    return s;
  }

  function corkBoard(w, h) {
    var on = D.certs.filter(function (c) { return c.on }).length;
    var s = shadow(4, 6, w, h, .55);
    s += rr(0, 0, w, h, 4, 'url(#wlCork)');
    s += rr(6, 6, w - 12, h - 12, 2, 'none', 'stroke="rgba(0,0,0,.35)" stroke-width="3"');
    s += tx(16, 24, '奖状墙 · 已得 ' + on + '/' + D.certs.length, 11, '#e6d9c4', 'start', '600', 1);
    var cols = 3, rows = Math.ceil(D.certs.length / cols);
    var cw = (w - 64) / cols, ch = (h - 84) / Math.max(1, rows);
    D.certs.forEach(function (c, i) {
      var cx = 18 + (i % cols) * (cw + 14), cy = 38 + Math.floor(i / cols) * (ch + 14);
      if (c.on) {
        s += rr(cx + 2, cy + 3, cw, ch, 2, 'rgba(0,0,0,.45)');
        s += rr(cx, cy, cw, ch, 2, 'url(#wlPaper)');
        s += rr(cx + 5, cy + 5, cw - 10, ch - 10, 1, 'none', 'stroke="rgba(140,110,70,.5)"');
        s += tx(cx + cw / 2, cy + ch / 2 + 4, c.t, 9.5, '#5b4a33', 'middle', '700');
        s += '<circle cx="' + (cx + cw - 14) + '" cy="' + (cy + ch - 12) + '" r="8" fill="#b23b3b" opacity=".85"/>';
        s += tx(cx + cw - 14, cy + ch - 9, '优', 7, '#fff', 'middle');
      } else {
        s += rr(cx, cy, cw, ch, 2, 'rgba(255,255,255,.04)', 'stroke="rgba(255,255,255,.22)" stroke-dasharray="5 4"');
        s += tx(cx + cw / 2, cy + ch / 2 + 4, c.t, 8, '#a08b74', 'middle');
      }
    });
    return s;
  }

  function pointsSign(w, h) {
    var s = shadow(4, 6, w, h, .55);
    s += rr(0, 0, w, h, 6, 'url(#wlMetal)');
    s += rr(6, 6, w - 12, h - 12, 4, 'none', 'stroke="rgba(255,255,255,.1)"');
    s += tx(18, 26, '可用积分', 10, '#8b93a5', 'start', '600', 1);
    s += tx(18, h * .62, '⭐ ' + D.pts.avail, Math.min(34, h * .3), '#fbbf24', 'start', '700');
    s += tx(w - 18, 26, '本周 ' + (D.pts.week >= 0 ? '+' : '') + D.pts.week, 11, D.pts.week >= 0 ? '#34d399' : '#f87171', 'end', '600');
    s += tx(18, h - 16, '累计赚 ' + D.pts.all + ' · 1 元 = ' + D.pts.rate + ' 分', 9.5, '#6b7488');
    [[10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10]].forEach(function (p) {
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#151a21"/>';
    });
    return s;
  }

  function streakRope(w, h) {
    var n = D.days, per = Math.ceil(n / 2);
    var s = frame(0, 0, w, h, '连续打卡 · 今天第 ' + D.streak + ' 天');
    var gap = (w - 48) / Math.max(1, per - 1);
    for (var row = 0; row < 2; row++) {
      var yy = 52 + row * 42;
      s += '<path d="M24 ' + yy + ' Q' + (w / 2) + ' ' + (yy + 10) + ' ' + (w - 24) + ' ' + yy + '" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/>';
      for (var i = 0; i < per; i++) {
        var idx = row * per + i; if (idx >= n) break;
        var bx = 24 + i * gap, by = yy + Math.sin(i / per * Math.PI) * 8;
        var on = idx >= (n - D.streak);
        s += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="' + (on ? 4.2 : 3.2) + '" fill="' + (on ? '#fbbf24' : '#2f3542') +
          '"' + (on ? ' stroke="rgba(251,191,36,.45)" stroke-width="1.5"' : '') + '/>';
      }
    }
    s += tx(w / 2, h - 16, '连着 ' + D.streak + ' 天' + (D.best ? ' · 最长 ' + D.best + ' 天' : ''), 10, '#8b93a5', 'middle');
    return s;
  }

  function mistakeJar(w, h) {
    var s = frame(0, 0, w, h, '错题罐');
    var jx = 30, jy = 44, jw = w - 60, jh = h - 82;
    s += rr(jx, jy, jw, jh, 10, 'rgba(255,255,255,.05)');
    var fillH = Math.min(1, D.mistakes / 60) * jh * 0.8;
    for (var i = 0; i < 26; i++) {
      var ry = jy + jh - fillH * (i / 26) - 6;
      if (ry < jy + 8) break;
      s += '<rect x="' + (jx + 8 + ((i * 37) % Math.max(10, jw - 28))) + '" y="' + ry.toFixed(1) + '" width="' + (14 + (i % 4) * 4) +
        '" height="5" rx="1.5" fill="rgba(233,228,214,.5)" transform="rotate(' + ((i * 23) % 40 - 20) + ' ' + (jx + jw / 2) + ' ' + ry + ')"/>';
    }
    s += rr(jx, jy, jw, jh, 10, 'url(#wlJar)');
    s += rr(jx, jy, jw, jh, 10, 'none', 'stroke="rgba(200,235,245,.25)"');
    var top = D.mkTop.length ? D.mkTop[0].k : '—';
    var lab = '共 ' + D.mistakes + ' 道' + (D.mkTop.length ? ' · 最常错「' + top + '」' : '');
    var maxc = Math.max(8, Math.floor(w / 8.2));
    if (lab.length > maxc) lab = lab.slice(0, maxc - 1) + '…';
    s += tx(w / 2, h - 16, lab, 9.5, '#8b93a5', 'middle');
    return s;
  }

  function ruler(w, h) {
    var n = D.timeline.length;
    var s = shadow(2, 6, w, h, .4);
    s += rr(0, 0, w, h, 4, 'rgba(255,255,255,.045)');
    s += rr(0, 0, w, 2, 1, 'rgba(255,255,255,.14)');
    var step = (w - 60) / Math.max(1, n - 1);
    s += '<line x1="30" y1="' + (h / 2) + '" x2="' + (w - 30) + '" y2="' + (h / 2) + '" stroke="rgba(255,255,255,.16)" stroke-width="2"/>';
    D.timeline.forEach(function (t, i) {
      var cx = 30 + i * step, cy = h / 2;
      s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy + '" r="' + (t.now ? 7 : 4.5) + '" fill="' +
        (t.now ? '#818cf8' : (t.done ? '#34d399' : '#2a3040')) + '"' + (t.now ? ' stroke="rgba(129,140,248,.45)" stroke-width="4"' : '') + '/>';
      s += tx(cx, cy - 14, t.n, 8.5, t.now ? '#cfd6e4' : (t.done ? '#7d8799' : '#5a6478'), 'middle', t.now ? '600' : '');
      if (t.now) s += tx(cx, cy + 22, '现在', 8, '#818cf8', 'middle', '600');
    });
    return s;
  }

  var NAT = {
    chart: { w: 330, h: 210, fn: chartWall, name: '成绩曲线', ico: '📈' },
    certs: { w: 360, h: 210, fn: corkBoard, name: '奖状墙', ico: '🏅' },
    pts: { w: 350, h: 210, fn: pointsSign, name: '积分牌', ico: '⭐' },
    medals: { w: 400, h: 250, fn: medals, name: '各科奖牌', ico: '🥇' },
    streak: { w: 290, h: 250, fn: streakRope, name: '连续打卡', ico: '🔥' },
    jar: { w: 350, h: 250, fn: mistakeJar, name: '错题罐', ico: '🫙' },
    rule: { w: 1080, h: 96, fn: ruler, name: '考试时间轴', ico: '📏' }
  };

  function layout(portrait) {
    var box = [];
    if (!portrait) {
      var L = [['chart', 60, 60, 330, 210], ['certs', 410, 60, 360, 210], ['pts', 790, 60, 350, 210],
        ['medals', 60, 292, 400, 250], ['streak', 480, 292, 290, 250], ['jar', 790, 292, 350, 250],
        ['rule', 60, 562, 1080, 96]];
      L.forEach(function (a) { box.push({ id: a[0], x: a[1], y: a[2], w: a[3], h: a[4] }) });
      return { W: 1200, H: 700, box: box };
    }
    var W = 720, m = 20, y = 16, w = W - m * 2;
    function add(id, x, yy, ww) {
      var s = ww / NAT[id].w;
      box.push({ id: id, x: x, y: yy, w: ww, h: NAT[id].h * s });
      return yy + NAT[id].h * s;
    }
    y = add('chart', m, y, w) + 22;
    var half = (w - 16) / 2;
    var y2 = add('pts', m, y, half);
    y2 = Math.max(y2, add('jar', m + half + 16, y, half));
    y = y2 + 22;
    y = add('medals', m, y, w) + 22;
    y = add('certs', m, y, w) + 22;
    y = add('streak', m, y, w) + 22;
    y = add('rule', m, y, w) + 30;
    return { W: W, H: y, box: box };
  }

  /* ---------- 画整面墙 ---------- */
  var hostEl = null, sheetEl = null, lastData = null;

  var _lastPortrait = null, _lastW = 0, _rt = null;
  function render() {
    if (!hostEl || !D) return;
    var portrait = (window.innerWidth || hostEl.clientWidth) < 700;
    _lastPortrait = portrait; _lastW = window.innerWidth || hostEl.clientWidth;
    TS = portrait ? 1 : 1.32;
    var lay = layout(portrait);
    var svg = '<svg viewBox="0 0 ' + lay.W + ' ' + lay.H + '" width="100%" style="display:block;height:auto">' +
      '<defs>' +
      '<linearGradient id="wlWood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b4634"/><stop offset=".5" stop-color="#6b5340"/><stop offset="1" stop-color="#41301f"/></linearGradient>' +
      '<linearGradient id="wlPaper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9e4d6"/><stop offset="1" stop-color="#d5cfbe"/></linearGradient>' +
      '<linearGradient id="wlCork" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b4f31"/><stop offset="1" stop-color="#4a3622"/></linearGradient>' +
      '<linearGradient id="wlMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2c323c"/><stop offset=".45" stop-color="#3c4450"/><stop offset="1" stop-color="#232830"/></linearGradient>' +
      '<linearGradient id="wlGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2d489"/><stop offset=".5" stop-color="#c9a227"/><stop offset="1" stop-color="#8a6d14"/></linearGradient>' +
      '<linearGradient id="wlSilver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6ebf2"/><stop offset=".5" stop-color="#a8b2c0"/><stop offset="1" stop-color="#6f7887"/></linearGradient>' +
      '<linearGradient id="wlBronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d99a6c"/><stop offset=".5" stop-color="#a86a3f"/><stop offset="1" stop-color="#6e3f22"/></linearGradient>' +
      '<linearGradient id="wlJar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fd6e8" stop-opacity=".28"/><stop offset=".35" stop-color="#d8f2fa" stop-opacity=".14"/><stop offset="1" stop-color="#7fb8cc" stop-opacity=".22"/></linearGradient>' +
      '<filter id="wlSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="7"/></filter>' +
      '</defs>';
    lay.box.forEach(function (o) {
      var nat = NAT[o.id], sc = o.w / nat.w;
      svg += '<g class="wl-obj" data-obj="' + o.id + '" role="button" tabindex="0" aria-label="' + NAT[o.id].name + '" style="cursor:pointer">' +
        '<g transform="translate(' + o.x.toFixed(1) + ',' + o.y.toFixed(1) + ') scale(' + sc.toFixed(4) + ')">' +
        nat.fn(nat.w, nat.h) +
        '<rect x="0" y="0" width="' + nat.w + '" height="' + nat.h + '" fill="transparent"/>' +
        '</g></g>';
    });
    svg += '</svg>';
    hostEl.innerHTML = svg;
    var nodes = hostEl.querySelectorAll('.wl-obj');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].addEventListener('click', function () { openObj(this.getAttribute('data-obj')) });
      nodes[i].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openObj(this.getAttribute('data-obj')) }
      });
    }
  }

  /* ---------- 详情 ---------- */
  function detail(id) {
    if (!D) return null;
    var e = D.exams, last = e.length ? e[e.length - 1] : null, prev = e.length > 1 ? e[e.length - 2] : null;
    if (id === 'chart') {
      if (!e.length) return { ico: '📈', name: '成绩曲线', sub: '还没有成绩', body: '录一次考试就会出现。' };
      var diff = prev ? (last.v - prev.v) : 0;
      return {
        ico: '📈', name: '成绩曲线', sub: '近 ' + e.length + ' 次 · 最近一次 ' + last.d + ' ' + last.n,
        body: '最新 <b>' + last.v + '</b> / ' + D.full + ' 分' + (prev ? '，比上次 <b>' + (diff >= 0 ? '+' : '') + diff + '</b>' : '') +
          (D.role === 'p' ? '；三中线 ' + Math.round((D.ref || .78) * D.full) + ' 分，' +
            (last.v >= D.full * (D.ref || .78) ? '已经过了。' : '还差 ' + Math.round(D.full * (D.ref || .78) - last.v) + ' 分。') : '。')
      };
    }
    if (id === 'medals') {
      var weak = D.subs.filter(function (s) { return s.f && s.s / s.f < .7 });
      return {
        ico: '🥇', name: '各科奖牌', sub: D.subs.length + ' 科 · 金≥90% 银≥80% 铜≥70%',
        body: (D.role === 'p' && weak.length ? '偏弱：<b>' + weak.map(function (s) { return s.n + ' ' + Math.round(s.s / s.f * 100) + '%' }).join('、') + '</b>。' : '每一科都在自己那一档里。')
      };
    }
    if (id === 'certs') {
      var got = D.certs.filter(function (c) { return c.on }), no = D.certs.filter(function (c) { return !c.on });
      return {
        ico: '🏅', name: '奖状墙', sub: '已得 ' + got.length + ' / ' + D.certs.length,
        body: '已得：' + (got.length ? got.map(function (c) { return c.t }).join('、') : '还没有') +
          (no.length ? '<br>空着：' + no.map(function (c) { return c.t }).join('、') : '')
      };
    }
    if (id === 'pts') {
      return {
        ico: '⭐', name: '积分牌', sub: '可用 ' + D.pts.avail + ' · 累计 ' + D.pts.all,
        body: '本周 <b>' + (D.pts.week >= 0 ? '+' : '') + D.pts.week + '</b> 分。' +
          (D.next ? '离下一个奖励「' + D.next.name + '」还差 <b>' + D.next.need + '</b>。' : '')
      };
    }
    if (id === 'streak') {
      return {
        ico: '🔥', name: '连续打卡', sub: '今天第 ' + D.streak + ' 天',
        body: D.days + ' 天里亮了 <b>' + D.streak + '</b> 颗。断一天不清零，珠子还在。'
      };
    }
    if (id === 'jar') {
      return {
        ico: '🫙', name: '错题罐', sub: '共 ' + D.mistakes + ' 道',
        body: D.mkTop.length ? '最常错：' + D.mkTop.map(function (m) { return m.k + ' ' + m.n }).join('、') : '还没记录错题。'
      };
    }
    return { ico: '📏', name: '考试时间轴', sub: '初二上 → 中考', body: '现在在 <b>' + (D.nowStage || '—') + '</b>。' };
  }

  function openObj(id) {
    var d = detail(id); if (!d) return;
    if (!sheetEl) return;
    sheetEl.querySelector('.lcr-sh-ico').textContent = d.ico;
    sheetEl.querySelector('.lcr-sh-name').textContent = d.name;
    var pill = sheetEl.querySelector('.lcr-pill'); pill.textContent = ''; pill.className = 'lcr-pill';
    sheetEl.querySelector('.lcr-sh-price').textContent = d.sub;
    sheetEl.querySelector('.lcr-sh-cond').innerHTML = d.body;
    var acts = sheetEl.querySelector('.lcr-sh-acts'); acts.innerHTML = '';
    var b = document.createElement('button'); b.type = 'button'; b.className = 'lcr-btn'; b.textContent = '关闭';
    b.onclick = function () { sheetEl.classList.remove('open') };
    acts.appendChild(b);
    sheetEl.classList.add('open');
  }

  function buildSheet() {
    sheetEl = document.createElement('div');
    sheetEl.className = 'lcr-sheet';
    sheetEl.style.cssText = 'position:fixed;left:8px;right:8px;bottom:8px;z-index:80;max-width:520px;margin:0 auto';
    sheetEl.innerHTML = '<div class="lcr-row"><div class="lcr-sh-ico">📊</div><div class="lcr-grow">' +
      '<div class="lcr-sh-name">成绩墙</div><div class="lcr-sh-price"></div></div><span class="lcr-pill"></span></div>' +
      '<div class="lcr-sh-cond"></div><div class="lcr-sh-acts"></div>';
    document.body.appendChild(sheetEl);
  }

  window.WALL = {
    version: 1,
    mount: function (host, data) {
      hostEl = host; D = data;
      if (!sheetEl) buildSheet();
      render();
      requestAnimationFrame(function () {
        if (!hostEl || !hostEl.isConnected) return;
        if (((window.innerWidth || hostEl.clientWidth) < 700) !== _lastPortrait) render();
      });
      // 横竖屏 / 宽度变化时重排（墙是静态 SVG，重排很便宜）
      if (!window.__wlResizeBound) {
        window.__wlResizeBound = true;
        window.addEventListener('resize', function () {
          clearTimeout(_rt);
          _rt = setTimeout(function () {
            if (!hostEl || !hostEl.isConnected) return;
            var ww = window.innerWidth || hostEl.clientWidth;
            if ((ww < 700) !== _lastPortrait || Math.abs(ww - _lastW) > 40) render();
          }, 180);
        });
        window.addEventListener('orientationchange', function () {
          setTimeout(function () { if (hostEl && hostEl.isConnected) render(); }, 280);
        });
      }
      return host;
    },
    refresh: function (data) { D = data; render(); },
    close: function () { if (sheetEl) sheetEl.classList.remove('open') }
  };
})();
