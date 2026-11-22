const enc=new TextEncoder(),dec=new TextDecoder(),$=s=>document.querySelector(s);
const esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const H=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(t.trim())))].map(x=>x.toString(16).padStart(2,'0')).join('');
const gen=()=>{const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';return [...crypto.getRandomValues(new Uint32Array(10))].map(v=>c[v%c.length]).join('')};
const b64=u=>btoa(String.fromCharCode(...u)),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function dk(pw,salt){const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:200000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
async function seal(o,pw){const s=crypto.getRandomValues(new Uint8Array(16)),i=crypto.getRandomValues(new Uint8Array(12));const c=await crypto.subtle.encrypt({name:'AES-GCM',iv:i},await dk(pw,s),enc.encode(JSON.stringify(o)));return{s:b64(s),i:b64(i),c:b64(new Uint8Array(c))}}
async function unseal(v,pw){return JSON.parse(dec.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(v.i)},await dk(pw,ub(v.s)),ub(v.c))))}
async function loadData(){const r=await fetch('data.json?t='+Date.now());return r.json()}
const uid=()=>'p'+Math.random().toString(36).slice(2,8);
const norm=s=>s.trim().replace(/\s+/g,' ').toLowerCase();
function pageHTML(D,p){const kids=D.pages.filter(x=>x.parent===p.id);return `<div class="card"><h2>${esc(p.title)}</h2><div>${p.html}</div></div>`+(kids.length?`<div class="card"><b>صفحات فرعية</b><div class="row" style="margin-top:8px">${kids.map(k=>`<button class="g" data-k="p:${k.id}">${esc(k.title)}</button>`).join('')}</div></div>`:'')}
