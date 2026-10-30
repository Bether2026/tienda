/* ═══════════════════════════════════════════════════════════
   YERBA & BARRO · TIENDA (demo)
   Catálogo, filtros, vista rápida, carrito persistente y pedido
   por WhatsApp. Para sumar un producto, agregalo a PRODUCTOS.
═══════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* Configuración */
const WHATSAPP='5491145309135';          // destino del pedido (Bether Studio, es una demo)
const ENVIO_GRATIS=60000, COSTO_ENVIO=6500, OFF_TRANSFER=.10, GRABADO=3500;

const CATS={ mates:'Mates', yerbas:'Yerbas', termos:'Termos', materas:'Materas' };
const CAT_FOTO={ mates:'1784475844948-e9abada34215', yerbas:'1675001077188-809370ce3279', termos:'1486381950565-e3ada9f1a370', materas:'1691480150204-66dd1eb77391' };

/* badge: 'top' (más vendido), 'new' o un % de descuento si tiene 'antes' */
const PRODUCTOS=[
  { id:'m01', cat:'mates', nombre:'Mate imperial cincelado', precio:38900, foto:'1784475844948-e9abada34215', badge:'top',
    desc:'Calabaza seleccionada con virola de alpaca cincelada a mano. Un clásico que dura toda la vida.', det:['Calabaza natural','Virola de alpaca','Curado incluido'] },
  { id:'m02', cat:'mates', nombre:'Mate imperial guarda pampa', precio:42500, foto:'1784475845364-f9cbad75ffd8',
    desc:'Forrado en cuero con guarda pampa tejida. Para regalar (o regalarte).', det:['Forro de cuero','Guarda tejida','Curado incluido'] },
  { id:'m03', cat:'mates', nombre:'Mate imperial de alpaca', precio:56000, foto:'1784475845427-81d1967770b9', badge:'new',
    desc:'Nuestro mate más trabajado: base y virola de alpaca con detalles en relieve.', det:['Alpaca completa','Pieza única','Curado incluido'] },
  { id:'m04', cat:'mates', nombre:'Mate copa de alpaca', precio:34900, foto:'1784475844777-dc04755b82a3',
    desc:'Elegante y liviano, con pie de copa. Ideal para la oficina.', det:['Alpaca','Apto lavavajillas: no','Curado incluido'] },
  { id:'m05', cat:'mates', nombre:'Mate de calabaza clásico', precio:14900, antes:17500, foto:'1609541994821-d909982e2f1b',
    desc:'El de toda la vida: calabaza curada y lista para usar.', det:['Calabaza natural','Tamaño mediano','Curado incluido'] },
  { id:'m06', cat:'mates', nombre:'Mate de cerámica terracota', precio:12500, foto:'1610098969315-cb01f18fbe87',
    desc:'Torneado a mano por ceramistas de Lanús. No necesita curado.', det:['Cerámica esmaltada','Sin curado','Hecho a mano'] },
  { id:'m07', cat:'mates', nombre:'Mate de cerámica crema', precio:11900, foto:'1585744259332-111384f5def9',
    desc:'Suave al tacto y fácil de lavar. Perfecto para empezar a matear.', det:['Cerámica esmaltada','Sin curado','Hecho a mano'] },
  { id:'m08', cat:'mates', nombre:'Mate de madera de algarrobo', precio:9800, foto:'1646233487430-cb90b0d61bf2',
    desc:'Madera de algarrobo del norte, con el sabor que solo da la madera.', det:['Algarrobo','Curado incluido','Hecho a mano'] },
  { id:'y01', cat:'yerbas', nombre:'Yerba orgánica 1 kg', precio:7900, foto:'1675001077188-809370ce3279', badge:'top',
    desc:'Suave, con palo y estacionada 18 meses. Certificada orgánica.', det:['1 kg','Con palo','Orgánica'] },
  { id:'y02', cat:'yerbas', nombre:'Yerba barbacuá 500 g', precio:5600, foto:'1559749619-5f290507d5e6',
    desc:'Secada al humo de leña: intensa, ahumada y con mucho cuerpo.', det:['500 g','Ahumada','Molienda gruesa'] },
  { id:'y03', cat:'yerbas', nombre:'Lata yerbera + yerba', precio:13900, foto:'1646233534579-163423f39c88', badge:'new',
    desc:'Lata de acero con 500 g de nuestra yerba orgánica. Para tenerla siempre fresca.', det:['Lata de acero','500 g de yerba','Cierre hermético'] },
  { id:'t01', cat:'termos', nombre:'Termo de acero 1 L', precio:39900, foto:'1486381950565-e3ada9f1a370', badge:'top',
    desc:'Mantiene el agua caliente 24 horas. Pico cebador de precisión.', det:['1 litro','24 h caliente','Pico cebador'] },
  { id:'t02', cat:'termos', nombre:'Termo negro mate 1,2 L', precio:36500, antes:41000, foto:'1609975031156-a626cd7001ef',
    desc:'Acero inoxidable con terminación mate antideslizante.', det:['1,2 litros','Doble pared','Pico cebador'] },
  { id:'b01', cat:'materas', nombre:'Matera de cuero', precio:64900, foto:'1691480150204-66dd1eb77391',
    desc:'Cuero vacuno curtido al vegetal, con lugar para termo, mate y yerbera.', det:['Cuero vacuno','Correa regulable','Grabado disponible'] },
  { id:'b02', cat:'materas', nombre:'Mochila matera', precio:72000, foto:'1622560480605-d83c853bc5c3', badge:'new',
    desc:'Para matear en la ruta: compartimento térmico y bolsillo para notebook.', det:['Cuero y lona','Compartimento térmico','Grabado disponible'] }
];

const $=s=>document.querySelector(s);
const img=(id,w)=>`https://images.unsplash.com/photo-${id}?w=${w||600}&q=70&auto=format&fit=crop`;
const $$=n=>'$'+Math.round(n).toLocaleString('es-AR');
const byId=id=>PRODUCTOS.find(p=>p.id===id);
const grabable=p=>p.cat==='mates'||p.cat==='materas';
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ── Encabezado ── */
const head=$('#head'), burger=$('#burger');
addEventListener('scroll',()=>head.classList.toggle('scrolled',scrollY>10),{passive:true});
burger.addEventListener('click',()=>{ const o=head.classList.toggle('open'); burger.setAttribute('aria-expanded',o); });

/* ── Catálogo ── */
let cat='todos', q='', sort='dest';
const chips=$('#chips');
chips.innerHTML=[['todos','Todo',PRODUCTOS.length],...Object.entries(CATS).map(([k,v])=>[k,v,PRODUCTOS.filter(p=>p.cat===k).length])]
  .map(([k,v,n])=>`<button data-cat="${k}"${k==='todos'?' class="on"':''}>${v}<small>${n}</small></button>`).join('');
$('#cats').innerHTML=Object.entries(CATS).map(([k,v])=>`<a href="#tienda" class="cat rv" data-go="${k}">
    <img src="${img(CAT_FOTO[k],700)}" alt="${v}" loading="lazy"><div><b>${v}</b><small>${PRODUCTOS.filter(p=>p.cat===k).length} productos</small></div><span class="go">→</span></a>`).join('');

function badge(p){
  if(p.antes) return `<span class="badge badge--off">-${Math.round((1-p.precio/p.antes)*100)}%</span>`;
  if(p.badge==='top') return '<span class="badge">Más vendido</span>';
  if(p.badge==='new') return '<span class="badge badge--new">Nuevo</span>';
  return '';
}
function render(){
  let list=PRODUCTOS.filter(p=>(cat==='todos'||p.cat===cat)&&(!q||(p.nombre+' '+p.desc).toLowerCase().includes(q)));
  if(sort==='asc') list=[...list].sort((a,b)=>a.precio-b.precio);
  if(sort==='desc') list=[...list].sort((a,b)=>b.precio-a.precio);
  $('#grid').innerHTML=list.map((p,i)=>`<article class="card" style="animation-delay:${Math.min(i,8)*.04}s">
      <div class="card__img" data-qv="${p.id}" role="button" tabindex="0" aria-label="Ver ${esc(p.nombre)}">
        <img src="${img(p.foto)}" alt="${esc(p.nombre)}" loading="lazy">${badge(p)}<span class="peek">Vista rápida</span></div>
      <div class="card__body">
        <small>${CATS[p.cat]}</small>
        <h3>${esc(p.nombre)}</h3>
        <div class="price"><b>${$$(p.precio)}</b>${p.antes?`<s>${$$(p.antes)}</s>`:''}</div>
        <span class="cuotas">3 cuotas sin interés de ${$$(p.precio/3)}</span>
        <div class="add"><button class="btn btn--green" data-add="${p.id}">Agregar al carrito</button></div>
      </div></article>`).join('');
  $('#empty').hidden=list.length>0;
}
function setCat(c){ cat=c; chips.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.cat===c)); render(); }
chips.addEventListener('click',e=>{ const b=e.target.closest('button'); if(b) setCat(b.dataset.cat); });
document.addEventListener('click',e=>{ const g=e.target.closest('[data-go]'); if(g){ setCat(g.dataset.go); head.classList.remove('open'); } });
$('#q').addEventListener('input',e=>{ q=e.target.value.trim().toLowerCase(); render(); });
$('#sort').addEventListener('change',e=>{ sort=e.target.value; render(); });
render();

/* Producto destacado del hero */
const star=PRODUCTOS[0];
$('#heroCard').innerHTML=`<img src="${img(star.foto,200)}" alt=""><div><b>${star.nombre}</b><span>${$$(star.precio)}</span></div><button data-add="${star.id}" aria-label="Agregar ${star.nombre}">+</button>`;

/* ── Carrito (se guarda en el navegador) ── */
let cart=[];
try{ cart=JSON.parse(localStorage.getItem('yb_cart')||'[]').filter(l=>byId(l.id)); }catch(e){}
const save=()=>{ try{ localStorage.setItem('yb_cart',JSON.stringify(cart)); }catch(e){} };
const lineKey=(id,gr)=>id+'|'+(gr||'');
const unit=l=>byId(l.id).precio+(l.grabado?GRABADO:0);
const subtotal=()=>cart.reduce((s,l)=>s+unit(l)*l.qty,0);
const count=()=>cart.reduce((s,l)=>s+l.qty,0);

function add(id,qty=1,grabado=''){
  const k=lineKey(id,grabado), ex=cart.find(l=>lineKey(l.id,l.grabado)===k);
  if(ex) ex.qty+=qty; else cart.push({id,qty,grabado});
  save(); paint();
  const n=$('#cartCount'); n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
  toast('🧉 '+byId(id).nombre+' en el carrito');
}
document.addEventListener('click',e=>{ const b=e.target.closest('[data-add]'); if(b) add(b.dataset.add); });

let toastT;
function toast(t){ const el=$('#toast'); el.textContent=t; el.classList.add('on'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('on'),2200); }

/* ── Vista rápida ── */
const qv=$('#qv');
function openQV(id){
  const p=byId(id); let qty=1;
  $('#qvBody').innerHTML=`<div class="qv__grid">
      <img class="qv__img" src="${img(p.foto,900)}" alt="${esc(p.nombre)}">
      <div class="qv__info">
        <small>${CATS[p.cat]}</small>
        <h3>${esc(p.nombre)}</h3>
        <div class="price"><b>${$$(p.precio)}</b>${p.antes?`<s>${$$(p.antes)}</s>`:''}</div>
        <span class="cuotas">3 cuotas sin interés de ${$$(p.precio/3)} · ${$$(p.precio*(1-OFF_TRANSFER))} con transferencia</span>
        <p>${esc(p.desc)}</p>
        <ul class="qv__list">${p.det.map(d=>`<li>${esc(d)}</li>`).join('')}</ul>
        ${grabable(p)?`<div class="engrave"><label><input type="checkbox" id="grOn"> Grabar iniciales (+${$$(GRABADO)})</label><input type="text" id="grTxt" maxlength="4" placeholder="Ej: MJ" hidden></div>`:''}
        <div class="buy"><div class="qty"><button data-q="-1" aria-label="Menos">−</button><span id="qvQty">1</span><button data-q="1" aria-label="Más">+</button></div>
          <button class="btn btn--clay" id="qvAdd">Agregar · <span id="qvTot">${$$(p.precio)}</span></button></div>
      </div></div>`;
  const gOn=$('#grOn'), gTx=$('#grTxt');
  const upd=()=>{ $('#qvQty').textContent=qty; $('#qvTot').textContent=$$((p.precio+(gOn&&gOn.checked?GRABADO:0))*qty); };
  if(gOn) gOn.addEventListener('change',()=>{ gTx.hidden=!gOn.checked; if(gOn.checked) gTx.focus(); upd(); });
  $('#qvBody').querySelectorAll('[data-q]').forEach(b=>b.addEventListener('click',()=>{ qty=Math.max(1,Math.min(20,qty+ +b.dataset.q)); upd(); }));
  $('#qvAdd').addEventListener('click',()=>{
    const gr=gOn&&gOn.checked?(gTx.value.trim().toUpperCase()||'—'):'';
    add(p.id,qty,gr); qv.close();
  });
  qv.showModal();
}
document.addEventListener('click',e=>{ const t=e.target.closest('[data-qv]'); if(t) openQV(t.dataset.qv); });
document.addEventListener('keydown',e=>{ const t=e.target.closest&&e.target.closest('[data-qv]'); if(t&&(e.key==='Enter'||e.key===' ')){ e.preventDefault(); openQV(t.dataset.qv); } });
qv.addEventListener('click',e=>{ if(e.target===qv||e.target.closest('[data-close]')) qv.close(); });

/* ── Panel del carrito y checkout ── */
const drawer=$('#drawer'), overlay=$('#overlay');
let step='cart';
function openCart(){ step='cart'; paint(); drawer.classList.add('on'); overlay.classList.add('on'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('lock'); }
function closeCart(){ drawer.classList.remove('on'); overlay.classList.remove('on'); drawer.setAttribute('aria-hidden','true'); document.body.classList.remove('lock'); }
$('#cartBtn').addEventListener('click',openCart);
$('#drawerX').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);
addEventListener('keydown',e=>{ if(e.key==='Escape'&&drawer.classList.contains('on')) closeCart(); });

function totals(entrega,pago){
  const sub=subtotal(), off=pago==='Transferencia'?sub*OFF_TRANSFER:0;
  const envio=entrega==='Envío a domicilio'&&sub<ENVIO_GRATIS?COSTO_ENVIO:0;
  return {sub,off,envio,total:sub-off+envio};
}
function paint(){
  $('#cartCount').textContent=count();
  const sub=subtotal(), falta=ENVIO_GRATIS-sub;
  $('#ship').innerHTML=cart.length?(falta>0?`Te faltan <b>${$$(falta)}</b> para el <b>envío gratis</b> 🚚`:'¡Tenés <b>envío gratis</b>! 🎉')+`<div class="ship__bar"><i style="width:${Math.min(100,sub/ENVIO_GRATIS*100)}%"></i></div>`:'';
  $('#ship').hidden=!cart.length||step!=='cart';
  const body=$('#drawerBody'), foot=$('#drawerFoot');
  if(!cart.length){
    $('#drawerTitle').textContent='Tu carrito';
    body.innerHTML='<div class="drawer__empty"><span>🧉</span><p>Tu carrito está vacío.<br>¿Arrancamos por un mate?</p></div>';
    foot.innerHTML='<button class="btn btn--green btn--full" id="goShop">Ver la tienda</button>';
    $('#goShop').onclick=()=>{ closeCart(); location.hash='tienda'; };
    return;
  }
  if(step==='cart'){
    $('#drawerTitle').textContent='Tu carrito';
    body.innerHTML=cart.map((l,i)=>{ const p=byId(l.id); return `<div class="line">
        <img src="${img(p.foto,160)}" alt="">
        <div><b>${esc(p.nombre)}</b>${l.grabado?`<small>Grabado: ${esc(l.grabado)}</small>`:''}<small>${$$(unit(l))} c/u</small>
          <div class="qty"><button data-l="${i}" data-d="-1" aria-label="Menos">−</button><span>${l.qty}</span><button data-l="${i}" data-d="1" aria-label="Más">+</button></div></div>
        <div class="line__r"><b>${$$(unit(l)*l.qty)}</b><button data-rm="${i}">Quitar</button></div></div>`; }).join('');
    foot.innerHTML=`<div class="sum"><span>Subtotal</span><b>${$$(sub)}</b></div>
      <div class="sum"><span>Con transferencia</span><b>${$$(sub*(1-OFF_TRANSFER))}</b></div>
      <button class="btn btn--clay btn--full" id="goCo">Finalizar compra</button>`;
    $('#goCo').onclick=()=>{ step='co'; paint(); };
  } else {
    $('#drawerTitle').innerHTML='<button class="back" id="back">← Volver</button>';
    $('#back').onclick=()=>{ step='cart'; paint(); };
    body.innerHTML=`<form class="co" id="co">
        <label>Nombre y apellido<input name="nombre" required autocomplete="name"></label>
        <label>Teléfono<input name="tel" required inputmode="tel" autocomplete="tel"></label>
        <fieldset><legend>Entrega</legend>
          <label class="opt"><input type="radio" name="entrega" value="Envío a domicilio" checked> Envío a domicilio<small>${sub>=ENVIO_GRATIS?'Gratis':$$(COSTO_ENVIO)}</small></label>
          <label class="opt"><input type="radio" name="entrega" value="Retiro por el taller"> Retiro por el taller (Lanús)<small>Gratis</small></label>
        </fieldset>
        <label id="dirWrap">Dirección, localidad y código postal<textarea name="dir" rows="2" required></textarea></label>
        <fieldset><legend>Pago</legend>
          <label class="opt"><input type="radio" name="pago" value="Transferencia" checked> Transferencia<small>10% off</small></label>
          <label class="opt"><input type="radio" name="pago" value="Mercado Pago"> Mercado Pago · 3 cuotas</label>
          <label class="opt"><input type="radio" name="pago" value="Efectivo al retirar"> Efectivo al retirar</label>
        </fieldset>
      </form>`;
    const co=$('#co');
    const refresh=()=>{
      const d=new FormData(co), en=d.get('entrega'), pg=d.get('pago');
      const dir=$('#dirWrap'); dir.hidden=en!=='Envío a domicilio'; dir.querySelector('textarea').required=!dir.hidden;
      const t=totals(en,pg);
      foot.innerHTML=`<div class="sum"><span>Subtotal</span><span>${$$(t.sub)}</span></div>
        ${t.off?`<div class="sum sum--off"><span>Descuento transferencia</span><span>−${$$(t.off)}</span></div>`:''}
        <div class="sum"><span>Envío</span><span>${t.envio?$$(t.envio):'Gratis'}</span></div>
        <div class="sum sum--total"><span>Total</span><span>${$$(t.total)}</span></div>
        <button class="btn btn--wa btn--full" id="send" type="button">Enviar pedido por WhatsApp</button>`;
      $('#send').onclick=send;
    };
    co.addEventListener('change',refresh); refresh();
    function send(){
      if(!co.reportValidity()) return;
      const d=new FormData(co), en=d.get('entrega'), pg=d.get('pago'), t=totals(en,pg);
      let m='[Demo tienda] ¡Hola Yerba & Barro! Quiero hacer este pedido:\n\n';
      cart.forEach(l=>{ const p=byId(l.id); m+=`• ${l.qty} × ${p.nombre}${l.grabado?' (grabado: '+l.grabado+')':''} — ${$$(unit(l)*l.qty)}\n`; });
      m+=`\nSubtotal: ${$$(t.sub)}`+(t.off?`\nDescuento transferencia: −${$$(t.off)}`:'')+`\nEnvío: ${t.envio?$$(t.envio):'Gratis'}\n*Total: ${$$(t.total)}*\n\n`;
      m+=`Nombre: ${d.get('nombre')}\nTeléfono: ${d.get('tel')}\nEntrega: ${en}`+(en==='Envío a domicilio'?`\nDirección: ${d.get('dir')}`:'')+`\nPago: ${pg}`;
      open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(m),'_blank','noopener');
    }
  }
}
$('#drawerBody').addEventListener('click',e=>{
  const q=e.target.closest('[data-d]'), r=e.target.closest('[data-rm]');
  if(q){ const l=cart[+q.dataset.l]; l.qty+= +q.dataset.d; if(l.qty<1) cart.splice(+q.dataset.l,1); save(); paint(); }
  if(r){ cart.splice(+r.dataset.rm,1); save(); paint(); }
});
paint();

/* ── Aparición al hacer scroll ── */
const io=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } }),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

})();
