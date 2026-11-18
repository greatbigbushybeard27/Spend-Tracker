const CACHE='spend-tracker-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key.startsWith('spend-tracker-')&&key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'||url.pathname.endsWith('/index.html')||url.pathname.endsWith('.html')){
  event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok){const cache=await caches.open(CACHE);cache.put('./index.html',response.clone())}return response}catch(error){return (await caches.match('./index.html'))||Response.error()}})());
  return;
 }
 event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;try{const response=await fetch(event.request);if(response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}return response}catch(error){return cached||Response.error()}})());
});