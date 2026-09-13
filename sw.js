/* 阿勒学习驾驶舱 · Service Worker
   作用：① 安卓 Chrome 可"安装成应用" ② 断网也能打开壳 ③ 静态资源缓存加速
   注意：AI 请求、云存储图片、数据库走网络，不缓存 */
const CACHE = 'lc-shell-v1'
const ASSETS = ['./', './index.html', './styles.css', './manifest.json', './icon-192.png', './icon-512.png', './icon-180.png']

self.addEventListener('install', function (e) {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS).catch(function () {}) }))
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE }).map(function (k) { return caches.delete(k) }))
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
  const isShell = (p === '/' || p.endsWith('.html') || p.endsWith('app.js') || p.endsWith('styles.css') || p.endsWith('manifest.json'))
  if (isShell) {
    // 网络优先：保证每次都能拿到最新版；断网时回缓存
    e.respondWith(
      fetch(req).then(function (r) {
        const cp = r.clone()
        caches.open(CACHE).then(function (c) { c.put(req, cp) }).catch(function () {})
        return r
      }).catch(function () {
        return caches.match(req).then(function (m) { return m || caches.match('./index.html') })
      })
    )
  } else {
    // 图标等：缓存优先
    e.respondWith(caches.match(req).then(function (m) { return m || fetch(req) }))
  }
})