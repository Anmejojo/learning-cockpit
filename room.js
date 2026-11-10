/* ===================================================================
   乐乐学习驾驶舱 · 房间视图（正面视角 · 方案 E）
   -------------------------------------------------------------------
   约定：
   · 不改数据结构。零件来自 D.parts（id/icon/name/value/cond/det/
     unlocked/received/exchange），本文件只负责“怎么画、怎么点”。
   · 不自己存业务数据。相机位置、锁定样式只存 localStorage（本机偏好）。
   · 只暴露 window.ROOM.mount(host, opts)，由 app.js 的 rp() 调用。
   =================================================================== */
(function () {
  'use strict';

  var W = 1200, H = 800;               // 世界坐标（正面视角）
  var DESK_FAR = 510, DESK_NEAR = 640, FLOOR = 676;
  var CASE = { x: 722, y: 638, w: 122, h: 150 };
  var INSIDE = [10, 11, 12, 13, 14, 15, 17, 18];   // 机箱里的 8 件

  /* ---------- 小工具 ---------- */
  function rr(x, y, w, h, r, fill, extra) {
    return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) +
      '" height="' + h.toFixed(1) + '" rx="' + r + '" fill="' + fill + '" ' + (extra || '') + '/>';
  }
  function tx(x, y, s, size, fill, anchor, weight) {
    return '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" font-size="' + (size || 10) +
      '" fill="' + (fill || '#98a1b3') + '" text-anchor="' + (anchor || 'start') + '"' +
      (weight ? ' font-weight="' + weight + '"' : '') +
      ' font-family="-apple-system,Microsoft YaHei,sans-serif">' + s + '</text>';
  }
  function shadow(cx, cy, rx, ry, op) {
    return '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="' + rx.toFixed(1) +
      '" ry="' + ry.toFixed(1) + '" fill="rgba(0,0,0,' + (op || .6) + ')" filter="url(#lcrSoft)"/>';
  }

  /* ---------- 房间壳 ---------- */
  function shell() {
    var s = '';
    s += '<rect x="-200" y="-200" width="1600" height="1200" fill="url(#lcrWall)"/>';
    s += '<rect x="-200" y="-200" width="1600" height="1200" fill="url(#lcrWallGlow)"/>';

    var wx = 60, wy = 6, ww = 1080, wh = 452;
    s += '<rect x="' + (wx - 14) + '" y="' + (wy - 14) + '" width="' + (ww + 28) + '" height="' + (wh + 28) + '" rx="4" fill="#1e232a"/>';
    s += '<rect x="' + wx + '" y="' + wy + '" width="' + ww + '" height="' + wh + '" fill="url(#lcrSky)"/>';
    [[110,262,70,190],[186,214,54,238],[246,286,82,166],[336,196,58,256],[400,258,76,194],
     [486,170,60,282],[552,250,84,202],[646,208,56,244],[712,276,78,176],[800,226,62,226],
     [872,290,48,162],[930,244,70,208],[1010,286,54,166],[1074,258,44,194]].forEach(function (b) {
      s += '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + b[3] + '" fill="url(#lcrBldA)" opacity=".58"/>';
    });
    s += '<rect x="150" y="336" width="128" height="116" fill="url(#lcrBldB)" opacity=".95"/>';
    s += '<rect x="470" y="300" width="164" height="152" fill="url(#lcrBldB)" opacity=".98"/>';
    s += '<rect x="820" y="348" width="126" height="104" fill="url(#lcrBldB)" opacity=".95"/>';
    s += '<rect x="' + wx + '" y="426" width="' + ww + '" height="32" fill="#a9c2ce" opacity=".24"/>';
    s += '<rect x="' + (wx - 14) + '" y="' + (wy + wh - 6) + '" width="' + (ww + 28) + '" height="12" fill="#232830"/>';
    s += '<rect x="' + (wx - 14) + '" y="' + (wy - 14) + '" width="' + (ww + 28) + '" height="12" fill="#232830"/>';
    s += '<rect x="' + (wx + ww / 2 - 5) + '" y="' + wy + '" width="10" height="' + wh + '" fill="#232830"/>';
    s += '<rect x="' + (wx + ww * 0.215 - 4) + '" y="' + wy + '" width="8" height="' + wh + '" fill="#20252c" opacity=".9"/>';
    s += '<rect x="' + (wx + ww * 0.785 - 4) + '" y="' + wy + '" width="8" height="' + wh + '" fill="#20252c" opacity=".9"/>';
    s += '<path d="M' + (wx + 120) + ' ' + (wy + wh) + ' L' + (wx + ww - 140) + ' ' + wy + ' L' + (wx + ww - 260) + ' ' + wy +
      ' L' + (wx + 180) + ' ' + (wy + wh) + ' Z" fill="rgba(255,255,255,.05)"/>';
    s += '<rect x="' + (wx - 30) + '" y="' + (wy + wh) + '" width="' + (ww + 60) + '" height="12" rx="2" fill="#282d35"/>';

    // 墙上：挂钟 + 两幅画（竖屏多出来的上下空间靠它们填，不做黑边）
    s += '<rect x="-200" y="800" width="1600" height="420" fill="#08090c"/>';
    s += '<rect x="-200" y="790" width="1600" height="12" fill="rgba(255,255,255,.03)"/>';
    var ckx = 560, cky = -92;
    s += '<circle cx="' + ckx + '" cy="' + cky + '" r="30" fill="#1b2027" stroke="rgba(255,255,255,.14)" stroke-width="2"/>';
    s += '<circle cx="' + ckx + '" cy="' + cky + '" r="24" fill="#0d1218"/>';
    s += '<line x1="' + ckx + '" y1="' + cky + '" x2="' + ckx + '" y2="' + (cky - 14) + '" stroke="#8b93a5" stroke-width="2.4"/>';
    s += '<line x1="' + ckx + '" y1="' + cky + '" x2="' + (ckx + 10) + '" y2="' + (cky + 5) + '" stroke="#8b93a5" stroke-width="2.4"/>';
    [[382, -156, 96, 78, '#c9a227'], [676, -150, 92, 72, '#5a6f96']].forEach(function (f) {
      s += '<rect x="' + f[0] + '" y="' + f[1] + '" width="' + f[2] + '" height="' + f[3] + '" rx="3" fill="url(#lcrWood)"/>';
      s += '<rect x="' + (f[0] + 6) + '" y="' + (f[1] + 6) + '" width="' + (f[2] - 12) + '" height="' + (f[3] - 12) + '" rx="2" fill="#1a1e25"/>';
      s += '<path d="M' + (f[0] + 14) + ' ' + (f[1] + f[3] - 22) + ' l18 -22 l16 16 l14 -18 l18 24" fill="none" stroke="' + f[4] + '" stroke-width="2.2" stroke-linejoin="round" opacity=".9"/>';
    });
    s += shadow(600, 506, 420, 10, .55);
    s += '<path d="M232 470 L968 470 L986 496 L214 496 Z" fill="url(#lcrRiser)"/>';
    s += '<rect x="214" y="496" width="772" height="14" fill="#1b1f26"/>';
    s += '<path d="M232 470 L968 470 L968 473 L232 473 Z" fill="rgba(255,255,255,.14)"/>';

    s += '<path d="M150 510 L1050 510 L1116 640 L84 640 Z" fill="url(#lcrDeskTop)"/>';
    s += '<path d="M150 510 L1050 510 L1050 513 L150 513 Z" fill="rgba(255,255,255,.10)"/>';
    s += '<path d="M210 510 L990 510 L1030 640 L170 640 Z" fill="rgba(150,195,235,.05)"/>';
    s += '<path d="M84 640 L1116 640 L1116 648 L84 648 Z" fill="rgba(255,255,255,.07)"/>';
    s += '<path d="M84 648 L1116 648 L1116 676 L84 676 Z" fill="url(#lcrDeskFace)"/>';
    s += '<rect x="0" y="676" width="1200" height="124" fill="#08090c"/>';
    return s;
  }
  function lights() {
    return '<ellipse cx="720" cy="150" rx="440" ry="300" fill="url(#lcrCool)"/>' +
      '<ellipse cx="140" cy="430" rx="300" ry="250" fill="url(#lcrLamp)" opacity=".5"/>' +
      '<ellipse cx="600" cy="530" rx="320" ry="60" fill="#6ea8ff" opacity=".09" filter="url(#lcrSoft2)"/>';
  }

  /* ---------- 零件画法 ---------- */
  function monitor(x, y, w, h) {
    var s = '';
    s += '<ellipse cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" rx="' + (w * .62) + '" ry="' + (h * .9) + '" fill="url(#lcrCool)" opacity=".42"/>';
    s += '<rect x="' + (x + w / 2 - 84) + '" y="' + (y + h - 4) + '" width="168" height="12" rx="5" fill="#1b1f26"/>';
    s += '<rect x="' + (x + w / 2 - 16) + '" y="' + (y + h - 62) + '" width="32" height="58" fill="#232830"/>';
    s += rr(x, y, w, h, 9, '#0b0e13');
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" fill="none" stroke="rgba(255,255,255,.11)"/>';
    s += rr(x + 7, y + 7, w - 14, h - 14, 4, 'url(#lcrScreen)');
    s += '<path d="M' + (x + 7) + ' ' + (y + h - 7) + ' L' + (x + 7) + ' ' + (y + 96) + ' L' + (x + w - 7) + ' ' + (y + 7) +
      ' L' + (x + w - 7) + ' ' + (y + h - 7) + ' Z" fill="rgba(70,110,200,.10)"/>';
    for (var i = 0; i < 5; i++) s += rr(x + 22, y + 26 + i * 32, 20, 20, 5, 'rgba(255,255,255,.10)');
    s += rr(x + w * .34, y + h * .2, w * .48, h * .46, 6, 'rgba(16,24,38,.94)', 'stroke="rgba(255,255,255,.10)"');
    s += rr(x + w * .34, y + h * .2, w * .48, 18, 6, 'rgba(255,255,255,.07)');
    s += '<circle cx="' + (x + w * .34 + 12) + '" cy="' + (y + h * .2 + 9) + '" r="3" fill="#f87171"/>';
    s += '<circle cx="' + (x + w * .34 + 24) + '" cy="' + (y + h * .2 + 9) + '" r="3" fill="#fbbf24"/>';
    s += '<circle cx="' + (x + w * .34 + 36) + '" cy="' + (y + h * .2 + 9) + '" r="3" fill="#34d399"/>';
    for (var j = 0; j < 5; j++) s += '<rect x="' + (x + w * .37) + '" y="' + (y + h * .31 + j * 12) + '" width="' + (w * (.34 - j * .05)) + '" height="4" rx="2" fill="rgba(180,205,255,.15)"/>';
    s += '<rect x="' + (x + 7) + '" y="' + (y + h - 38) + '" width="' + (w - 14) + '" height="24" fill="rgba(8,12,20,.9)"/>';
    for (var k = 0; k < 9; k++) s += rr(x + 24 + k * 23, y + h - 32, 13, 11, 3, 'rgba(255,255,255,.15)');
    s += '<path d="M' + (x + 7) + ' ' + (y + 7) + ' L' + (x + 140) + ' ' + (y + 7) + ' L' + (x + 7) + ' ' + (y + 160) + ' Z" fill="rgba(160,205,255,.04)"/>';
    s += '<rect x="' + x + '" y="' + DESK_FAR + '" width="' + w + '" height="76" fill="url(#lcrRefl)" opacity=".4"/>';
    s += rr(x + 24, y - 26, w - 48, 9, 4, '#252a32');
    s += '<rect x="' + (x + 52) + '" y="' + (y - 18) + '" width="' + (w - 104) + '" height="4" rx="2" fill="#ffe3b0" opacity=".85"/>';
    return s;
  }
  function speaker(x, base) {
    var s = '', w = 86, h = 124;
    s += shadow(x + w / 2, base + 2, w * .6, 8, .6);
    s += rr(x, base - h, w, h, 7, 'url(#lcrMetal)');
    s += '<rect x="' + x + '" y="' + (base - h) + '" width="' + w + '" height="2.5" rx="1" fill="rgba(255,255,255,.55)"/>';
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (base - h + 70) + '" r="26" fill="#2b3038"/>';
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (base - h + 70) + '" r="20" fill="#1a1e24"/>';
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (base - h + 70) + '" r="7" fill="#0e1115"/>';
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (base - h + 24) + '" r="10" fill="#2b3038"/>';
    s += '<ellipse cx="' + (x + w / 2 - 9) + '" cy="' + (base - h + 62) + '" rx="5" ry="10" fill="rgba(255,255,255,.12)"/>';
    return s;
  }
  function gamepad(x, base) {
    var s = '', w = 74;
    s += shadow(x + w / 2, base + 2, w * .45, 6, .55);
    s += '<path d="M' + x + ' ' + (base - 12) + ' q0-26 26-26 q13 0 17 7 q7 6 15 0 q4-7 17-7 q26 0 26 26 q0 15-7 16 q-9 2-16-9 q-5-7-18-7 q-13 0-18 7 q-7 11-17 9 q-7-1-7-16 Z" fill="#e4e8ee"/>';
    s += '<circle cx="' + (x + 24) + '" cy="' + (base - 16) + '" r="7.5" fill="#2b3038"/>';
    s += '<circle cx="' + (x + 54) + '" cy="' + (base - 21) + '" r="6.5" fill="#2b3038"/>';
    s += '<circle cx="' + (x + 39) + '" cy="' + (base - 6) + '" r="3.6" fill="#b9bfc8"/>';
    return s;
  }
  function headphones(x, base) {
    var s = '';
    s += shadow(x + 34, base + 2, 32, 7, .55);
    s += '<rect x="' + (x + 30) + '" y="' + (base - 120) + '" width="8" height="120" rx="4" fill="#3a414d"/>';
    s += '<path d="M' + (x + 2) + ' ' + (base - 84) + ' q32-44 64 0" fill="none" stroke="#eef2f7" stroke-width="11" stroke-linecap="round"/>';
    s += rr(x - 2, base - 90, 22, 50, 10, '#2b3038');
    s += rr(x + 50, base - 90, 22, 50, 10, '#2b3038');
    s += '<rect x="' + (x + 3) + '" y="' + (base - 78) + '" width="12" height="28" rx="6" fill="#1a1e24"/>';
    s += '<rect x="' + (x + 55) + '" y="' + (base - 78) + '" width="12" height="28" rx="6" fill="#1a1e24"/>';
    return s;
  }
  function mat(x, y, w, h) {
    var s = '', ins = 18;
    s += '<path d="M' + (x + ins) + ' ' + y + ' L' + (x + w - ins) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' Z" fill="url(#lcrMat)"/>';
    s += '<path d="M' + (x + ins) + ' ' + y + ' L' + (x + w - ins) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' Z" fill="none" stroke="rgba(255,255,255,.06)"/>';
    for (var i = 1; i < 6; i++) {
      var yy = y + i * h / 6, kx = ins * (1 - i / 6);
      s += '<line x1="' + (x + kx + 8) + '" y1="' + yy + '" x2="' + (x + w - kx - 8) + '" y2="' + yy + '" stroke="rgba(255,255,255,.014)"/>';
    }
    return s;
  }
  function keyboard(x, y, w, h) {
    var s = '', ins = 12, rows = 4;
    s += shadow(x + w / 2, y + h + 4, w * .45, 7, .6);
    s += '<path d="M' + (x + ins) + ' ' + y + ' L' + (x + w - ins) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' Z" fill="#23272e"/>';
    s += '<path d="M' + (x + ins) + ' ' + y + ' L' + (x + w - ins) + ' ' + y + ' L' + (x + w) + ' ' + (y + h) + ' L' + x + ' ' + (y + h) + ' Z" fill="none" stroke="rgba(255,255,255,.10)"/>';
    for (var r = 0; r < rows; r++) {
      var t0 = r / rows, t1 = (r + 1) / rows;
      var iy = y + 7 + r * ((h - 12) / rows), i0 = ins * (1 - t0), i1 = ins * (1 - t1);
      var usable = (w - (i0 + i1)) - 14, cw = usable / 16;
      for (var c = 0; c < 16; c++) {
        if (r === 3 && c > 3 && c < 12) continue;
        var kx = x + i0 + 7 + c * cw;
        s += '<rect x="' + kx.toFixed(1) + '" y="' + iy.toFixed(1) + '" width="' + (cw - 3).toFixed(1) + '" height="' + ((h - 12) / rows - 3).toFixed(1) + '" rx="2" fill="#3c424b"/>';
        s += '<rect x="' + kx.toFixed(1) + '" y="' + iy.toFixed(1) + '" width="' + (cw - 3).toFixed(1) + '" height="2" rx="1" fill="rgba(255,255,255,.18)"/>';
      }
    }
    return s;
  }
  function mouse(x, y) {
    var s = '';
    s += shadow(x + 26, y + 26, 24, 6, .6);
    s += '<path d="M' + (x + 2) + ' ' + (y + 20) + ' q0-20 23-20 q23 0 23 20 q0 22-23 22 q-23 0-23-22 Z" fill="url(#lcrMetal)"/>';
    s += rr(x + 22, y + 5, 6, 10, 3, '#5a606a');
    s += '<ellipse cx="' + (x + 15) + '" cy="' + (y + 10) + '" rx="7" ry="5" fill="rgba(255,255,255,.4)"/>';
    return s;
  }
  function switchDock(x, base) {
    var s = '', w = 104, h = 92;
    s += shadow(x + w / 2, base + 2, w * .55, 7, .6);
    s += rr(x + 4, base - 16, w - 8, 16, 4, '#181c22');
    s += rr(x, base - h, w, h, 7, '#12161c');
    s += rr(x + 6, base - h + 6, w - 12, h - 12, 4, '#0d1626');
    s += rr(x + 10, base - h + 10, w - 20, h - 20, 3, '#26415f');
    s += rr(x + 14, base - h + 14, w - 28, h - 28, 2, '#16283f');
    s += rr(x + 20, base - h + 22, 26, 18, 3, 'rgba(255,255,255,.18)');
    s += rr(x + 52, base - h + 22, 26, 18, 3, 'rgba(255,255,255,.12)');
    s += rr(x + 20, base - h + 46, 26, 18, 3, 'rgba(255,255,255,.12)');
    s += rr(x + 52, base - h + 46, 26, 18, 3, 'rgba(255,255,255,.18)');
    s += rr(x - 4, base - h + 4, 12, 78, 5, '#e05a6a');
    s += rr(x + w - 8, base - h + 4, 12, 78, 5, '#4a90d9');
    s += '<circle cx="' + (x + 2) + '" cy="' + (base - h + 22) + '" r="3" fill="#2b3038"/>';
    s += '<circle cx="' + (x + w - 2) + '" cy="' + (base - h + 22) + '" r="3" fill="#2b3038"/>';
    return s;
  }
  function cartridge(x, y) {
    return rr(x, y, 20, 26, 2, '#3a3f48') + rr(x + 2, y + 2, 16, 22, 1, '#c9b47a');
  }
  function webcam(x, y) {
    return rr(x, y, 38, 22, 6, '#2a2f38') +
      '<circle cx="' + (x + 19) + '" cy="' + (y + 11) + '" r="7" fill="#111418"/>' +
      '<circle cx="' + (x + 19) + '" cy="' + (y + 11) + '" r="3.4" fill="#3f74ad"/>';
  }
  function strip(x, y) {
    var s = '';
    s += shadow(x + 96, y + 18, 96, 8, .55);
    s += rr(x, y, 192, 24, 7, '#d9dde4');
    for (var i = 0; i < 3; i++) s += rr(x + 16 + i * 58, y + 9, 40, 12, 3, '#b7bdc7');
    return s;
  }
  function tower() {
    var s = '', c = CASE;
    s += shadow(c.x + c.w / 2, c.y + c.h + 4, c.w * .55, 10, .6);
    s += rr(c.x, c.y, c.w, c.h, 8, 'url(#lcrCase)');
    s += rr(c.x + 8, c.y + 10, c.w - 16, c.h - 20, 5, 'url(#lcrGlass)');
    s += '<rect x="' + (c.x + c.w - 22) + '" y="' + (c.y + 14) + '" width="3" height="' + (c.h - 28) + '" rx="1.5" fill="#6ea8ff" opacity=".55"/>';
    return s;
  }
  function plant(x, base) {
    var s = '';
    s += shadow(x + 30, base + 2, 28, 6, .5);
    s += rr(x + 10, base - 30, 40, 30, 5, '#3b3230');
    s += '<path d="M' + (x + 30) + ' ' + (base - 30) + ' q-22-34 -6-58 q4 26 10 34" fill="#2f6b52" opacity=".9"/>';
    s += '<path d="M' + (x + 30) + ' ' + (base - 30) + ' q20-30 4-52 q-2 22-8 32" fill="#37785c" opacity=".85"/>';
    return s;
  }
  function mug(x, y) {
    var s = '';
    s += '<ellipse cx="' + (x + 16) + '" cy="' + (y + 22) + '" rx="20" ry="6" fill="rgba(0,0,0,.45)" filter="url(#lcrSoft)"/>';
    s += rr(x, y, 32, 24, 4, '#c9ced6');
    s += '<ellipse cx="' + (x + 16) + '" cy="' + y + '" rx="16" ry="5" fill="#e6eaf0"/>';
    s += '<path d="M' + (x + 32) + ' ' + (y + 6) + ' q13 2 12 10 q-2 8-12 8" fill="none" stroke="#c9ced6" stroke-width="4"/>';
    return s;
  }
  function chair() {
    return '<path d="M110 812 C110 730 250 680 470 680 C690 680 790 730 790 812 Z" fill="url(#lcrChair)"/>' +
      '<path d="M136 802 C154 742 268 704 470 704 C672 704 742 742 760 802" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="2"/>';
  }
  function cables() {
    return '<path d="M620 500 q40 22 30 46 q-8 20 18 26" fill="none" stroke="#15181d" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M830 512 q60 16 120 40" fill="none" stroke="#14171c" stroke-width="3" stroke-linecap="round"/>';
  }

  /* ---------- 组合 ---------- */
  var cur = null;        // {parts, rate, avail, ...}
  function P(id) { if (!cur) return null; for (var i = 0; i < cur.parts.length; i++) if (cur.parts[i].id === id) return cur.parts[i]; return null; }
  function isOn(p) { return !!(p && p.unlocked); }

  function act(at, inner, box, label) {
    return '<g class="lcr-act" data-act="' + at + '" role="button" tabindex="0" aria-label="' + (label || at) + '">' +
      '<g class="shp">' + inner + '</g>' +
      '<rect x="' + box.x.toFixed(1) + '" y="' + box.y.toFixed(1) + '" width="' + Math.max(10, box.w).toFixed(1) +
      '" height="' + Math.max(10, box.h).toFixed(1) + '" fill="transparent"/>' +
      '</g>';
  }
  // 作业本：桌上左下角一摞纸 + 笔
  function notebook() {
    var x = 396, y = 512, s = '';
    s += '<ellipse cx="' + (x + 40) + '" cy="' + (y + 44) + '" rx="46" ry="8" fill="rgba(0,0,0,.5)" filter="url(#lcrSoft)"/>';
    s += rr(x, y + 8, 82, 34, 4, '#e9e4d6');
    s += rr(x + 3, y + 4, 76, 32, 4, '#efeae0');
    s += rr(x + 6, y, 70, 30, 4, '#f5f1e8');
    s += '<rect x="' + (x + 14) + '" y="' + (y + 8) + '" width="40" height="3" rx="1.5" fill="rgba(80,90,110,.35)"/>';
    s += '<rect x="' + (x + 14) + '" y="' + (y + 15) + '" width="52" height="3" rx="1.5" fill="rgba(80,90,110,.22)"/>';
    s += '<rect x="' + (x + 62) + '" y="' + (y + 2) + '" width="4" height="26" rx="2" fill="#6366f1" transform="rotate(18 ' + (x + 64) + ' ' + (y + 15) + ')"/>';
    return s;
  }
  // 奖品盒：右下角一个礼物盒
  function giftBox() {
    var x = 742, y = 508, s = '';
    s += '<ellipse cx="' + (x + 34) + '" cy="' + (y + 44) + '" rx="40" ry="7" fill="rgba(0,0,0,.5)" filter="url(#lcrSoft)"/>';
    s += rr(x, y + 12, 68, 32, 5, '#3b3f7a');
    s += rr(x, y, 68, 16, 5, '#4b50a0');
    s += '<rect x="' + (x + 30) + '" y="' + y + '" width="8" height="44" fill="#f2d489"/>';
    s += '<rect x="' + x + '" y="' + (y + 12) + '" width="68" height="6" fill="#f2d489" opacity=".9"/>';
    return s;
  }
  // 小计分牌：一块小小的 LED 屏
  function scoreboard() {
    var x = 496, y = 512, s = '';
    var L = (cur && cur.stat) || { lv: 1, streak: 0, pts: 0 };
    s += '<ellipse cx="' + (x + 38) + '" cy="' + (y + 44) + '" rx="40" ry="6" fill="rgba(0,0,0,.45)" filter="url(#lcrSoft)"/>';
    s += rr(x, y + 8, 76, 34, 6, '#20242c');
    s += rr(x + 3, y + 11, 70, 28, 4, '#0b1018');
    s += '<text x="' + (x + 38) + '" y="' + (y + 22) + '" font-size="8.5" fill="#8fd6ff" text-anchor="middle" font-family="monospace">LV ' + L.lv + '</text>';
    s += '<text x="' + (x + 38) + '" y="' + (y + 33) + '" font-size="8" fill="#fbbf24" text-anchor="middle" font-family="monospace">\u2605 ' + L.pts + '  \uD83D\uDD25' + L.streak + '</text>';
    return s;
  }
  // 手机（菜单入口）
  function phoneMini() {
    var x = 736, y = 512, s = '';
    s += '<ellipse cx="' + (x + 20) + '" cy="' + (y + 32) + '" rx="22" ry="5" fill="rgba(0,0,0,.5)" filter="url(#lcrSoft)"/>';
    s += rr(x, y, 40, 30, 6, '#2b3038');
    s += rr(x + 2, y + 3, 36, 24, 4, '#0d1520');
    s += '<rect x="' + (x + 6) + '" y="' + (y + 7) + '" width="28" height="2.5" fill="rgba(120,180,255,.55)"/>';
    s += '<rect x="' + (x + 6) + '" y="' + (y + 13) + '" width="16" height="2" fill="rgba(255,255,255,.22)"/>';
    return s;
  }
  // 小搭：桌边一个小机器人
  function robot() {
    var x = 562, y = 452, s = '';
    s += '<ellipse cx="' + (x + 26) + '" cy="' + (y + 96) + '" rx="30" ry="7" fill="rgba(0,0,0,.55)" filter="url(#lcrSoft)"/>';
    s += rr(x + 10, y + 54, 32, 34, 8, '#2b3242');
    s += rr(x + 12, y + 58, 28, 16, 4, '#1b2230');
    s += '<circle cx="' + (x + 19) + '" cy="' + (y + 66) + '" r="2.6" fill="#22d3ee"/>';
    s += '<circle cx="' + (x + 33) + '" cy="' + (y + 66) + '" r="2.6" fill="#22d3ee"/>';
    s += rr(x + 4, y + 12, 44, 40, 11, '#39415a');
    s += rr(x + 9, y + 18, 34, 26, 8, '#0e1626');
    s += '<circle cx="' + (x + 18) + '" cy="' + (y + 31) + '" r="3.4" fill="#8fd6ff"/>';
    s += '<circle cx="' + (x + 34) + '" cy="' + (y + 31) + '" r="3.4" fill="#8fd6ff"/>';
    s += '<path d="M' + (x + 26) + ' ' + (y + 12) + ' L' + (x + 26) + ' ' + (y + 2) + '" stroke="#39415a" stroke-width="3"/>';
    s += '<circle cx="' + (x + 26) + '" cy="' + (y + 1) + '" r="4" fill="#22d3ee" opacity=".9"/>';
    s += rr(x + 2, y + 56, 6, 26, 3, '#39415a');
    s += rr(x + 44, y + 56, 6, 26, 3, '#39415a');
    return s;
  }  function part(id, inner, box) {
    var p = P(id), on = isOn(p);
    return '<g class="lcr-part ' + (on ? 'unlocked' : 'locked') + '" data-id="' + id + '" role="button" tabindex="0" aria-label="' + ((p && p.name) || '') + '">' +
      '<rect class="ph" x="' + box.x.toFixed(1) + '" y="' + box.y.toFixed(1) + '" width="' + Math.max(8, box.w).toFixed(1) +
      '" height="' + Math.max(8, box.h).toFixed(1) + '" rx="5" fill="rgba(120,150,200,.05)" stroke="rgba(150,180,220,.5)" stroke-width="1.3" stroke-dasharray="5 4"/>' +
      '<g class="shp">' + inner + '</g>' +
      '<rect x="' + box.x.toFixed(1) + '" y="' + box.y.toFixed(1) + '" width="' + Math.max(8, box.w).toFixed(1) +
      '" height="' + Math.max(8, box.h).toFixed(1) + '" fill="transparent"/>' +
      '</g>';
  }

  // 自己加的零件：摆在桌右侧空地
  var EXTRA_SPOT = [{ x: 840, y: 520 }, { x: 900, y: 520 }, { x: 960, y: 520 }, { x: 840, y: 470 }];
  function extraPart(p, i) {
    var sp = EXTRA_SPOT[i % EXTRA_SPOT.length] || { x: 860, y: 470 };
    var inner = rr(sp.x, sp.y, 54, 54, 6, '#3b4356') +
      '<rect x="' + sp.x + '" y="' + sp.y + '" width="54" height="6" rx="3" fill="rgba(255,255,255,.14)"/>' +
      tx(sp.x + 27, sp.y + 36, p.icon || '📦', 20, '#cfd6e4', 'middle');
    return part(p.id, inner, { x: sp.x - 4, y: sp.y - 6, w: 62, h: 66 });
  }

  function scene() {
    var s = shell() + lights();
    s += part(8, tower(), { x: CASE.x - 4, y: CASE.y - 4, w: CASE.w + 8, h: CASE.h + 8 });
    // 机箱里的 8 件
    var iw = (CASE.w - 26) / 2, ih = (CASE.h - 30) / 4;
    INSIDE.forEach(function (id, idx) {
      var p = P(id); if (!p) return;
      var x = CASE.x + 12 + (idx % 2) * (iw + 2), y = CASE.y + 14 + Math.floor(idx / 2) * (ih + 2);
      var w = iw - 4, h = ih - 6, on = isOn(p);
      var inner = on
        ? rr(x, y, w, h, 3, 'rgba(62,108,175,.55)') +
          '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="none" stroke="rgba(150,200,255,.5)"/>' +
          tx(x + w / 2, y + h / 2 + 4, p.icon, 11, '#d7e7ff', 'middle')
        : rr(x, y, w, h, 3, 'rgba(255,255,255,.03)', 'stroke="rgba(255,255,255,.13)" stroke-dasharray="4 4"');
      s += part(id, inner, { x: x, y: y, w: w, h: h });
    });
    s += part(3, strip(840, 766), { x: 840, y: 766, w: 192, h: 26 });

    s += part(16, monitor(372, 230, 456, 266), { x: 372, y: 204, w: 456, h: 296 });
    s += act('wall', '<rect x="380" y="238" width="440" height="250" fill="transparent"/>', { x: 380, y: 238, w: 440, h: 250 }, '成绩');
    s += part(6, webcam(586, 204), { x: 586, y: 202, w: 38, h: 24 });
    s += part(7, speaker(300, 496) + speaker(834, 496), { x: 300, y: 370, w: 620, h: 130 });
    s += part(9, gamepad(316, 492), { x: 316, y: 444, w: 76, h: 54 });
    s += part(1, mat(290, 548, 540, 84), { x: 290, y: 548, w: 540, h: 84 });
    s += part(4, keyboard(372, 566, 350, 58), { x: 372, y: 566, w: 350, h: 58 });
    s += part(2, mouse(750, 578), { x: 750, y: 578, w: 52, h: 46 });
    s += part(5, headphones(1002, 604), { x: 996, y: 470, w: 80, h: 140 });
    s += part(19, switchDock(838, 632), { x: 830, y: 540, w: 118, h: 100 });
    s += part(20, cartridge(956, 606), { x: 956, y: 606, w: 20, h: 26 });

    // 20 件之外自己加的
    var known = { 1:1,2:1,3:1,4:1,5:1,6:1,7:1,8:1,9:1,10:1,11:1,12:1,13:1,14:1,15:1,16:1,17:1,18:1,19:1,20:1 };
    var ei = 0;
    (cur.parts || []).forEach(function (p) { if (!known[p.id]) extraPart(p, ei++); });

    s += chair() + plant(112, 636) + mug(688, 522) + cables();
    // ── 空间里的"入口"物件（不是按钮）
    s += act('checkin', notebook(), { x: 388, y: 504, w: 96, h: 52 }, '交作业');
    // 桌上的 AGENT（小搭）
    s += act('chat', robot(), { x: 660, y: 458, w: 64, h: 110 }, '小搭');
    // 桌角的小计分牌：Lv / 连续 / 积分
    s += act('stat', scoreboard(), { x: 496, y: 508, w: 76, h: 50 }, '状态');
    // 手机上翻菜单（错题本 / 单词 / 设置）
    s += act('menu', phoneMini(), { x: 736, y: 512, w: 44, h: 34 }, '菜单');

    // ── 房间反映"今天"：待交的卷子堆在桌上；今天没动 → 窗外天色暗一档
    var td = (cur && cur.today) || {};
    if (td.pending > 0) {
      var n = Math.min(5, td.pending);
      s += '<g class="lcr-act" data-act="checkin" role="button" tabindex="0" aria-label="待交的作业">';
      for (var pi = 0; pi < n; pi++) {
        var px = 236 + pi * 3.5, py = 516 + pi * 2.6;
        s += '<g transform="rotate(' + (-3 + pi * 1.4) + ' ' + px + ' ' + py + ')">' +
          '<rect x="' + px + '" y="' + py + '" width="86" height="58" rx="2" fill="#e8e4d8" opacity=".92"/>' +
          '<rect x="' + (px + 8) + '" y="' + (py + 10) + '" width="52" height="3" rx="1.5" fill="rgba(80,90,110,.45)"/>' +
          '<rect x="' + (px + 8) + '" y="' + (py + 18) + '" width="64" height="3" rx="1.5" fill="rgba(80,90,110,.3)"/>' +
          '<rect x="' + (px + 8) + '" y="' + (py + 26) + '" width="40" height="3" rx="1.5" fill="rgba(80,90,110,.25)"/>' +
          '</g>';
      }
      s += rr(228, 488, 104, 20, 6, 'rgba(251,191,36,.16)', 'stroke="rgba(251,191,36,.45)"');
      s += tx(280, 502, '待交 ' + td.pending + ' 张', 11, '#fbbf24', 'middle', '600');
      s += '</g>';
    }
    if (td.done === 0) {
      s += '<rect x="60" y="6" width="1080" height="452" fill="#070b12" opacity=".38"/>';
      s += '<rect x="60" y="6" width="1080" height="452" fill="none" stroke="rgba(255,255,255,.05)"/>';
    }
    return s;
  }

  /* ---------- 相机 ---------- */
  var el = null, hostEl = null, svgEl = null, worldEl = null, sheetEl = null;
  var cam = { k: 1, x: 0, y: 0 }, fitted = false, lockMode = 'sil';
  var LS_CAM = 'lc_room_cam', LS_LOCK = 'lc_room_lock';
  try { lockMode = localStorage.getItem(LS_LOCK) || 'sil'; } catch (e) { }

  function apply() { if (worldEl) worldEl.setAttribute('transform', 'translate(' + cam.x.toFixed(2) + ',' + cam.y.toFixed(2) + ') scale(' + cam.k.toFixed(4) + ')'); }
  function viewSize() { return { w: svgEl.clientWidth || 360, h: svgEl.clientHeight || 420 }; }
  function clampCam() {
    var v = viewSize(), k = cam.k, w = W * k, h = H * k;
    if (w <= v.w) cam.x = (v.w - w) / 2; else cam.x = Math.min(0, Math.max(v.w - w, cam.x));
    if (h <= v.h) cam.y = (v.h - h) / 2; else cam.y = Math.min(0, Math.max(v.h - h, cam.y));
  }
  function fit() {
    var v = viewSize();
    var kFit = Math.min(v.w / W, v.h / H);
    var kCov = Math.max(v.w / W, v.h / H);
    // 手机（竖着的窄框）：不要贴太近，最多放大到 2.2 倍，剩下的用背景补
    var k = (kCov / kFit > 1.15) ? Math.min(kCov, kFit * 2.2) : kFit;
    cam.k = Math.max(.25, Math.min(2.2, k));
    cam.x = v.w / 2 - cam.k * W / 2;
    cam.y = (kCov / kFit > 1.15) ? (v.h / 2 - cam.k * H * 0.60) : (v.h / 2 - cam.k * H / 2);
    clampCam(); apply();
  }
  function zoomAt(cx, cy, f) {
    var nk = Math.max(.3, Math.min(2.8, cam.k * f));
    var wx = (cx - cam.x) / cam.k, wy = (cy - cam.y) / cam.k;
    cam.k = nk; cam.x = cx - wx * nk; cam.y = cy - wy * nk;
    clampCam(); apply();
  }
  function saveCam() { try { localStorage.setItem(LS_CAM, JSON.stringify(cam)); } catch (e) { } }
  function local(e) { var r = svgEl.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

  /* ---------- 抽屉 ---------- */
  function fmt(n) { return (n || 0).toLocaleString(); }
  function statusOf(p) {
    if (p.received) return { k: 'ok', t: '✅ 已签收' };
    if (p.unlocked) return { k: 'wait', t: '🔓 已解锁 · 待下单' };
    return { k: '', t: '🔒 未解锁' };
  }
  function mkBtn(t, cls, fn) { var b = document.createElement('button'); b.className = cls; b.type = 'button'; b.textContent = t; b.onclick = fn; return b; }
  function markSel(id) {
    if (!worldEl) return;
    var all = worldEl.querySelectorAll('.lcr-part');
    for (var i = 0; i < all.length; i++) all[i].classList.toggle('sel', +all[i].getAttribute('data-id') === id);
  }
  function closeSheet() { if (sheetEl) sheetEl.classList.remove('open'); markSel(null); }
  function openSheet(id) {
    if (!cur || !sheetEl) return;
    var p = P(id); if (!p) return;
    var st = statusOf(p), cost = Math.round((p.value || 0) * (cur.rate || 1));
    sheetEl.querySelector('.lcr-sh-ico').textContent = p.icon || '📦';
    sheetEl.querySelector('.lcr-sh-name').textContent = p.name || '零件';
    var pill = sheetEl.querySelector('.lcr-pill');
    pill.textContent = st.t; pill.className = 'lcr-pill ' + st.k;
    sheetEl.querySelector('.lcr-sh-price').textContent = '¥' + fmt(p.value) + ' / ⭐' + fmt(cost);
    sheetEl.querySelector('.lcr-sh-cond').innerHTML =
      (p.exchange ? '积分兑换 · ' : '解锁条件 · ') + '<b>' + (p.cond || '') + '</b>　' + (p.det || '') +
      (p.unlocked ? '' : '<br><span class="lcr-dim">空位先摆在那儿，看得见要往哪走。</span>');
    var acts = sheetEl.querySelector('.lcr-sh-acts');
    acts.innerHTML = '';
    if (cur.canReceive && p.unlocked && !p.received) {
      acts.appendChild(mkBtn('✅ 标记签收', 'lcr-btn primary', function () { closeSheet(); cur.onReceive && cur.onReceive(p.id); }));
    }
    if (cur.canReceive && p.exchange && !p.unlocked) {
      var can = (cur.avail || 0) >= cost;
      acts.appendChild(mkBtn((can ? '💰 兑换 ⭐' : '🔒 积分不足 ⭐') + fmt(cost), 'lcr-btn ' + (can ? 'primary' : ''), function () {
        cur.onExchange && cur.onExchange(p.id);
      }));
    }
    if (cur.canEdit) acts.appendChild(mkBtn('✏️ 改价', 'lcr-btn', function () { closeSheet(); cur.onEdit && cur.onEdit(p.id); }));
    acts.appendChild(mkBtn('关闭', 'lcr-btn', closeSheet));
    sheetEl.classList.add('open');
    markSel(id);
  }

  /* ---------- 建壳（只建一次） ---------- */
  function build() {
    el = document.createElement('div');
    el.className = 'lcr-room mode-' + lockMode;
    el.innerHTML =
      '<svg class="lcr-svg" xmlns="http://www.w3.org/2000/svg">' +
      '<defs>' +
      '<linearGradient id="lcrWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1e24"/><stop offset=".6" stop-color="#14171c"/><stop offset="1" stop-color="#0d0f13"/></linearGradient>' +
      '<radialGradient id="lcrWallGlow" cx=".6" cy=".15" r=".7"><stop offset="0" stop-color="#7fb0e8" stop-opacity=".16"/><stop offset="1" stop-color="#7fb0e8" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="lcrSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#26456a"/><stop offset=".42" stop-color="#48739a"/><stop offset=".74" stop-color="#8fb4cc"/><stop offset="1" stop-color="#cfdde2"/></linearGradient>' +
      '<linearGradient id="lcrBldA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#44607c"/><stop offset="1" stop-color="#5d7a93"/></linearGradient>' +
      '<linearGradient id="lcrBldB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31506c"/><stop offset="1" stop-color="#4a6884"/></linearGradient>' +
      '<linearGradient id="lcrDeskTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31353d"/><stop offset=".10" stop-color="#3d424b"/><stop offset=".55" stop-color="#31353d"/><stop offset="1" stop-color="#22262c"/></linearGradient>' +
      '<linearGradient id="lcrRiser" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3f48"/><stop offset="1" stop-color="#262a31"/></linearGradient>' +
      '<linearGradient id="lcrDeskFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1f25"/><stop offset="1" stop-color="#0b0d11"/></linearGradient>' +
      '<linearGradient id="lcrMat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#31363e"/><stop offset="1" stop-color="#1d2128"/></linearGradient>' +
      '<linearGradient id="lcrScreen" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stop-color="#1a2740"/><stop offset=".45" stop-color="#101b2e"/><stop offset="1" stop-color="#0a1220"/></linearGradient>' +
      '<linearGradient id="lcrRefl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fa8e0" stop-opacity=".22"/><stop offset="1" stop-color="#7fa8e0" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="lcrMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#a9aeb8"/><stop offset=".3" stop-color="#eef2f7"/><stop offset=".62" stop-color="#c2c7d0"/><stop offset="1" stop-color="#8b919b"/></linearGradient>' +
      '<linearGradient id="lcrCase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b313a"/><stop offset=".5" stop-color="#363d47"/><stop offset="1" stop-color="#1c2129"/></linearGradient>' +
      '<linearGradient id="lcrGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8fb6e0" stop-opacity=".3"/><stop offset=".4" stop-color="#2b3d55" stop-opacity=".55"/><stop offset="1" stop-color="#0d141d" stop-opacity=".8"/></linearGradient>' +
      '<linearGradient id="lcrWood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5b4634"/><stop offset="1" stop-color="#3a2c1e"/></linearGradient>' +
      '<linearGradient id="lcrChair" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#33383f"/><stop offset=".4" stop-color="#20252b"/><stop offset="1" stop-color="#0c0e12"/></linearGradient>' +
      '<radialGradient id="lcrLamp" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf9a" stop-opacity=".5"/><stop offset="1" stop-color="#ffcf9a" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lcrCool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#8fc3ff" stop-opacity=".28"/><stop offset="1" stop-color="#8fc3ff" stop-opacity="0"/></radialGradient>' +
      '<filter id="lcrSoft" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="8"/></filter>' +
      '<filter id="lcrSoft2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>' +
      '</defs><g class="lcr-world"></g></svg>' +
      '<div class="lcr-top"><span class="lcr-stat"></span><span class="lcr-sp"></span>' +
      '<button type="button" class="lcr-mini" data-act="lock" title="切换未解锁样式">🔒</button>' +
      '<button type="button" class="lcr-mini" data-act="fit" title="看全">⤢</button></div>' +
      '<div class="lcr-sheet"><div class="lcr-row"><div class="lcr-sh-ico">🎁</div><div class="lcr-grow">' +
      '<div class="lcr-sh-name">零件</div><div class="lcr-sh-price"></div></div><span class="lcr-pill"></span></div>' +
      '<div class="lcr-sh-cond"></div><div class="lcr-sh-acts"></div></div>';

    svgEl = el.querySelector('.lcr-svg');
    worldEl = el.querySelector('.lcr-world');
    sheetEl = el.querySelector('.lcr-sheet');
    try { var sc = JSON.parse(localStorage.getItem(LS_CAM) || 'null'); if (sc && sc.k > 0) { cam = sc; fitted = true; } } catch (e) { }

    el.querySelector('[data-act="fit"]').onclick = function (e) { e.stopPropagation(); fit(); saveCam(); };
    el.querySelector('[data-act="lock"]').onclick = function (e) {
      e.stopPropagation();
      var order = ['sil', 'ghost', 'icon'], name = { sil: '剪影', ghost: '灰掉', icon: '只留锁' };
      lockMode = order[(order.indexOf(lockMode) + 1) % 3];
      try { localStorage.setItem(LS_LOCK, lockMode); } catch (err) { }
      el.className = 'lcr-room mode-' + lockMode;
      if (cur && cur.toast) cur.toast('未解锁零件：' + name[lockMode]);
    };

    var ptrs = {}, moved = 0;
    svgEl.addEventListener('pointerdown', function (e) {
      try { svgEl.setPointerCapture(e.pointerId); } catch (err) { }
      var l = local(e); ptrs[e.pointerId] = { x: l.x, y: l.y }; moved = 0;
    });
    svgEl.addEventListener('pointermove', function (e) {
      var p = ptrs[e.pointerId]; if (!p) return;
      var ids = Object.keys(ptrs), l = local(e);
      if (ids.length === 1) {
        var dx = l.x - p.x, dy = l.y - p.y;
        p.x = l.x; p.y = l.y; moved += Math.abs(dx) + Math.abs(dy);
        cam.x += dx; cam.y += dy; clampCam(); apply();
      } else {
        var a = ptrs[ids[0]], b = ptrs[ids[1]];
        var before = Math.hypot(a.x - b.x, a.y - b.y);
        p.x = l.x; p.y = l.y;
        var after = Math.hypot(a.x - b.x, a.y - b.y);
        if (before > 6 && after > 6) zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, after / before);
        moved += 50;
      }
    });
    function up(e) { delete ptrs[e.pointerId]; if (!Object.keys(ptrs).length) saveCam(); }
    svgEl.addEventListener('pointerup', up);
    svgEl.addEventListener('pointercancel', up);
    svgEl.addEventListener('wheel', function (e) {
      e.preventDefault();
      var l = local(e); zoomAt(l.x, l.y, e.deltaY < 0 ? 1.12 : .89); saveCam();
    }, { passive: false });

    svgEl.addEventListener('click', function (e) {
      if (moved > 12) return;
      var a = e.target.closest ? e.target.closest('[data-act]') : null;
      if (a && cur && cur.onAct) { try{ if(navigator.vibrate) navigator.vibrate(8) }catch(err){} cur.onAct(a.getAttribute('data-act')); return; }
      var g = e.target.closest ? e.target.closest('[data-id]') : null;
      if (g) openSheet(+g.getAttribute('data-id')); else closeSheet();
    });

    // 横竖屏切换 / 窗口变化：重新取景（防抖，避免拖影）
    var _rt = null, _lw = 0, _lh = 0;
    function relayout() {
      if (!el || !el.isConnected) return;
      var w = svgEl.clientWidth || 0, h = svgEl.clientHeight || 0;
      if (Math.abs(w - _lw) < 24 && Math.abs(h - _lh) < 24) { clampCam(); apply(); return; }
      _lw = w; _lh = h;
      fit();
    }
    function onViewportChange() {
      clearTimeout(_rt);
      _rt = setTimeout(relayout, 160);
    }
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', function () { setTimeout(onViewportChange, 260); });
    if (window.visualViewport) window.visualViewport.addEventListener('resize', onViewportChange);
  }

  function paint() {
    if (!worldEl || !cur) return;
    worldEl.innerHTML = scene();
    apply();
    var on = 0, total = (cur.parts || []).length;
    (cur.parts || []).forEach(function (p) { if (p.unlocked) on++; });
    el.querySelector('.lcr-stat').textContent = '已解锁 ' + on + '/' + total + ' · 可用 ⭐' + fmt(cur.avail);
  }

  window.ROOM = {
    version: 2,
    mount: function (h, opts) {
      cur = opts; hostEl = h;
      if (!el) build();
      if (el.parentNode !== h) h.appendChild(el);
      el.className = 'lcr-room mode-' + lockMode + (opts && opts.bare ? ' bare' : '');
      paint();
      requestAnimationFrame(function () {
        if (!el) return;
        if (!fitted) { fit(); fitted = true; }
        else { clampCam(); apply(); }
      });
      return el;
    },
    fit: function () { fit(); },
    close: closeSheet
  };
})();
