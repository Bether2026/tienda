/* ═══════════════════════════════════════════════════════════
   YERBA & BARRO · TIENDA (demo)
   Script compartido por todas las páginas. Cada bloque se activa
   solo si su elemento existe. Los productos están en js/datos.js.
═══════════════════════════════════════════════════════════ */
(function(){
'use strict';
const D=window.DATOS, P=D.productos, CATS=D.cats;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const img=(id,w)=>`https://images.unsplash.com/photo-${id}?w=${w||600}&q=70&auto=format&fit=crop`;
const money=n=>'$'+Math.round(n).toLocaleString('es-AR');
const byId=id=>P.find(p=>p.id===id);
const grabable=p=>p.cat==='mates'||p.cat==='materas';
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const stars=r=>'★★★★★'.slice(0,Math.round(r))+'☆☆☆☆☆'.slice(0,5-Math.round(r));
const REDUCED=matchMedia('(prefers-reduced-motion:reduce)').matches;
const params=new URLSearchParams(location.search);
$$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());

/* ── Encabezado ─────────────────────────────────────────── */
const head=$('#head'), burger=$('#burger');
addEventListener('scroll',()=>head.classList.toggle('scrolled',scrollY>10),{passive:true});
burger.addEventListener('click',()=>{ const o=head.classList.toggle('open'); burger.setAttribute('aria-expanded',o); });

/* ── Tarjeta de producto ────────────────────────────────── */
function badge(p){
  if(p.antes) return `<span class="badge badge--off">-${Math.round((1-p.precio/p.antes)*100)}%</span>`;
  if(p.badge==='top') return '<span class="badge">Más vendido</span>';
  if(p.badge==='new') return '<span class="badge badge--new">Nuevo</span>';
  return '';
}
const card=(p,i=0)=>`<article class="card" style="animation-delay:${Math.min(i,8)*.04}s">
    <a class="card__img" href="producto.html?id=${p.id}" aria-label="Ver ${esc(p.nombre)}">
      <img src="${img(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">${badge(p)}<span class="peek">Ver producto</span></a>
    <div class="card__body">
      <small>${CATS[p.cat].nombre}</small>
      <h3><a href="producto.html?id=${p.id}">${esc(p.nombre)}</a></h3>
      <div class="price"><b>${money(p.precio)}</b>${p.antes?`<s>${money(p.antes)}</s>`:''}</div>
      <span class="cuotas">3 cuotas sin interés de ${money(p.precio/3)}</span>
      <div class="add"><button class="btn btn--green" data-add="${p.id}">Agregar al carrito</button></div>
    </div></article>`;

/* ── Carrito (se guarda en el navegador) ────────────────── */
let cart=[];
try{ cart=JSON.parse(localStorage.getItem('yb_cart')||'[]').filter(l=>byId(l.id)); }catch(e){}
const save=()=>{ try{ localStorage.setItem('yb_cart',JSON.stringify(cart)); }catch(e){} };
const lineKey=(id,gr)=>id+'|'+(gr||'');
const unit=l=>byId(l.id).precio+(l.grabado?D.grabado:0);
const subtotal=()=>cart.reduce((s,l)=>s+unit(l)*l.qty,0);
const count=()=>cart.reduce((s,l)=>s+l.qty,0);
const shipHTML=()=>{ const sub=subtotal(), falta=D.envioGratis-sub;
  return (falta>0?`Te faltan <b>${money(falta)}</b> para el <b>envío gratis</b> 🚚`:'¡Tenés <b>envío gratis</b>! 🎉')+`<div class="ship__bar"><i style="width:${Math.min(100,sub/D.envioGratis*100)}%"></i></div>`; };

function add(id,qty=1,grabado=''){
  const k=lineKey(id,grabado), ex=cart.find(l=>lineKey(l.id,l.grabado)===k);
  if(ex) ex.qty+=qty; else cart.push({id,qty,grabado});
  save(); paint();
  const n=$('#cartCount'); n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
  toast('🧉 '+byId(id).nombre+' en el carrito');
}
document.addEventListener('click',e=>{ const b=e.target.closest('[data-add]'); if(b){ e.preventDefault(); add(b.dataset.add); } });

let toastT;
function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('on'),2200); }

const drawer=$('#drawer'), overlay=$('#overlay');
function openCart(){ paint(); drawer.classList.add('on'); overlay.classList.add('on'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('lock'); }
function closeCart(){ drawer.classList.remove('on'); overlay.classList.remove('on'); drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); }
$('#cartBtn').addEventListener('click',openCart);
$('#drawerX').addEventListener('click',closeCart);
overlay.addEventListener('click',()=>{ closeCart(); closeSide(); });
addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeCart(); closeSearch(); closeSide(); } });

const lineHTML=(l,i)=>{ const p=byId(l.id); return `<div class="line">
    <img src="${img(p.foto,160)}" alt="">
    <div><b>${esc(p.nombre)}</b>${l.grabado?`<small>Grabado: ${esc(l.grabado)}</small>`:''}<small>${money(unit(l))} c/u</small>
      <div class="qty"><button data-l="${i}" data-d="-1" aria-label="Menos">−</button><span>${l.qty}</span><button data-l="${i}" data-d="1" aria-label="Más">+</button></div></div>
    <div class="line__r"><b>${money(unit(l)*l.qty)}</b><button data-rm="${i}">Quitar</button></div></div>`; };

function paint(){
  $('#cartCount').textContent=count();
  const body=$('#drawerBody'), foot=$('#drawerFoot'), ship=$('#ship');
  ship.innerHTML=cart.length?shipHTML():''; ship.hidden=!cart.length;
  if(!cart.length){
    body.innerHTML='<div class="drawer__empty"><span>🧉</span><p>Tu carrito está vacío.<br>¿Arrancamos por un mate?</p></div>';
    foot.innerHTML='<a class="btn btn--green btn--full" href="tienda.html">Ver la tienda</a>';
  } else {
    const sub=subtotal();
    body.innerHTML=cart.map(lineHTML).join('');
    foot.innerHTML=`<div class="sum"><span>Subtotal</span><b>${money(sub)}</b></div>
      <div class="sum"><span>Con transferencia</span><b>${money(sub*(1-D.offTransfer))}</b></div>
      <a class="btn btn--clay btn--full" href="checkout.html">Finalizar compra</a>`;
  }
  if(typeof paintCheckout==='function') paintCheckout();
}
document.addEventListener('click',e=>{
  const q=e.target.closest('[data-d]'), r=e.target.closest('[data-rm]');
  if(q){ const l=cart[+q.dataset.l]; l.qty+= +q.dataset.d; if(l.qty<1) cart.splice(+q.dataset.l,1); save(); paint(); }
  if(r){ cart.splice(+r.dataset.rm,1); save(); paint(); }
});

/* ── Buscador instantáneo ───────────────────────────────── */
const sbox=$('#sbox'), sIn=$('#sIn'), sRes=$('#sRes');
let sSel=-1;
function openSearch(){ sbox.classList.add('on'); sbox.setAttribute('aria-hidden','false'); document.body.classList.add('lock'); setTimeout(()=>sIn.focus(),60); runSearch(); }
function closeSearch(){ if(!sbox.classList.contains('on')) return; sbox.classList.remove('on'); sbox.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); }
const norm=t=>t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function runSearch(){
  const q=norm(sIn.value.trim()); sSel=-1;
  if(!q){ sRes.innerHTML=`<div class="sbox__hint">Probá con:<br>${['imperial','yerba','termo','cerámica','matera'].map(w=>`<button data-q="${w}">${w}</button>`).join('')}</div>`; return; }
  const hits=P.filter(p=>norm(p.nombre+' '+CATS[p.cat].nombre+' '+p.desc).includes(q)).slice(0,6);
  const hl=t=>{ const n=norm(t), i=n.indexOf(q); return i<0?esc(t):esc(t.slice(0,i))+'<mark>'+esc(t.slice(i,i+q.length))+'</mark>'+esc(t.slice(i+q.length)); };
  sRes.innerHTML=hits.length?hits.map(p=>`<a href="producto.html?id=${p.id}"><img src="${img(p.foto,120)}" alt=""><div><b>${hl(p.nombre)}</b><small>${CATS[p.cat].nombre}</small></div><span class="pr">${money(p.precio)}</span></a>`).join('')
    +`<a class="sbox__all" href="tienda.html?q=${encodeURIComponent(sIn.value.trim())}">Ver todos los resultados →</a>`
    :`<div class="sbox__hint">No encontramos "${esc(sIn.value.trim())}". Probá con otra palabra.</div>`;
}
$('#searchBtn').addEventListener('click',openSearch);
sbox.addEventListener('click',e=>{ if(e.target===sbox) closeSearch(); const b=e.target.closest('[data-q]'); if(b){ sIn.value=b.dataset.q; runSearch(); sIn.focus(); } });
sIn.addEventListener('input',runSearch);
sIn.addEventListener('keydown',e=>{
  const links=[...sRes.querySelectorAll('a')];
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){ e.preventDefault(); if(!links.length) return; sSel=(sSel+(e.key==='ArrowDown'?1:-1)+links.length)%links.length; links.forEach((a,i)=>a.classList.toggle('on',i===sSel)); }
  if(e.key==='Enter'){ e.preventDefault(); if(sSel>=0&&links[sSel]) location.href=links[sSel].href; else if(sIn.value.trim()) location.href='tienda.html?q='+encodeURIComponent(sIn.value.trim()); }
});
addEventListener('keydown',e=>{ if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName)){ e.preventDefault(); openSearch(); } });

/* ── Inicio ─────────────────────────────────────────────── */
const heroCard=$('#heroCard');
if(heroCard){ const s=P[0]; heroCard.innerHTML=`<a href="producto.html?id=${s.id}"><img src="${img(s.foto,200)}" alt=""></a><div><b>${s.nombre}</b><span>${money(s.precio)}</span></div><button data-add="${s.id}" aria-label="Agregar ${s.nombre}">+</button>`; }
const catsEl=$('#cats');
if(catsEl) catsEl.innerHTML=Object.entries(CATS).map(([k,c])=>`<a href="tienda.html?cat=${k}" class="cat rv">
    <img src="${img(c.foto,700)}" alt="${c.nombre}" loading="lazy"><div><b>${c.nombre}</b><small>${P.filter(p=>p.cat===k).length} productos</small></div><span class="go">→</span></a>`).join('');
const rail=$('#rail');
if(rail){
  const best=[...P].sort((a,b)=>(b.badge==='top')-(a.badge==='top')||b.opiniones-a.opiniones).slice(0,8);
  rail.innerHTML=best.map(card).join('');
  const prev=$('#railPrev'), next=$('#railNext');
  const step=()=>rail.querySelector('.card').offsetWidth+22;
  const upd=()=>{ prev.disabled=rail.scrollLeft<10; next.disabled=rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-10; };
  prev.onclick=()=>rail.scrollBy({left:-step()*2}); next.onclick=()=>rail.scrollBy({left:step()*2});
  rail.addEventListener('scroll',upd,{passive:true}); upd();
}

/* ── Tienda: filtros ────────────────────────────────────── */
const grid=$('#shopGrid');
const side=$('#side');
function closeSide(){ if(side&&side.classList.contains('on')){ side.classList.remove('on'); overlay.classList.remove('on'); document.body.classList.remove('lock'); } }
if(grid){
  const max=Math.ceil(Math.max(...P.map(p=>p.precio))/1000)*1000;
  const st={cat:params.get('cat')||'todos',q:params.get('q')||'',max,ofertas:false,grab:false,sort:'dest'};
  const rng=$('#fMax'); rng.max=max; rng.value=max; rng.min=5000; rng.step=1000;
  $('#q').value=st.q;
  $('#sideCats').innerHTML=[['todos','Todo',P.length],...Object.entries(CATS).map(([k,c])=>[k,c.nombre,P.filter(p=>p.cat===k).length])]
    .map(([k,v,n])=>`<button data-cat="${k}">${v}<small>${n}</small></button>`).join('');
  function render(){
    const q=norm(st.q);
    let list=P.filter(p=>(st.cat==='todos'||p.cat===st.cat)&&p.precio<=st.max&&(!st.ofertas||p.antes)&&(!st.grab||grabable(p))&&(!q||norm(p.nombre+' '+p.desc).includes(q)));
    if(st.sort==='asc') list=[...list].sort((a,b)=>a.precio-b.precio);
    if(st.sort==='desc') list=[...list].sort((a,b)=>b.precio-a.precio);
    if(st.sort==='rate') list=[...list].sort((a,b)=>b.rating-a.rating);
    grid.innerHTML=list.map(card).join('');
    $('#resN').textContent=list.length;
    $('#empty').hidden=list.length>0;
    $('#fMaxOut').textContent='Hasta '+money(st.max);
    $$('#sideCats button').forEach(b=>b.classList.toggle('on',b.dataset.cat===st.cat));
    $('#ptitle').innerHTML=st.cat==='todos'?'La <em>tienda</em>':`<em>${CATS[st.cat].nombre}</em>`;
    $('#crumbCat').textContent=st.cat==='todos'?'Tienda':CATS[st.cat].nombre;
    const u=new URLSearchParams(); if(st.cat!=='todos') u.set('cat',st.cat); if(st.q) u.set('q',st.q);
    history.replaceState(null,'',location.pathname+(u.toString()?'?'+u:''));
  }
  $('#sideCats').addEventListener('click',e=>{ const b=e.target.closest('button'); if(b){ st.cat=b.dataset.cat; render(); } });
  rng.addEventListener('input',()=>{ st.max=+rng.value; render(); });
  $('#fOff').addEventListener('change',e=>{ st.ofertas=e.target.checked; render(); });
  $('#fGrab').addEventListener('change',e=>{ st.grab=e.target.checked; render(); });
  $('#q').addEventListener('input',e=>{ st.q=e.target.value.trim(); render(); });
  $('#sort').addEventListener('change',e=>{ st.sort=e.target.value; render(); });
  $('#fClear').addEventListener('click',()=>{ Object.assign(st,{cat:'todos',q:'',max,ofertas:false,grab:false}); rng.value=max; $('#q').value=''; $('#fOff').checked=false; $('#fGrab').checked=false; render(); });
  $('#filterBtn').addEventListener('click',()=>{ side.classList.add('on'); overlay.classList.add('on'); document.body.classList.add('lock'); });
  $('#sideX').addEventListener('click',closeSide);
  $('#sideApply').addEventListener('click',closeSide);
  if(!CATS[st.cat]) st.cat='todos';
  render();
}

/* ── Página de producto ─────────────────────────────────── */
const pdp=$('#pdp');
if(pdp){
  const p=byId(params.get('id'))||P[0], c=CATS[p.cat];
  document.title=p.nombre+' — Yerba & Barro';
  $('#crumbP').innerHTML=`<a href="index.html">Inicio</a><span>/</span><a href="tienda.html">Tienda</a><span>/</span><a href="tienda.html?cat=${p.cat}">${c.nombre}</a><span>/</span><span>${esc(p.nombre)}</span>`;
  /* Galería: la foto del producto con tres encuadres + una foto de ambiente */
  const views=[{src:img(p.foto,1100),pos:'50% 50%'},{src:img(p.foto,1100),pos:'30% 35%',zoom:1.6},{src:img(p.foto,1100),pos:'70% 70%',zoom:1.6},{src:img(c.ambiente,1100),pos:'50% 50%'}];
  let qty=1;
  pdp.innerHTML=`<div class="pgal">
      <div class="pgal__thumbs">${views.map((v,i)=>`<button${i?'':' class="on"'} aria-label="Ver imagen ${i+1}"><img src="${v.src.replace('w=1100','w=200')}" alt="" style="object-position:${v.pos};${v.zoom?`transform:scale(${v.zoom})`:''}"></button>`).join('')}</div>
      <div class="pgal__main" id="pMain"><img src="${views[0].src}" alt="${esc(p.nombre)}">${badge(p)}<span class="pgal__hint">🔍 Pasá el mouse para ampliar</span></div>
    </div>
    <div class="pinfo">
      <small class="pcat">${c.nombre}</small>
      <h1>${esc(p.nombre)}</h1>
      <div class="rating"><span class="stars">${stars(p.rating)}</span><b>${String(p.rating).replace('.',',')}</b> · ${p.opiniones} opiniones</div>
      <div class="price"><b>${money(p.precio)}</b>${p.antes?`<s>${money(p.antes)}</s>`:''}</div>
      <span class="cuotas">3 cuotas sin interés de ${money(p.precio/3)}</span><br>
      <span class="transfer">🏦 ${money(p.precio*(1-D.offTransfer))} pagando por transferencia</span>
      ${p.stock&&p.stock<=4?`<div class="stock"><i></i>¡Quedan solo ${p.stock} unidades!</div>`:''}
      <p class="lead">${esc(p.desc)}</p>
      ${grabable(p)?`<div class="engrave"><label><input type="checkbox" id="grOn"> Grabar iniciales (+${money(D.grabado)})</label><input type="text" id="grTxt" maxlength="4" placeholder="Ej: MJ" hidden></div>`:''}
      <div class="buy--big"><div class="qty"><button data-q="-1" aria-label="Menos">−</button><span id="pQty">1</span><button data-q="1" aria-label="Más">+</button></div>
        <button class="btn btn--clay" id="pAdd">Agregar al carrito · <span id="pTot">${money(p.precio)}</span></button></div>
      <button class="btn btn--green buy-now" id="pNow">Comprar ahora</button>
      <div class="mini-perks"><div><b>🚚</b>Envío gratis desde ${money(D.envioGratis)}</div><div><b>🔁</b>Cambios hasta 30 días</div><div><b>🔒</b>Compra protegida</div></div>
      <div class="tabs">
        <div class="tabs__nav" role="tablist"><button class="on" data-t="0">Descripción</button><button data-t="1">Cuidados</button><button data-t="2">Envíos y cambios</button></div>
        <div class="tabs__pane on"><p>${esc(p.desc)}</p><ul>${p.det.map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>
        <div class="tabs__pane"><ul>${D.cuidados[p.cat].map(d=>`<li>${esc(d)}</li>`).join('')}</ul></div>
        <div class="tabs__pane"><ul><li>Envíos a todo el país en 2 a 5 días hábiles.</li><li>Envío gratis en compras desde ${money(D.envioGratis)}.</li><li>Podés retirar sin cargo por nuestro taller en Lanús.</li><li>Cambios dentro de los 30 días (los productos grabados no tienen cambio).</li></ul></div>
      </div>
    </div>`;
  const main=$('#pMain'), mImg=main.querySelector('img'), th=[...pdp.querySelectorAll('.pgal__thumbs button')];
  let view=views[0];
  th.forEach((b,i)=>b.addEventListener('click',()=>{ view=views[i]; th.forEach(x=>x.classList.toggle('on',x===b)); mImg.style.opacity=0; setTimeout(()=>{ mImg.src=view.src; mImg.style.objectPosition=view.pos; mImg.style.transform=view.zoom?`scale(${view.zoom})`:''; mImg.style.opacity=1; },180); }));
  if(matchMedia('(hover:hover)').matches){
    main.addEventListener('mousemove',e=>{ const r=main.getBoundingClientRect(); main.classList.add('zoom'); mImg.style.transformOrigin=`${(e.clientX-r.left)/r.width*100}% ${(e.clientY-r.top)/r.height*100}%`; mImg.style.transform='scale(1.9)'; });
    main.addEventListener('mouseleave',()=>{ main.classList.remove('zoom'); mImg.style.transform=view.zoom?`scale(${view.zoom})`:''; mImg.style.transformOrigin=''; });
  } else main.querySelector('.pgal__hint').remove();
  const gOn=$('#grOn'), gTx=$('#grTxt');
  const upd=()=>{ $('#pQty').textContent=qty; $('#pTot').textContent=money((p.precio+(gOn&&gOn.checked?D.grabado:0))*qty); };
  if(gOn) gOn.addEventListener('change',()=>{ gTx.hidden=!gOn.checked; if(gOn.checked) gTx.focus(); upd(); });
  pdp.querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>{ qty=Math.max(1,Math.min(20,qty+ +b.dataset.q)); upd(); }));
  const addIt=()=>add(p.id,qty,gOn&&gOn.checked?(gTx.value.trim().toUpperCase()||'—'):'');
  $('#pAdd').addEventListener('click',addIt);
  $('#pNow').addEventListener('click',()=>{ addIt(); location.href='checkout.html'; });
  pdp.querySelector('.tabs__nav').addEventListener('click',e=>{ const b=e.target.closest('button'); if(!b) return; const t=+b.dataset.t;
    pdp.querySelectorAll('.tabs__nav button').forEach((x,i)=>x.classList.toggle('on',i===t)); pdp.querySelectorAll('.tabs__pane').forEach((x,i)=>x.classList.toggle('on',i===t)); });
  /* Relacionados y barra fija de compra en celular */
  const rel=P.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(P.filter(x=>x.cat!==p.cat)).slice(0,4);
  $('#related').innerHTML=rel.map(card).join('');
  const sb=$('#stickyBuy');
  sb.innerHTML=`<div><b>${money(p.precio)}</b><small>${esc(p.nombre)}</small></div><button class="btn btn--clay" id="sbAdd">Agregar</button>`;
  $('#sbAdd').addEventListener('click',addIt);
  new IntersectionObserver(([e])=>sb.classList.toggle('on',!e.isIntersecting&&e.boundingClientRect.top<0)).observe($('#pAdd'));
}

/* ── Checkout ───────────────────────────────────────────── */
let paintCheckout=null;
const chk=$('#checkout');
if(chk){
  const form=$('#coForm');
  const totals=()=>{ const d=new FormData(form), en=d.get('entrega'), pg=d.get('pago'), sub=subtotal();
    const off=pg==='Transferencia'?sub*D.offTransfer:0, envio=en==='Envío a domicilio'&&sub<D.envioGratis?D.costoEnvio:0;
    return {sub,off,envio,total:sub-off+envio,en,pg}; };
  paintCheckout=function(){
    const empty=!cart.length;
    $('#coEmpty').hidden=!empty||$('#coDone').dataset.on==='1'; $('#coMain').hidden=empty;
    if(empty) return;
    const t=totals();
    $('#dirWrap').hidden=t.en!=='Envío a domicilio';
    $('#dirWrap').querySelectorAll('input').forEach(i=>i.required=!$('#dirWrap').hidden);
    $('#shipCost').textContent=subtotal()>=D.envioGratis?'Gratis':money(D.costoEnvio);
    $('#osumLines').innerHTML=cart.map((l,i)=>{ const p=byId(l.id); return `<div class="line"><img src="${img(p.foto,160)}" alt=""><div><b>${esc(p.nombre)}</b>${l.grabado?`<small>Grabado: ${esc(l.grabado)}</small>`:''}<small>Cantidad: ${l.qty}</small></div><div class="line__r"><b>${money(unit(l)*l.qty)}</b></div></div>`; }).join('');
    $('#osumShip').innerHTML=shipHTML();
    $('#osumTot').innerHTML=`<div class="sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>
      ${t.off?`<div class="sum sum--off"><span>Descuento transferencia (10%)</span><span>−${money(t.off)}</span></div>`:''}
      <div class="sum"><span>Envío</span><span>${t.envio?money(t.envio):'Gratis'}</span></div>
      <div class="sum sum--total"><span>Total</span><span>${money(t.total)}</span></div>`;
  };
  form.addEventListener('change',paintCheckout);
  $('#editCart').addEventListener('click',openCart);
  $('#coSend').addEventListener('click',()=>{
    if(!form.reportValidity()) return;
    const d=new FormData(form), t=totals(), num='YB-'+String(Date.now()).slice(-5);
    let m=`[Demo tienda] ¡Hola Yerba & Barro! Quiero hacer este pedido (${num}):\n\n`;
    cart.forEach(l=>{ const p=byId(l.id); m+=`• ${l.qty} × ${p.nombre}${l.grabado?' (grabado: '+l.grabado+')':''} — ${money(unit(l)*l.qty)}\n`; });
    m+=`\nSubtotal: ${money(t.sub)}`+(t.off?`\nDescuento transferencia: −${money(t.off)}`:'')+`\nEnvío: ${t.envio?money(t.envio):'Gratis'}\n*Total: ${money(t.total)}*\n\n`;
    m+=`Nombre: ${d.get('nombre')}\nTeléfono: ${d.get('tel')}`+(d.get('email')?`\nEmail: ${d.get('email')}`:'')+`\nEntrega: ${t.en}`+(t.en==='Envío a domicilio'?`\nDirección: ${d.get('dir')}, ${d.get('loc')} (CP ${d.get('cp')})`:'')+`\nPago: ${t.pg}`+(d.get('nota')?`\nNota: ${d.get('nota')}`:'');
    open('https://wa.me/'+D.whatsapp+'?text='+encodeURIComponent(m),'_blank','noopener');
    $('#doneNum').textContent='Pedido '+num+' · '+money(t.total);
    cart=[]; save(); $('#coDone').dataset.on='1'; $('#coDone').hidden=false; $('#coMain').hidden=true; $('#coSteps').querySelectorAll('span').forEach(s=>{ s.classList.remove('on'); s.classList.add('done'); }); paint();
    scrollTo({top:0,behavior:REDUCED?'auto':'smooth'});
  });
}

paint();

/* ── Aparición al hacer scroll ──────────────────────────── */
const io=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }),{threshold:.12});
$$('.rv').forEach(el=>io.observe(el));

})();
