const SUB={}
SUB['初二上']=[{id:'chinese',name:'语文',full:150,rate:1},{id:'math',name:'数学',full:150,rate:1},{id:'english',name:'英语',full:150,rate:1},{id:'physics',name:'物理',full:100,rate:0.9},{id:'geo',name:'地理',full:100,rate:0.3},{id:'bio',name:'生物',full:100,rate:0.3},{id:'dao',name:'道法',full:100,rate:0.5},{id:'history',name:'历史',full:100,rate:0.5},{id:'pe',name:'体育',full:40,rate:1}]
SUB['初二下']=SUB['初二上']
SUB['初三上']=[...SUB['初二上'],{id:'chem',name:'化学',full:100,rate:0.6}]
SUB['初三下']=SUB['初三上']

const PLANS=[{name:'基础套餐',data:'5GB+100分钟',cost:30},{name:'视频加成',data:'+5GB',cost:10},{name:'达标奖励',data:'+10GB',cost:20},{name:'优异奖励',data:'+20GB',cost:40}]
const PT=[{id:1,icon:'🖱️',name:'鼠标垫',value:30,cond:'初二上期中',det:'主科均分≥100',st:1},{id:2,icon:'🐭',name:'鼠标',value:200,cond:'初二上期中',det:'主科均分≥100',st:2},{id:3,icon:'🔌',name:'排插',value:100,cond:'初二上期中',det:'主科均分≥100',st:3},{id:4,icon:'⌨️',name:'键盘',value:400,cond:'初二上期末',det:'总分≥508',st:4},{id:5,icon:'🎧',name:'耳机',value:350,cond:'初二上期末',det:'总分≥508',st:5},{id:6,icon:'🎥',name:'摄像头',value:200,cond:'初二上期末',det:'总分≥508',st:6},{id:7,icon:'🔊',name:'音响',value:400,cond:'初二下期中',det:'总分≥517',st:7},{id:8,icon:'🎒',name:'机箱',value:350,cond:'初二下期中',det:'总分≥517',st:8},{id:9,icon:'🕹️',name:'游戏手柄',value:350,cond:'初二下期中',det:'总分≥517',st:9},{id:10,icon:'💾',name:'SSD 1TB',value:500,cond:'初二下期末',det:'总分≥538',st:10},{id:11,icon:'❄️',name:'散热器',value:300,cond:'初二下期末',det:'总分≥538',st:11},{id:12,icon:'⚡',name:'电源750W',value:500,cond:'初三上期中',det:'总分≥580',st:12},{id:13,icon:'💽',name:'机械硬盘',value:500,cond:'初三上期中',det:'总分≥580',st:13},{id:14,icon:'🧠',name:'内存32G',value:600,cond:'初三上期末',det:'总分≥610',st:14},{id:15,icon:'🔧',name:'主板',value:1000,cond:'一模≥600',det:'初三下开学',st:15},{id:16,icon:'📺',name:'显示器2K',value:1200,cond:'二模≥610',det:'初三下期中',st:16},{id:17,icon:'🧮',name:'CPU',value:1500,cond:'三模≥615',det:'中考前冲刺',st:17},{id:18,icon:'🎮',name:'显卡',value:2500,cond:'中考≥625',det:'中考达标!',st:18},{id:19,icon:'🎮',name:'Switch游戏机',value:3508,cond:'积分兑换',det:'游戏机大奖',exchange:true,st:19},{id:20,icon:'🗡️',name:'塞尔达游戏',value:287,cond:'积分兑换',det:'Switch游戏卡带',exchange:true,st:20}]

const CHECK_TYPES=[
  {id:'homework',name:'作业拍照',icon:'📖',subject:true,pts:2},
  {id:'note',name:'课堂笔记',icon:'📝',subject:true,pts:2},
  {id:'extra',name:'额外学习',icon:'📚',subject:true,pts:5},
  {id:'word',name:'背单词',icon:'🔤',subject:true,englishOnly:true,pts:2},
  {id:'mistake',name:'错题本拍照',icon:'📓',subject:true,pts:2},
  {id:'recite',name:'背诵默写签名',icon:'🖊️',subject:false,pts:2},
  {id:'assignment',name:'作业内容',icon:'📋',subject:false,pts:1}
]
const SUBJECTS=['语文','数学','英语','物理','化学','地理','生物','历史','道法']
const EXAM_TYPES=[{id:'quiz',name:'小测试',big:false},{id:'mid',name:'期中',big:true},{id:'final',name:'期末',big:true},{id:'monthly',name:'月考',big:true},{id:'mock',name:'模拟考',big:true},{id:'zk',name:'中考',big:true}]
function defData(){
  return {
    exams:[],parts:JSON.parse(JSON.stringify(PT)),dailyChecks:{},checkImgs:{},checks:[],points:[],sem:'初二上',
    rate:10,
    bl:{chinese:99,math:115,english:70,geo:67,history:81,dao:63,bio:58,physics:null,pe:null,chem:null},
    phone:false,phDate:null,tabUnlock:true,tabDailyMinutes:60,pl:0,examDate:null,examTopic:'',mistakes:[],tasks:[],ritualTime:'20:00',smallGoals:[],mistakeMilestones:[],mistakeLog:{},
    dci:[{key:'videoCall',icon:'📞',label:'视频通话',pts:2},{key:'askTeacher',icon:'🙋',label:'主动问老师',pts:3},{key:'noSkipStep',icon:'✅',label:'解题不跳步',pts:2},{key:'reciteMethod',icon:'🧠',label:'背英语用方法',pts:2},{key:'onTimeStudy',icon:'⏰',label:'按时开始学习',pts:2}]
  }
}
const SK='lc_v3'
// ===== 腾讯云开发接入（PostgreSQL + rdb）=====
const CLOUD_ENV='jiajia-study-d6gjyod13d77728d6'
const CLOUD_REGION='ap-shanghai'
const CLOUD_KEY='eyJhbGciOiJSUzI1NiIsImtpZCI6IjNhNjk3Y2I2LWRjMDMtNGFkMi04ZGQ2LTFkMWNjNjZhNGQ5MSJ9.eyJpc3MiOiJodHRwczovL2ppYWppYS1zdHVkeS1kNmdqeW9kMTNkNzc3MjhkNi5hcC1zaGFuZ2hhaS50Y2ItYXBpLnRlbmNlbnRjbG91ZGFwaS5jb20iLCJzdWIiOiJhbm9uIiwiYXVkIjoiamlhamlhLXN0dWR5LWQ2Z2p5b2QxM2Q3NzcyOGQ2IiwiZXhwIjo0MDkyNTI4NDk2LCJpYXQiOjE3ODg4NDUyOTYsIm5vbmNlIjoiODhqMEJEQV9Tci1qTVNMT1BhVWFBZyIsImF0X2hhc2giOiI4OGowQkRBX1NyLWpNU0xPUGFVYUFnIiwibmFtZSI6IkFub255bW91cyIsInNjb3BlIjoiYW5vbnltb3VzIiwicHJvamVjdF9pZCI6ImppYWppYS1zdHVkeS1kNmdqeW9kMTNkNzc3MjhkNiIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.Mp-ZotDDKuzD-fXrSi9TvnFQLh_HhZqfy3ZHON4TWnhbuG6y2atGQSk6fjYMJqNX3QYajY5ZaQ3gAcrLYUF_Sx3CFRj3Ugeask5lKlWFnlEkn7PpY9joBFcSP7-TXeNwssT4FoiuqlzoEetJw8pQFtTo8iB3vOYLBsWAw5O3uNPysNWRN9YKA3RXSvcqQOOMMWXjmVEJsuTLzK_w0VmuahW_RyXIvJk_mpnZ-PeAA21uWhGJws5spytiKEyG9OXen4_SeICfTUYBxLncReGrluLxRU9nyDnPTyq3aKemz0I5AbPJdngwsRtxk3W17Os6OxvUBwbWfGbeJOwFn74O8Q'
const CLOUD_TABLE='study_data'
const CLOUD_ID=1
let cloudApp=null,cloudRdb=null,cloudReady=false
let _syncT=0,_cloudTs=0,_dirty=false,_retryTimer=null,_offline=false,_failNotified=false,_lastVisCheck=Date.now(),_cloudReadOk=false,_quotaWarned=false
function fmtHM(t){const d=new Date(t||Date.now());return ('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)}
function setCloudStatus(txt,ok){
  const el=document.getElementById('cloudBadge')
  if(el){el.innerHTML=txt;el.style.color=ok?'#6ee7b7':'#fbbf24'}
}
function markSynced(t){_syncT=t||Date.now();_dirty=false;_failNotified=false;if(_retryTimer){clearTimeout(_retryTimer);_retryTimer=null}setCloudStatus('☁️ 已同步 '+fmtHM(_syncT),true)}
function markDirty(){_dirty=true;setCloudStatus('⏳ 待上传（点此重试）',false);scheduleRetry()}
function scheduleRetry(){
  if(_retryTimer||!cloudReady)return
  _retryTimer=setTimeout(function(){
    _retryTimer=null
    if(!cloudReady)return
    if(!_cloudReadOk){retryRead();return}
    if(_dirty)saveCloud(D)
  },15000)
}
async function retryRead(){
  if(!cloudReady||_offline)return
  const cd=await loadCloud()
  if(!_cloudReadOk)return
  const localT=parseInt(localStorage.getItem(SK+'_t')||'0',10)
  if(cd&&!(localT>_cloudTs+5000)){
    D=normalize(cd);render();markSynced(_cloudTs||Date.now());ts('🔄 已连接云端，载入最新数据')
  }else{
    if(_dirty)saveCloud(D)
  }
}
async function syncNow(){
  if(!cloudReady){ts('⚠️ 云端未连接，数据已存在本机');return}
  if(_offline){ts('📴 当前离线，联网后会自动上传');return}
  setCloudStatus('🔄 同步中...',true)
  const ok=await saveCloud(D)
  ts(ok?'☁️ 已同步到云端':'⚠️ 同步失败，稍后自动重试')
}
function normalize(d){
  if(d&&d.hw)delete d.hw
  const df=defData()
  for(const k of Object.keys(df)){
    if(!(k in d))d[k]=df[k]
    if(k==='dailyCheckItems'&&!d.dci&&d.dailyCheckItems)d.dci=d.dailyCheckItems
  }
  if(!d.parts||d.parts.length!==PT.length){d.parts=JSON.parse(JSON.stringify(PT))}
  const _DEP=['englishVocab','homeworkPhoto','extraStudy','classNote','mistakeBook']
  if(d.dci&&Array.isArray(d.dci)){d.dci=d.dci.filter(function(it){return _DEP.indexOf(it.key)<0})}
  if(d.dci&&Array.isArray(d.dci)){const dd=defData().dci;for(const item of dd){if(!d.dci.some(function(x){return x.key===item.key})){d.dci.push(item)}}}
  if(!d.mistakeLog)d.mistakeLog={}
  return d
}
const CLOUD_SDK_URL='https://static.cloudbase.net/cloudbase-js-sdk/latest/cloudbase.full.js'
function loadCloudSDK(){
  return new Promise(function(res,rej){
    if(typeof window!=='undefined'&&window.cloudbase)return res()
    const sc=document.createElement('script')
    sc.src=CLOUD_SDK_URL
    sc.onload=function(){res()}
    sc.onerror=function(){rej(new Error('SDK 加载失败'))}
    document.head.appendChild(sc)
  })
}
async function initCloud(){
  try{
    if(NOCLOUD){setCloudStatus('📴 本地模式（?local）',false);return false}
    await loadCloudSDK()
    if(typeof window==='undefined'||!window.cloudbase){setCloudStatus('SDK未加载',false);return false}
    cloudApp=cloudbase.init({env:CLOUD_ENV,region:CLOUD_REGION,accessKey:CLOUD_KEY})
    cloudRdb=cloudApp.rdb()
    cloudReady=true
    return true
  }catch(e){console.error('云端初始化失败',e);setCloudStatus('连接失败',false);cloudReady=false;return false}
}
async function loadCloud(){
  if(!cloudReady)return null
  try{
    const {data,error}=await cloudRdb.from(CLOUD_TABLE).select('*').eq('id',CLOUD_ID).limit(1)
    if(error){console.error('云端读取失败',JSON.stringify(error));return null}
    _cloudReadOk=true
    if(data&&data.length>0&&data[0]&&data[0].data){
      if(data[0].updated_at){const t=Date.parse(data[0].updated_at);if(!isNaN(t))_cloudTs=t}
      return data[0].data
    }
    return null
  }catch(e){console.error('云端读取失败',e);return null}
}
async function saveCloud(d){
  if(!cloudReady){markDirty();return false}
  if(_offline){markDirty();return false}
  if(!_cloudReadOk){_dirty=true;setCloudStatus('⏳ 等待云端确认（本机已存）',false);scheduleRetry();return false}
  try{
    const ts=Date.now()
    const r=await cloudRdb.from(CLOUD_TABLE).upsert({id:CLOUD_ID,data:d,updated_at:new Date(ts).toISOString()})
    if(r&&r.error)throw new Error(JSON.stringify(r.error))
    _cloudTs=ts
    markSynced(ts)
    return true
  }catch(e){
    console.error('云端写入失败',JSON.stringify(e))
    markDirty()
    if(!_failNotified){_failNotified=true;ts('⚠️ 云端保存失败，数据已存本机，会自动重试')}
    return false
  }
}
function ld(){
  try{
    let r=localStorage.getItem(SK)
    if(!r){r=localStorage.getItem('learning_cockpit_data')}
    if(!r){r=localStorage.getItem('learning_cockpit_v2')}
    if(r){
      const d=normalize(JSON.parse(r))
      if(!localStorage.getItem(SK))localStorage.setItem(SK,JSON.stringify(d))
      return d
    }
  }catch(e){console.error('Load error:',e)}
  return defData()
}

function sv(d){
  let ok=true
  try{localStorage.setItem(SK,JSON.stringify(d));localStorage.setItem(SK+'_t',String(Date.now()))}
  catch(e){
    ok=false
    try{
      const slim=JSON.parse(JSON.stringify(d))
      if(slim.checks)slim.checks.forEach(function(c){delete c.imgs;delete c.img})
      if(slim.exams)slim.exams.forEach(function(x){delete x.imgs;delete x.subjImgs})
      slim.checkImgs={};slim._slim=true
      localStorage.setItem(SK,JSON.stringify(slim));localStorage.setItem(SK+'_t',String(Date.now()))
      ok=true
      if(!_quotaWarned){_quotaWarned=true;ts('⚠️ 本机缓存已满，照片改为只存云端（数据没丢）')}
    }catch(e2){}
  }
  if(!ok&&!_quotaWarned){_quotaWarned=true;ts('⚠️ 本机已无法保存，请到「设置」导出备份')}
  maybeSnapshot()
  if(!cloudReady)return
  if(_offline){markDirty();return}
  saveCloud(d)
}

const up=new URLSearchParams(window.location.search)
let VW=up.has('view')||up.has('readonly')
const NOCLOUD=up.has('local')   // 加 ?local 可强制本地模式（排查问题/离线演示用）
if(VW){document.body.classList.add('view-only');const b=document.getElementById('modeBadge');b.textContent='👀 查看模式';b.className='badge view';b.style.display=''}

/* ================= 访问口令（家长 / 孩子） ================= */
let _lv=''
function hsh(s){let h=5381;s=String(s);for(let i=0;i<s.length;i++){h=((h<<5)+h+s.charCodeAt(i))|0}return 'h'+(h>>>0).toString(36)}
function closeGate(){const g=document.getElementById('gate');if(g)g.remove()}
function _gateBox(title,desc,fields,btnText,onOk){
  closeGate()
  const ov=document.createElement('div');ov.id='gate'
  const box=document.createElement('div');box.className='gate-box'
  box.appendChild(h('div',{className:'gate-title'},title))
  if(desc)box.appendChild(h('div',{className:'gate-desc'},desc))
  const inputs=fields.map(function(f){
    box.appendChild(h('div',{className:'gate-label'},f.label))
    const i=h('input',{type:'password',placeholder:f.ph||'',id:'g_'+f.k})
    box.appendChild(i);return i
  })
  const err=h('div',{className:'gate-err'})
  const btn=h('button',{className:'btn btn-primary',style:'width:100%;margin-top:12px',onClick:function(){
    const msg=onOk(inputs.map(function(i){return i.value}))
    err.textContent=msg||''
  }},btnText)
  box.appendChild(btn)
  box.appendChild(err)
  ov.appendChild(box)
  document.body.appendChild(ov)
  if(inputs[0])inputs[0].focus()
}
function showSetup(){
  _gateBox('设置访问口令','这台设备第一次使用，请设置两个口令：家长口令（全部权限）、孩子口令（只能看和打卡）。以后打开都要输入，可以放心把链接发给家人。',
    [{k:'p',label:'家长口令',ph:'自己起一个，至少 4 位'},{k:'c',label:'孩子口令',ph:'给孩子用的，至少 3 位'}],
    '保存并进入',function(v){
      const p=(v[0]||'').trim(),c=(v[1]||'').trim()
      if(p.length<4)return '家长口令至少 4 位'
      if(c.length<3)return '孩子口令至少 3 位'
      D._auth={p:hsh(p),c:hsh(c)}
      localStorage.setItem('lc_lv','p');localStorage.setItem('lc_tok',hsh(p))
      closeGate();applyLv('p');sv(D);render();ts('✅ 口令已设置，本机已记住')
      return ''
    })
}
function showGate(){
  _gateBox('请输入口令','',[{k:'x',label:'口令',ph:'家长口令 或 孩子口令'}],'进入',function(v){
    const pw=(v[0]||'').trim()
    if(!pw)return '请输入口令'
    if(D._auth&&hsh(pw)===D._auth.p){localStorage.setItem('lc_lv','p');localStorage.setItem('lc_tok',hsh(pw));closeGate();applyLv('p');render();return ''}
    if(D._auth&&hsh(pw)===D._auth.c){localStorage.setItem('lc_lv','c');localStorage.setItem('lc_tok',hsh(pw));closeGate();applyLv('c');render();return ''}
    return '口令不对，再试试'
  })
}
function applyLv(lv){
  _lv=lv
  if(lv==='c'){
    VW=true
    document.body.classList.add('view-only')
    const b=document.getElementById('modeBadge')
    if(b){b.textContent='👀 查看模式';b.className='badge view';b.style.display=''}
  }
}
function initAuth(){
  const saved=localStorage.getItem('lc_lv')||''
  if(!(D._auth&&D._auth.p)){showSetup();return}
  if(saved==='p'||saved==='c'){applyLv(saved);render();return}
  showGate()
}
function logout(){
  localStorage.removeItem('lc_lv');localStorage.removeItem('lc_tok')
  location.reload()
}

/* ================= AI 助手（密钥在云函数里，网页端不存） ================= */
const AI_URL='https://jiajia-study-d6gjyod13d77728d6-1483465315.ap-shanghai.app.tcloudbase.com/ai'
function aiToken(){return localStorage.getItem('lc_tok')||''}
async function aiCall(prompt,image){
  if(!aiToken())return {ok:false,err:'请先设置口令，再使用 AI'}
  try{
    const res=await fetch(AI_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({token:aiToken(),prompt:prompt,image:(image||'')})
    })
    const txt=await res.text()
    let j=null
    try{j=JSON.parse(txt)}catch(e){}
    if(j&&j.ok)return {ok:true,text:String(j.text||'')}
    if(j&&j.err)return {ok:false,err:j.err}
    return {ok:false,err:'返回异常(HTTP '+res.status+')：'+txt.slice(0,120)}
  }catch(e){
    console.error('AI 调用失败',e)
    return {ok:false,err:'网络请求失败：'+String((e&&e.message)||e).slice(0,140)}
  }
}
function weekStats(){
  const now=new Date();const day=now.getDay()||7
  const ws=new Date(now);ws.setDate(now.getDate()-day+1)
  const wsStr=ymd(ws)
  let checks=0,habits=0
  for(let i=0;i<7;i++){const d=new Date(ws);d.setDate(ws.getDate()+i);const ds=ymd(d)
    const chk=D.dailyChecks[ds];if(chk){for(const k in chk){if(chk[k])habits++}}
  }
  checks=(D.checks||[]).filter(function(c){return c.date>=wsStr&&c.status==='approved'}).length
  const pend=(D.checks||[]).filter(function(c){return c.date>=wsStr&&c.status==='pending'}).length
  const pts=(D.points||[]).filter(function(p){return p.date>=wsStr}).reduce(function(a,p){return a+(p.type==='earn'?p.points:-p.points)},0)
  const mis=(D.checks||[]).filter(function(c){return c.date>=wsStr&&c.type==='mistake'&&c.status!=='rejected'}).length
  const subs=gs(D.sem)
  const weak=[]
  for(const s of subs){const raw=D.bl&&D.bl[s.id]!=null?D.bl[s.id]:null;if(raw!=null){const p=raw/s.full*100;if(p<70)weak.push(s.name+' '+p.toFixed(0)+'%')}}
  const lt=D.exams.length?[...D.exams].sort(function(a,b){return (a.date||'').localeCompare(b.date||'')})[D.exams.length-1]:null
  let examTxt='本周没有录入考试。'
  const wk=D.exams.filter(function(e){return (e.date||'')>=wsStr})
  if(wk.length){examTxt=wk.map(function(e){const i2=ct(e.scores,e.sem);return e.date+' '+e.examType+' 总分'+i2.total+'/'+i2.fullTotal+'（'+i2.pct.toFixed(1)+'%）'}).join('；')}
  return {wsStr:wsStr,checks:checks,pend:pend,habits:habits,pts:pts,mis:mis,weak:weak,examTxt:examTxt,lt:lt}
}
function aiWeekPrompt(){
  const w=weekStats()
  const L=[]
  L.push('你是初二学生的学习教练，也是家长的参谋。根据下面这一周的真实数据，用中文输出三段，总字数不超过 260 字：')
  L.push('① 一句话肯定（具体到某个行为，不要空泛）')
  L.push('② 这周最值得注意的 1 个问题（必须引用数据）')
  L.push('③ 下周具体的 3 件事（每天可完成、可勾选）')
  L.push('要求：不客套、不喊口号、不鸡汤；如果数据太少就直说数据不足，不要编。')
  L.push('')
  L.push('【本周数据】')
  L.push('· 记录通过 '+w.checks+' 次，待审核 '+w.pend+' 次')
  L.push('· 习惯打卡（打勾）'+w.habits+' 次')
  L.push('· 本周积分变动 '+w.pts)
  L.push('· 本周整理错题 '+w.mis+' 道')
  L.push('· 成绩基准偏弱科目：'+(w.weak.length?w.weak.join('、'):'暂无（都在 70% 以上）'))
  L.push('· 本周考试：'+w.examTxt)
  return L.join('\n')
}
function aiPraisePrompt(){
  const ds=dayStats(td),hs=habStats(td)
  const doneNow=[]
  ;(D.checks||[]).filter(function(c){return c.date===td&&c.status==='approved'}).forEach(function(c){doneNow.push((c.subject?c.subject+'·':'')+c.typeName)})
  const hk=hs.tchk;for(const it of hs.ci){if(hk[it.key])doneNow.push(it.label)}
  return '你是初二学生的学习伙伴。请写一句 30 字以内的鼓励，要求：\n· 具体到他今天做的某件事（不要说空泛的"加油""真棒"）\n· 不要超过 1 个感叹号\n· 不要说教\n\n【他今天完成的】\n'+(doneNow.length?doneNow.join('、'):'今天还没有完成打卡')+'\n【今天还没有做的】\n'+(hs.total-hs.done)+' 项习惯打卡待完成'
}
function aiCardUI(kind){
  const isReport=(kind==='report')
  const store=isReport?(D._aiReport||null):(D._aiPraise||null)
  const fresh=!isReport||!store||store.date!==td?store:(store.date===td?store:null)
  const c=h('div',{className:'card'})
  const head=h('div',{className:'card-header'},h('span',{innerHTML:'📝'}),isReport?'本周点评':'今天的话')
  if(store&&store.text)head.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-left:auto',onClick:function(){if(isReport)D._aiReport=null;else D._aiPraise=null;sv(D);render()}},'清除'))
  c.appendChild(head)
  if(store&&store.text){
    c.appendChild(h('div',{className:'longtext',style:'font-size:15px;line-height:1.8;white-space:pre-wrap;background:var(--bg-elev);border-radius:8px;padding:12px 14px;border:1px solid var(--border)'},store.text))
    c.appendChild(h('div',{style:'font-size:12.5px;color:var(--faint);margin-top:6px'},store.at?('生成于 '+fd(ymd(new Date(store.at)))+' '+fmtHM(store.at)):''))
  }else{
    c.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-bottom:8px'},'还没有点评，点下面生成一次。'))
  }
  const row=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap',className:'edit-only'})
  row.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){
    ts('🤖 正在生成…')
    const p=isReport?aiWeekPrompt():aiPraisePrompt()
    aiCall(p).then(function(r){
      if(r.ok&&r.text){
        if(isReport)D._aiReport={at:Date.now(),text:r.text};else D._aiPraise={at:Date.now(),date:td,text:r.text}
        sv(D);render();ts('✅ 生成完成')
      }else{
        ts('⚠️ '+(r.err||'暂时不可用')+'：可用「复制提示词」手动生成')
      }
    })
  }},'生成一次'))
  row.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){
    const p=isReport?aiWeekPrompt():aiPraisePrompt()
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(p).then(function(){ts('📋 提示词已复制：粘到 DeepSeek/豆包，再把回复粘回来')}).catch(function(){ts('⚠️ 复制失败')})}
    else ts('⚠️ 复制失败，请用电脑版')
  }},'📋 复制提示词'))
  row.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){
    const p=isReport?aiWeekPrompt():aiPraisePrompt()
    const v=prompt('把 AI 的回复粘贴到这里：\n\n（下面是要发给 AI 的提示词，可先复制）\n'+p.slice(0,120)+'…',store&&store.text?store.text:'')
    if(v==null)return
    const txt=String(v).trim();if(!txt)return
    if(isReport)D._aiReport={at:Date.now(),text:txt};else D._aiPraise={at:Date.now(),date:td,text:txt}
    sv(D);render();ts('✅ 已保存')
  }},'📥 粘贴 AI 回复'))
  c.appendChild(row)
  c.appendChild(h('div',{style:'font-size:12.5px;color:var(--faint);margin-top:6px'},'根据本周的真实数据生成，只给方法、不直接给答案'))
  return c
}


function ts(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000)}
const PRAISE={check:['今天又进步了一点！','坚持就是胜利！','好习惯正在养成！','认真完成，真棒！'],score:['这次有进步，继续保持！','努力有回报了！','成绩稳步上升，加油！'],part:['攒下奖励，离目标更近一步！','一分耕耘一分收获！'],task:['任务完成，说到做到！','又完成一件，真棒！'],goal:['小目标达成，一步步变强！'],unlock:['太棒了，解锁新奖励！','努力开花结果了！'],week:['这周的努力看得见！','下周继续加油！'],default:['继续加油！','每天都有进步！']}
function encPool(){if(!D._enc)D._enc={today:null,queue:[],i:0};if(!D._enc.queue)D._enc.queue=[];return D._enc}
function praise(cat){
  const p=encPool()
  if(p.queue.length){p.i=((p.i||0)+1)%p.queue.length;return p.queue[p.i]}
  const a=PRAISE[cat]||PRAISE.default
  return a[Math.floor(Math.random()*a.length)]
}
function encLine(){return praise('default')}
function encToday(){const p=encPool();if(p.today&&p.today.text)return p.today.text;return praise('default')}
function encTake(){const p=encPool();if(p.queue.length){const t=p.queue.shift();p.i=0;return t}return praise('default')}
let _encRunning=false
function encEnsure(force){
  if(VW||_encRunning||!cloudReady)return
  const p=encPool()
  if(!force&&p.today&&p.today.date===td&&p.queue.length>=2)return
  _encRunning=true
  aiCall(encPrompt()).then(function(r){
    _encRunning=false
    if(!r.ok||!r.text)return
    let j=null
    try{
      const raw=String(r.text).replace(/```json/g,'').replace(/```/g,'').trim()
      const mm=raw.match(/[{][\s\S]*[}]/)
      j=JSON.parse(mm?mm[0]:raw)
    }catch(e){j=null}
    if(j&&j.today){
      p.today={date:td,text:String(j.today).slice(0,60)}
      if(Array.isArray(j.queue))p.queue=j.queue.map(function(x){return String(x).slice(0,50)}).filter(Boolean).slice(0,8)
      p.i=0
      sv(D)
      if(tb==='today'||tb==='checkin'||tb==='settings')render()
    }
  })
}
function encPrompt(){
  const ds=dayStats(td),hs=habStats(td)
  const done=[]
  ;(D.checks||[]).filter(function(c){return c.date===td&&c.status==='approved'}).forEach(function(c){done.push((c.subject?c.subject+'·':'')+c.typeName)})
  const hk=hs.tchk;for(const it of hs.ci){if(hk[it.key])done.push(it.label)}
  const ex=(D.exams||[]).length?[...D.exams].sort(function(x,y){return (x.date||'').localeCompare(y.date||'')}).slice(-1)[0]:null
  let exam='暂无'
  if(ex){const i2=ct(ex.scores,ex.sem);exam=ex.date+' '+ex.examType+' 总分'+i2.total+'/'+i2.fullTotal}
  const weak=[]
  for(const sb of gs(D.sem)){const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null;if(raw!=null&&raw/sb.full*100<70)weak.push(sb.name)}
  return ['你在给一位初二的男生写鼓励的话。他学习基础偏弱、有点没信心，家长在外地工作。',
    '要求（很重要，请严格遵守）：',
    '1) 具体、平实，像家里人说话；不要喊口号，不用"加油/真棒/相信自己/你是最棒的"这类空话；',
    '2) 不要编造没有依据的事（例如"谁给你打电话""看你今天笑了"）；只能依据下面给的数据；',
    '3) 不要出现"妈妈""你妈""爸爸"等称呼，也不要提"家长"这个词，不称呼即可；',
    '4) 不要提"打卡""任务""监督""积分"这类管理味儿的词；说"做到""做完"就好；',
    '5) 每句不超过25字，语气温和，不要居高临下。',
    '只输出 JSON，不要任何解释：',
    '{"today":"今天最想对他说的一句话","queue":["他完成一件事时显示的一句","再给3到4句"]}',
    '',
    '【今天的情况】',
    '· 今天完成的：'+(done.length?done.join('、'):'还没有'),
    '· 还没做的：'+(hs.total-hs.done)+' 项',
    '· 最近考试：'+exam,
    '· 偏弱科目：'+(weak.join('、')||'暂无')
  ].join(String.fromCharCode(10))
}
function setExamDate(daysAgo){const d=new Date(Date.now()-(daysAgo||0)*86400000);const el=document.getElementById('ed');if(el)el.value=ymd(d)}
function checkImgs(c){
  if(!c)return []
  if(c.imgs&&c.imgs.length)return c.imgs
  if(c.img)return [c.img]
  return []
}
function submitCheck(typeId,subject,imgsArr){
  const type=CHECK_TYPES.find(function(t){return t.id===typeId})
  if(!type)return
  if(!D.checks)D.checks=[]
  const _ds=_checkDate||td
  const _sub=subject||''
  const old=(D.checks||[]).find(function(c){return c.date===_ds&&c.subject===_sub&&c.type===typeId})
  const _lbl=(_sub?_sub+'·':'')+type.name
  if(old&&old.status!=='approved'){
    old.imgs=imgsArr||[];old.status='pending';old.ts=Date.now();old.pts=type.pts
    old.noteSubmit=encTake()
    sv(D);render();ts('✅ 已更新 · '+old.noteSubmit)
    return
  }
  const _rec={id:Date.now(),date:_ds,type:typeId,typeName:type.name,subject:_sub,imgs:imgsArr||[],pts:type.pts,status:'pending',ts:Date.now()}
  _rec.noteSubmit=encTake()
  D.checks.unshift(_rec)
  D.points.push({date:_ds,source:'提交·'+_lbl,points:1,type:'earn'})
  sv(D);render()
  ts('✅ 已收到 +1分 · '+_rec.noteSubmit)
}
function approveCheck(id){
  const c=(D.checks||[]).find(function(x){return x.id===id})
  if(!c||c.status!=='pending')return
  c.status='approved'
  c.note=encTake()
  D.points.push({date:(c.date||td),source:(c.subject?c.subject+'·':'')+c.typeName,points:c.pts,type:'earn'})
  sv(D);render()
  ts('✅ 已通过 +'+c.pts+'分')
}
function rejectCheck(id){
  const c=(D.checks||[]).find(function(x){return x.id===id})
  if(!c||c.status!=='pending')return
  c.status='rejected'
  sv(D);render()
  ts('↩️ 已退回')
}
function msgUnread(mine){
  const seen=mine==='p'?(D.msgSeenP||0):(D.msgSeenC||0)
  return (D.msgs||[]).filter(function(m){return m.from!==mine&&m.ts>seen}).length
}
function subjectAdvice(name){
  if(name==='英语')return '背20个单词 + 朗读课文15分钟'
  if(name==='数学')return '做5道基础计算题 + 整理1道错题'
  if(name==='语文')return '1篇阅读理解 + 摘抄5个好句'
  if(name==='物理')return '弄懂1个公式，做2道课本例题'
  if(name==='化学')return '背1个化学方程式，做3道基础题'
  if(name==='地理')return '看一遍地图，记5个知识点'
  if(name==='生物')return '过一遍课本插图，记5个概念'
  if(name==='历史')return '理1条时间线，记5个事件'
  if(name==='道法')return '背2个知识点，结合1个例子'
  return '复习课本重点，做基础题'
}
function weekStatsOf(ws){
  const wsStr=ymd(ws)
  let habits=0
  for(let i=0;i<7;i++){const d=new Date(ws);d.setDate(ws.getDate()+i);const ds=ymd(d);if(ds>td)continue;const chk=D.dailyChecks[ds];if(chk){for(const k in chk){if(chk[k])habits++}}}
  const checks=(D.checks||[]).filter(function(c){return c.date>=wsStr&&c.date<=td&&c.status==='approved'}).length
  const pts=(D.points||[]).filter(function(p){return p.date>=wsStr&&p.date<=td}).reduce(function(x,p){return x+(p.type==='earn'?p.points:-p.points)},0)
  let mis=0;for(const c of (D.checks||[])){if(c.date>=wsStr&&c.date<=td&&c.type==='mistake'&&c.status!=='rejected')mis++}
  return {checks:checks,habits:habits,pts:pts,mis:mis}
}

﻿/* ================= AI 提问 / 惊喜提示 / 即时反馈 ================= */
function askPool(){if(!D._enc)D._enc={today:null,queue:[],i:0};return D._enc}
function weekKey(){const now=new Date();const day=now.getDay()||7;const ws=new Date(now);ws.setDate(now.getDate()-day+1);return ymd(ws)}
function askQuestions(){const p=askPool();return (p.asks&&p.asks.week===weekKey())?(p.asks.list||[]):[]}
function asksPrompt(){
  const w=weekStatsOf(new Date(weekKey().replace(/-/g,'/')))
  const weak=[]
  for(const sb of gs(D.sem)){const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null;if(raw!=null&&raw/sb.full*100<70)weak.push(sb.name+' '+(raw/sb.full*100).toFixed(0)+'%')}
  const qs=(D._chat||[]).filter(function(m){return m.role==='u'}).slice(-5).map(function(m){return m.text})
  return ['你在帮一位妈妈准备和初二儿子的一次聊天。妈妈在外地工作，孩子学习基础偏弱、不太愿意多说话。',
    '请给出 3 个「妈妈可以问他的问题」。要求：',
    '1) 不能用"作业写完了吗""今天学得怎么样"这种稽查式问题；',
    '2) 要具体、好回答、不让他有压力，能让他愿意多说两句；',
    '3) 分别对应：这周的数据、他自己的感受、下周的打算；',
    '4) 每个问题不超过 20 字。',
    '只输出 JSON，不要解释：{"asks":["问题1","问题2","问题3"]}',
    '',
    '【这周情况】',
    '· 记录通过 '+w.checks+' 次；习惯打卡 '+w.habits+' 次；整理错题 '+w.mis+' 道',
    '· 偏弱科目：'+(weak.join('、')||'暂无'),
    '· 他最近问过的问题：'+(qs.length?qs.join(' / '):'（没有）')
  ].join('\n')
}
function ensureAsks(force){
  if(VW||!cloudReady)return
  const p=askPool()
  if(!force&&p.asks&&p.asks.week===weekKey()&&(p.asks.list||[]).length>=3)return
  aiCall(asksPrompt()).then(function(r){
    if(!r.ok||!r.text)return
    let j=null
    try{const raw=String(r.text).replace(/```json/g,'').replace(/```/g,'').trim();const mm=raw.match(/[{][\s\S]*[}]/);j=JSON.parse(mm?mm[0]:raw)}catch(e){j=null}
    if(j&&Array.isArray(j.asks)&&j.asks.length){
      p.asks={week:weekKey(),list:j.asks.map(function(x){return String(x).slice(0,40)}).slice(0,3)}
      sv(D);render()
    }
  })
}
function safeStreak(){
  try{let n=0;const dd=new Date()
    const has=function(d){return (D.checks||[]).some(function(c){return c.date===d&&c.status==='approved'})}
    if(!has(ymd(dd)))dd.setDate(dd.getDate()-1)
    for(let i=0;i<400;i++){const d=ymd(dd);if(has(d)){n++;dd.setDate(dd.getDate()-1)}else break}
    return n
  }catch(e){return 0}
}
function surpriseSignal(){
  const stk=safeStreak()
  const w=weekStatsOf(new Date(weekKey().replace(/-/g,'/')))
  if(stk>=5)return 'stk'+Math.floor(stk/5)*5
  if(w.checks>=8)return 'ck8'
  if(w.mis>=10)return 'mis10'
  return null
}
function surprisePrompt(){
  const stk=safeStreak()
  const w=weekStatsOf(new Date(weekKey().replace(/-/g,'/')))
  return ['你在给一位妈妈出主意。她初二儿子最近坚持得不错，妈妈想给他一个"惊喜"（是心意，不是奖励制度）。',
    '请给 1 个具体建议：做什么、大概花多少钱、为什么适合他。像朋友给主意，不超过 60 字，只输出这一句话。',
    '',
    '【情况】连续 '+stk+' 天有记录；本周通过 '+w.checks+' 次；整理错题 '+w.mis+' 道',
    '【背景】他在莆田上学、跟爷爷奶奶住；妈妈在杭州工作；母子靠视频联系'
  ].join('\n')
}
function ensureSurprise(){
  if(VW||!cloudReady)return
  const key=surpriseSignal()
  if(!key)return
  const p=askPool()
  if(p.surprise&&p.surprise.key===key)return
  aiCall(surprisePrompt()).then(function(r){
    if(!r.ok||!r.text)return
    p.surprise={key:key,text:String(r.text).replace(/[\r\n]+/g,' ').slice(0,80),at:Date.now()}
    sv(D)
    if(tb==='today')render()
  })
}
function surpriseText(){
  const p=askPool();const key=surpriseSignal()
  if(!key)return ''
  return (p.surprise&&p.surprise.key===key)?p.surprise.text:''
}
function asksCardUI(){
  const list=askQuestions()
  if(!list.length)return null
  const c=h('div',{className:'card'})
  c.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'💬'}),'这周可以问他这 3 个问题'))
  list.forEach(function(q,i){c.appendChild(h('div',{className:'alert success',style:'margin-bottom:6px'},(i+1)+'. '+q))})
  c.appendChild(h('div',{style:'font-size:12.5px;color:var(--faint);margin-top:4px'},'都是好回答的问题，别追加追问；他愿意多说一句就算成功'))
  if(!VW)c.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-top:8px',onClick:function(){ts('正在换一批…');ensureAsks(true);setTimeout(function(){render();ts('已更新')},7000)}},'换一批'))
  return c
}

﻿/* ================= 和搭子说话（AI 对话栏） ================= */
﻿﻿/* ================= 小搭「看得见网页」：站点地图 + 实时快照 ================= */
function chatSiteMap(){
  return ['【他能看到的网页（他妈妈给他做的「学习驾驶舱」）】',
  '标签页有 5 个：今日 / 记录 / 成绩 / 积分奖励 / 设置。',
  '· 今日：今天做到多少、连续几天、可用积分、妈妈留言、这周可以聊的3个问题；',
  '· 记录：拍照记录今天做的事（妈妈审核后加分）、习惯打勾、今天的任务清单、不会的题可以问；',
  '· 成绩：录入考试、成绩趋势图、基准线（起点分）、薄弱科目；',
  '· 积分奖励：积分明细和规则 / 电脑零件清单（一件件解锁，攒积分兑换）；',
  '· 设置：考试日期、学习时间、小目标、平板限时、话费、口令、数据备份。',
  '他问"我在哪看xxx"时，直接告诉他点哪个标签、大概在页面什么位置，别让他自己找。'
  ].join('\n')
}
function chatSnapshot(){
  const L=['【网页上的实时数据（你随时可以引用，数字要准，不要编）】']
  // 连续打卡
  let stk=0
  try{
    const has=function(d){return (D.checks||[]).some(function(c){return c.date===d&&c.status==='approved'})}
    const dd=new Date(); if(!has(ymd(dd)))dd.setDate(dd.getDate()-1)
    for(let i=0;i<400;i++){const d=ymd(dd);if(has(d)){stk++;dd.setDate(dd.getDate()-1)}else break}
  }catch(e){}
  const ds=dayStats(td),hs=habStats(td)
  L.push('· 连续有记录：'+stk+' 天；今天已做 '+((ds.done+hs.done))+' 项（共 '+(ds.total+hs.total)+' 项）')
  // 成绩
  const exs=(D.exams||[]).filter(function(e){return e.status!=='rejected'})
  if(exs.length){
    const last=[...exs].sort(function(a,b){return (a.date||'').localeCompare(b.date||'')}).slice(-1)[0]
    const i2=ct(last.scores,last.sem)
    const gap=Math.round(625-i2.total/i2.fullTotal*800)
    L.push('· 最近一次考试：'+last.date+' '+last.examType+'，总分 '+i2.total+'/'+i2.fullTotal+'（'+i2.pct.toFixed(1)+'%）'+(gap>0?('，离三中线还差 '+gap+' 分'):'，已过三中线'))
  }else{L.push('· 最近考试：还没有录成绩')}
  // 薄弱科目
  const weak=[]
  for(const sb of gs(D.sem)){const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null;if(raw!=null&&raw/sb.full*100<70)weak.push(sb.name+' '+(raw/sb.full*100).toFixed(0)+'%')}
  if(weak.length)L.push('· 偏弱科目：'+weak.join('、'))
  // 积分
  const earn=(D.points||[]).filter(function(p){return p.type==='earn'}).reduce(function(a,p){return a+p.points},0)
  const spend=(D.points||[]).filter(function(p){return p.type==='spend'}).reduce(function(a,p){return a+p.points},0)
  const avail=earn-spend
  L.push('· 积分：可用 '+avail+'（累计赚 '+earn+'，用掉 '+spend+'）')
  // 零件
  const rate=D.rate||1
  const locked=(D.parts||[]).filter(function(p){return !p.unlocked}).map(function(p){return {name:p.name,icon:p.icon,cost:Math.round(p.value*rate)}}).sort(function(a,b){return a.cost-b.cost})
  const pu=(D.parts||[]).filter(function(p){return p.unlocked}).length
  if(locked.length)L.push('· 电脑零件：已解锁 '+pu+'/'+(D.parts||[]).length+'；下一件 '+locked[0].name+' 要 '+locked[0].cost+' 积分，还差 '+Math.max(0,locked[0].cost-avail))
  // 本周错题
  const wk=weekKey(); let mis=0
  ;(D.checks||[]).forEach(function(c){if(c.date>=wk&&c.type==='mistake'&&c.status!=='rejected')mis++})
  L.push('· 本周整理错题：'+mis+' 道')
  // 妈妈留言
  const un=(D.msgs||[]).filter(function(m){return m.from==='p'&&m.ts>(D.msgSeenC||0)}).length
  if(un)L.push('· 妈妈给他留了 '+un+' 条还没看')
  // 今日任务
  const tds=D.tasks.filter(function(t){return t.date===td&&!t.done}).map(function(t){return t.text})
  if(tds.length)L.push('· 他自己列了今天要做：'+tds.join('、'))
  return L.join('\n')
}

/* ================= 小搭角色卡（结构化，参考 character-card-spec-v2 / SillyTavern） ================= */
function chatCard(){
  return {
    name:AI_NAME,
    desc:'比初二学生大两届的高中男生，刚考完中考。不是老师，不是家长，是陪他做题的同龄搭子。短句、口语、不客套。',
    mes:[
      {u:'在吗', a:'在，说。'},
      {u:'今天不想学了', a:'行，那今天不学了。就歇着，想干啥干啥。'},
      {u:'这题不会：一次函数和x轴交点怎么求', a:'x轴交点就是 y=0 那个点。先把 y=0 代进去，得到个式子，你写出来我看看？'},
      {u:'还有什么没做的', a:'语文笔记弄完了，先记一笔。数学还差3项，要不要挑一个顺手的弄掉？完事儿就收工。'},
      {u:'我妈老是问成绩，烦死了', a:'反复问是真烦。你是烦她问的那一下，还是烦问完后面那套话？'},
      {u:'算了没事', a:'行，我在。想说再说。'}
    ]
  }
}
function chatExamplesText(){
  return chatCard().mes.map(function(m){return '他：'+m.u+'\n'+AI_NAME+'：'+m.a}).join('\n\n')
}
/* 后置强约束：放在提示词最后（模型对末尾更敏感） */
function chatTailRules(){
  return ['【最后再确认一次——按这些写】',
    '· 只给思路和第一步，不给最终答案；',
    '· 80 字以内，像微信聊天；',
    '· 不用"加油/真棒/你真聪明/打卡/任务/监督/未完成/你应该/必须"这些词；',
    '· 不评价他这个人，不讲大道理；',
    '· 情绪优先：他状态不好就不提任何事。'
  ].join('\n')
}
/* 禁词兜底（工程保障，不靠模型自觉） */
const CHAT_BAN=['加油','真棒','你真聪明','打卡','任务','监督','未完成','你应该','必须要','一定得','相信自己','好好学习']
function chatBanned(t){
  const s=String(t||'')
  return CHAT_BAN.filter(function(w){return s.indexOf(w)>=0})
}
/* 关于他的记忆（简化版 lorebook / 长期记忆） */
function chatMem(){if(!D._mem)D._mem=[];return D._mem}
function memRelevant(text){
  const mem=chatMem()
  if(!mem.length)return []
  const hits=mem.filter(function(m){return (m.tags||[]).some(function(t){return t&&text.indexOf(t)>=0})})
  return (hits.length?hits:mem.slice(-2)).slice(0,3).map(function(m){return m.text})
}
function memText(text){
  const r=memRelevant(text)
  return r.length?('【你记得关于他的事】\n· '+r.join('\n· ')):''
}

const AI_NAME='小搭'
function chatLog(){if(!D._chat)D._chat=[];return D._chat}
function chatToday(){return chatLog().filter(function(m){return m.date===td})}
function chatPersona(){
  return ['你是「'+AI_NAME+'」，一个比初二学生大两届的高中男生（刚考完中考）。你不是老师，也不是家长，你是陪他一起做题的同龄搭档。',
  '',
  '【你怎么说话】',
  '- 短句、口语，像微信聊天；不用书面语，不说"同学你好""希望对你有帮助""让我们一起"这种话；',
  '- 每次回复不超过 80 字，能一句说清就不说三句；',
  '- 不喊口号、不夸他"聪明/真棒"、不说"加油"；',
  '- 不叫他"同学"，直接说事。',
  '',
  '【你绝对不做】',
  '1) 不直接给最终答案。永远只给：这题考什么 → 第一步怎么做 → 一个反问让他自己往下走；',
  '2) 不说教、不比较（不提别人、不提排名、不提分数差距）；',
  '3) 不评价他这个人（可以说"这个方法省事"，不能说"你真聪明""你太懒"）；',
  '4) 不替他写作业、不写作文；',
  '5) 不假装知道：题目信息不够，就让他补充，或说"这题我得看原题"。',
  '',
  '【他发图片的时候】',
  '先一句话说清你看到的是什么（哪科、什么题），然后按上面的规则给思路和第一步 + 反问；',
  '不要因为看到全题就把整道题解完；图片看不清就说"图有点糊，重拍一张"，不要瞎猜。',
  '',
  '【他不想学的时候】',
  '先接住情绪，别讲道理。比如：「行，那今天先只做 5 分钟」「这题做完就歇」。不追问原因，不教育他。',
  '',
  '【他说心里话的时候】',
  '先听着，别急着给建议。可以问一句「那你现在最烦哪个」，不要马上把话题转回学习。',
  '',
  '【你能看到网页上的数据】',
  '下面会给你这个网页有什么、以及他现在的各项数据（成绩/积分/零件/连续天数…）。规则：',
  '1) 他问数据就准确回答（比如"我还有多少积分""离鼠标还差多远"），不要含糊、不要编；',
  '2) 不要主动念数据、不要报数字流水账。只有他问、或者用来肯定他时才引用；',
  '3) 引用时用"还剩xx""差xx"这种口语，不要说"根据数据""当前值为"；',
  '4) 他问"在哪看"，直接告诉点哪个标签页。',
  '',
  '【你知道他今天的进度】',
  '下面会给你他今天做到的和没做的。规则（很重要）：',
  '1) 不要每次都提。只有这几种时候才自然地提一句：他问"现在做什么/还有什么"、你刚给他讲完一道题、他聊完情绪，或者他今天什么都没做；',
  '2) 一次最多提 1~2 件，用邀请的语气（"要不要顺手把___弄了"、"这个弄完今天就收工"），不要列表、不要说"你还有几项没完成"；',
  '3) 顺序永远是：先说他今天已经做到的（要具体，说哪一科哪个），再说可以做的；反过来就是催；',
  '4) 如果他情绪不好（烦、累、难过、被气到），只接情绪，一件任务都别提；',
  '5) 永远不用"打卡""任务""监督""未完成""应该"这些词，用"记一下""弄完""收工""顺手"；',
  '6) 他不做就算了，说"那明天再说"，不要追。',
  '',
  '【你也是他的心理老师】',
  '他不一定跟妈妈讲的事，可能会跟你讲：不想说话、烦躁、睡不着、觉得自己没用、不想上学、被同学孤立或被起外号、和家里人吵架（妈妈在外地）、喜欢上谁了、身体上的变化、只想打游戏不想写作业。',
  '处理方式：',
  '1) 先接情绪，后谈事。第一句永远先站在他这边（"这挺正常的""换我也烦"）；',
  '2) 不评价、不贴标签：不说"你太敏感""你想太多了""你这是抑郁"；',
  '3) 不讲大道理，一次只给一个能做到的小动作（"今晚手机放客厅充电，下楼走十分钟"）；',
  '4) 他说"没事"就不追问，只说"行，我在，想说了随时说"；',
  '5) 不评价他爸妈，也不替他传话；',
  '6) 身体发育、喜欢谁这类事：当成正常事聊，不回避、不笑话、不追问细节；',
  '7) 回复依然要短，不要变成心理咨询腔，不要问一长串问题。',
  '',
  '【安全底线（最高优先，覆盖上面所有规则）】',
  '如果他提到：不想活 / 伤害自己 / 被打 / 被威胁 / 被欺负得很严重：',
  '- 第一句先让他感到你在意："你跟我说这个，我挺在意的"；',
  '- 不讲道理，不说"你别想不开""你要坚强""你没那么严重"；',
  '- 明确告诉他：这件事得让大人知道，鼓励他告诉信任的大人（妈妈或老师）；',
  '- 如果他说不能告诉家里，就把这个电话给他：12355（共青团青少年服务台，专门帮学生说话）；',
  '- 这类事不能替他保密；',
  '- 并且在这一条回复的最后，另起一行单独写：[[ALERT]]（这一行会被系统收走，不会给他看到）。',
  '',
  '【你的边界】',
  '你不是医生：不诊断、不贴标签、不说"你会好起来的""你有心理问题"。你只陪他说话。',
  '',
  '【你的目标】',
  '让他觉得跟你说话不累、不丢脸，愿意每天来问一两个问题、说一两句心里话。'
  ].join('\n')
}
function chatTrim(){
  const log=chatLog()
  if(log.length>300)D._chat=log.slice(-300)
  const withImg=chatLog().filter(function(m){return m.img})
  if(withImg.length>20){withImg.slice(0,withImg.length-20).forEach(function(m){m.img='';m.imgCleared=true})}
}
function chatPickImage(){
  const inp=document.createElement('input')
  inp.type='file';inp.accept='image/*'
  inp.onchange=function(e){
    const f=e.target.files[0]
    if(!f)return
    ts('正在处理照片…')
    compressImage(f,function(b64){ if(b64)chatSend(b64); else ts('照片处理失败，重拍一张') })
  }
  inp.click()
}
function chatStateText(){
  const ds=td
  const doneNow=[],todoNow=[]
  ;(D.checks||[]).filter(function(c){return c.date===ds}).forEach(function(c){
    const lbl=(c.subject?c.subject+'·':'')+c.typeName
    if(c.status==='approved')doneNow.push(lbl)
    else if(c.status==='pending')doneNow.push(lbl+'(刚交)')
  })
  const hs=habStats(ds)
  const hk=hs.tchk
  for(const it of hs.ci){if(hk[it.key])doneNow.push(it.label)}
  const missSubj=[]
  for(const subj of SUBJECTS){const st=subjStats(subj,ds);if(st.total>0&&st.done<st.total)missSubj.push(subj+'还差'+(st.total-st.done)+'项')}
  const htodo=[];for(const it of hs.ci){if(!hk[it.key])htodo.push(it.label)}
  const ttodo=D.tasks.filter(function(t){return t.date===ds&&!t.done}).map(function(t){return t.text})
  if(missSubj.length)todoNow.push(missSubj.join('、'))
  if(htodo.length)todoNow.push('习惯：'+htodo.join('、'))
  if(ttodo.length)todoNow.push('今天自己列的：'+ttodo.join('、'))
  return ['【他今天的进度】（按上面的规则，判断合适才自然提）',
    '· 已完成：'+(doneNow.length?doneNow.join('、'):'还没有'),
    '· 还没做：'+(todoNow.length?todoNow.join(' | '):'没有'),
    '· 现在时间：'+fmtHM(Date.now())
  ].join('\n')
}
function chatSend(imgB64){
  const el=document.getElementById('chatInput')
  const v=(el&&el.value||'').trim()
  if(!v&&!imgB64)return
  const log=chatLog()
  log.push({id:Date.now(),date:td,role:'u',text:(v||'（发了张图）'),img:(imgB64||''),ts:Date.now()})
  chatTrim()
  sv(D);render()
  const box=document.getElementById('chatOut')
  if(box){box.style.display='';box.textContent=AI_NAME+' 正在看…'}
  const ctx=chatLog().slice(-8).map(function(m){return (m.role==='u'?'他：':'你：')+(m.text||'')}).join('\n')
  const tail=(imgB64?'他刚发了一张图（可能是题目、课本或作业）。先一句话说清你看到的是什么，再按规则给思路和第一步 + 反问；不要因为看到全题就把整道题解完；看不清就让他重拍。':'请回复他最后那句。记住：只给思路和第一步，不给最终答案；短一点。')
  const _mem=memText(v||'')
  const _full=[chatPersona(),
    chatSiteMap(),
    chatSnapshot(),
    '【你的角色卡】\n'+chatCard().desc,
    '【说话方式看这几个例子，照着这个长度和口气】\n'+chatExamplesText(),
    _mem,
    chatStateText(),
    '【最近的对话】\n'+ctx,
    tail,
    chatTailRules()
  ].filter(Boolean).join('\n\n')
  aiCall(_full, imgB64||'').then(async function(r){
    let _txt=r.ok?String(r.text):'（我现在有点卡，你等下再问我一次）'
    const _bad=r.ok?chatBanned(_txt):[]
    if(_bad.length){
      try{
        const fx=await aiCall('下面这段话违反了说话要求（出现了：'+_bad.join('、')+'）。请在不改变意思的前提下重写一遍：80字以内、像微信聊天、不用这些词、只给思路不给答案。只输出重写后的内容。\n\n原文：'+_txt)
        if(fx&&fx.ok&&fx.text)_txt=fx.text
      }catch(e){}
    }
    let _alert=false
    if(_txt.indexOf('[[ALERT]]')>=0){_alert=true;_txt=_txt.replace(/\[\[ALERT\]\]/g,'').trim()}
    const l2=chatLog()
    l2.push({id:Date.now()+1,date:td,role:'a',text:_txt.trim(),alert:_alert||undefined,ts:Date.now()})
    if(_alert){const pp=askPool();pp.alert={date:td,at:Date.now()};}
    if(l2.length>300)D._chat=l2.slice(-300)
    sv(D);render()
  })
}
function chatTimeLabel(ts,prevTs){
  const d=new Date(ts)
  const ds=ymd(d)
  let pre=''
  if(ds===td)pre=''
  else if(ds===ymd(new Date(Date.now()-86400000)))pre='昨天 '
  else pre=fd(ds)+' '
  return pre+fmtHM(ts)
}
function chatUI(){
  const list=chatToday().slice(-30)
  const c=h('div',{className:'card'})
  const head=h('div',{className:'card-header'},h('span',{innerHTML:'🫂'}),'和 '+AI_NAME+' 说话')
  if(list.length)head.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-left:auto',onClick:function(){
    if(confirm('清空今天的对话？（记录会一起清掉）')){D._chat=chatLog().filter(function(m){return m.date!==td});sv(D);render();ts('已清空')}
  }},'清空'))
  c.appendChild(head)
  const wrap=h('div',{className:'chat-wrap'})
  if(!list.length){
    wrap.appendChild(h('div',{style:'text-align:center;color:var(--muted);font-size:14px;padding:18px 0'},'不会的题、不想学的时候，都可以跟他说一句'))
  }
  let prevTs=0
  list.forEach(function(m){
    if(!prevTs||m.ts-prevTs>8*60000){wrap.appendChild(h('div',{className:'chat-time'},chatTimeLabel(m.ts)));}
    const me=(m.role==='u')
    const row=h('div',{className:'chat-row'+(me?' me':'')})
    row.appendChild(h('div',{className:'chat-av '+(me?'u':'a')},me?'我':'搭'))
    const main=h('div',{className:'chat-main'})
    if(!me)main.appendChild(h('div',{className:'chat-who'},AI_NAME))
    const bub=h('div',{className:'chat-bub '+(me?'u':'a')},m.text)
    if(m.img)bub.appendChild(h('img',{src:m.img,loading:'lazy',alt:'他发的照片',onClick:function(){viewImg(m.img)}}))
    if(m.imgCleared)bub.appendChild(h('div',{className:'imgtip'},'（图片已清理）'))
    main.appendChild(bub)
    row.appendChild(main)
    wrap.appendChild(row)
    prevTs=m.ts
  })
  c.appendChild(wrap)
  if(VW){
    c.appendChild(h('div',{id:'chatOut',style:'display:none'}))
    const bar=h('div',{className:'chat-bar'})
    bar.appendChild(h('button',{className:'chat-cam',onClick:function(){chatPickImage()}},'📷'))
    bar.appendChild(h('input',{id:'chatInput',placeholder:'说点什么…'}))
    bar.appendChild(h('button',{className:'chat-send',onClick:function(){chatSend()}},'发送'))
    c.appendChild(bar)
    c.appendChild(h('div',{className:'chat-tip'},'不会的题可以拍照发给他；他只给思路和第一步'))
  }else{
    c.appendChild(h('div',{style:'margin-top:10px;padding:10px 12px;background:var(--bg-elev);border-radius:8px;font-size:13px;color:var(--muted);line-height:1.7'},'这是他在手机上看到的界面（微信式）。这是他和小搭的私人对话——你可以看、可以看他问了什么，但不建议替他发言；有话想跟他说，用「留言」更合适。'))
  }
  return c
}
function chatSummaryPrompt(){
  const list=chatToday()
  const txt=list.map(function(m){return (m.role==='u'?'他：':'搭子：')+m.text+(m.img?'（并发了题图）':'')}).join('\n')
  return ['下面是一位初二男生今天和学习搭子的聊天记录。你是给家长看的分析助手。',
    '请只输出 JSON，不要任何解释，格式：',
    '{"summary":"90字以内：①他今天聊了什么 ②情绪状态（要有依据） ③家长今晚可以做什么（一条具体动作，不要提成绩）",',
    ' "memories":[{"text":"关于他的1条稳定事实，20字内","tags":["关键词1","关键词2"]}]}',
    'memories 要记"关于他这个人"的稳定事实（如"不喜欢被问成绩""数学函数容易卡""和同桌关系不错"），不是当天流水；最多 2 条，没有就空数组。',
    '平实、不夸大；如果只是问了题目，只说"主要是问功课"，不要过度解读。',
    '如果出现自我否定、被欺负、和家里冲突、不想上学，summary 里要如实说，并提醒家长先关心人。',
    '',
    '【聊天记录】',
    txt
  ].join('\n')
}
function ensureChatSummary(){
  if(VW||!cloudReady)return
  const list=chatToday()
  if(!list.length)return
  const p=askPool()
  if(p.chatSum&&p.chatSum.date===td&&p.chatSum.n===list.length)return
  aiCall(chatSummaryPrompt()).then(function(r){
    if(!r.ok||!r.text)return
    const _raw=String(r.text).trim()
    let _jj=null
    try{const m2=_raw.replace(/```json/g,'').replace(/```/g,'').match(/[{][\s\S]*[}]/);if(m2)_jj=JSON.parse(m2[0])}catch(e){_jj=null}
    if(_jj&&_jj.summary){
      p.chatSum={date:td,n:list.length,text:String(_jj.summary).replace(/[\r\n]+/g,' ').slice(0,160)}
      if(Array.isArray(_jj.memories)&&_jj.memories.length){
        const mem=chatMem()
        _jj.memories.forEach(function(m3){
          const t3=String((m3&&m3.text)||m3||'').replace(/[\r\n]+/g,' ').slice(0,60)
          if(!t3)return
          if(mem.some(function(x){return x.text===t3}))return
          mem.push({id:Date.now()+Math.random(),text:t3,tags:(m3&&m3.tags)||[],at:Date.now()})
        })
        if(mem.length>40)D._mem=mem.slice(-40)
      }
    }else{
      p.chatSum={date:td,n:list.length,text:_raw.replace(/[\r\n]+/g,' ').slice(0,160)}
    }
    sv(D)
    if(tb==='today')render()
  })
}
function chatParentUI(){
  const list=chatToday()
  if(!list.length)return null
  const p=askPool()
  const c=h('div',{className:'card edit-only'})
  c.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🫂'}),'他和 '+AI_NAME+' 聊了 '+list.length+' 句'))
  if(p.alert&&p.alert.date===td)c.appendChild(h('div',{className:'alert danger',style:'margin-bottom:8px'},'🆘 今天聊到需要你关注的内容，建议今晚打个电话，先别谈成绩'))
  const sum=(p.chatSum&&p.chatSum.date===td)?p.chatSum.text:'（正在整理今天的聊天摘要…）'
  c.appendChild(h('div',{className:'longtext',style:'font-size:14px;line-height:1.75;color:var(--text)'},sum))
  let open=false
  const box=h('div',{style:'display:none;margin-top:8px'})
  list.forEach(function(m){
    const row=h('div',{style:'font-size:13.5px;line-height:1.7;margin-bottom:4px;color:'+(m.role==='u'?'var(--text)':'var(--muted)')})
    row.appendChild(h('span',null,((m.role==='u')?'他：':(AI_NAME+'：'))+m.text))
    if(m.img)row.appendChild(h('img',{src:m.img,loading:'lazy',alt:'他发的照片',style:'width:64px;height:64px;object-fit:cover;border-radius:6px;margin-left:6px;vertical-align:middle;border:1px solid var(--border);cursor:pointer',onClick:function(){viewImg(m.img)}}))
    box.appendChild(row)
  })
  c.appendChild(box)
  c.appendChild(h('button',{className:'btn btn-outline btn-sm',style:'margin-top:8px',onClick:function(){open=!open;box.style.display=open?'':'none';this.innerHTML=open?'收起原文':'查看原文'}},'查看原文'))
  const mem=chatMem().slice(-6)
  if(mem.length){
    c.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-top:10px;font-weight:600'},'小搭记住的关于他的事：'))
    mem.forEach(function(m5){c.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-top:2px'},'· '+m5.text))})
  }
  c.appendChild(h('div',{style:'font-size:12px;color:var(--faint);margin-top:6px'},'默认只给你摘要，需要时再点开原文——他知道聊天会被记录，这样他更敢说真话'))
  ensureChatSummary()
  return c
}

function msgTemplates(){
  return ['今天看到你把___做完了，比昨天快',
          '这次___比上次清楚，进步在___',
          '明天试试先做___，做完再玩']
}
function msgCardUI(){
  const mine=VW?'c':'p'
  const list=(D.msgs||[]).slice(-8)
  const c=h('div',{className:'card'})
  const head=h('div',{className:'card-header'},h('span',{innerHTML:'💬'}),mine==='p'?'给孩子的留言':'家长的话')
  const un=msgUnread(mine)
  if(un)head.appendChild(h('span',{style:'margin-left:auto;font-size:13px;color:var(--danger);font-weight:600'},'新 '+un+' 条'))
  c.appendChild(head)
  if(!list.length)c.appendChild(h('div',{style:'color:var(--muted);font-size:14px;margin-bottom:8px'},mine==='p'?'还没有留言，写一句鼓励的话吧':'家长还没留言'))
  list.forEach(function(m){
    const isMe=m.from===mine
    const row=h('div',{style:'margin-bottom:8px;display:flex;'+(isMe?'justify-content:flex-end':'justify-content:flex-start')})
    const wrap=h('div',{style:'max-width:80%'})
    wrap.appendChild(h('div',{style:'font-size:12.5px;color:var(--faint);margin-bottom:2px;text-align:'+(isMe?'right':'left')},(isMe?'我':(mine==='p'?'孩子':'家长'))+' · '+fmtHM(m.ts)))
    const b=h('div',{style:'padding:8px 12px;border-radius:12px;font-size:14.5px;line-height:1.55;word-break:break-word;'+(isMe?'background:linear-gradient(135deg,#6366f1,#7c3aed);color:#fff':'background:var(--card-2);border:1px solid var(--border);color:var(--text)')})
    b.textContent=m.text
    wrap.appendChild(b)
    row.appendChild(wrap)
    c.appendChild(row)
  })
  if(mine==='p'){
    const tw=h('div',{style:'display:flex;gap:6px;flex-wrap:wrap;margin-top:8px'})
    tw.appendChild(h('span',{style:'font-size:13px;color:var(--faint);width:100%'},'不知道写什么？点一个套用：'))
    msgTemplates().forEach(function(t){
      tw.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){const el=document.getElementById('msgInput');if(el){el.value=t;el.focus()}}},t.slice(0,14)+'…'))
    })
    c.appendChild(tw)
  }
  const ir=h('div',{style:'display:flex;gap:8px;margin-top:8px'})
  ir.appendChild(h('input',{id:'msgInput',placeholder:mine==='p'?'写一件他今天具体做了什么（比"加油"有用得多）…':'回复家长…',style:'flex:1'}))
  ir.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){
    const el=document.getElementById('msgInput');const v=(el&&el.value||'').trim()
    if(!v){ts('⚠️ 请先写点什么');return}
    if(!D.msgs)D.msgs=[]
    D.msgs.push({id:Date.now(),from:mine,text:v,ts:Date.now()})
    if(D.msgs.length>60)D.msgs=D.msgs.slice(-60)
    if(mine==='p')D.msgSeenP=Date.now();else D.msgSeenC=Date.now()
    sv(D);render();ts('✅ 已发送')
  }},'发送'))
  c.appendChild(ir)
  if(mine==='p')D.msgSeenP=Date.now();else D.msgSeenC=Date.now()
  return c
}
function reviewCardUI(){
  if(!D.examDate)return null
  const days=Math.ceil((new Date(D.examDate+'T00:00:00')-Date.now())/86400000)
  if(days<0)return null
  const subs=gs(D.sem)
  const rank=subs.map(function(sb){const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null;return {name:sb.name,pct:raw!=null?raw/sb.full*100:100}})
  rank.sort(function(a,b){return a.pct-b.pct})
  const idx=new Date().getDate()%2
  const picks=[rank[0],rank[1],rank[2+idx]].filter(function(x){return !!x})
  const c=h('div',{className:'card'})
  c.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📚'}),'复习计划 · 距大考 '+days+' 天'))
  if(D.examTopic)c.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-bottom:8px'},'📌 考试内容：'+D.examTopic))
  c.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-bottom:8px'},'按目前最弱的科目排的，每天照着做就行：'))
  picks.forEach(function(p){
    c.appendChild(h('div',{className:'alert warning',style:'margin-bottom:6px'},'🔴 '+p.name+'（'+p.pct.toFixed(0)+'%）→ '+subjectAdvice(p.name)))
  })
  c.appendChild(h('div',{style:'font-size:13px;color:var(--faint);margin-top:6px'},'基准分在「成绩」页可以修改，改完这里的建议会跟着变'))
  return c
}
function trashPush(kind,label,data){
  if(!D._trash)D._trash=[]
  D._trash.unshift({id:Date.now()+Math.random(),kind:kind,label:label,data:JSON.parse(JSON.stringify(data)),at:Date.now()})
  const cut=Date.now()-30*86400000
  D._trash=D._trash.filter(function(t){return t.at>cut}).slice(0,60)
}
function trashRestore(id){
  const i=(D._trash||[]).findIndex(function(t){return t.id===id})
  if(i<0)return
  const t=D._trash[i]
  if(t.kind==='point')D.points.push(t.data)
  else if(t.kind==='exam')D.exams.push(t.data)
  else if(t.kind==='part')D.parts.push(t.data)
  else if(t.kind==='check')D.checks.push(t.data)
  D._trash.splice(i,1)
  sv(D);render();ts('✅ 已恢复：'+t.label)
}
function maybeSnapshot(){
  try{
    const now=Date.now()
    if(!D._snaps)D._snaps=[]
    const last=D._snaps.length?D._snaps[D._snaps.length-1].at:0
    if(now-last<6*3600*1000)return
    const slim=JSON.parse(JSON.stringify(D))
    delete slim._snaps;delete slim._trash
    if(slim.checks)slim.checks.forEach(function(c){delete c.imgs;delete c.img})
    if(slim.exams)slim.exams.forEach(function(x){delete x.imgs;delete x.subjImgs})
    slim.checkImgs={}
    D._snaps.push({at:now,label:fd(ymd(new Date(now)))+' '+fmtHM(now),data:slim})
    while(D._snaps.length>5)D._snaps.shift()
  }catch(e){console.warn('快照失败',e)}
}
function rollbackTo(idx){
  const snap=(D._snaps||[])[idx]
  if(!snap)return
  if(!confirm('回滚到「'+snap.label+'」的数据？\n\n记录会回到那个时候；照片会尽量保留，不会因为回滚被删。'))return
  const cur=D
  const nd=normalize(JSON.parse(JSON.stringify(snap.data)))
  const chkImg={},exImg={}
  ;(cur.checks||[]).forEach(function(c){chkImg[c.id]=c.imgs||c.img})
  ;(cur.exams||[]).forEach(function(x){exImg[x.id]={imgs:x.imgs,subjImgs:x.subjImgs}})
  ;(nd.checks||[]).forEach(function(c){if(chkImg[c.id])c.imgs=chkImg[c.id]})
  ;(nd.exams||[]).forEach(function(x){if(exImg[x.id]){x.imgs=exImg[x.id].imgs;x.subjImgs=exImg[x.id].subjImgs}})
  nd.checkImgs=cur.checkImgs||{}
  nd._snaps=cur._snaps||[]
  nd._trash=cur._trash||[]
  D=nd
  sv(D);render();ts('✅ 已回滚到 '+snap.label)
}
function exportBackup(){
  try{
    D._lastBackup=Date.now();sv(D)
    const b=new Blob([JSON.stringify(D,null,2)],{type:'application/json'})
    const u=URL.createObjectURL(b);const a=document.createElement('a')
    a.href=u;a.download='阿勒驾驶舱备份_'+td+'.json';a.click();URL.revokeObjectURL(u)
    ts('📥 备份已导出到「下载」文件夹')
  }catch(e){ts('⚠️ 导出失败')}
}
function approveChecks(list){
  if(!confirm('确定把这 '+list.length+' 条打卡全部通过吗？会立刻加积分，且不能撤销。'))return
  let n=0,pts=0
  for(const c of list){
    if(!c||c.status!=='pending')continue
    c.status='approved'
    c.note=encTake()
    D.points.push({date:(c.date||td),source:(c.subject?c.subject+'·':'')+c.typeName,points:c.pts,type:'earn'})
    n++;pts+=c.pts
  }
  if(n){sv(D);render();ts('✅ 已通过 '+n+' 条打卡，+'+pts+'分')}
  else ts('没有待审核的打卡')
}
function approveExams(list){
  if(!confirm('确定把这 '+list.length+' 条成绩全部通过吗？'))return
  let n=0
  for(const ex of list){if(!ex||ex.status!=='pending')continue;ex.status='approved';cu(ex);n++}
  if(n){sv(D);render();ts('✅ 已通过 '+n+' 条成绩')}
}
function updateTabBadges(){
  const pendChecks=(D.checks||[]).filter(function(c){return c.status==='pending'}).length
  const pendExams=(D.exams||[]).filter(function(e){return e.status==='pending'}).length
  const _mine=VW?'c':'p'
  const map={today:pendChecks+pendExams+msgUnread(_mine),checkin:pendChecks,scores:pendExams}
  document.querySelectorAll('.tab-btn').forEach(function(b){
    const n=map[b.dataset.tab]||0
    let sp=b.querySelector('.tab-badge')
    if(!n){if(sp)sp.remove();return}
    if(!sp){sp=document.createElement('span');sp.className='tab-badge';b.appendChild(sp)}
    sp.textContent=n>99?'99+':String(n)
  })
}
function pickAndSubmit(type,subject){
  ts('📷 请拍照或选择图片（可多张）')
  const inp=document.createElement('input')
  inp.type='file';inp.accept='image/*';inp.multiple=true
  inp.onchange=function(e){
    const files=Array.from(e.target.files||[])
    if(!files.length){ts('已取消上传');return}
    ts('⏳ 正在处理 '+files.length+'张照片...')
    const collected=[]
    let done=0
    files.forEach(function(f){
      compressImage(f,function(b64){
        done++
        if(b64)collected.push(b64)
        if(done===files.length){
          if(collected.length)submitCheck(type.id,subject,collected)
          else ts('⚠️ 照片处理失败，请重试')
        }
      })
    })
  }
  inp.click()
}
function startCheck(type,subject){
  pickAndSubmit(type,subject||'')
}
function approveExam(id){
  const ex=(D.exams||[]).find(function(x){return x.id===id})
  if(!ex||ex.status==='approved')return
  ex.status='approved'
  cu(ex)
  sv(D);render()
  ts('✅ 成绩已通过')
}
function rejectExam(id){
  const ex=(D.exams||[]).find(function(x){return x.id===id})
  if(!ex||ex.status==='approved')return
  ex.status='rejected'
  sv(D);render()
  ts('↩️ 成绩已退回')
}
function compressImage(file,cb){
  try{
    const reader=new FileReader()
    reader.onload=function(e){
      const img=new Image()
      img.onload=function(){
        const maxW=700
        const scale=Math.min(1,maxW/img.width)
        const cv=document.createElement('canvas')
        cv.width=Math.round(img.width*scale)
        cv.height=Math.round(img.height*scale)
        cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height)
        cb(cv.toDataURL('image/jpeg',0.6))
      }
      img.onerror=function(){cb(null)}
      img.src=e.target.result
    }
    reader.readAsDataURL(file)
  }catch(e){cb(null)}
}
function toggleCheck(item,img){
  const nv=!D.dailyChecks[td][item.key]
  D.dailyChecks[td][item.key]=nv
  if(nv){
    if(img){
      if(!D.checkImgs)D.checkImgs={}
      if(!D.checkImgs[td])D.checkImgs[td]={}
      D.checkImgs[td][item.key]=img
    }
    D.points.push({date:td,source:item.label,points:item.pts,type:'earn'})
    sv(D);render()
    ts('✅ '+item.label+' +'+item.pts+'分'+(img?' · 已上传照片':''))
  }else{
    if(D.checkImgs&&D.checkImgs[td]){delete D.checkImgs[td][item.key]}
    D.points=D.points.filter(function(p){return !(p.date===td&&p.source===item.label&&p.type==='earn')})
    sv(D);render()
    ts('已取消 '+item.label)
  }
}
let _lbScale=1,_lbImg=null,_lbList=[],_lbIdx=0
function closeLightbox(){const lb=document.getElementById('lightbox');if(lb)lb.remove();_lbScale=1;_lbImg=null}
function lbZoom(d){_lbScale=Math.max(0.3,Math.min(5,_lbScale+d));if(_lbImg)_lbImg.style.transform='scale('+_lbScale+')'}
function viewImg(b64,list){
  if(!b64)return
  _lbList=(list&&list.length)?list.filter(function(x){return !!x}):[b64]
  let idx=_lbList.indexOf(b64)
  _lbIdx=idx<0?0:idx
  renderLb()
}
function lbStep(d){
  if(_lbList.length<2)return
  _lbIdx=(_lbIdx+d+_lbList.length)%_lbList.length
  _lbScale=1
  renderLb()
}
function renderLb(){
  const b64=_lbList[_lbIdx]
  closeLightbox()
  if(!b64)return
  const keep=_lbList.slice()
  const keepIdx=_lbIdx
  const ov=document.createElement('div')
  ov.id='lightbox'
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px'
  const img=document.createElement('img')
  img.src=b64
  img.style.cssText='max-width:92%;max-height:72vh;border-radius:10px;box-shadow:0 10px 50px rgba(0,0,0,0.6);transition:transform 0.15s;transform-origin:center center;cursor:zoom-in;position:relative;z-index:2'
  _lbImg=img
  img.addEventListener('wheel',function(e){e.preventDefault();lbZoom(e.deltaY<0?0.15:-0.15)},{passive:false})
  img.addEventListener('dblclick',function(){_lbScale=1;img.style.transform='scale(1)'})
  const close=h('button',null,'✕')
  close.style.cssText='position:absolute;top:16px;right:16px;width:40px;height:40px;border:none;border-radius:50%;background:rgba(255,255,255,0.2);color:#fff;font-size:20px;cursor:pointer;z-index:4'
  close.onclick=closeLightbox
  if(keep.length>1){
    const prev=h('button',null,'‹')
    prev.style.cssText='position:absolute;left:12px;top:50%;transform:translateY(-50%);width:46px;height:46px;border:none;border-radius:50%;background:rgba(255,255,255,0.2);color:#fff;font-size:30px;line-height:1;cursor:pointer;z-index:4'
    prev.onclick=function(e){e.stopPropagation();_lbList=keep;_lbIdx=keepIdx;lbStep(-1)}
    const next=h('button',null,'›')
    next.style.cssText='position:absolute;right:12px;top:50%;transform:translateY(-50%);width:46px;height:46px;border:none;border-radius:50%;background:rgba(255,255,255,0.2);color:#fff;font-size:30px;line-height:1;cursor:pointer;z-index:4'
    next.onclick=function(e){e.stopPropagation();_lbList=keep;_lbIdx=keepIdx;lbStep(1)}
    const cnt=h('div',null,(keepIdx+1)+' / '+keep.length)
    cnt.style.cssText='position:absolute;top:20px;left:50%;transform:translateX(-50%);color:#fff;font-size:14.5px;background:rgba(0,0,0,0.55);padding:4px 13px;border-radius:12px;z-index:4'
    ov.appendChild(prev);ov.appendChild(next);ov.appendChild(cnt)
  }
  const bar=h('div',null)
  bar.style.cssText='margin-top:16px;display:flex;gap:12px;flex-wrap:wrap;justify-content:center;position:relative;z-index:3'
  function mk(txt,fn,bg){const b=h('button',null,txt);b.style.cssText='padding:9px 18px;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;color:#fff;background:'+bg;b.onclick=fn;return b}
  bar.appendChild(mk('＋ 放大',function(){lbZoom(0.25)},'#4b5563'))
  bar.appendChild(mk('－ 缩小',function(){lbZoom(-0.25)},'#4b5563'))
  bar.appendChild(mk('还原',function(){_lbScale=1;img.style.transform='scale(1)'},'#2563eb'))
  bar.appendChild(mk('关闭',closeLightbox,'#dc2626'))
  ov.appendChild(img)
  ov.appendChild(bar)
  ov.appendChild(close)
  ov.addEventListener('click',function(e){if(e.target===ov)closeLightbox()})
  document.body.appendChild(ov)
}
document.addEventListener('keydown',function(e){
  if(!document.getElementById('lightbox'))return
  if(e.key==='ArrowLeft'){lbStep(-1)}
  else if(e.key==='ArrowRight'){lbStep(1)}
  else if(e.key==='Escape'){closeLightbox()}
})
function pickImageThenCheck(item){
  const done=!!D.dailyChecks[td][item.key]
  const hasImg=D.checkImgs&&D.checkImgs[td]&&D.checkImgs[td][item.key]
  if(done){if(hasImg){viewImg(hasImg);return}toggleCheck(item);return}
  if(confirm('要上传证明照片吗？\n（点“确定”选照片，点“取消”直接打卡）')){
    const inp=document.createElement('input')
    inp.type='file';inp.accept='image/*'
    inp.onchange=function(e){
      const f=e.target.files[0]
      if(f){compressImage(f,function(b64){toggleCheck(item,b64)})}
      else{toggleCheck(item)}
    }
    inp.click()
  }else{
    toggleCheck(item)
  }
}
function ckDate(){return _checkDate||td}
function findRec(subj,typeId,date){const ds=date||ckDate();return (D.checks||[]).find(function(c){return c.date===ds&&c.subject===subj&&c.type===typeId})}
function subjTypes(subj){return CHECK_TYPES.filter(function(t){return t.subject&&(!t.englishOnly||subj==='英语')})}
function subjStats(subj,date){
  const sts=subjTypes(subj);let done=0,pending=0
  for(const t of sts){const r=findRec(subj,t.id,date);if(r&&r.status==='approved')done++;else if(r&&r.status==='pending')pending++}
  return {sts:sts,total:sts.length,done:done,pending:pending}
}
function dayStats(date){
  const ds=date||ckDate();let done=0,total=0,pending=0
  for(const sb of SUBJECTS){const st=subjStats(sb,ds);done+=st.done;total+=st.total;pending+=st.pending}
  for(const t of CHECK_TYPES.filter(function(x){return !x.subject})){total++;const r=findRec('',t.id,ds);if(r&&r.status==='approved')done++;else if(r&&r.status==='pending')pending++}
  return {done:done,total:total,pending:pending}
}
function habStats(date){
  const ds=date||td;const ci=D.dci||defData().dci;const tchk=D.dailyChecks[ds]||{}
  let done=0;for(const it of ci){if(tchk[it.key])done++}
  return {done:done,total:ci.length,ci:ci,tchk:tchk}
}
function segBar(items){
  const seg=h('div',{className:'seg'})
  for(const it of items)seg.appendChild(h('button',{className:'seg-btn'+(it.on?' on':''),onClick:it.fn},it.label))
  return seg
}
function gs(sem){return SUB[sem]||SUB['初二上']}
function ct(sc,sem){const subs=gs(sem);let t=0,f=0;for(const s of subs){f+=s.full*s.rate;const v=sc[s.id];if(v!=null&&typeof v==='number')t+=v*s.rate}return{total:Math.round(t*10)/10,fullTotal:Math.round(f*10)/10,pct:f>0?Math.round(t/f*1000)/10:0}}
function ymd(d){d=d||new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function fd(d){if(!d)return'—';const p=d.split('-');return p[0]+'年'+parseInt(p[1])+'月'+parseInt(p[2])+'日'}
function buildTrendSvg(list){
  const W=660,H=220,padL=46,padR=16,padT=18,padB=34
  const pts=list.map(function(e){const info=ct(e.scores,e.sem);return {label:(e.date||'').slice(5)+' '+(e.examType||''),pct:info.pct}})
  const n=pts.length
  const x=function(i){return padL+(W-padL-padR)*(n<=1?0.5:i/(n-1))}
  const y=function(v){return padT+(H-padT-padB)*(1-v/100)}
  let path='',dots='',labels=''
  for(let i=0;i<n;i++){
    const px=x(i),py=y(pts[i].pct)
    path+=(i?' L':'M')+px.toFixed(1)+' '+py.toFixed(1)
    dots+='<circle cx="'+px.toFixed(1)+'" cy="'+py.toFixed(1)+'" r="4" fill="#818cf8" stroke="#0b0d12" stroke-width="2"/>'
    dots+='<text x="'+px.toFixed(1)+'" y="'+(py-10).toFixed(1)+'" fill="#e6e8ee" font-size="11" text-anchor="middle">'+pts[i].pct.toFixed(0)+'%</text>'
    if(n<=8||i%2===0||i===n-1)labels+='<text x="'+px.toFixed(1)+'" y="'+(H-12)+'" fill="#8b93a5" font-size="10" text-anchor="middle">'+pts[i].label.slice(0,9)+'</text>'
  }
  const ty=y(78.1)
  const svg='<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="'+H+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="成绩趋势">'+
    '<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(H-padB)+'" stroke="rgba(255,255,255,0.12)"/>'+
    '<line x1="'+padL+'" y1="'+(H-padB)+'" x2="'+(W-padR)+'" y2="'+(H-padB)+'" stroke="rgba(255,255,255,0.12)"/>'+
    '<line x1="'+padL+'" y1="'+ty.toFixed(1)+'" x2="'+(W-padR)+'" y2="'+ty.toFixed(1)+'" stroke="#34d399" stroke-width="1.5" stroke-dasharray="6 5" opacity="0.9"/>'+
    '<text x="'+(W-padR)+'" y="'+(ty-6).toFixed(1)+'" fill="#34d399" font-size="10" text-anchor="end">三中线 78%</text>'+
    '<text x="8" y="'+(padT+4)+'" fill="#8b93a5" font-size="10">100%</text>'+
    '<text x="14" y="'+(H-padB)+'" fill="#8b93a5" font-size="10">0%</text>'+
    '<path d="'+path+'" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>'+dots+labels+'</svg>'
  const box=h('div',{style:'width:100%;overflow:hidden'})
  box.innerHTML=svg
  return box
}
function roundRect(g,x,y,w,hh,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+hh,r);g.arcTo(x+w,y+hh,x,y+hh,r);g.arcTo(x,y+hh,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function wrapText(g,text,x,y,maxW,lh){
  let line=''
  for(const ch of String(text)){
    if(g.measureText(line+ch).width>maxW){g.fillText(line,x,y);line=ch;y+=lh}
    else line+=ch
  }
  if(line)g.fillText(line,x,y)
  return y
}
function exportWeekly(data){
  try{
    const W=760,H=540,pad=44
    const cv=document.createElement('canvas');cv.width=W*2;cv.height=H*2
    const g=cv.getContext('2d');g.scale(2,2)
    const grad=g.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#151826');grad.addColorStop(1,'#0b0d12')
    g.fillStyle=grad;g.fillRect(0,0,W,H)
    g.fillStyle='#6366f1';g.fillRect(0,0,W,6)
    g.fillStyle='#e6e8ee';g.font='bold 27px "Microsoft YaHei",sans-serif'
    g.fillText('阿勒学习周报',pad,76)
    g.fillStyle='#8b93a5';g.font='15px "Microsoft YaHei",sans-serif'
    g.fillText(data.range,pad,106)
    let y=170
    for(const it of data.items){
      g.font='17px "Microsoft YaHei",sans-serif';g.fillStyle='#8b93a5';g.fillText(it.label,pad,y)
      g.font='bold 18px "Microsoft YaHei",sans-serif';g.fillStyle='#a5b4fc';g.fillText(String(it.val),pad+160,y)
      y+=46
    }
    g.fillStyle='#1b1f29';roundRect(g,pad-12,y-10,W-pad*2+24,96,10);g.fill()
    g.fillStyle='#c7d2fe';g.font='16px "Microsoft YaHei",sans-serif'
    wrapText(g,'下周建议：'+data.advice,pad,y+22,W-pad*2-8,26)
    const a=document.createElement('a')
    a.href=cv.toDataURL('image/png')
    a.download='阿勒学习周报_'+String(data.range).replace(/[^\d]/g,'').slice(0,8)+'.png'
    a.click()
    ts('📥 周报图片已保存到「下载」')
  }catch(e){ts('⚠️ 图片生成失败')}
}
function ps(v){return v.toFixed(1)+'%'}

let D=ld()
let tb='today'
let $c=document.getElementById('appContent')
const td=ymd()
const itms=D.dci||defData().dci
if(!D.dailyChecks[td]){const ds={};for(const it of itms)ds[it.key]=false;D.dailyChecks[td]=ds;sv(D)}

function h(tag,attrs,...children){
  const el=document.createElement(tag)
  if(attrs){for(const[k,v]of Object.entries(attrs)){if(k==='className')el.className=v;else if(k==='innerHTML')el.innerHTML=v;else if(k.startsWith('on'))el.addEventListener(k.slice(2).toLowerCase(),v);else el.setAttribute(k,v)}}
  for(const child of children){if(child==null)continue;if(typeof child==='string'||typeof child==='number')el.appendChild(document.createTextNode(String(child)));else el.appendChild(child)}
  return el
}

function render(){
  if(document.getElementById('gate'))return
  $c.innerHTML=''
  if(tb==='today')rtoday()
  else if(tb==='checkin')rck()
  else if(tb==='chat')rchat()
  else if(tb==='scores')rsc()
  else if(tb==='points')rpk()
  else if(tb==='settings')rset()
  updateTabBadges()
}

let _showAlerts=false,_openImg={},_examEdit=false,_openExamForm=false,_ckView='list',_scView='list',_pkView='points',_partEdit=false,_blEdit=false,_ptFilter='all',_exFilter='all'

/* ============ ① 今日（概览 + 快捷操作） ============ */
function rtoday(){
  const lt=D.exams.length?[...D.exams].sort((a,b)=>b.date.localeCompare(a.date))[0]:null
  const si=lt?ct(lt.scores,lt.sem||D.sem):{total:0,fullTotal:gs(D.sem).reduce((s,sub)=>s+sub.full*sub.rate,0),pct:0}
  const ds=dayStats(td)
  const hs=habStats(td)

  // ☀️ 今天：先给成就，再给待办
  let stk=0
  ;(function(){const has=function(d){return (D.checks||[]).some(function(c){return c.date===d&&c.status==='approved'})};const dd=new Date();if(!has(ymd(dd)))dd.setDate(dd.getDate()-1);for(let i=0;i<400;i++){const d=ymd(dd);if(has(d)){stk++;dd.setDate(dd.getDate()-1)}else break}})()
  const avail=(D.points||[]).filter(function(pp){return pp.type==='earn'}).reduce(function(x,pp){return x+pp.points},0)-(D.points||[]).filter(function(pp){return pp.type==='spend'}).reduce(function(x,pp){return x+pp.points},0)
  const tcard=h('div',{className:'card todo-card'})
  tcard.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'☀️'}),'今天'))
  const bigRow=h('div',{className:'stat-grid mini-grid'})
  const _dsum=ds.done+hs.done,_tsum=ds.total+hs.total
  bigRow.appendChild(h('div',{className:'stat-card '+(_dsum>0?'success':'primary')},h('div',{className:'sv'},_dsum+'/'+_tsum),h('div',{className:'sl'},'今日完成')))
  bigRow.appendChild(h('div',{className:'stat-card '+(stk>0?'success':'primary')},h('div',{className:'sv'},'🔥 '+stk),h('div',{className:'sl'},'连续打卡')))
  bigRow.appendChild(h('div',{className:'stat-card primary'},h('div',{className:'sv'},'⭐ '+avail),h('div',{className:'sl'},'可用积分')))
  tcard.appendChild(bigRow)
  function bar(done,total,label,cls){
    const row=h('div',{style:'margin-bottom:10px'})
    row.appendChild(h('div',{style:'display:flex;justify-content:space-between;font-size:14.5px;margin-bottom:2px'},h('span',null,label),h('span',{className:'num',style:'color:var(--muted)'},done+' / '+total)))
    const pb=h('div',{className:'progress-bar'})
    const pf=h('div',{className:'fill '+cls})
    pf.style.width=(total?Math.round(done/total*100):0)+'%'
    pb.appendChild(pf);row.appendChild(pb)
    return row
  }
  tcard.appendChild(bar(ds.done,ds.total,'📷 今日记录',ds.done>=ds.total?'success':'primary'))
  tcard.appendChild(bar(hs.done,hs.total,'🔁 习惯打卡',hs.done>=hs.total?'success':'warning'))
  const qrow=h('div',{style:'display:flex;flex-wrap:wrap;gap:8px;margin-top:2px'})
  for(const subj of SUBJECTS){
    const st=subjStats(subj,td)
    const full=st.total>0&&st.done===st.total
    const b=h('button',{className:'q-btn'+(full?' done':(st.pending?' pending':'')),onClick:function(){_openSubj={};_openSubj[subj]=true;_ckView='list';sw('checkin');setTimeout(function(){var el=document.getElementById('subj_'+subj);if(el)el.scrollIntoView({behavior:'smooth',block:'center'})},120)}})
    b.innerHTML=subj+' '+st.done+'/'+st.total+(st.pending?' ⏳':'')
    qrow.appendChild(b)
  }
  tcard.appendChild(qrow)
  tcard.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-top:8px'},'点科目名直接跳到「记录」页并展开该科'))
  $c.appendChild(tcard)

  // 考试倒计时
  const ed=D.examDate
  let cdTxt=''
  if(ed){
    const now=new Date();const target=new Date(ed+'T00:00:00');const diff=Math.ceil((target-now)/86400000)
    if(diff>0){cdTxt='⏰ 距下次大考还有 <strong>'+diff+'</strong> 天'}
    else if(diff===0){cdTxt='🔥 今天就是大考日！'}
    else{cdTxt='✅ 考试已结束'}
  }else{cdTxt='⏰ 未设置下次大考日期'}
  const cd=h('div',{className:'card countdown'})
  const cdHead=h('div',{className:'card-header'},h('span',{innerHTML:'⏰'}),'考试倒计时')
  if(!VW)cdHead.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-left:auto',onClick:function(){sw('settings')}},'✏️ 修改'))
  cd.appendChild(cdHead)
  cd.appendChild(h('div',{style:'font-size:20px;font-weight:700',innerHTML:cdTxt}))
  if(D.examTopic)cd.appendChild(h('div',{style:'margin-top:6px;padding:8px 12px;background:var(--bg-elev);border-radius:6px;font-size:15px',innerHTML:'📌 考试内容：<strong>'+D.examTopic+'</strong>'}))
  $c.appendChild(cd)

  // 今日概览 Hero
  const hero=h('div',{className:'hero'})
  hero.appendChild(h('div',{className:'hero-item blue'},h('div',{className:'hl'},'最近考试总分'),h('div',{className:'hn'},lt?(si.total+' 分'):'未录成绩'),h('div',{className:'hs'},lt?('得分率 '+ps(si.pct)+' · 满分 '+si.fullTotal):'点下方「＋ 录成绩」开始')))
  hero.appendChild(h('div',{className:'hero-item green'},h('div',{className:'hl'},'距三中 625 线'),h('div',{className:'hn'},lt?(si.total/si.fullTotal*800>=625?'✅ 已达标':'差 '+(625-Math.round(si.total/si.fullTotal*800))+' 分'):'—'),h('div',{className:'hs'},'目标：中考 ≥625 分')))
  $c.appendChild(hero)

  // 今日寄语
  $c.appendChild(h('div',{className:'daily-praise',style:'font-size:15px;line-height:1.75'},'💬 '+encToday()))
  encEnsure()

  // 孩子端：我的今日
  if(VW){
    const _earn=(D.points||[]).filter(function(pp){return pp.type==='earn'}).reduce(function(a,pp){return a+pp.points},0)
    const _spend=(D.points||[]).filter(function(pp){return pp.type==='spend'}).reduce(function(a,pp){return a+pp.points},0)
    const avail=_earn-_spend
    const krate=D.rate||1
    let nx=null
    for(const pp of D.parts){if(pp.unlocked)continue;const cost=Math.round(pp.value*krate);if(!nx||cost<nx.cost)nx={icon:pp.icon,name:pp.name,cost:cost}}
    let sd=0
    ;(function(){
      const has=function(d){return (D.checks||[]).some(function(c){return c.date===d&&c.status==='approved'})}
      const dd=new Date()
      if(!has(ymd(dd)))dd.setDate(dd.getDate()-1)
      for(let i=0;i<400;i++){const d=ymd(dd);if(has(d)){sd++;dd.setDate(dd.getDate()-1)}else break}
    })()
    const kd=ds.done+hs.done,kt=ds.total+hs.total
    const kc=h('div',{className:'card'})
    kc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🌟'}),'我的今日'))
    const kg=h('div',{className:'stat-grid mini-grid'})
    kg.appendChild(h('div',{className:'stat-card primary'},h('div',{className:'sv',style:'font-size:24px'},kd+'/'+kt),h('div',{className:'sl'},'今日完成')))
    kg.appendChild(h('div',{className:'stat-card success'},h('div',{className:'sv',style:'font-size:24px'},'⭐ '+avail),h('div',{className:'sl'},'我的积分')))
    kg.appendChild(h('div',{className:'stat-card warning'},h('div',{className:'sv',style:'font-size:24px'},'🔥 '+sd),h('div',{className:'sl'},'连续打卡')))
    kc.appendChild(kg)
    const kpb=h('div',{className:'progress-bar'})
    const kpf=h('div',{className:'fill '+(kd>=kt?'success':kd*2>=kt?'primary':'warning')})
    kpf.style.width=(kt?Math.round(kd/kt*100):0)+'%'
    kpb.appendChild(kpf);kc.appendChild(kpb)
    if(kd>=kt&&kt>0)kc.appendChild(h('div',{className:'alert success'},'🎉 今天的任务全部完成，你真棒！'))
    else kc.appendChild(h('div',{style:'font-size:14.5px;margin-top:8px'},'今天还剩 '+(kt-kd)+' 项没完成，加油～'))
    if(nx){
      const need=Math.max(0,nx.cost-avail)
      kc.appendChild(h('div',{style:'margin-top:10px;padding:10px 12px;background:var(--primary-weak);border:1px solid var(--primary-border);border-radius:8px;font-size:14.5px'},'🎁 再攒 '+need+' 积分，就能解锁 '+nx.icon+' '+nx.name+'（需要 ⭐'+nx.cost+'）'))
    }
    $c.appendChild(kc)
  }

  // 留言板
  $c.appendChild(msgCardUI())

  // 每周 3 问 / 他问的问题（家长端）
  if(!VW){
    const _ak=asksCardUI();if(_ak)$c.appendChild(_ak)
    const _cp=chatParentUI();if(_cp)$c.appendChild(_cp)
    ensureAsks();ensureSurprise()
  }

  // 今日鼓励由后台生成，界面只呈现句子

  // 大考复习计划
  const _rv=reviewCardUI()
  if(_rv)$c.appendChild(_rv)



  // 快捷操作
  if(!VW){
    const qa=h('div',{className:'card edit-only'})
    qa.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'⚡'}),'快捷操作'))
    const qr=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
    qr.appendChild(h('button',{className:'btn btn-primary',onClick:function(){_openExamForm=true;_scView='list';sw('scores')}},'＋ 录成绩'))
    qr.appendChild(h('button',{className:'btn btn-outline',onClick:function(){_ckView='list';sw('checkin')}},'📷 去打卡'))
    const pendN=(D.checks||[]).filter(function(c){return c.status==='pending'}).length
    const pendE=(D.exams||[]).filter(function(e){return e.status==='pending'}).length
    if(pendN+pendE)qr.appendChild(h('button',{className:'btn btn-success',onClick:function(){if(pendN){_ckView='list';sw('checkin')}else{_scView='list';sw('scores')}}},'✅ 待审核 '+(pendN+pendE)+' 条'))
    qr.appendChild(h('button',{className:'btn btn-outline',onClick:function(){_pkView='parts';sw('points')}},'🎁 积分兑换'))
    qa.appendChild(qr)
    $c.appendChild(qa)
  }

  // 需要关注
  const al=[]
  const tchk=hs.tchk
  if(!tchk.videoCall)al.push({l:'warning',m:'📞 今天还没视频通话'})
  if(lt&&si.pct<62)al.push({l:'danger',m:'⚠️ 最近成绩偏低：'+ps(si.pct)+'，目标需≥62%'})
  const pu=D.parts.filter(function(p){return p.unlocked}).length
  const pr=D.parts.filter(function(p){return p.received}).length
  if(pu>0&&pu>pr)al.push({l:'success',m:'📦 '+(pu-pr)+'个零件已解锁待下单！'})
  if(!VW){
    const pn=(D.checks||[]).filter(function(c){return c.status==='pending'}).length
    const pe=(D.exams||[]).filter(function(e){return e.status==='pending'}).length
    if(pn+pe)al.push({l:'warning',m:'⏳ 有 '+(pn+pe)+' 条待审核（打卡 '+pn+' · 成绩 '+pe+'）'})
  }
  const _al=askPool().alert
  if(!VW&&_al&&_al.date===td)al.unshift({l:'danger',m:'🆘 他今天和小搭聊到情绪或困难，建议今晚给他打个电话，先别问成绩'})
  const _sp=surpriseText()
  if(!VW&&_sp)al.unshift({l:'success',m:'🎁 '+_sp})
  const ystr=(function(){var d=new Date();d.setDate(d.getDate()-1);return ymd(d)})()
  const yCnt=(D.checks||[]).filter(function(c){return c.date===ystr}).length
  if(yCnt===0)al.push({l:'warning',m:'⏰ 昨天（'+ystr+'）没有打卡记录，可到「打卡」页补卡'})
  const _lastBk=D._lastBackup||0
  const _daysBk=_lastBk?Math.floor((Date.now()-_lastBk)/86400000):999
  if(!VW&&_daysBk>=7)al.push({l:'warning',m:'💾 '+(_lastBk?('已经 '+_daysBk+' 天'):'还没有')+'导出过备份，建议现在导出一份',_bk:true})
  if(al.length){
    const ac=h('div',{className:'card'})
    ac.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🚨'}),'需要关注'+(al.length>1&&!_showAlerts?('（'+al.length+' 条）'):'')))
    const _show=_showAlerts?al:al.slice(0,1)
    for(const a of _show){
      const row=h('div',{className:'alert '+a.l,style:a._bk?'flex-wrap:wrap;gap:10px':''},a.m)
      if(a._bk)row.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:exportBackup},'📥 立即导出'))
      ac.appendChild(row)
    }
    if(al.length>1&&!_showAlerts)ac.appendChild(h('button',{className:'btn btn-outline btn-sm',style:'margin-top:4px',onClick:function(){_showAlerts=true;render()}},'还有 '+(al.length-1)+' 条'))
    $c.appendChild(ac)
  }
}

/* ============ ② 打卡（拍照 + 习惯 + 日历） ============ */
function rchat(){
  $c.appendChild(h('div',{className:'daily-praise',style:'font-size:15px;line-height:1.75'},'💬 '+encToday()))
  $c.appendChild(chatUI())
  const ds=dayStats(td),hs=habStats(td)
  const left=(ds.total+hs.total)-(ds.done+hs.done)
  $c.appendChild(h('div',{style:'text-align:center;font-size:12.5px;color:var(--faint);padding:6px 0 12px'},left>0?('今天还有 '+left+' 项没弄，不着急，想弄的时候跟他说一声就行'):'今天该弄的都弄完了'))
}

function rck(){
  $c.appendChild(segBar([
    {label:'📷 记录今天',on:_ckView==='list',fn:function(){_ckView='list';render()}},
    {label:'📅 记录日历',on:_ckView==='cal',fn:function(){_ckView='cal';render()}}
  ]))
  const box=h('div',null)
  $c.appendChild(box)
  const host=$c; $c=box
  try{ if(_ckView==='cal')rcal(); else rckList() } finally{ $c=host }
}

function rckList(){
  const ckd=ckDate()
  const cq=h('div',{className:'card'})
  cq.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📷'}),'记录今天（拍张照给家长看，通过后加分）'))
  const minD=(function(){var d=new Date();d.setDate(d.getDate()-2);return ymd(d)})()
  const dateRow=h('div',{style:'display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap'})
  dateRow.innerHTML='<span style="font-size:14.5px">日期：</span><input type="date" id="checkDateInput" value="'+ckd+'" min="'+minD+'" max="'+td+'" style="width:150px">'+(ckd!==td?'<span style="font-size:14px;color:var(--warning)">（补卡 '+ckd+'）</span>':'')
  dateRow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){var v=document.getElementById('checkDateInput').value||td;if(v<minD){ts('⚠️ 只能补最近 2 天（'+minD+'之后）');return}if(v>td){ts('⚠️ 不能选未来日期');return}_checkDate=v;render()}},'切换'))
  dateRow.appendChild(h('button',{className:'btn btn-warning btn-sm',onClick:function(){var d=new Date();d.setDate(d.getDate()-1);_checkDate=ymd(d);render()}},'⏰ 补昨天'))
  if(ckd!==td)dateRow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){_checkDate=null;render()}},'回到今天'))
  cq.appendChild(dateRow)
  const ctrlRow=h('div',{style:'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px'})
  ctrlRow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){for(const sb of SUBJECTS)_openSubj[sb]=true;render()}},'全部展开'))
  ctrlRow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){_openSubj={};render()}},'全部收起'))
  const onlyBtn=h('button',{className:'btn btn-sm '+(_onlyTodo?'btn-primary':'btn-outline'),onClick:function(){_onlyTodo=!_onlyTodo;render()}})
  onlyBtn.innerHTML=_onlyTodo?'☑ 只看未完成':'☐ 只看未完成'
  ctrlRow.appendChild(onlyBtn)
  cq.appendChild(ctrlRow)
  const pendDay=(D.checks||[]).filter(function(c){return c.date===ckd&&c.status==='pending'})
  if(!VW&&pendDay.length){
    const pbar=h('div',{className:'alert warning',style:'margin-bottom:10px;flex-wrap:wrap;gap:10px'})
    pbar.appendChild(h('span',null,'⏳ 这天有 '+pendDay.length+' 条待审核'))
    pbar.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){approveChecks(pendDay)}},'✅ 一键全部通过（+'+pendDay.reduce(function(s,c){return s+c.pts},0)+'分）'))
    cq.appendChild(pbar)
  }
  function makeCheckCard(type,subj){
    const rec=findRec(subj,type.id,ckd)
    const card=h('div',{className:'check-item '+(rec&&rec.status==='approved'?'done':'')})
    card.innerHTML='<div class="ci">'+type.icon+'</div><div class="cl">'+type.name+' <span style="font-size:13.5px;color:var(--muted)">+'+type.pts+'</span></div>'
    const rImgs=checkImgs(rec)
    if(rImgs.length){
      const ir=h('div',{style:'display:flex;flex-wrap:wrap;gap:5px;margin-top:6px'})
      rImgs.forEach(function(b){ir.appendChild(h('img',{alt:'记录照片',loading:'lazy',src:b,style:'width:56px;height:56px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid var(--border)',onClick:function(){viewImg(b,rImgs)}}))})
      card.appendChild(ir)
    }
    if(rec){
      const st=rec.status==='pending'?'⏳ 待审核':rec.status==='approved'?'✅ 已通过':'↩️ 已退回'
      const sc2=rec.status==='pending'?'var(--warning)':rec.status==='approved'?'var(--success)':'var(--muted)'
      card.appendChild(h('div',{style:'font-size:14px;margin-top:5px;color:'+sc2+';font-weight:600'},st+(rec.ts?' · '+fmtHM(rec.ts)+' 提交':'')))
      if(VW&&rec.status==='pending'){
        card.appendChild(h('button',{className:'btn btn-outline btn-sm',style:'margin-top:6px',onClick:function(){startCheck(type,subj)}},'📷 重新上传'))
      }
      if(!VW&&rec.status==='pending'){
        const br=h('div',{style:'margin-top:6px;display:flex;gap:5px;justify-content:center'})
        br.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){approveCheck(rec.id)}},'✅ 通过'))
        br.appendChild(h('button',{className:'btn btn-danger btn-sm',onClick:function(){rejectCheck(rec.id)}},'↩️ 退回'))
        card.appendChild(br)
      }
      if(rec.status==='rejected')card.appendChild(h('button',{className:'btn btn-outline btn-sm',style:'margin-top:6px',onClick:function(){startCheck(type,subj)}},'📷 重新上传'))
      if(rec.status==='pending'&&rec.noteSubmit)card.appendChild(h('div',{className:'longtext',style:'font-size:14px;line-height:1.7;color:var(--success);margin-top:6px'},'💬 '+rec.noteSubmit))
      if(rec.status==='approved'&&rec.note)card.appendChild(h('div',{className:'longtext',style:'font-size:14px;line-height:1.7;color:var(--primary);margin-top:6px'},'💬 '+rec.note))
    }else{
      card.appendChild(h('button',{className:'btn btn-primary btn-sm',style:'margin-top:6px',onClick:function(){startCheck(type,subj)}},'📷 记一笔'))
    }
    return card
  }
  for(const subj of SUBJECTS){
    const st=subjStats(subj,ckd)
    if(_onlyTodo&&st.total>0&&st.done===st.total)continue
    const open=!!_openSubj[subj]
    const head=h('div',{id:'subj_'+subj,className:'subj-head'+(open?' open':''),onClick:function(){_openSubj[subj]=!_openSubj[subj];render()}})
    head.appendChild(h('span',{className:'sh-name'},subj))
    head.appendChild(h('span',{className:'sh-stat'},st.done+'/'+st.total+' 完成'+(st.pending?' · ⏳'+st.pending+' 待审核':'')))
    head.appendChild(h('span',{className:'sh-arrow'},'▶'))
    cq.appendChild(head)
    if(open){
      const grid=h('div',{className:'check-grid'})
      for(const type of st.sts){
        if(_onlyTodo){const r=findRec(subj,type.id,ckd);if(r&&r.status==='approved')continue}
        grid.appendChild(makeCheckCard(type,subj))
      }
      grid.style.marginBottom='14px'
      cq.appendChild(grid)
    }
  }
  cq.appendChild(h('div',{style:'font-weight:700;font-size:15px;margin:8px 0'},'其他'))
  const ggrid=h('div',{className:'check-grid'})
  for(const type of CHECK_TYPES.filter(function(t){return !t.subject}))ggrid.appendChild(makeCheckCard(type,''))
  cq.appendChild(ggrid)
  $c.appendChild(cq)

  // 习惯打卡
  const hs=habStats(td)
  const cc=h('div',{className:'card'})
  cc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔁'}),'习惯打卡（打勾即可，不用拍照）'))
  const grid=h('div',{className:'check-grid'})
  for(const item of hs.ci){
    const done=hs.tchk[item.key]||false
    const cii=h('div',{className:'check-item '+(done?'done':''),onClick:function(){pickImageThenCheck(item)}})
    cii.innerHTML='<div class="ci">'+(done?'✅':item.icon)+'</div><div class="cl">'+item.label+(D.checkImgs&&D.checkImgs[td]&&D.checkImgs[td][item.key]?' 📷':'')+'</div><div class="cs">+'+item.pts+' 积分</div>'
    grid.appendChild(cii)
  }
  cc.appendChild(grid)
  $c.appendChild(cc)

  // 今日任务清单
  const tc=h('div',{className:'card'})
  tc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📋'}),'今日任务清单'))
  const todayTasks=D.tasks.filter(function(t){return t.date===td})
  const tt=h('div',null)
  for(const task of todayTasks){
    const item=h('div',{className:'task-item'})
    const chk=h('button',{className:'q-btn '+(task.done?'done':''),onClick:function(){task.done=!task.done;sv(D);render();ts(task.done?'✅ 任务完成 · '+praise('task'):'已取消')}})
    chk.innerHTML=(task.done?'✅ ':'⬜ ')+task.text
    item.appendChild(chk)
    if(!VW){const del=h('button',{className:'btn btn-danger btn-sm',style:'margin-left:6px',onClick:function(){D.tasks=D.tasks.filter(function(x){return x.id!==task.id});sv(D);render()}});del.innerHTML='✕';item.appendChild(del)}
    tt.appendChild(item)
  }
  if(todayTasks.length===0)tt.appendChild(h('div',{style:'color:var(--muted);font-size:14.5px'},'今天还没有任务，可在下方添加'))
  tc.appendChild(tt)
  if(!VW){
    const addRow=h('div',{style:'display:flex;gap:8px;margin-top:10px'})
    addRow.innerHTML='<input id="taskInput" placeholder="如：背20个单词、做5道数学题" style="flex:1">'
    addRow.appendChild(h('button',{className:'btn btn-primary btn-sm edit-only',onClick:function(){var v=document.getElementById('taskInput').value.trim();if(!v){ts('⚠️ 请输入任务');return}D.tasks.push({id:Date.now(),date:td,text:v,done:false});sv(D);render();ts('✅ 任务已添加')}},'➕ 添加'))
    tc.appendChild(addRow)
  }
  $c.appendChild(tc)

  // 连续打卡
  const sc=h('div',{className:'card'})
  sc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔥'}),'习惯连续天数'))
  function cs_(key){let n=0;const d=new Date();for(let i=0;i<60;i++){const d2=ymd(d);const chk=D.dailyChecks[d2];if(chk&&chk[key]){n++;d.setDate(d.getDate()-1)}else break}return n}
  sc.innerHTML+='<div class="table-scroll"><table><thead><tr><th scope="col">项目</th><th scope="col">连续天数</th><th scope="col">状态</th></tr></thead><tbody>'+hs.ci.map(function(item){const n=cs_(item.key);const st=n>=7?'🟢 优秀':n>=3?'🟡 良好':n>0?'🟠 一般':'🔴 未打卡';return '<tr><td>'+item.icon+' '+item.label+'</td><td><strong>'+n+'</strong> 天</td><td>'+st+'</td></tr>'}).join('')+'</tbody></table></div>'
  $c.appendChild(sc)
}

/* ============ ③ 成绩（记录 / 周报） ============ */
function rsc(){
  $c.appendChild(segBar([
    {label:'📋 成绩记录',on:_scView==='list',fn:function(){_scView='list';render()}},
    {label:'📊 学习周报',on:_scView==='weekly',fn:function(){_scView='weekly';render()}}
  ]))
  const box=h('div',null)
  $c.appendChild(box)
  const host=$c; $c=box
  try{ if(_scView==='weekly')rwk(); else rs() } finally{ $c=host }
}

/* ============ ④ 积分奖励（积分 / 零件） ============ */
function rpk(){
  $c.appendChild(segBar([
    {label:'⭐ 积分账本',on:_pkView==='points',fn:function(){_pkView='points';render()}},
    {label:'🎁 零件奖励',on:_pkView==='parts',fn:function(){_pkView='parts';render()}}
  ]))
  const box=h('div',null)
  $c.appendChild(box)
  const host=$c; $c=box
  try{ if(_pkView==='parts')rp(); else rpt() } finally{ $c=host }
}

/* ============ ⑤ 设置（所有配置集中） ============ */
function rset(){
  $c.appendChild(h('div',{className:'daily-praise'},'⚙️ 这些设置改一次就行，平时不用管'))

  // 考试信息
  const ec=h('div',{className:'card edit-only'})
  ec.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📅'}),'下次大考信息'))
  const erow=h('div',{className:'form-row'})
  erow.innerHTML='<div><label>考试日期</label><input type="date" id="examDateInput" value="'+(D.examDate||'')+'"></div><div><label>考什么</label><input type="text" id="examTopicInput" placeholder="如：英语 Unit5-6、数学一次函数" value="'+(D.examTopic||'')+'"></div>'
  ec.appendChild(erow)
  ec.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){D.examDate=document.getElementById('examDateInput').value||null;D.examTopic=document.getElementById('examTopicInput').value.trim();sv(D);render();ts('✅ 考试信息已保存')}},'💾 保存'))
  $c.appendChild(ec)

  // 固定学习时间
  const rt=D.ritualTime||'20:00'
  const rc=h('div',{className:'card edit-only'})
  rc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🕗'}),'固定学习时间'))
  rc.appendChild(h('div',{style:'font-size:14.5px;color:var(--muted);margin-bottom:8px'},'固定时间比临时起意更省力，孩子不用纠结"要不要学"，到点就做'))
  const rrow=h('div',{style:'display:flex;align-items:center;gap:8px;flex-wrap:wrap'})
  rrow.innerHTML='<input type="time" id="ritualTime" value="'+rt+'" style="width:130px">'
  rrow.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){var v=document.getElementById('ritualTime').value;if(v){D.ritualTime=v;sv(D);render();ts('✅ 学习时间已设为 '+v)}}},'💾 保存'))
  rc.appendChild(rrow)
  $c.appendChild(rc)

  // 小目标
  const goals=D.smallGoals||[]
  const gcard=h('div',{className:'card edit-only'})
  gcard.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🎯'}),'小目标阶梯（达成 +10 分）'))
  gcard.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-bottom:8px'},'够得着，别定太高。每次只提一点点（如英语70→75）'))
  if(!goals.length)gcard.appendChild(h('div',{style:'color:var(--muted);font-size:14.5px'},'还没有小目标，在下面添加'))
  for(const g of goals){
    const row=h('div',{className:'mistake-item'})
    row.innerHTML='<strong>'+g.subject+'</strong> '+g.from+'→'+g.to+(g.done?' <span style="color:var(--success)">✅ 已达成</span>':'')
    const btn=h('button',{className:'btn btn-sm '+(g.done?'btn-outline':'btn-success'),style:'margin-top:4px;margin-left:8px',onClick:function(){g.done=!g.done;if(g.done){D.points.push({date:td,source:'小目标达成',points:10,type:'earn'});ts('🎉 小目标达成 +10分 · '+praise('goal'))}else{const idx=D.points.findIndex(function(x){return x.date===td&&x.source==='小目标达成'&&x.type==='earn'});if(idx>=0)D.points.splice(idx,1);ts('已取消')}sv(D);render()}})
    btn.innerHTML=g.done?'✅ 已达成':'✔ 标记达成 +10分'
    row.appendChild(btn)
    const del=h('button',{className:'btn btn-danger btn-sm',style:'margin-top:4px;margin-left:4px',onClick:function(){D.smallGoals=D.smallGoals.filter(function(x){return x.id!==g.id});sv(D);render()}})
    del.innerHTML='✕';row.appendChild(del)
    gcard.appendChild(row)
  }
  const arow=h('div',{style:'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap'})
  arow.innerHTML='<input id="goalSubject" placeholder="科目" style="width:80px"><input id="goalFrom" type="number" placeholder="现在分" style="width:80px"><input id="goalTo" type="number" placeholder="目标分" style="width:80px">'
  arow.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){const sb=document.getElementById('goalSubject').value.trim();const f=parseFloat(document.getElementById('goalFrom').value);const t=parseFloat(document.getElementById('goalTo').value);if(!sb||isNaN(f)||isNaN(t)){ts('⚠️ 请填写完整');return}D.smallGoals.push({id:Date.now(),subject:sb,from:f,to:t,done:false});sv(D);render();ts('✅ 小目标已添加')}},'➕ 添加目标'))
  gcard.appendChild(arow)
  $c.appendChild(gcard)

  // 平板使用
  const tabCard=h('div',{className:'card edit-only'})
  tabCard.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'💻'}),'平板使用'))
  tabCard.appendChild(h('div',{style:'font-size:14.5px',innerHTML:'状态：'+(D.tabUnlock?'✅ 已发放':'⬜ 未发放')+' | 每天限时 <strong>'+(D.tabDailyMinutes||60)+' 分钟</strong>'}))
  const limitRow=h('div',{style:'display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap'})
  limitRow.innerHTML='<span style="font-size:14.5px">限时：</span><input type="number" id="tabLimit" value="'+(D.tabDailyMinutes||60)+'" min="10" max="240" step="10" style="width:80px"><span style="font-size:14.5px">分钟</span>'
  limitRow.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){var v=parseInt(document.getElementById('tabLimit').value);if(v>0){D.tabDailyMinutes=v;sv(D);render();ts('✅ 平板限时已设为 '+v+' 分钟')}}},'💾 保存'))
  tabCard.appendChild(limitRow)
  const tgl=h('button',{className:'btn '+(D.tabUnlock?'btn-outline':'btn-success')+' btn-sm',style:'margin-top:8px',onClick:function(){D.tabUnlock=!D.tabUnlock;sv(D);render();ts(D.tabUnlock?'✅ 已标记发放':'已标记未发放')}})
  tgl.innerHTML=D.tabUnlock?'标记为未发放':'✅ 标记为已发放'
  tabCard.appendChild(tgl)
  tabCard.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-top:6px'},'提示：网页只记录规则，实际锁屏请在平板系统的"屏幕使用时间/家长控制"里设置'))
  $c.appendChild(tabCard)

  // 话费
  const plc=D.pl||0
  const pc=h('div',{className:'card edit-only'})
  pc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📞'}),'话费套餐'))
  pc.innerHTML+='<div class="table-scroll"><table><thead><tr><th scope="col">套餐</th><th scope="col">内容</th><th scope="col">月费</th><th scope="col">当前</th></tr></thead><tbody>'+PLANS.map(function(pp,i){return '<tr><td>'+pp.name+'</td><td>'+pp.data+'</td><td>¥'+pp.cost+'</td><td>'+(i<=plc?'✅':'⬜')+'</td></tr>'}).join('')+'</tbody></table></div>'
  const pcost=PLANS.slice(0,Math.min(plc+1,PLANS.length)).reduce(function(a,pp){return a+pp.cost},0)
  pc.appendChild(h('div',{style:'margin-top:10px;font-size:14.5px',innerHTML:'💰 月费：<strong>¥'+pcost+'</strong> | 📱：'+(D.phone?'✅ '+(D.phDate?'已发放('+D.phDate+')':'待发放'):'⬜ 待达标')}))
  const pbr=h('div',{style:'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap'})
  if(plc<PLANS.length-1)pbr.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){D.pl=Math.min(plc+1,PLANS.length-1);sv(D);render();ts('📈 已升级')}},'📈 升级'))
  if(plc>0)pbr.appendChild(h('button',{className:'btn btn-warning btn-sm',onClick:function(){D.pl=Math.max(plc-1,0);sv(D);render();ts('📉 已降级')}},'📉 降级'))
  if(D.phone&&!D.phDate)pbr.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){D.phDate=td;sv(D);render();ts('✅ 已标记手机发放')}},'📱 标记手机已发放'))
  pc.appendChild(pbr)
  $c.appendChild(pc)

  // 积分兑换率
  const rate=D.rate||1
  const rt2=h('div',{className:'card edit-only'})
  rt2.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'💱'}),'积分兑换率'))
  const rrow2=h('div',{style:'display:flex;align-items:center;gap:10px;flex-wrap:wrap'})
  rrow2.innerHTML='<span>当前：<strong>1元 = '+rate+' 积分</strong></span><input type="number" id="ri" value="'+rate+'" min="0.1" max="100" step="0.1" style="width:90px"><button class="btn btn-primary btn-sm" id="br">更新</button>'
  rt2.appendChild(rrow2)
  rt2.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-top:6px'},'修改后所有零件所需积分自动重算'))
  rt2.querySelector('#br').addEventListener('click',function(){const nr=parseFloat(rt2.querySelector('#ri').value);if(nr>0){D.rate=nr;sv(D);render();ts('💱 1元='+nr+'积分')}})
  $c.appendChild(rt2)

  // 管理习惯打卡项
  const ci=D.dci||defData().dci
  const hc=h('div',{className:'card edit-only'})
  hc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔁'}),'管理习惯打卡项'))
  const ht=h('table')
  ht.innerHTML='<thead><tr><th scope="col">图标</th><th scope="col">名称</th><th scope="col">积分</th><th scope="col">操作</th></tr></thead><tbody></tbody>'
  const htb=ht.querySelector('tbody')
  for(let i=0;i<ci.length;i++){
    const item=ci[i]
    const tr=h('tr')
    const t1=h('td');t1.appendChild(h('input',{value:item.icon,'data-idx':i,'data-field':'icon',style:'width:56px;text-align:center'}));tr.appendChild(t1)
    const t2=h('td');t2.appendChild(h('input',{value:item.label,'data-idx':i,'data-field':'label',style:'width:130px'}));tr.appendChild(t2)
    const t3=h('td');t3.appendChild(h('input',{type:'number',value:item.pts,'data-idx':i,'data-field':'pts',style:'width:64px'}));tr.appendChild(t3)
    const t4=h('td');t4.appendChild(h('button',{className:'btn btn-danger btn-sm','data-del':i},'✕'));tr.appendChild(t4)
    htb.appendChild(tr)
  }
  const hw=h('div',{className:'table-scroll'});hw.appendChild(ht);hc.appendChild(hw)
  hc.appendChild(h('button',{className:'btn btn-primary btn-sm',style:'margin-top:8px',onClick:function(){
    const inputs=hc.querySelectorAll('input[data-idx]')
    for(let k=0;k<inputs.length;k++){const inp=inputs[k];const idx=parseInt(inp.getAttribute('data-idx'));const f=inp.getAttribute('data-field');if(!isNaN(idx)&&f){if(f==='pts')D.dci[idx][f]=parseInt(inp.value)||1;else D.dci[idx][f]=inp.value}}
    sv(D);render();ts('✅ 已更新')
  }},'💾 保存修改'))
  const har=h('div',{style:'display:flex;gap:8px;margin-top:10px;alignItems:center;flexWrap:wrap'})
  har.innerHTML='<input id="ni" placeholder="图标" style="width:60px" value="⭐"><input id="nl" placeholder="名称" style="width:130px"><input id="np" type="number" placeholder="积分" style="width:70px" value="2">'
  har.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){const icon=hc.querySelector('#ni').value||'⭐';const label=hc.querySelector('#nl').value.trim();const pts=parseInt(hc.querySelector('#np').value)||2;if(!label){ts('⚠️ 请输入名称');return}D.dci.push({key:'c_'+Date.now(),icon:icon,label:label,pts:pts});sv(D);render();ts('✅ 已添加：'+label)}},'➕ 添加项目'))
  hc.appendChild(har)
  hc.addEventListener('click',function(e){const db=e.target.closest('[data-del]');if(db){const idx=parseInt(db.dataset.del);const nm=D.dci[idx].label;if(confirm('删除：'+nm+'？')){const ok=D.dci[idx].key;D.dci.splice(idx,1);for(const d in D.dailyChecks){if(D.dailyChecks[d][ok]!==undefined)delete D.dailyChecks[d][ok]}sv(D);render();ts('已删除：'+nm)}}})
  $c.appendChild(hc)

  // 管理零件清单
  const pec=h('div',{className:'card edit-only'})
  pec.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🖥️'}),'管理零件清单（'+D.parts.length+' 件）'))
  const ptgl=h('button',{className:'btn btn-outline btn-sm',onClick:function(){_partEdit=!_partEdit;render()}})
  ptgl.innerHTML=_partEdit?'收起清单':'展开编辑'
  pec.appendChild(ptgl)
  if(_partEdit){
    const pet=h('table')
    pet.innerHTML='<thead><tr><th scope="col">图标</th><th scope="col">名称</th><th scope="col">价格¥</th><th scope="col">解锁条件</th><th scope="col">说明</th><th scope="col">操作</th></tr></thead><tbody></tbody>'
    const petb=pet.querySelector('tbody')
    for(let i=0;i<D.parts.length;i++){
      const ep=D.parts[i]
      const tr=h('tr')
      tr.innerHTML='<td><input value="'+ep.icon+'" data-pi="'+i+'" data-pf="icon" style="width:52px;text-align:center"></td>'+
        '<td><input value="'+ep.name.replace(/"/g,'&quot;')+'" data-pi="'+i+'" data-pf="name" style="width:100px"></td>'+
        '<td><input type="number" value="'+ep.value+'" data-pi="'+i+'" data-pf="value" style="width:76px"></td>'+
        '<td><input value="'+ep.cond.replace(/"/g,'&quot;')+'" data-pi="'+i+'" data-pf="cond" style="width:100px"></td>'+
        '<td><input value="'+(ep.det||'').replace(/"/g,'&quot;')+'" data-pi="'+i+'" data-pf="det" style="width:100px"></td>'+
        '<td><button class="btn btn-danger btn-sm" data-pdel="'+i+'">✕</button></td>'
      petb.appendChild(tr)
    }
    const pw=h('div',{className:'table-scroll'});pw.appendChild(pet);pec.appendChild(pw)
    pec.appendChild(h('button',{className:'btn btn-primary btn-sm',style:'margin-top:8px',onClick:function(){
      const inputs=pec.querySelectorAll('input[data-pi]')
      for(let k=0;k<inputs.length;k++){const inp=inputs[k];const pi=parseInt(inp.getAttribute('data-pi'));const pf=inp.getAttribute('data-pf');if(!isNaN(pi)&&pf){if(pf==='value')D.parts[pi][pf]=parseFloat(inp.value)||0;else D.parts[pi][pf]=inp.value}}
      sv(D);render();ts('✅ 零件已更新')
    }},'💾 保存修改'))
    pec.addEventListener('click',function(e){const db=e.target.closest('[data-pdel]');if(db){const pi=parseInt(db.getAttribute('data-pdel'));if(confirm('删除零件：'+D.parts[pi].name+'？')){D.parts.splice(pi,1);sv(D);render();ts('已删除')}}})
    const par=h('div',{style:'display:flex;gap:8px;margin-top:10px;alignItems:center;flexWrap:wrap'})
    par.innerHTML='<input id="pnIcon" placeholder="图标" style="width:60px" value="⭐"><input id="pnName" placeholder="名称" style="width:100px"><input id="pnValue" type="number" placeholder="价格¥" style="width:86px" value="100"><input id="pnCond" placeholder="解锁条件" style="width:100px"><input id="pnDet" placeholder="说明" style="width:100px">'
    par.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){const name=pec.querySelector('#pnName').value.trim();if(!name){ts('⚠️ 请输入名称');return}const nid=Math.max.apply(null,D.parts.map(function(x){return x.id}).concat([0]))+1;D.parts.push({id:nid,icon:pec.querySelector('#pnIcon').value||'⭐',name:name,value:parseFloat(pec.querySelector('#pnValue').value)||100,cond:pec.querySelector('#pnCond').value.trim()||'手动',det:pec.querySelector('#pnDet').value.trim(),unlocked:false,received:false});sv(D);render();ts('✅ 已添加：'+name)}},'➕ 添加零件'))
    pec.appendChild(par)
  }
  $c.appendChild(pec)

  // 添加到主屏指引（按设备自动识别）
  const _ua=(navigator.userAgent||'')
  const _isIOS=/iPad|iPhone|iPod/.test(_ua)
  const _isAnd=/Android/.test(_ua)
  const _isWX=/MicroMessenger/i.test(_ua)
  const gc=h('div',{className:'card edit-only'})
  gc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📱'}),'装到手机桌面（像 App 一样打开）'))
  let _title='', _steps=[]
  if(_isWX){
    _title='你现在是在微信里打开的，微信里不能添加'
    _steps=['点右上角的「⋯」','选「在浏览器打开」','到浏览器里再按下面提示操作']
  }else if(_isIOS){
    _title='你在 iPhone / iPad（Safari）'
    _steps=['点屏幕底部中间的「分享」按钮（方框 + 向上箭头 ↑）','在弹出的菜单里往下滑，找到「添加到主屏幕」','点「添加」，桌面就会出现图标']
  }else if(_isAnd){
    _title='你在安卓手机'
    _steps=['点浏览器右上角的「⋮」（三个点）','在下拉菜单里找「添加到主屏幕」或「安装应用」','点「添加」即可']
  }else{
    _title='你在电脑上'
    _steps=['看网址栏右侧有没有一个「安装」小图标（显示器加箭头），点它','或点浏览器右上角「⋮ / ⋯」→ 找「应用 → 安装此站点」','安装后会像独立软件一样打开，没有地址栏']
  }
  gc.appendChild(h('div',{style:'font-size:14px;color:var(--primary);font-weight:600;margin-bottom:6px'},'👉 '+_title))
  const _ol=h('div',{style:'font-size:14px;line-height:1.9;color:var(--muted)'})
  _steps.forEach(function(t,i){_ol.appendChild(h('div',null,(i+1)+'. '+t))})
  gc.appendChild(_ol)
  gc.appendChild(h('div',{style:'font-size:13px;color:var(--faint);margin-top:8px'},'装到桌面后：图标是紫色的仪表盘，点开即全屏，不用再找网址'))
  $c.appendChild(gc)

  // 孩子端链接
  const sh=h('div',{className:'card edit-only'})
  sh.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔗'}),'孩子端链接（发给大哥）'))
  const _kid=((typeof location!=='undefined'&&location.origin&&location.origin!=='null')?location.origin+location.pathname:'index.html')+'?view'
  sh.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);margin-bottom:8px;word-break:break-all'},_kid))
  const sbr=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
  sbr.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){
    const done=function(){ts('✅ 已复制，粘贴到微信发给大哥即可')}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(_kid).then(done).catch(function(){ts('⚠️ 复制失败，请长按上面的链接手动复制')})}
    else{ts('请长按上面的链接手动复制')}
  }},'📋 复制孩子端链接'))
  sbr.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){window.open(_kid,'_blank')}},'🔍 预览孩子端'))
  sh.appendChild(sbr)
  sh.appendChild(h('div',{style:'font-size:13px;color:var(--muted);margin-top:8px'},'孩子打开只能看和提交打卡，不能改设置；手机浏览器菜单里选「添加到主屏幕」可以像 App 一样打开'))
  $c.appendChild(sh)

  const sec=h('div',{className:'card edit-only'})
  sec.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔐'}),'口令与 AI'))
  sec.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-bottom:8px'},'家长口令=全部权限；孩子口令=只能看和打卡。口令已记在本机，换设备需要重新输入。'))
  const srow=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
  srow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){localStorage.removeItem('lc_lv');localStorage.removeItem('lc_tok');ts('已退出，正在刷新…');setTimeout(function(){location.reload()},800)}},'🚪 退出登录'))
  srow.appendChild(h('button',{className:'btn btn-danger btn-sm',onClick:function(){
    if(!confirm('重设口令？重设后本机要重新设置家长/孩子口令。'))return
    D._auth=null;sv(D);localStorage.removeItem('lc_lv');localStorage.removeItem('lc_tok');location.reload()
  }},'🔄 重设口令'))
  sec.appendChild(srow)
  const _tk=aiToken()||'（先设置口令）'
  const tkRow=h('div',{style:'margin-top:10px;padding:10px 12px;background:var(--bg-elev);border-radius:8px;border:1px solid var(--border)'})
  tkRow.appendChild(h('div',{style:'font-size:13.5px;color:var(--muted);font-weight:600;margin-bottom:4px'},'云函数需要的 AI_TOKEN（复制到腾讯云云函数的环境变量里）'))
  tkRow.appendChild(h('div',{style:'font-size:13.5px;word-break:break-all;color:var(--primary)'},_tk))
  tkRow.appendChild(h('button',{className:'btn btn-outline btn-sm',style:'margin-top:6px',onClick:function(){
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(_tk).then(function(){ts('✅ 令牌已复制')}).catch(function(){ts('⚠️ 复制失败，请手动选中复制')})}
    else ts('请手动选中上面那串复制')
  }},'📋 复制令牌'))
  sec.appendChild(tkRow)
  const testRow=h('div',{style:'margin-top:8px'})
  const testOut=h('div',{style:'font-size:13.5px;margin-top:6px;color:var(--muted);white-space:pre-wrap'},'')
  testRow.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){
    testOut.style.color='var(--muted)';testOut.textContent='测试中…（约 5 秒）'
    aiCall('请只回复两个字：正常').then(function(r){
      if(r.ok){
        testOut.style.color='var(--success)';testOut.textContent='✅ AI 已部署并可用，模型回复：'+r.text
      }else{
        testOut.style.color='var(--danger)'
        testOut.textContent='❌ 还用不了：'+(r.err||'未知错误')+'\n（若显示「AI 函数未部署」，说明腾讯云那边的 leaiai 云函数还没建好）'
      }
    })
  }},'🔌 测试 AI 连接'))
  testRow.appendChild(testOut)
  sec.appendChild(testRow)
  const encRow=h('div',{style:'margin-top:10px;padding:10px 12px;background:var(--bg-elev);border-radius:8px;border:1px solid var(--border)'})
  encRow.appendChild(h('div',{style:'font-size:12.5px;color:var(--muted);font-weight:600;margin-bottom:4px'},'今天显示给孩子的鼓励（后台生成，界面上不出现"AI"字样）'))
  encRow.appendChild(h('div',{className:'longtext',style:'font-size:14px;line-height:1.75'},encToday()))
  encRow.appendChild(h('div',{style:'font-size:12px;color:var(--faint);margin-top:4px'},'备用句子还有 '+encPool().queue.length+' 句（他完成一件就呈现一句）'))
  const encBtns=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px'})
  encBtns.appendChild(h('button',{className:'btn btn-primary btn-sm',onClick:function(){ts('正在后台生成…');encEnsure(true);setTimeout(function(){render();ts('已更新')},7000)}},'🔄 换一批鼓励语'))
  encRow.appendChild(encBtns)
  sec.appendChild(encRow)
  sec.appendChild(h('div',{style:'font-size:12px;color:var(--faint);margin-top:10px'},'🤖 后台状态：'+(cloudReady?'正常，鼓励语每天自动更新':'未连云端，先用备用句子')))
  sec.appendChild(h('div',{style:'font-size:13px;color:var(--faint);margin-top:4px'},'部署步骤见项目目录里的「AI-部署说明.md」；云函数代码在 cloud-function-ai.js'))
  $c.appendChild(sec)

  // 历史版本
  const hv=h('div',{className:'card edit-only'})
  hv.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🕘'}),'历史版本（每 6 小时自动存一版，保留 5 版）'))
  const snaps=(D._snaps||[])
  if(!snaps.length)hv.appendChild(h('div',{style:'color:var(--muted);font-size:14px'},'还没有历史版本，用一会儿就会自动生成'))
  snaps.slice().reverse().forEach(function(sn,ri){
    const realIdx=snaps.length-1-ri
    const row=h('div',{className:'mistake-item',style:'display:flex;align-items:center;gap:8px;flex-wrap:wrap'})
    row.appendChild(h('span',{style:'flex:1;font-size:14px'},(ri===0?'最新 · ':'')+sn.label))
    row.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){rollbackTo(realIdx)}},'↩️ 回滚到这一版'))
    hv.appendChild(row)
  })
  hv.appendChild(h('button',{className:'btn btn-primary btn-sm',style:'margin-top:8px',onClick:function(){if(D._snaps&&D._snaps.length){D._snaps[D._snaps.length-1].at=0}maybeSnapshot();sv(D);render();ts('✅ 已保存一版快照')}},'📸 立即保存一版'))
  $c.appendChild(hv)

  // 最近删除
  const tr=(D._trash||[])
  if(tr.length){
    const tv=h('div',{className:'card edit-only'})
    tv.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🗑'}),'最近删除（'+tr.length+' 条 · 30 天内可恢复）'))
    tr.slice(0,15).forEach(function(t){
      const row=h('div',{className:'mistake-item',style:'display:flex;align-items:center;gap:8px;flex-wrap:wrap'})
      row.appendChild(h('span',{style:'flex:1;font-size:14px'},t.label))
      row.appendChild(h('span',{style:'font-size:13.5px;color:var(--faint)'},fd(ymd(new Date(t.at)))))
      row.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){trashRestore(t.id)}},'恢复'))
      tv.appendChild(row)
    })
    tv.appendChild(h('button',{className:'btn btn-danger btn-sm',style:'margin-top:8px',onClick:function(){if(confirm('清空回收站？清空后无法恢复。')){D._trash=[];sv(D);render();ts('回收站已清空')}}},'清空回收站'))
    $c.appendChild(tv)
  }

  // 数据备份
  const dm=h('div',{className:'card edit-only'})
  dm.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🔧'}),'数据备份'))
  const dbr=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
  dbr.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:exportBackup},'📥 导出备份'))
  dbr.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){const inp=document.createElement('input');inp.type='file';inp.accept='.json';inp.onchange=function(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=function(ev){try{const d=JSON.parse(ev.target.result);if(confirm('将覆盖当前所有数据？')){D=normalize(d);sv(D);render();ts('✅ 已导入')}}catch(err){ts('⚠️ 格式错误')}};r.readAsText(f)};inp.click()}},'📤 导入备份'))
  dbr.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){
    if(_offline){ts('⚠️ 当前离线，请联网后再清理');return}
    if(!confirm('只清理这台设备上的本地缓存（照片和记录仍完整保留在云端），然后从云端重新加载。\n\n继续吗？'))return
    try{localStorage.removeItem(SK);localStorage.removeItem(SK+'_t')}catch(e){}
    ts('🧹 已清理本机缓存，正在从云端重新加载…')
    setTimeout(function(){location.reload()},1000)
  }},'🧹 清理本机缓存'))
  dm.appendChild(dbr)
  dm.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-top:8px'},'上次备份：'+((D._lastBackup)?fd(ymd(new Date(D._lastBackup))):'从未导出')+'（建议每周导出一次，存微信收藏或网盘）'))
  $c.appendChild(dm)
}

let _editExamId=null,_editOrig=null
function rs(){
  $c.appendChild(h('div',{className:'daily-praise'},'💬 '+encLine()))

  const editing=_editExamId?true:false
  const orig=_editOrig
  // 每科目的照片：subjImgs[科目id] = [b64,...]
  let subjImgs={}
  if(editing&&orig&&orig.subjImgs){subjImgs=JSON.parse(JSON.stringify(orig.subjImgs))}
  else if(editing&&orig&&orig.imgs&&orig.imgs.length){subjImgs['__all']=orig.imgs.slice()}

  const _showForm=editing||_openExamForm
  if(!_showForm){
    const oc=h('div',{className:'card edit-only'})
    oc.appendChild(h('button',{className:'btn btn-primary',onClick:function(){_openExamForm=true;render()}},'＋ 录入考试成绩'))
    oc.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-top:8px'},'点按钮展开录入；录入时可以顺手拍试卷照片，通过后计入'))
    $c.appendChild(oc)
  }
  if(_showForm){
  const fc=h('div',{className:'card'})
  fc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📝'}),editing?'编辑考试成绩':'录入考试成绩（分数+试卷照片放一起）'))
  const sel=function(v,c){return v===c?' selected':''}
  fc.innerHTML+='<div class="form-row"><div><label>日期</label><input type="date" id="ed" value="'+(editing&&orig?orig.date:td)+'"><div style="margin-top:4px;display:flex;gap:6px"><button type="button" class="btn btn-outline btn-sm" onclick="setExamDate(0)">今天</button><button type="button" class="btn btn-warning btn-sm" onclick="setExamDate(1)">昨天</button></div></div><div><label>学期</label><select id="es">'+['初二上','初二下','初三上','初三下'].map(function(s){return '<option value="'+s+'"'+(editing&&orig?sel(orig.sem,s):(D.sem===s?' selected':''))+'>'+s+'</option>'}).join('')+'</select></div><div><label>考试类型</label><select id="et">'+['小测试','期中','期末','月考','模拟考','中考'].map(function(s){return '<option value="'+s+'"'+(editing&&orig?sel(orig.examType,s):'')+'>'+s+'</option>'}).join('')+'</select></div></div>'
  fc.innerHTML+='<div id="ei"></div>'
  fc.innerHTML+='<div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary" id="bae">💾 '+(editing?'保存修改':'提交成绩')+'</button>'+(editing?'<button class="btn btn-outline" id="btnCancelEdit">取消编辑</button>':'')+'</div>'

  function renderSubjImgs(subId){
    const box=fc.querySelector('.subj-imgs[data-sub="'+subId+'"]')
    if(!box)return
    box.innerHTML=''
    const arr=subjImgs[subId]||[]
    arr.forEach(function(b64,idx){
      const wrap=h('div',{style:'position:relative;display:inline-block'})
      wrap.appendChild(h('img',{alt:'记录照片',loading:'lazy',src:b64,style:'width:64px;height:64px;object-fit:cover;border-radius:6px;border:1px solid var(--border);cursor:pointer',onClick:function(){viewImg(b64,arr)}}))
      wrap.appendChild(h('button',{className:'btn btn-danger btn-sm',style:'position:absolute;top:-6px;right:-6px;padding:0 4px;font-size:12.5px;line-height:1',onClick:function(){subjImgs[subId].splice(idx,1);renderSubjImgs(subId)}},'✕'))
      box.appendChild(wrap)
    })
  }

  function pasteImageTo(subId){
    ts('📋 请按 Ctrl+V 粘贴图片')
    function onPaste(e){
      const items=(e.clipboardData&&e.clipboardData.items)||[]
      let found=false
      for(const item of items){
        if(item.type&&item.type.indexOf('image')===0){
          const file=item.getAsFile()
          if(file){found=true;compressImage(file,function(b64){if(b64){if(!subjImgs[subId])subjImgs[subId]=[];subjImgs[subId].push(b64);renderSubjImgs(subId);ts('✅ 已粘贴')}})}
        }
      }
      document.removeEventListener('paste',onPaste)
      if(!found){ts('⚠️ 剪贴板里没有图片')}
    }
    document.addEventListener('paste',onPaste)
  }
  function ui(){
    // 先记住已经输入/选择的内容，避免切换学期时丢失
    const prev={}
    fc.querySelectorAll('#ei input[data-sub]').forEach(function(inp){prev[inp.getAttribute('data-sub')]=inp.value})
    const sem=fc.querySelector('#es').value
    const subs=gs(sem)
    const box=fc.querySelector('#ei')
    box.innerHTML=''
    for(const s of subs){
      const oldVal=prev[s.id]!=null?prev[s.id]:(editing&&orig&&orig.scores&&orig.scores[s.id]!=null?orig.scores[s.id]:'')
      const row=h('div',{className:'subj-line',style:'padding-bottom:8px;border-bottom:1px dashed var(--border);margin-bottom:8px'})
      row.appendChild(h('label',{style:'font-size:14px;color:var(--muted);font-weight:600;display:block;margin-bottom:4px'},s.name+'（满分'+s.full+'，×'+(s.rate*100).toFixed(0)+'%）'))
      const r2=h('div',{style:'display:flex;align-items:center;gap:8px;flex-wrap:wrap'})
      r2.appendChild(h('input',{type:'text',placeholder:'数字或ABC',value:String(oldVal),'data-sub':s.id,style:'width:110px'}))
      const _n=(subjImgs[s.id]||[]).length
      const extra=h('div',{className:'subj-extra',style:'margin-top:8px;display:'+(_openImg[s.id]?'':'none')})
      const tg=h('button',{className:'btn btn-outline btn-sm',onClick:function(){
        _openImg[s.id]=!_openImg[s.id]
        extra.style.display=_openImg[s.id]?'':'none'
        tg.innerHTML=_btnText()
      }})
      function _btnText(){return '📷 '+((subjImgs[s.id]||[]).length?((subjImgs[s.id]||[]).length+' 张'):'加照片')+(_openImg[s.id]?' ▴':' ▾')}
      tg.innerHTML=_btnText()
      r2.appendChild(tg)
      row.appendChild(r2)
      const r3=h('div',{style:'display:flex;gap:8px;flex-wrap:wrap'})
      const upBtn=h('button',{className:'btn btn-outline btn-sm',onClick:function(){
        const inp=document.createElement('input')
        inp.type='file';inp.accept='image/*';inp.multiple=true
        inp.onchange=function(e){
          const files=Array.from(e.target.files||[])
          if(!files.length)return
          ts('⏳ 正在处理 '+files.length+'张...')
          let done=0
          files.forEach(function(f){
            compressImage(f,function(b64){
              done++
              if(b64){if(!subjImgs[s.id])subjImgs[s.id]=[];subjImgs[s.id].push(b64)}
              if(done===files.length){renderSubjImgs(s.id);tg.innerHTML=_btnText();ts('✅ '+s.name+'已添加照片')}
            })
          })
        }
        inp.click()
      }})
      upBtn.innerHTML='📷 选择照片'
      r3.appendChild(upBtn)
      const pasteBtn=h('button',{className:'btn btn-outline btn-sm',onClick:function(){pasteImageTo(s.id)}})
      pasteBtn.innerHTML='📋 粘贴'
      r3.appendChild(pasteBtn)
      extra.appendChild(r3)
      extra.appendChild(h('div',{className:'subj-imgs','data-sub':s.id,style:'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px'}))
      row.appendChild(extra)
      box.appendChild(row)
    }
    for(const s of subs){renderSubjImgs(s.id)}
  }
  fc.querySelector('#es').addEventListener('change',ui);ui()

  if(editing){
    fc.querySelector('#btnCancelEdit').addEventListener('click',function(){_editExamId=null;_editOrig=null;_openExamForm=false;render()})
  }

  fc.querySelector('#bae').addEventListener('click',function(){
    const scores={};const inputs=fc.querySelectorAll('#ei input');let has=false
    for(const inp of inputs){const raw=inp.value.trim();if(!raw)continue;const v=parseFloat(raw);if(!isNaN(v)){scores[inp.getAttribute('data-sub')]=v;has=true}else{scores[inp.getAttribute('data-sub')]=raw.toUpperCase();has=true}}
    if(!has){ts('⚠️ 请至少输入一科成绩');return}
    const newDate=fc.querySelector('#ed').value
    const newSem=fc.querySelector('#es').value
    const newType=fc.querySelector('#et').value
    // 汇总所有照片到 imgs
    const allImgs=[]
    for(const k in subjImgs){if(subjImgs[k]&&subjImgs[k].length){subjImgs[k].forEach(function(b){allImgs.push(b)})}}

    if(editing&&orig){
      const changes=[]
      if(newDate!==orig.date)changes.push('日期 '+orig.date+'→'+newDate)
      if(newSem!==orig.sem)changes.push('学期 '+orig.sem+'→'+newSem)
      if(newType!==orig.examType)changes.push('类型 '+orig.examType+'→'+newType)
      const keys={}
      Object.keys(orig.scores||{}).forEach(function(k){keys[k]=1})
      Object.keys(scores).forEach(function(k){keys[k]=1})
      const subNames={chinese:'语文',math:'数学',english:'英语',physics:'物理',chem:'化学',geo:'地理',bio:'生物',dao:'道法',history:'历史',pe:'体育'}
      for(const k in keys){const a=orig.scores&&orig.scores[k]!=null?orig.scores[k]:'空';const b=scores[k]!=null?scores[k]:'空';if(a!==b)changes.push((subNames[k]||k)+' '+a+'→'+b)}
      if(JSON.stringify(orig.imgs||[])!==JSON.stringify(allImgs))changes.push('更换了试卷照片')
      const note=changes.join('，')||'无实质变化'
      orig.history=orig.history||[]
      orig.history.push({ts:Date.now(),note:note})
      orig.date=newDate;orig.sem=newSem;orig.examType=newType;orig.scores=scores;orig.imgs=allImgs;orig.subjImgs=subjImgs;orig.ts=Date.now()
      if(orig.status==='approved')cu(orig)
      sv(D);_editExamId=null;_editOrig=null;_openExamForm=false;render()
      ts('✅ 修改已保存，日志已记录')
    }else{
      const ex={id:Date.now(),date:newDate,sem:newSem,examType:newType,scores:scores,imgs:allImgs,subjImgs:subjImgs,status:VW?'pending':'approved',ts:Date.now(),history:[]}
      D.exams.push(ex)
      if(!VW){D.sem=ex.sem;cu(ex)}
      sv(D);_openExamForm=false;render()
      ts(VW?'✅ 已提交等待家长审核':'✅ 成绩已保存')
    }
  })
  $c.appendChild(fc)
  }

  // 家长审核区
  if(!VW){
    const pending=(D.exams||[]).filter(function(x){return x.status==='pending'})
    if(pending.length){
      const ap=h('div',{className:'card'})
      ap.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'👩‍👩‍👧'}),'待审核成绩（'+pending.length+'条）'))
      ap.appendChild(h('button',{className:'btn btn-success btn-sm',style:'margin-bottom:10px',onClick:function(){approveExams(pending)}},'✅ 全部通过（'+pending.length+'条）'))
      for(const ex of pending){
        const row=h('div',{className:'mistake-item'})
        const info=ct(ex.scores,ex.sem)
        row.innerHTML='<div><strong>'+fd(ex.date)+' '+ex.sem+' '+ex.examType+'</strong> 总分 '+info.total+'/'+info.fullTotal+'</div>'
        if(ex.imgs&&ex.imgs.length){
          const ir=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px'})
          for(const b of ex.imgs){ir.appendChild(h('img',{alt:'记录照片',loading:'lazy',src:b,style:'width:70px;height:70px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid var(--border)',onClick:function(){viewImg(b,ex.imgs)}}))}
          row.appendChild(ir)
        }
        const br=h('div',{style:'margin-top:8px'})
        br.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){approveExam(ex.id)}},'✅ 通过'))
        br.appendChild(h('button',{className:'btn btn-danger btn-sm',style:'margin-left:6px',onClick:function(){rejectExam(ex.id)}},'↩️ 退回'))
        row.appendChild(br)
        ap.appendChild(row)
      }
      $c.appendChild(ap)
    }
  }

  // 成绩基准线（起点分）+ 薄弱科目
  const bsubs=gs(D.sem)
  const bc=h('div',{className:'card'})
  const bcHead=h('div',{className:'card-header'},h('span',{innerHTML:'📏'}),'成绩基准线（'+D.sem+' 起点）')
  if(!VW){const be=h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-left:auto',onClick:function(){_blEdit=!_blEdit;render()}});be.innerHTML=_blEdit?'收起':'✏️ 编辑';bcHead.appendChild(be)}
  bc.appendChild(bcHead)
  let btb='<div class="table-scroll"><table><thead><tr><th scope="col">科目</th><th scope="col">卷面</th><th class="col-sm-hide">折算</th><th scope="col">得分率</th><th class="col-sm-hide">状态</th></tr></thead><tbody>'
  let bkt=0,bkf=0
  for(const sb of bsubs){
    const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null
    const conv=raw!=null?raw*sb.rate:null;const pct=raw!=null?raw/sb.full*100:0
    if(raw!=null){bkt+=conv;bkf+=sb.full*sb.rate}
    btb+='<tr><td><strong>'+sb.name+'</strong></td><td>'+(raw!=null?raw+'/'+sb.full:'?/'+sb.full)+'</td><td class="col-sm-hide">'+(conv!=null?conv.toFixed(1)+'/'+(sb.full*sb.rate).toFixed(0):'—')+'</td><td style="color:'+(pct<55?'var(--danger)':pct<70?'var(--warning)':'var(--success)')+';font-weight:600">'+(raw!=null?pct.toFixed(1)+'%':'—')+'</td><td class="col-sm-hide" style="color:'+(raw!=null?'var(--success)':'var(--muted)')+'">'+(raw!=null?'✅ 已有':'⬜ 待填')+'</td></tr>'
  }
  btb+='</tbody></table></div>'
  bc.innerHTML+=btb
  const bpct=bkf>0?(bkt/bkf*100):0
  const bfull=bsubs.reduce(function(a,x){return a+x.full*x.rate},0)
  bc.appendChild(h('div',{style:'margin-top:10px;padding:8px;background:var(--bg-elev);border-radius:6px;font-size:14px',innerHTML:'📊 基准合计：<strong>'+bkt.toFixed(1)+'/'+bkf.toFixed(0)+'</strong>（'+bpct.toFixed(1)+'%）| 满分：'+bfull}))
  if(!VW&&_blEdit){
    const beg=h('div',{className:'form-row',style:'margin-top:10px'})
    for(const sb of bsubs){
      const v=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:''
      const cell=h('div')
      cell.appendChild(h('label',null,sb.name+'（满分'+sb.full+'）'))
      cell.appendChild(h('input',{type:'number',id:'bl_'+sb.id,value:String(v),placeholder:'不填=待考'}))
      beg.appendChild(cell)
    }
    bc.appendChild(beg)
    bc.appendChild(h('button',{className:'btn btn-primary btn-sm',style:'margin-top:8px',onClick:function(){
      if(!D.bl)D.bl={}
      for(const sb of bsubs){const el=document.getElementById('bl_'+sb.id);const val=el.value.trim();D.bl[sb.id]=val===''?null:parseFloat(val)}
      sv(D);_blEdit=false;render();ts('✅ 基准分已保存')
    }},'💾 保存基准分'))
  }
  $c.appendChild(bc)

  const weakSubs=[]
  for(const sb of bsubs){const raw=D.bl&&D.bl[sb.id]!=null?D.bl[sb.id]:null;if(raw!=null){const wp=raw/sb.full*100;if(wp<60)weakSubs.push({name:sb.name,pct:wp})}}
  if(weakSubs.length){
    const wc=h('div',{className:'card'})
    wc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🎯'}),'薄弱科目诊断'))
    for(const w of weakSubs){
      let adv='回归课本，梳理知识点，多做基础题'
      if(w.name==='英语')adv='每天背20个单词 + 朗读课文15分钟'
      else if(w.name==='数学')adv='每天做5道基础计算题，先抓计算准确率'
      else if(w.name==='语文')adv='每周2篇阅读理解 + 积累作文素材'
      else if(w.name==='物理')adv='先弄懂每个公式的含义，做课本例题'
      wc.appendChild(h('div',{className:'alert danger'},'🔴 '+w.name+' 得分率 '+w.pct.toFixed(1)+'% — 建议：'+adv))
    }
    $c.appendChild(wc)
  }

  // 成绩趋势图
  const _exs=(D.exams||[]).filter(function(e){return e.status!=='rejected'})
  if(_exs.length>=2){
    const _sorted=[..._exs].sort(function(a,b){return (a.date||'').localeCompare(b.date||'')}).slice(-12)
    const tcc=h('div',{className:'card'})
    tcc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📈'}),'成绩趋势（'+(D.sem||'')+' 得分率）'))
    tcc.appendChild(buildTrendSvg(_sorted))
    tcc.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-top:4px'},'绿色虚线是「三中 625 线」对应得分率 78.1%，点越往上越好'))
    $c.appendChild(tcc)
  }

  // 成绩列表
  const lc=h('div',{className:'card'})
  lc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📋'}),'成绩记录（共 '+D.exams.length+' 次）'))
  const _ech=h('div',{style:'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px'})
  ;[['all','全部'],['初二上','初二上'],['初二下','初二下'],['初三上','初三上'],['初三下','初三下']].forEach(function(f){
    _ech.appendChild(h('button',{className:'btn btn-sm '+(_exFilter===f[0]?'btn-primary':'btn-outline'),onClick:function(){_exFilter=f[0];render()}},f[1]))
  })
  lc.appendChild(_ech)
  if(!D.exams.length){lc.appendChild(h('div',{style:'text-align:center;padding:40px;color:var(--muted)'},'📭 暂无记录'))}
  else{
    const sorted=[...D.exams].filter(function(x){return _exFilter==='all'||(x.sem||'初二上')===_exFilter}).sort(function(a,b){return b.ts-a.ts})
    for(const ex of sorted){
      const info=ct(ex.scores,ex.sem)
      const pctColor=info.pct<65?'var(--danger)':info.pct<75?'var(--warning)':'var(--success)'
      const st=ex.status==='pending'?'⏳ 待审核':ex.status==='rejected'?'↩️ 已退回':'✅'
      const stc=ex.status==='pending'?'var(--warning)':ex.status==='rejected'?'var(--muted)':'var(--success)'
      const row=h('div',{className:'mistake-item'})
      row.innerHTML='<div><strong>'+fd(ex.date)+' '+ex.sem+' '+ex.examType+'</strong> <span style="color:'+stc+'">'+st+'</span></div><div style="font-size:14.5px;color:var(--muted);margin-top:2px">总分 <strong style="color:'+pctColor+'">'+info.total+'</strong> / '+info.fullTotal+' （'+ps(info.pct)+'）</div>'
      if(ex.imgs&&ex.imgs.length){
        const ir=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px'})
        for(const b of ex.imgs){ir.appendChild(h('img',{alt:'记录照片',loading:'lazy',src:b,style:'width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid var(--border)',onClick:function(){viewImg(b,ex.imgs)}}))}
        row.appendChild(ir)
      }
      if(ex.history&&ex.history.length){
        const hd=h('div',{style:'margin-top:6px;font-size:14px;color:var(--faint)'})
        hd.appendChild(h('div',{style:'font-weight:600;color:var(--muted)'},'📝 更新日志（'+ex.history.length+'条）'))
        for(const hh of ex.history){hd.appendChild(h('div',{style:'margin-top:2px'},fd(ymd(new Date(hh.ts)))+': '+hh.note))}
        row.appendChild(hd)
      }
      if(!VW&&ex.status!=='approved'){
        const br=h('div',{style:'margin-top:8px'})
        if(ex.status==='pending'){
          br.appendChild(h('button',{className:'btn btn-success btn-sm',onClick:function(){approveExam(ex.id)}},'✅ 通过'))
          br.appendChild(h('button',{className:'btn btn-danger btn-sm',style:'margin-left:6px',onClick:function(){rejectExam(ex.id)}},'↩️ 退回'))
        }
        if(ex.status==='rejected'){
          br.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){ex.status='pending';sv(D);render()}},'重新提交'))
        }
        row.appendChild(br)
      }
      if(!VW){
        const br2=h('div',{style:'margin-top:8px'})
        br2.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){_editExamId=ex.id;_editOrig=ex;render()}},'✏️ 编辑'))
        const delBtn=h('button',{className:'btn btn-danger btn-sm',style:'margin-left:6px',onClick:function(){if(confirm('删除这条成绩？')){D.exams=D.exams.filter(function(e){return e.id!==ex.id});sv(D);render()}}});delBtn.innerHTML='🗑';delBtn.onclick=function(){if(confirm('删除这条成绩？\n'+fd(ex.date)+' '+ex.sem+' '+ex.examType+'\n\n会放进「设置 → 最近删除」，30 天内可恢复')){trashPush('exam',fd(ex.date)+' '+ex.sem+' '+ex.examType,ex);D.exams=D.exams.filter(function(e){return e.id!==ex.id});sv(D);render();ts('已删除（可在设置页恢复）')}};br2.appendChild(delBtn)
        row.appendChild(br2)
      }
      lc.appendChild(row)
    }
  }
  $c.appendChild(lc)
}

function cu(ex){
  const info=ct(ex.scores,ex.sem);let ch=false
  function up(id){var p=D.parts.find(function(x){return x.id===id});if(p&&!p.unlocked){p.unlocked=true;return true}return false}
  // 初二上期中：主科均分≥100，解锁鼠标垫(1)+鼠标(2)
  if(ex.sem==='初二上'&&ex.examType==='期中'){const avg=(ex.scores.chinese+ex.scores.math+ex.scores.english)/3;if(avg>=100){if(up(1))ch=true;if(up(2))ch=true;if(up(3))ch=true}}
  const conds=[{ids:[4,5,6],s:'初二上',e:'期末',m:508},{ids:[7,8,9],s:'初二下',e:'期中',m:517},{ids:[10,11],s:'初二下',e:'期末',m:538},{ids:[12,13],s:'初三上',e:'期中',m:580},{ids:[14],s:'初三上',e:'期末',m:610},{ids:[15],s:'初三下',e:'月考',m:600},{ids:[16],s:'初三下',e:'期中',m:610},{ids:[17],s:'初三下',e:'期末',m:615}]
  for(var ci=0;ci<conds.length;ci++){var c=conds[ci];if(ex.sem===c.s&&ex.examType===c.e&&info.total>=c.m){for(var k=0;k<c.ids.length;k++){if(up(c.ids[k]))ch=true}}}
  if(ex.examType==='中考'&&info.total>=625&&up(18))ch=true
  if(ex.sem==='初二上'&&ex.examType==='期末'&&info.total>=508&&!D.phone){D.phone=true;ch=true}
  if(ch){sv(D);ts('🎉 解锁！ · '+praise('unlock'))}
}

function rp(){
  $c.appendChild(h('div',{className:'daily-praise'},'💬 '+encLine()))
  const rate=D.rate||1
  const pu=D.parts.filter(p=>p.unlocked).length
  const pr=D.parts.filter(p=>p.received).length
  const tv=D.parts.filter(p=>p.unlocked).reduce((s,p)=>s+p.value,0)
  const tpc=D.parts.filter(p=>p.unlocked).reduce((s,p)=>s+Math.round(p.value*rate),0)

  const sg=h('div',{className:'stat-grid'})
  sg.appendChild(h('div',{className:'stat-card success'},h('div',{className:'sv'},pu+'/'+D.parts.length),h('div',{className:'sl'},'已解锁')))
  sg.appendChild(h('div',{className:'stat-card primary'},h('div',{className:'sv'},pr+'/11'),h('div',{className:'sl'},'已签收')))
  sg.appendChild(h('div',{className:'stat-card '+(pu>=3?'success':'warning')},h('div',{className:'sv'},'¥'+tv.toLocaleString()),h('div',{className:'sl'},'已解锁价值')))
  sg.appendChild(h('div',{className:'stat-card primary'},h('div',{className:'sv'},'⭐'+tpc.toLocaleString()),h('div',{className:'sl'},'已解锁需积分')))
  $c.appendChild(sg)

  /* 积分兑换率已移到「设置」页 */


  const pc=h('div',{className:'card'})
  pc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'💻'}),'零件清单（¥价格 / ⭐积分）'))
  const grid=h('div',{className:'parts-grid'})
  const teP=D.points.filter(p=>p.type==='earn').reduce((s,p)=>s+p.points,0)
  const tsP=D.points.filter(p=>p.type==='spend').reduce((s,p)=>s+p.points,0)
  const availPts=teP-tsP
  for(const part of D.parts){
    const pcost=Math.round(part.value*rate)
    const card=h('div',{className:'part-card '+(part.unlocked?'unlocked':'locked'),onClick:()=>{if(!VW&&part.unlocked&&!part.received){if(confirm('标记 "'+part.name+'" 为已签收？')){part.received=true;sv(D);render();ts('✅ 已标记签收 · '+praise('part'))}}}})
    card.innerHTML='<div class="pb">'+(part.received?'✅':part.unlocked?'🔓':'🔒')+'</div><div class="pi">'+part.icon+'</div><div class="pn">'+part.name+'</div><div class="pv">¥'+part.value.toLocaleString()+' / ⭐'+pcost.toLocaleString()+'</div><div class="pc">'+part.cond+'</div><div style="font-size:12.5px;color:var(--muted);margin-top:2px">'+(part.exchange?('需 '+pcost.toLocaleString()+' 积分兑换'):part.det)+'</div>'
    if(part.exchange&&!part.unlocked&&!VW){
      const need=pcost
      const can=availPts>=need
      card.appendChild(h('button',{className:'btn btn-sm '+(can?'btn-success':'btn-outline'),style:'margin-top:6px;font-size:13.5px',onClick:(e)=>{e.stopPropagation();if(availPts<need){ts('⚠️ 积分不足，还差 '+(need-availPts).toLocaleString()+' 分');return}if(confirm('确认用 '+need.toLocaleString()+' 积分兑换 '+part.name+'？')){D.points.push({date:td,source:'兑换 '+part.name,points:need,type:'spend'});part.unlocked=true;sv(D);render();ts('✅ 已兑换 '+part.name+' · '+praise('part'))}}},(can?'💰 兑换 ⭐':'🔒 积分不足')))
    }
    if(!VW)card.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-top:6px;font-size:12.5px',onClick:(e)=>{e.stopPropagation();const np=prompt('修改 '+part.name+' 价格（当前：¥'+part.value.toLocaleString()+'）：',part.value);if(np!==null){const v=parseFloat(np);if(!isNaN(v)&&v>0){part.value=v;sv(D);render();ts('✅ 已更新')}}}},'✏️ 改价'))
    grid.appendChild(card)
  }
  pc.appendChild(grid)
  const av=D.parts.reduce((s,p)=>s+p.value,0)
  const ap=D.parts.reduce((s,p)=>s+Math.round(p.value*rate),0)
  pc.appendChild(h('div',{style:'margin-top:14px;padding:10px;background:var(--bg-elev);border-radius:6px;font-size:14.5px;text-align:center',innerHTML:'💰 全部总价：<strong>¥'+av.toLocaleString()+'</strong> | 共需积分：<strong>⭐'+ap.toLocaleString()+'</strong>（1元='+rate+'分）'}))
  $c.appendChild(pc)

  /* 管理零件清单已移到「设置」页 */

}

/* rdl() 已合并进打卡页 rckList() */

function rpt(){
  $c.appendChild(h('div',{className:'daily-praise'},'💬 '+encLine()))
  const te=D.points.filter(p=>p.type==='earn').reduce((s,p)=>s+p.points,0)
  const ts_=D.points.filter(p=>p.type==='spend').reduce((s,p)=>s+p.points,0)
  const sm=h('div',{className:'ps'})
  sm.appendChild(h('div',{className:'psi'},h('div',{className:'pv',style:'color:var(--primary)'},'⭐ '+te),h('div',{className:'pl'},'累计赚取')))
  sm.appendChild(h('div',{className:'psi'},h('div',{className:'pv',style:'color:var(--danger)'},'💸 '+ts_),h('div',{className:'pl'},'已使用')))
  sm.appendChild(h('div',{className:'psi'},h('div',{className:'pv',style:'color:var(--success)'},'💰 '+(te-ts_)),h('div',{className:'pl'},'可用积分')))
  $c.appendChild(sm)

  if(!VW){
    const ac=h('div',{className:'card edit-only'})
    ac.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'➕'}),'手动添加'))
    ac.innerHTML+='<div class="form-row"><div><label>日期</label><input type="date" id="pd" value="'+td+'"></div><div><label>来源</label><input type="text" id="psrc" placeholder="如：单元测试达标"></div><div><label>分值</label><input type="number" id="pv" placeholder="正=赚，负=花"></div></div><button class="btn btn-primary btn-sm" id="bap">💾 添加</button>'
    ac.querySelector('#bap').addEventListener('click',()=>{const src=ac.querySelector('#psrc').value.trim();const val=parseInt(ac.querySelector('#pv').value);if(!src||isNaN(val)||val===0){ts('⚠️ 请填写完整');return}D.points.push({date:ac.querySelector('#pd').value,source:src,points:Math.abs(val),type:val>0?'earn':'spend'});sv(D);render();ts('✅ 已添加')})
    $c.appendChild(ac)
  }

  const dc=h('div',{className:'card'})
  dc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📋'}),'积分明细（共 '+D.points.length+' 条）'))
  const _fch=h('div',{style:'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px'})
  ;[['all','全部'],['earn','🟢 赚取'],['spend','🔴 支出']].forEach(function(f){
    _fch.appendChild(h('button',{className:'btn btn-sm '+(_ptFilter===f[0]?'btn-primary':'btn-outline'),onClick:function(){_ptFilter=f[0];render()}},f[1]))
  })
  dc.appendChild(_fch)
  if(!D.points.length){dc.appendChild(h('div',{style:'text-align:center;padding:40px;color:var(--muted)'},'📭 暂无记录'))}
  else{
    const sorted=[...D.points].filter(function(x){return _ptFilter==='all'||x.type===_ptFilter}).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,50)
    var rows2=''
    for(var pi=0;pi<sorted.length;pi++){
      var p=sorted[pi]
      rows2+='<tr><td>'+fd(p.date)+'</td><td>'+p.source+'</td>'
      rows2+='<td class="col-sm-hide">'+(p.type==='earn'?'🟢 赚取':'🔴 支出')+'</td>'
      rows2+='<td style="font-weight:700;color:'+(p.type==='earn'?'var(--success)':'var(--danger)')+'">'+(p.type==='earn'?'+':'-')+p.points+'</td>'
      if(!VW){
        var btnId='btn_'+pi
        rows2+='<td><button id="'+btnId+'" class="btn btn-danger btn-sm">🗑</button></td>'
      }else{rows2+='<td></td>'}
      rows2+='</tr>'
    }
    dc.innerHTML+='<div class="table-scroll"><table><thead><tr><th scope="col">日期</th><th scope="col">来源</th><th class="col-sm-hide">类型</th><th scope="col">分值</th><th scope="col">操作</th></tr></thead><tbody>'+rows2+'</tbody></table></div>'
    if(!VW){for(var pi2=0;pi2<sorted.length;pi2++){(function(p2){var el=dc.querySelector('#btn_'+pi2);if(el)el.onclick=function(){if(!confirm('删除这条积分记录？\n'+p2.date+' '+p2.source+' '+(p2.type==='earn'?'+':'-')+p2.points+'\n\n会放进「设置 → 最近删除」，30 天内可恢复'))return;const _i=D.points.indexOf(p2);if(_i<0)return;trashPush('point',p2.date+' '+p2.source,D.points[_i]);D.points.splice(_i,1);sv(D);render();ts('已删除（可在设置页恢复）')}})(sorted[pi2])}}
    if(D.points.length>50)dc.appendChild(h('div',{style:'text-align:center;color:var(--muted);margin-top:8px;font-size:14px'},'仅显示最近 50 条'+(_ptFilter!=='all'?'（已按类型筛选）':'')))
  }
  $c.appendChild(dc)

  const rc=h('div',{className:'card'})
  rc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📖'}),'积分规则（自动发放）'))
  const _ci=D.dci||defData().dci
  let _rtb='<div class="table-scroll"><table><thead><tr><th scope="col">来源</th><th scope="col">积分</th></tr></thead><tbody>'
  _rtb+='<tr><td>📷 拍照打卡（家长审核通过后）</td><td>'+CHECK_TYPES.map(function(t){return t.name+' +'+t.pts}).join('、')+'</td></tr>'
  if(_ci.length)_rtb+='<tr><td>🔁 习惯打卡（打勾即加）</td><td>'+_ci.map(function(it){return it.label+' +'+it.pts}).join('、')+'</td></tr>'
  _rtb+='<tr><td>🎯 小目标达成</td><td>+10 / 个</td></tr>'
  _rtb+='<tr><td>✅ 家长手动添加</td><td>在「积分账本」页录入</td></tr>'
  _rtb+='</tbody></table></div>'
  rc.innerHTML+=_rtb
  rc.appendChild(h('div',{style:'font-size:14px;color:var(--muted);padding:8px;background:var(--bg-elev);border-radius:6px;margin-top:8px'},'大考奖励分数不会自动加，请参考下表用「手动添加」录入实际达成的项'))
  $c.appendChild(rc)

  const erc=h('div',{className:'card'})
  erc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'🏅'}),'大考积分参考（手动录入）'))
  erc.innerHTML+='<div class="table-scroll"><table><thead><tr><th scope="col">积分项</th><th scope="col">参考分值</th></tr></thead><tbody><tr><td>🏅 达标基础分</td><td><strong>+150</strong></td></tr><tr><td>🚀 超标加分</td><td><strong>+15/分</strong></td></tr><tr><td>📚 单科达标</td><td><strong>+40/科</strong></td></tr><tr><td>🌟 全科达标</td><td><strong>+80</strong></td></tr><tr><td>📈 进步奖</td><td><strong>+60</strong></td></tr><tr><td>🔥 连续达标</td><td><strong>+80</strong></td></tr></tbody></table></div><div style="margin-top:10px;font-size:14px;color:var(--muted);padding:8px;background:var(--warning-weak);border-radius:6px">💡 <strong>示例：</strong>达标150 + 超标45 + 3科120 + 进步60 = <strong>375 分</strong></div>'
  $c.appendChild(erc)
}

let _checkDate=null
let _openSubj={},_onlyTodo=false
let _calY=null,_calM=null,_calSel=null
function rcal(){
  $c.innerHTML=''
  const now=new Date()
  if(_calY===null){_calY=now.getFullYear();_calM=now.getMonth()}
  const y=_calY,m=_calM
  function pad(n){return n<10?'0'+n:''+n}
  function dateStr(d){return y+'-'+pad(m+1)+'-'+pad(d)}
  function dayCount(ds){return (D.checks||[]).filter(function(c){return c.date===ds}).length}
  function dayApproved(ds){return (D.checks||[]).filter(function(c){return c.date===ds&&c.status==='approved'}).length}

  // 醒目的鼓励横幅
  const todayStr0=ymd()
  function monthDays(){const days={};for(const c of (D.checks||[])){if(c.date&&c.date.indexOf(y+'-'+pad(m+1))===0){days[c.date]=1}}return Object.keys(days).length}
  const mdays=monthDays()
  const todayCnt=(D.checks||[]).filter(function(c){return c.date===todayStr0}).length
  let praiseTxt, praiseEmoji
  if(mdays>=15){praiseTxt='火焰不停，本月已坚持 '+mdays+' 天，你太棒了！';praiseEmoji='🔥'}
  else if(mdays>=7){praiseTxt='已坚持 '+mdays+' 天，积少成多，继续加油！';praiseEmoji='🌟'}
  else if(todayCnt>0){praiseTxt='今天已打卡，给自己点个赞！';praiseEmoji='✨'}
  else if(mdays>0){praiseTxt='每一步都算数，今天也来打卡吧！';praiseEmoji='💪'}
  else{praiseTxt='今天还没打卡哦，坚持就是胜利！';praiseEmoji='✨'}
  const praiseBar=h('div',{style:'margin-bottom:14px;padding:18px 20px;border-radius:12px;background:linear-gradient(135deg,#6366f1,#a855f7);box-shadow:0 6px 24px rgba(99,102,241,0.35);text-align:center'})
  praiseBar.appendChild(h('div',{style:'font-size:32px;margin-bottom:6px'},praiseEmoji))
  praiseBar.appendChild(h('div',{style:'font-size:18px;font-weight:800;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.25);line-height:1.5'},praiseTxt))
  $c.appendChild(praiseBar)

  // 头部：月份导航
  const head=h('div',{className:'card'})
  const nav=h('div',{style:'display:flex;align-items:center;justify-content:space-between'})
  nav.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){_calM--;if(_calM<0){_calM=11;_calY--}render()}},'← 上月'))
  nav.appendChild(h('div',{style:'font-size:18px;font-weight:700'},y+'年 '+(m+1)+'月'))
  nav.appendChild(h('button',{className:'btn btn-outline btn-sm',onClick:function(){_calM++;if(_calM>11){_calM=0;_calY++}render()}},'下月 →'))
  head.appendChild(nav)
  // 图例
  head.appendChild(h('div',{style:'font-size:14px;color:var(--muted);margin-top:10px;display:flex;gap:14px;flex-wrap:wrap'},'🟢 有打卡 · ⚪ 无打卡 · 数字=当天打卡次数'))
  $c.appendChild(head)

  // 日历网格
  const firstDay=new Date(y,m,1).getDay()
  const offset=(firstDay+6)%7
  const daysInMonth=new Date(y,m+1,0).getDate()
  const calCard=h('div',{className:'card'})
  const wk=['一','二','三','四','五','六','日']
  const grid=h('div',{style:'display:grid;grid-template-columns:repeat(7,1fr);gap:4px'})
  for(const w of wk){grid.appendChild(h('div',{style:'text-align:center;font-size:14px;color:var(--faint);padding:6px 0;font-weight:600'},w))}
  for(let i=0;i<offset;i++){grid.appendChild(h('div',null))}
  const todayStr=ymd()
  for(let d=1;d<=daysInMonth;d++){
    const ds=dateStr(d)
    const cnt=dayCount(ds)
    const app=dayApproved(ds)
    const isToday=ds===todayStr
    const isSel=ds===_calSel
    const cell=h('div',{style:'min-height:56px;border-radius:8px;padding:4px;cursor:pointer;border:1px solid '+(isSel?'var(--primary-border)':isToday?'var(--border-strong)':'var(--border)')+';background:'+(cnt>0?(app===cnt&&cnt>0?'var(--success-weak)':'var(--warning-weak)'):'transparent'),onClick:function(){_calSel=(_calSel===ds)?null:ds;render()}})
    cell.appendChild(h('div',{style:'font-size:14.5px;font-weight:'+(isToday?'700':'500')+';color:'+(isToday?'var(--primary)':'var(--text)')},d))
    if(cnt>0){
      cell.appendChild(h('div',{style:'text-align:center;margin-top:4px'},h('span',{style:'display:inline-block;min-width:18px;padding:1px 6px;border-radius:10px;font-size:13.5px;font-weight:700;color:#fff;background:'+(app===cnt?'var(--success)':'var(--warning)')},cnt)))
    }else{
      cell.appendChild(h('div',{style:'text-align:center;margin-top:4px;font-size:13.5px;color:var(--faint)'},'⚪'))
    }
    grid.appendChild(cell)
  }
  calCard.appendChild(grid)
  $c.appendChild(calCard)

  // 选中日期详情
  if(_calSel){
    const selChecks=(D.checks||[]).filter(function(c){return c.date===_calSel})
    const dc=h('div',{className:'card'})
    dc.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📅'}),_calSel+' 打卡详情（'+selChecks.length+'条）'))
    if(!selChecks.length){dc.appendChild(h('div',{style:'color:var(--muted);font-size:14.5px'},'这天没有打卡记录'))}
    else{
      for(const c of selChecks){
        const type=CHECK_TYPES.find(function(t){return t.id===c.type})||{name:c.typeName,icon:''}
        const st=c.status==='pending'?'⏳ 待审核':c.status==='approved'?'✅ 已通过':'↩️ 已退回'
        const sc2=c.status==='pending'?'var(--warning)':c.status==='approved'?'var(--success)':'var(--muted)'
        const row=h('div',{className:'mistake-item'})
        row.innerHTML='<div><strong>'+type.icon+' '+(c.subject?c.subject+'·':'')+type.name+'</strong> <span style="color:'+sc2+'">'+st+'</span> <span style="color:var(--muted);font-size:14px">+'+c.pts+'分</span></div>'
        const cImgs=checkImgs(c)
        if(cImgs.length){const cir=h('div',{style:'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px'});cImgs.forEach(function(b){cir.appendChild(h('img',{alt:'记录照片',loading:'lazy',src:b,style:'width:60px;height:60px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid var(--border)',onClick:function(){viewImg(b,cImgs)}}))});row.appendChild(cir)}
        dc.appendChild(row)
      }
    }
    $c.appendChild(dc)
  }
}

/* 已移除：错题本页（无入口，功能并入打卡体系）*/

function rwk(){
  $c.innerHTML=''
  const now=new Date();const day=now.getDay()||7
  const weekStart=new Date(now);weekStart.setDate(now.getDate()-day+1)
  const weekStartStr=ymd(weekStart)
  let weekChecks=0
  for(let i=0;i<7;i++){const d=new Date(weekStart);d.setDate(weekStart.getDate()+i);const ds=ymd(d);const chk=D.dailyChecks[ds];if(chk){for(const k in chk){if(chk[k])weekChecks++}}}
  const weekPoints=D.points.filter(function(p){return p.date>=weekStartStr}).reduce(function(s,p){return s+(p.type==='earn'?p.points:-p.points)},0)
  let weekMistakes=0
  for(const _c of (D.checks||[])){if(_c.date>=weekStartStr&&_c.type==='mistake'&&_c.status!=='rejected')weekMistakes++}
  const weak=[]
  const bl=D.bl||{};const bsubs=gs(D.sem)
  for(const s of bsubs){const raw=bl[s.id];if(raw!=null){const p=raw/s.full*100;if(p<60)weak.push(s.name+'('+p.toFixed(0)+'%)')}}
  const rp=h('div',{className:'card'})
  rp.appendChild(h('div',{className:'card-header'},h('span',{innerHTML:'📊'}),'学习周报'))
  rp.appendChild(h('div',{style:'font-size:14.5px;color:var(--muted);margin-bottom:12px'},'本周：'+fd(weekStartStr)+' ~ '+fd(ymd(now))))
  const _lws=new Date(weekStart);_lws.setDate(weekStart.getDate()-7)
  const _TW=weekStatsOf(weekStart)
  const _LT=weekStatsOf(_lws)
  function _cmp(a,b){if(a>b)return {t:'↑'+(a-b),c:'var(--success)'};if(a<b)return {t:'↓'+(b-a),c:'var(--danger)'};return {t:'持平',c:'var(--muted)'}}
  const items=[
    {icon:'📷',label:'拍照记录',v:_TW.checks+' 次',lv:_LT.checks+' 次',cp:_cmp(_TW.checks,_LT.checks)},
    {icon:'🔁',label:'习惯打卡',v:_TW.habits+' 次',lv:_LT.habits+' 次',cp:_cmp(_TW.habits,_LT.habits)},
    {icon:'⭐',label:'积分',v:(_TW.pts>0?'+':'')+_TW.pts,lv:(_LT.pts>0?'+':'')+_LT.pts,cp:_cmp(_TW.pts,_LT.pts)},
    {icon:'📕',label:'整理错题',v:_TW.mis+' 道',lv:_LT.mis+' 道',cp:_cmp(_TW.mis,_LT.mis)},
    {icon:'🎯',label:'薄弱科目',v:weak.length?weak.join('、'):'暂无',lv:'',cp:null}
  ]
  for(const it of items){
    const row=h('div',{style:'display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid var(--border);font-size:15px'})
    row.appendChild(h('span',{style:'flex:1'},it.icon+' '+it.label))
    if(it.lv)row.appendChild(h('span',{style:'font-size:13px;color:var(--faint)'},'上周 '+it.lv))
    if(it.cp)row.appendChild(h('span',{style:'font-size:13.5px;font-weight:700;color:'+it.cp.c+';min-width:52px;text-align:right'},it.cp.t))
    row.appendChild(h('strong',{style:'min-width:64px;text-align:right'},it.v))
    rp.appendChild(row)
  }
  rp.appendChild(h('div',{style:'font-size:13px;color:var(--muted);margin-top:6px'},'右边是本周，中间是跟上周的自己比（↑进步 ↓退步）'))
  rp.appendChild(h('div',{className:'longtext',style:'margin-top:14px;padding:12px;background:var(--primary-weak);border-radius:8px;font-size:15px;line-height:1.8',innerHTML:'💡 <strong>下周建议：</strong>'+(weak.length?'重点突破 '+weak[0]+'，每天15分钟专项练习':'保持当前节奏，巩固已学知识')}))
  rp.appendChild(h('div',{className:'daily-praise',style:'margin-top:12px'},'💬 '+encLine()))
  if(!VW){
    rp.appendChild(h('button',{className:'btn btn-outline btn-sm edit-only',style:'margin-top:12px',onClick:function(){
      let txt='【阿勒学习周报】\n'+fd(weekStartStr)+' ~ '+fd(ymd(now))+(_LT.checks!==undefined?('\n上周对比：\n拍照记录 '+(weekStartStr&&_TW.checks)+'次（上周 '+_LT.checks+'）\n习惯打卡 '+_TW.habits+'次（上周 '+_LT.habits+'）\n积分 '+_TW.pts+'（上周 '+_LT.pts+'）\n整理错题 '+_TW.mis+'道（上周 '+_LT.mis+'）'):'')+'\n薄弱科目：'+(weak.length?weak.join('、'):'暂无')+'\n下周建议：'+(weak.length?'重点突破 '+weak[0]:'保持节奏')+'\n'
      navigator.clipboard.writeText(txt).then(function(){ts('✅ 周报已复制 · '+praise('week'))}).catch(function(){ts('⚠️ 复制失败')})
    }},'📋 复制周报到家庭群'))
    rp.appendChild(h('button',{className:'btn btn-success btn-sm edit-only',style:'margin-top:12px;margin-left:8px',onClick:function(){
      exportWeekly({range:fd(weekStartStr)+' ~ '+fd(ymd(now)),items:items.map(function(x){return {label:x.label+'（上周 '+x.lv+'）',val:x.v}}),advice:(weak.length?'重点突破 '+weak[0]+'，每天15分钟专项练习':'保持当前节奏，巩固已学知识')})
    }},'🖼 存成图片发群'))
  }
  $c.appendChild(rp)
  $c.appendChild(aiCardUI('report'))
}

function sw(tab){tb=tab;document.querySelectorAll('.tab-btn').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);if(on){try{b.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}catch(e){}}});render();window.scrollTo({top:0,behavior:'smooth'})}
document.getElementById('tabNav').addEventListener('click',(e)=>{const btn=e.target.closest('.tab-btn');if(btn)sw(btn.dataset.tab)})
var _cb=document.getElementById('cloudBadge')
if(_cb){_cb.style.cursor='pointer';_cb.addEventListener('click',function(){if(_dirty||!cloudReady){syncNow()}else{ts('☁️ 数据已同步（'+fmtHM(_syncT)+'）')}})}
async function checkCloudNewer(){
  if(!cloudReady||_offline)return
  try{
    const r=await cloudRdb.from(CLOUD_TABLE).select('updated_at').eq('id',CLOUD_ID).limit(1)
    const t=(r&&r.data&&r.data[0]&&r.data[0].updated_at)?Date.parse(r.data[0].updated_at):0
    if(t&&_syncT&&t>_syncT+5000&&!_dirty&&!VW){
      const cd=await loadCloud()
      if(cd){D=normalize(cd);render();markSynced(_cloudTs||Date.now());ts('🔄 已同步其他设备的最新数据')}
    }
  }catch(e){}
}
window.addEventListener('offline',function(){_offline=true;setCloudStatus('📴 离线（已存本机）',false)})
window.addEventListener('online',function(){_offline=false;setCloudStatus('🔄 网络恢复，同步中...',true);if(_dirty){saveCloud(D)}else{checkCloudNewer()}})
window.addEventListener('beforeunload',function(e){if(_dirty){e.preventDefault();e.returnValue=''}})
document.addEventListener('visibilitychange',function(){
  if(document.visibilityState==='visible'&&Date.now()-_lastVisCheck>120000){_lastVisCheck=Date.now();checkCloudNewer()}
})
initAuth()
;(async function boot(){
  const _tip=document.createElement('div');_tip.id='bootTip';_tip.textContent='☁️ 正在同步云端数据…';document.body.appendChild(_tip)
  const ok=await initCloud()
  if(ok){
    setCloudStatus('🔄 同步中...',true)
    const cd=await loadCloud()
    if(!_cloudReadOk){
      setCloudStatus('⚠️ 云端未确认（本机数据安全）',false)
      _dirty=true;scheduleRetry()
    }else if(cd){
      const localT=parseInt(localStorage.getItem(SK+'_t')||'0',10)
      const localNewer=localT>_cloudTs+5000&&!D._slim
      if(!localNewer){
        D=normalize(cd)
        if(!D.dailyChecks[td]){const ds={};for(const it of (D.dci||defData().dci))ds[it.key]=false;D.dailyChecks[td]=ds}
        render();markSynced(_cloudTs||Date.now())
      }else{
        render();await saveCloud(D)
      }
    }else{
      await saveCloud(D)
    }
  }else{
    setCloudStatus('📴 本地模式（未连云端）',false)
  }
  const _t2=document.getElementById('bootTip');if(_t2)_t2.remove()
})()
