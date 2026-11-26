/* 阿勒学习驾驶舱 · Service Worker
   作用：① 安卓 Chrome 可"安装成应用" ② 断网也能打开壳 ③ 静态资源缓存加速
   注意：AI 请求、云存储图片、数据库走网络，不缓存 */
const CACHE = 'lc-shell-v45'
const ASSETS = ['./', './index.html', './classic.html', './学习驾驶舱.html', './styles.css', './cockpit.css', './cockpit.js', './avatar-lele.png', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png', './font-inter.woff2', './font-mono.woff2', './words-8.json', './words-zk.json', './app.js', './room.js', './wall.js', './cockpit-hero.webp', './build-hero.webp']
ASSETS.push('./reward-photos/studio.webp','./reward-photos/switch-cartridges.webp','./reward-photos/zelda-cartridge.webp',...Array.from({length:20},(_,i)=>'./reward-photos/'+String(i+1).padStart(2,'0')+'.webp'))

self.addEventListener('install', function (e) {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS).catch(function () {}) }))
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k.startsWith('lc-shell-') && k !== CACHE }).map(function (k) { return caches.delete(k) }))
    }).then(function () { return self.clients.claim() })
  )
})

self.addEventListener('fetch', function (e) {
  const req = e.request
  if (req.method !== 'GET') return
  let u
  try { u = new URL(req.url) } catch (err) { return }
  if (u.origin !== self.location.origin) return                    // 跨域（AI / 云存储 / 数据库）不拦
  const p = u.pathname
  const isShell = (req.mode === 'navigate' || p === '/' || p.endsWith('.html') || p.endsWith('.js') || p.endsWith('.css') || p.endsWith('.json'))
  if (isShell) {
    // 网络优先：保证每次都能拿到最新版；断网时回缓存
    e.respondWith(
      fetch(req).then(function (r) {
        if (r.ok) {
          const cp = r.clone()
          caches.open(CACHE).then(function (c) { c.put(req, cp) }).catch(function () {})
        }
        return r
      }).catch(function () {
        return caches.open(CACHE).then(async function (cache) {
          const match = await cache.match(req) || await cache.match(u.pathname)
          if (match) return match
          if (req.mode === 'navigate') return await cache.match('./index.html') || Response.error()
          return Response.error()
        })
      })
    )
  } else {
    // 图标等：缓存优先
    e.respondWith(caches.match(req).then(function (m) { return m || fetch(req) }))
  }
})
