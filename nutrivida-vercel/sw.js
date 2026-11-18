// Cambia el número de versión cada vez que subas cambios a internet
const V='nutrivida-v6';
const BASE=['./','index.html','css/estilos.css','js/datos.js','js/extras.js','js/valoracion.js','js/seguimiento.js','manifest.json','img/logo.png','img/hero.jpg'].concat(['quinua','canahua','amaranto','papa','maiz','haba','frutas','verduras','tarwi'].map(n=>'img/'+n+'.jpg')).concat(['fonts/Fraunces.ttf','fonts/Figtree.ttf']);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.allSettled(BASE.map(u=>c.add(u)))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{const c=n.clone();caches.open(V).then(x=>x.put(e.request,c));return n}).catch(()=>caches.match('index.html'))))});
