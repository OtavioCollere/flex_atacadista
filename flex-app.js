/* Flex Atacadista — app (hash router + render) */
(function(){
const F=window.FLEX,$=s=>document.querySelector(s),brl=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const state={cart:0,items:[],q:'',sort:'relev',filters:{sub:new Set(),brand:new Set(),stock:false,pmin:'',pmax:''},tab:'best'};
const ACESS=F.findSub('acessorios-para-balao');
const catPath=sub=>`/${sub.cat.dept.slug}/${sub.cat.slug}/${sub.slug}/`;
const IMG={festas:'assets/flex/balao-latex.webp',confeitaria:'assets/flex/forma-bolo.webp',embalagens:'assets/flex/pote-embalagem.webp',papelaria:'assets/flex/caderno.jpeg',decoracao:'assets/flex/pote-embalagem.webp'};
const SUBIMG={varetas:'assets/flex/vareta-balao.jpeg','suportes-e-bases':'assets/flex/vareta-balao.jpeg','balao-bubble':'assets/flex/balao-latex.webp','balao-latex':'assets/flex/balao-latex.webp','balao-latex-coracao':'assets/flex/balao-latex.webp','balao-metalizado':'assets/flex/balao-latex.webp','balao-metalizado-numero':'assets/flex/balao-latex.webp','acessorios-para-balao':'assets/flex/vareta-balao.jpeg',formas:'assets/flex/forma-bolo.webp','cake-board':'assets/flex/forma-bolo.webp','papel-cartao':'assets/flex/caderno.jpeg',tags:'assets/flex/caderno.jpeg',adesivos:'assets/flex/caderno.jpeg'};
const pimg=p=>SUBIMG[p.sub]||(p.sub.includes('balao')||p.sub==='confetes'||p.sub==='gliter'||p.sub==='led'?'assets/flex/balao-latex.webp':'assets/flex/vareta-balao.jpeg');
const simg=(s,d)=>SUBIMG[s.slug]||(s.cat&&s.cat.dept?IMG[s.cat.dept.slug]:null)||(d?IMG[d.slug]:null)||'assets/flex/balao-latex.webp';
const ICON={search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-9.3-9.4C1.4 8 3.6 4.5 7.2 4.5c2 0 3.5 1.2 4.8 2.8 1.3-1.6 2.8-2.8 4.8-2.8 3.6 0 5.8 3.5 4.5 7.1C19.5 16.4 12 21 12 21z"/></svg>',cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.5L21.5 8H6"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="18" height="18"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',box:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8l9-4 9 4-9 4-9-4zM3 8v8l9 4 9-4V8M12 12v8"/></svg>',shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 5h16v11H9l-5 4z"/></svg>',filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>'};

/* ---------- shell ---------- */
function shell(){
$('#app').innerHTML=`
<div class="topbar"><div class="wrap"><div class="l"><span>Atacado para revendedores, decoradores e confeiteiros</span><a href="#/">Compra mínima R$ 300</a></div><div class="l" style="display:flex"><a href="#/">Atendimento (41) 99992-2958</a><a href="#/">Meus pedidos</a><a href="#/">Retire em Curitiba</a></div></div></div>
<header class="hdr"><div class="wrap">
 <a class="logo" href="#/" aria-label="Flex Atacadista"><img src="assets/flex/flex-logo.png" alt="Flex Atacadista"></a>
 <form class="search" id="sform" role="search"><label class="sr" for="q">Buscar</label><input id="q" type="search" placeholder="Busque por produto, marca ou código" autocomplete="off"><button type="submit" aria-label="Buscar">${ICON.search}</button><div class="sugg" id="sugg"></div></form>
 <div class="acts"><button class="act">${ICON.user}<span><small>Bem-vindo</small><b>Entrar ou cadastrar</b></span></button><button class="act"><span class="bdg">${ICON.heart}<i>0</i></span></button><button class="act" id="cartBtn"><span class="bdg">${ICON.cart}<i id="cartN">0</i></span><span><small>Carrinho</small><b id="cartT">R$ 0,00</b></span></button></div>
</div></header>
<nav class="dnav" aria-label="Departamentos"><div class="wrap">
 <button class="dbtn" id="megaBtn" aria-expanded="false">${ICON.menu} Todos os departamentos</button>
 ${F.D.map(d=>`<a class="lk" href="#/d/${d.slug}" data-d="${d.slug}">${d.name}</a>`).join('')}
 <a class="lk" href="#/ofertas" style="color:var(--red)">Ofertas</a>
 <span class="sp"></span><span class="ship">${ICON.truck.replace('<svg','<svg width="20" height="20"')} <b>Frete grátis</b> acima de R$ 1.200 no Sul</span>
 <div class="mega" id="mega"></div>
</div></nav>
<div class="scrim" id="scrim"></div>
<main id="main"></main>
<footer class="foot"><div class="wrap">
 <div><img src="assets/flex/flex-logo.png" alt="" style="height:44px"><p>Atacado de artigos para festas, confeitaria e embalagens. Mais de 4.000 itens com entrega para todo o Brasil e retirada em Curitiba.</p></div>
 <div><h4>Departamentos</h4><ul>${F.D.map(d=>`<li><a href="#/d/${d.slug}">${d.name}</a></li>`).join('')}</ul></div>
 <div><h4>Ajuda</h4><ul><li><a href="#/">Como comprar no atacado</a></li><li><a href="#/">Prazos e frete</a></li><li><a href="#/">Trocas e devoluções</a></li><li><a href="#/">Fale conosco</a></li></ul></div>
 <div><h4>Institucional</h4><ul><li><a href="#/">Sobre a Flex</a></li><li><a href="#/">Loja física</a></li><li><a href="#/">Política de privacidade</a></li></ul></div>
</div><div class="legal"><span>Flex Atacadista © 2026 · CNPJ 00.000.000/0001-00 · Curitiba, PR</span><details><summary>Dados estruturados desta página (JSON-LD)</summary><pre id="ld"></pre></details></div></footer>
<div class="toast" id="toast"></div>
<aside class="drawer" id="drawer" aria-label="Filtros"></aside>
<aside class="cart" id="cart" aria-label="Carrinho" aria-hidden="true"><div class="ch"><h3>Carrinho <span id="cartCount"></span></h3><button class="x" id="cartX" aria-label="Fechar">×</button></div><div class="cmin" id="cmin"></div><div class="citems" id="citems"></div><div class="cfoot" id="cfoot"></div></aside>`;
buildMega();bindShell();}

function buildMega(){const m=$('#mega');let cur=0;
const draw=()=>{const d=F.D[cur];m.innerHTML=`<div class="wrap"><div class="depts">${F.D.map((x,i)=>`<button class="${i===cur?'on':''}" data-i="${i}">${x.name}<small>${x.count}</small></button>`).join('')}</div><div class="cats">${d.cats.map(c=>`<div class="cat"><h4><a href="#/d/${d.slug}">${c.name}</a><span>${c.count}</span></h4><ul>${c.subs.map(s=>`<li><a href="#/c/${s.slug}">${s.name}<span>${s.count}</span></a></li>`).join('')}</ul></div>`).join('')}<div class="allc"><span>${d.desc}</span><a href="#/d/${d.slug}">Ver tudo em ${d.name} →</a></div></div></div>`;
m.querySelectorAll('.depts button').forEach(b=>{b.onmouseenter=b.onclick=()=>{cur=+b.dataset.i;draw();};});};
draw();}
function toggleMega(o){const m=$('#mega'),on=o??!m.classList.contains('open');m.classList.toggle('open',on);$('#scrim').classList.toggle('open',on);$('#megaBtn').setAttribute('aria-expanded',on);}
function bindShell(){
$('#megaBtn').onclick=()=>toggleMega();$('#scrim').onclick=()=>{toggleMega(false);openDrawer(false);openCart(false);};
$('#cartBtn').onclick=()=>openCart(true);$('#cartX').onclick=()=>openCart(false);
$('#cart').addEventListener('click',e=>{const b=e.target.closest('[data-cq]');if(b){const it=state.items.find(x=>x.sku===b.dataset.cq);it.n+=+b.dataset.d;if(it.n<=0)state.items=state.items.filter(x=>x!==it);renderCart();}const r=e.target.closest('[data-crm]');if(r){state.items=state.items.filter(x=>x.sku!==r.dataset.crm);renderCart();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){openCart(false);openDrawer(false);toggleMega(false);}});
$('#mega').addEventListener('click',e=>{if(e.target.closest('a'))toggleMega(false);});
const q=$('#q'),sg=$('#sugg');
q.oninput=()=>{const v=q.value.trim().toLowerCase();if(v.length<2){sg.classList.remove('open');return;}
 const subs=[];F.D.forEach(d=>d.cats.forEach(c=>c.subs.forEach(s=>{if(s.name.toLowerCase().includes(v))subs.push(s);})));
 const ps=F.P.filter(p=>(p.name+' '+p.brand+' '+p.sku).toLowerCase().includes(v)).slice(0,4);
 sg.innerHTML=(subs.length?`<div class="lab">Categorias</div>${subs.slice(0,3).map(s=>`<a href="#/c/${s.slug}">${s.name}<span>${s.count} produtos</span></a>`).join('')}`:'')+(ps.length?`<div class="lab">Produtos</div>${ps.map(p=>`<a href="#/p/${p.sku}">${p.name}<span>${brl(p.price)}</span></a>`).join('')}`:'')+`<a href="#/busca?q=${encodeURIComponent(q.value)}" style="color:var(--red);font-weight:600">Ver todos os resultados para “${esc(q.value)}”</a>`;sg.classList.add('open');};
q.onblur=()=>setTimeout(()=>sg.classList.remove('open'),150);
$('#sform').onsubmit=e=>{e.preventDefault();location.hash='#/busca?q='+encodeURIComponent(q.value);sg.classList.remove('open');};
document.body.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a)addToCart(a);const qb=e.target.closest('.qty button');if(qb){const i=qb.parentElement.querySelector('input');i.value=Math.max(1,(+i.value||1)+(+qb.dataset.d));}});}
const MIN=300;
function addToCart(btn){const p=F.P.find(x=>x.sku===btn.dataset.add);const i=btn.closest('.buy,.row')?.querySelector('input');const n=i?+i.value||1:1;const it=state.items.find(x=>x.sku===p.sku);if(it)it.n+=n;else state.items.push({sku:p.sku,n});renderCart();btn.classList.add('ok');btn.innerHTML='✓ Adicionado';setTimeout(()=>{btn.classList.remove('ok');btn.innerHTML='Adicionar';},1400);toast(`<b>${n}× ${p.unit.toLowerCase()}</b> ${esc(p.name)} no carrinho <u>Ver carrinho</u>`);$('#toast').onclick=()=>openCart(true);}
function tierPrice(p,n){return n>=10?p.price*0.9:n>=5?p.price*0.95:p.price;}
function renderCart(){const rows=state.items.map(it=>({...it,p:F.P.find(x=>x.sku===it.sku)}));const count=rows.reduce((a,r)=>a+r.n,0);const sub=rows.reduce((a,r)=>a+r.n*tierPrice(r.p,r.n),0);const full=rows.reduce((a,r)=>a+r.n*r.p.price,0);const saved=full-sub;state.cart=count;state.total=sub;
$('#cartN').textContent=count;$('#cartT').textContent=brl(sub);$('#cartCount').textContent=count?`· ${count} ${count===1?'item':'itens'}`:'';
const falta=Math.max(0,MIN-sub),pct=Math.min(100,sub/MIN*100);
$('#cmin').innerHTML=rows.length?`<div class="bar"><i style="width:${pct}%"></i></div><p>${falta>0?`Faltam <b>${brl(falta)}</b> para o pedido mínimo de ${brl(MIN)}`:'<b>Pedido mínimo atingido.</b> Frete grátis acima de R$ 1.200 no Sul.'}</p>`:'';
$('#citems').innerHTML=rows.length?rows.map(r=>`<div class="ci"><a href="#/p/${r.p.sku}" class="cimg"><img src="${pimg(r.p)}" alt=""></a><div class="cbd"><span class="brand">${r.p.brand}</span><a href="#/p/${r.p.sku}" class="cname">${esc(r.p.name)}</a><div class="cmeta">${r.p.total} un por ${r.p.unit.toLowerCase()} · ${brl(tierPrice(r.p,r.n))}/${r.p.unit.toLowerCase()}${r.n>=5?` <em>−${r.n>=10?10:5}%</em>`:''}</div><div class="crow"><span class="qty"><button data-cq="${r.sku}" data-d="-1" aria-label="Menos">−</button><input value="${r.n}" readonly aria-label="Quantidade"><button data-cq="${r.sku}" data-d="1" aria-label="Mais">+</button></span><b class="num">${brl(r.n*tierPrice(r.p,r.n))}</b></div></div><button class="crm" data-crm="${r.sku}" aria-label="Remover">×</button></div>`).join(''):`<div class="cempty"><p>Seu carrinho está vazio.</p><a class="btn p" href="#/c/acessorios-para-balao" id="cgo">Ver produtos</a></div>`;
$('#cfoot').innerHTML=rows.length?`<div class="ln"><span>Subtotal</span><b class="num">${brl(full)}</b></div>${saved>0?`<div class="ln ok"><span>Desconto por volume</span><b class="num">−${brl(saved)}</b></div>`:''}<div class="ln"><span>Frete</span><span>calculado no checkout</span></div><div class="ln tot"><span>Total</span><b class="num">${brl(sub)}</b></div><small>ou ${brl(sub*0.97)} no Pix (−3%) · até 6× de ${brl(sub*1.08/6)} no cartão</small><a class="btn p" href="#/carrinho" id="cgoto">${falta>0?'Ver carrinho':'Finalizar pedido'}</a><button class="btn s" id="ccont">Continuar comprando</button>`:'';
const gt=$('#cgoto');if(gt)gt.onclick=()=>openCart(false);const c=$('#ccont');if(c)c.onclick=()=>openCart(false);const g=$('#cgo');if(g)g.onclick=()=>openCart(false);}
function openCart(o){$('#cart').classList.toggle('open',o);$('#cart').setAttribute('aria-hidden',!o);$('#scrim').classList.toggle('open',o);if(o)renderCart();}
let tt;function toast(h){const t=$('#toast');t.innerHTML=h;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200);}
function setLD(o){$('#ld').textContent=JSON.stringify(o,null,1);let s=document.getElementById('ldjson');if(!s){s=document.createElement('script');s.id='ldjson';s.type='application/ld+json';document.head.appendChild(s);}s.textContent=JSON.stringify(o);}
const ORG={'@type':'Organization',name:'Flex Atacadista',url:'https://flexatacadista.com.br/',logo:'https://flexatacadista.com.br/logo.png',telephone:'+55-41-99992-2958',address:{'@type':'PostalAddress',addressLocality:'Curitiba',addressRegion:'PR',addressCountry:'BR'}};
const bcLD=items=>({'@type':'BreadcrumbList',itemListElement:items.map((it,i)=>({'@type':'ListItem',position:i+1,name:it[0],item:'https://flexatacadista.com.br'+it[1]}))});

/* ---------- components ---------- */
function card(p,small){const out=p.stock===0,low=p.stock>0&&p.stock<10;
return `<article class="card"><div class="img"><a href="#/p/${p.sku}" class="pic" aria-label="${esc(p.name)}"><img src="${pimg(p)}" alt="" loading="lazy"></a>${p.tag==='best'?'<span class="tag">Mais vendido</span>':p.tag==='new'?'<span class="tag new">Novo</span>':p.tag==='off'?`<span class="tag off">-${Math.round((1-p.price/p.old)*100)}%</span>`:''}</div>
<div class="bd"><span class="brand">${p.brand}</span><h3 class="name"><a href="#/p/${p.sku}">${p.name}</a></h3>
<div class="pack">${p.pct>1?`<span>${p.pct} pct × ${p.un} un</span><i>·</i>`:''}<span>${p.total} un por ${p.unit.toLowerCase()}</span></div>
<div class="price">${p.old?`<div style="font-size:12.5px;color:var(--g5);text-decoration:line-through" class="num">${brl(p.old)}</div>`:''}<div class="v num">${brl(p.price)}<small>/ ${p.unit.toLowerCase()}</small></div><div class="un num"><b>${brl(p.unitPrice)}</b> por unidade · à vista no Pix</div></div>
<div class="stock ${low?'low':''}" ${out?'style="color:var(--g5)"':''}>${out?'Sob encomenda · 7 dias':low?`Últimas ${p.stock} ${p.unit.toLowerCase()}s`:'Pronta entrega'}</div>
${small?'':`<div class="buy"><span class="qty"><button data-d="-1" aria-label="Menos">−</button><input type="number" value="1" min="1" aria-label="Quantidade"><button data-d="1" aria-label="Mais">+</button></span><button class="add" data-add="${p.sku}">Adicionar</button></div>`}</div></article>`;}
const bc=items=>`<nav class="bc" aria-label="Você está aqui">${items.map((it,i)=>i<items.length-1?`<a href="${it[2]||'#/'}">${it[0]}</a><i>/</i>`:`<b>${it[0]}</b>`).join('')}</nav>`;
const faq=list=>`<div class="faq">${list.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;
const strip=()=>`<div class="strip"><div class="wrap"><div>${ICON.truck}<span><b>Entrega para todo o Brasil</b><span>Frete grátis acima de R$ 1.200 no Sul</span></span></div><div>${ICON.box}<span><b>Preço de atacado por caixa</b><span>Compra mínima de R$ 300</span></span></div><div>${ICON.shield}<span><b>Pagamento seguro</b><span>Pix, boleto e cartão em até 6×</span></span></div><div>${ICON.chat}<span><b>Atendimento no WhatsApp</b><span>Seg. a sex., 8h às 18h</span></span></div></div></div>`;

/* ---------- pages ---------- */
function home(){document.title='Flex Atacadista — Artigos para festas, confeitaria e embalagens no atacado';
const rail=id=>({best:F.HOME_BEST,new:F.HOME_NEW,off:F.HOME_OFF}[id]);
$('#main').innerHTML=`<section class="hero"><div class="wrap"><div><h1>Tudo para festas, confeitaria e embalagens <em>em preço de atacado.</em></h1><p>Mais de 4.000 itens em caixa fechada ou pacote para revendedores, decoradores e confeiteiros. Compra mínima de R$ 300, entrega para todo o Brasil.</p><div class="ctas"><a class="btn p" href="#/d/festas">Ver departamentos</a><a class="btn s" href="#/c/acessorios-para-balao">Acessórios para balão</a></div><div class="trust"><div><b>4.000+</b>produtos em estoque</div><div><b>R$ 300</b>pedido mínimo</div><div><b>24h</b>para faturar</div><div><b>Curitiba</b>retire na loja</div></div></div><div class="vis"><div class="hg"><img src="assets/flex/balao-latex.webp" alt=""><img src="assets/flex/forma-bolo.webp" alt=""><img src="assets/flex/pote-embalagem.webp" alt=""><img src="assets/flex/caderno.jpeg" alt=""></div></div></div></section>

<section class="sec"><div class="wrap"><div class="sec-h"><div><h2>Compre por departamento</h2><p>Cada departamento abre em categorias e subcategorias — você encontra o item sem percorrer centenas de links.</p></div></div><div class="dept-grid">${F.D.map(d=>`<a class="dcard" href="#/d/${d.slug}"><div class="ph"><img src="${IMG[d.slug]}" alt="" loading="lazy"></div><b>${d.name}</b><span>${d.count.toLocaleString('pt-BR')} produtos</span><small>${d.cats.map(c=>c.name).join(' · ')}</small></a>`).join('')}</div></div></section>
<section class="sec" style="padding-top:0"><div class="wrap"><div class="sec-h"><h2>Produtos em destaque</h2><a href="#/c/acessorios-para-balao">Ver acessórios para balão →</a></div><div class="tabs">${[['best','Mais vendidos'],['new','Novidades'],['off','Ofertas']].map(([k,l])=>`<button class="${state.tab===k?'on':''}" data-tab="${k}">${l}</button>`).join('')}</div><div class="grid" id="railGrid">${rail(state.tab).map(p=>card(p)).join('')}</div></div></section>
<section class="sec" style="background:var(--g1)"><div class="wrap"><div class="sec-h"><div><h2>Guias para comprar melhor</h2><p>Respostas para as dúvidas mais comuns de quem monta festa e revende.</p></div><a href="#/">Todos os guias →</a></div><div class="guides">${F.GUIDES.map(([k,t,d])=>`<article class="guide"><span class="k">${k}</span><h3>${t}</h3><p>${d}</p><a href="#/">Ler guia →</a></article>`).join('')}</div></div></section>`;
$('#main').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;$('#main').querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x===b));$('#railGrid').innerHTML=rail(state.tab).map(p=>card(p)).join('');});
setLD({'@context':'https://schema.org','@graph':[ORG,{'@type':'WebSite',url:'https://flexatacadista.com.br/',potentialAction:{'@type':'SearchAction',target:'https://flexatacadista.com.br/busca?q={q}','query-input':'required name=q'}}]});}

function dept(slug){const d=F.D.find(x=>x.slug===slug)||F.D[0];document.title=`${d.name} no atacado — Flex Atacadista`;
$('#main').innerHTML=`<div class="wrap">${bc([['Home','',''],[d.name]])}<div class="chead" style="padding-bottom:20px"><div><h1>${d.name}</h1><p class="desc">${d.desc}</p><div class="meta"><span><b>${d.count.toLocaleString('pt-BR')}</b> produtos</span><span><b>${d.cats.length}</b> categorias</span></div></div></div>
${d.cats.map(c=>`<section class="sec" style="padding:10px 0 34px"><div class="sec-h"><h2 style="font-size:22px">${c.name} <span style="color:var(--g5);font-weight:400;font-size:15px">${c.count} produtos</span></h2></div><div class="subs">${c.subs.map(s=>`<a class="tile" href="#/c/${s.slug}"><div class="ph"><img src="${simg(s,d)}" alt="" loading="lazy"></div><b>${s.name}</b><span>${s.count} produtos</span></a>`).join('')}</div></section>`).join('')}</div>`;
setLD({'@context':'https://schema.org','@graph':[bcLD([['Home','/'],[d.name,`/${d.slug}/`]]),{'@type':'CollectionPage',name:d.name,description:d.desc}]});}

function category(slug){const sub=F.findSub(slug)||ACESS;const isA=sub===ACESS;document.title=`${sub.name} no atacado — ${sub.cat.dept.name} | Flex Atacadista`;
const desc=isA?'Encontre varetas, suportes, bombas, LEDs e adesivos para montagem de balões em festas, eventos e decoração. Vendemos em caixa fechada e pacote, com preço por unidade sempre visível.':`Tudo em ${sub.name.toLowerCase()} para revenda e decoração, em caixa fechada e pacote.`;
$('#main').innerHTML=`<div class="wrap">${bc([['Home','','#/'],[sub.cat.dept.name,'',`#/d/${sub.cat.dept.slug}`],[sub.cat.name,'',`#/d/${sub.cat.dept.slug}`],[sub.name]])}
<header class="chead"><div><h1>${sub.name}</h1><p class="desc">${desc}</p><div class="meta"><span><b>${sub.count}</b> produtos</span><span><b>${isA?F.ACESS_SUBS.length:6}</b> subcategorias</span><span><b>${F.BRANDS.length}</b> marcas</span><span>Pronta entrega em Curitiba</span></div></div><div class="bnr"><img src="${simg(sub,sub.cat.dept)}" alt=""></div></header>
${isA?`<h2 class="sr">Subcategorias de ${sub.name}</h2><div class="subs" id="subTiles">${F.ACESS_SUBS.map(s=>`<a class="tile" href="#/c/${sub.slug}?sub=${s.slug}" data-sub="${s.slug}"><div class="ph"><img src="${simg(s,sub.cat.dept)}" alt="" loading="lazy"></div><b>${s.name}</b><span>${s.count} produtos</span></a>`).join('')}</div>`:''}
<div class="list"><aside class="filters" id="filters"></aside><section><div class="tools"><span class="cnt" id="cnt"></span><div style="display:flex;gap:10px"><button class="fbtn" id="fbtn">${ICON.filter} Filtrar</button><label class="sort">Ordenar <select id="sort"><option value="relev">Relevância</option><option value="best">Mais vendidos</option><option value="pasc">Menor preço</option><option value="pdesc">Maior preço</option><option value="unit">Menor preço por unidade</option><option value="new">Lançamentos</option></select></label></div></div><div class="chips" id="chips"></div><div class="grid" id="grid"></div><div class="pager"><button class="on">1</button><button>2</button><button>3</button><button>…</button><button>8</button><button>Próxima →</button></div></section></div>
<section class="sec" style="border-top:1px solid var(--g2)"><div class="sec-h"><div><h2>Dúvidas frequentes sobre ${sub.name.toLowerCase()}</h2><p>Perguntas reais de clientes, respondidas pela nossa equipe.</p></div></div>${faq(F.FAQ_ACESS)}</section>
<section class="sec seo-txt" style="padding-top:0"><h2>Como escolher acessórios para balão</h2><p>A vareta define a altura e a firmeza do balão em centros de mesa; suportes e bases sustentam arcos e colunas; bombas manuais servem para volumes pequenos e infladores elétricos para eventos. LEDs e adesivos são acabamento e funcionam melhor em balões bubble e metalizados.</p><p>Para revenda, o preço por unidade é o que importa: a caixa fechada de varetas sai até 60% mais barata que o pacote. Veja também <a href="#/c/balao-latex" style="color:var(--red)">Balão Látex</a> e <a href="#/c/balao-metalizado" style="color:var(--red)">Balão Metalizado</a>.</p></section></div>`;
const params=new URLSearchParams((location.hash.split('?')[1])||'');state.filters={sub:new Set(params.get('sub')?[params.get('sub')]:[]),brand:new Set(),stock:false,pmin:'',pmax:''};state.sort='relev';
renderFilters();renderGrid(sub);
$('#sort').onchange=e=>{state.sort=e.target.value;renderGrid(sub);};$('#fbtn').onclick=()=>openDrawer(true);
setLD({'@context':'https://schema.org','@graph':[bcLD([['Home','/'],[sub.cat.dept.name,`/${sub.cat.dept.slug}/`],[sub.cat.name,`/${sub.cat.dept.slug}/${sub.cat.slug}/`],[sub.name,catPath(sub)]]),{'@type':'CollectionPage',name:sub.name,description:desc,url:'https://flexatacadista.com.br'+catPath(sub),mainEntity:{'@type':'ItemList',numberOfItems:sub.count,itemListElement:F.P.slice(0,4).map((p,i)=>({'@type':'ListItem',position:i+1,url:`https://flexatacadista.com.br/p/${p.sku.toLowerCase()}/`}))}},{'@type':'FAQPage',mainEntity:F.FAQ_ACESS.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}]});}

function filtersHTML(){const f=state.filters;return `<div class="fgrp"><h4>Subcategoria</h4>${F.ACESS_SUBS.map(s=>`<label><input type="checkbox" data-f="sub" value="${s.slug}" ${f.sub.has(s.slug)?'checked':''}>${s.name}<span>${s.count}</span></label>`).join('')}</div>
<div class="fgrp"><h4>Marca</h4>${F.BRANDS.map(b=>`<label><input type="checkbox" data-f="brand" value="${b}" ${f.brand.has(b)?'checked':''}>${b}<span>${F.P.filter(p=>p.brand===b).length}</span></label>`).join('')}</div>
<div class="fgrp"><h4>Preço</h4><div class="range"><input type="number" placeholder="Mín" data-f="pmin" value="${f.pmin}"><span>–</span><input type="number" placeholder="Máx" data-f="pmax" value="${f.pmax}"></div></div>
<div class="fgrp"><h4>Disponibilidade</h4><label><input type="checkbox" data-f="stock" ${f.stock?'checked':''}>Somente pronta entrega</label></div>
<div class="fgrp"><h4>Venda por</h4><label><input type="checkbox" data-f="unit" value="Caixa">Caixa fechada</label><label><input type="checkbox" data-f="unit" value="Pacote">Pacote</label><label><input type="checkbox" data-f="unit" value="Unidade">Unidade</label></div>
<button class="fclr" data-clear>Limpar filtros</button>`;}
function renderFilters(){const h=filtersHTML();$('#filters').innerHTML=h;$('#drawer').innerHTML=`<div class="dh"><h3>Filtrar</h3><button class="x" aria-label="Fechar">×</button></div>${h}`;
document.querySelectorAll('#filters,#drawer').forEach(root=>{root.querySelectorAll('[data-f]').forEach(i=>i.onchange=()=>{const k=i.dataset.f;if(k==='sub'||k==='brand')i.checked?state.filters[k].add(i.value):state.filters[k].delete(i.value);else if(k==='stock')state.filters.stock=i.checked;else if(k==='unit'){state.filters.unit=state.filters.unit||new Set();i.checked?state.filters.unit.add(i.value):state.filters.unit.delete(i.value);}else state.filters[k]=i.value;renderFilters();renderGrid(ACESS);});root.querySelector('[data-clear]').onclick=()=>{state.filters={sub:new Set(),brand:new Set(),stock:false,pmin:'',pmax:''};renderFilters();renderGrid(ACESS);};});
$('#drawer .x').onclick=()=>openDrawer(false);}
function openDrawer(o){$('#drawer').classList.toggle('open',o);$('#scrim').classList.toggle('open',o);}
function renderGrid(sub){const f=state.filters;let ps=F.P.filter(p=>(!f.sub.size||f.sub.has(p.sub))&&(!f.brand.size||f.brand.has(p.brand))&&(!f.stock||p.stock>0)&&(!f.unit||!f.unit.size||f.unit.has(p.unit))&&(f.pmin===''||p.price>=+f.pmin)&&(f.pmax===''||p.price<=+f.pmax));
const S={best:(a,b)=>(b.tag==='best')-(a.tag==='best'),pasc:(a,b)=>a.price-b.price,pdesc:(a,b)=>b.price-a.price,unit:(a,b)=>a.unitPrice-b.unitPrice,new:(a,b)=>(b.tag==='new')-(a.tag==='new')};if(S[state.sort])ps=[...ps].sort(S[state.sort]);
const active=f.sub.size||f.brand.size||f.stock||(f.unit&&f.unit.size)||f.pmin!==''||f.pmax!=='';const total=active?ps.length:sub.count;
$('#cnt').innerHTML=`Mostrando <b>1–${ps.length}</b> de <b>${total}</b> produtos`;
$('#chips').innerHTML=[...f.sub].map(s=>`<button class="chip" data-c="sub" data-v="${s}">${F.ACESS_SUBS.find(x=>x.slug===s)?.name||s} ×</button>`).join('')+[...f.brand].map(b=>`<button class="chip" data-c="brand" data-v="${b}">${b} ×</button>`).join('')+(f.stock?'<button class="chip" data-c="stock">Pronta entrega ×</button>':'');
$('#chips').querySelectorAll('.chip').forEach(c=>c.onclick=()=>{if(c.dataset.c==='stock')f.stock=false;else f[c.dataset.c].delete(c.dataset.v);renderFilters();renderGrid(sub);});
$('#grid').innerHTML=ps.length?ps.map(p=>card(p)).join(''):`<div class="empty" style="grid-column:1/-1"><h3>Nenhum produto com esses filtros</h3><p>Tente remover um filtro ou ver todas as subcategorias.</p></div>`;
document.querySelectorAll('#subTiles .tile').forEach(t=>t.classList.toggle('on',f.sub.has(t.dataset.sub)));}

function product(sku){const p=F.P.find(x=>x.sku===sku)||F.P[0];document.title=`${p.name} – ${p.brand} | Flex Atacadista`;const sname=F.ACESS_SUBS.find(s=>s.slug===p.sub)?.name||'';const rel=F.P.filter(x=>x.sub===p.sub&&x!==p).slice(0,5);
$('#main').innerHTML=`<div class="wrap">${bc([['Home','','#/'],['Festas','','#/d/festas'],['Balões','','#/d/festas'],['Acessórios para Balão','','#/c/acessorios-para-balao'],[sname,'',`#/c/acessorios-para-balao?sub=${p.sub}`],[p.name]])}
<div class="pdp"><div class="gal"><div class="th"><div class="on"><img src="${pimg(p)}" alt=""></div><div><img src="${pimg(p)}" alt=""></div><div><img src="assets/flex/balao-latex.webp" alt=""></div></div><div class="main"><img src="${pimg(p)}" alt="${esc(p.name)}"></div></div>
<div class="pinfo"><span class="brand">${p.brand}</span><h1>${p.name}</h1><div class="sku"><span>Cód. <b>${p.sku}</b></span><span>Categoria <b>${sname}</b></span><span>Marca <b>${p.brand}</b></span></div>
<div class="pbox"><div class="main-p"><span class="v num">${brl(p.price)}</span><small>por ${p.unit.toLowerCase()} · ${p.total} un</small></div><div class="un num">Equivale a <b>${brl(p.unitPrice)}</b> por unidade no Pix · ou 6× de ${brl(p.price*1.08/6)} no cartão</div>
<div class="tiers"><div class="on"><b class="num">${brl(p.price)}</b>1 a 4 ${p.unit.toLowerCase()}s</div><div><b class="num">${brl(p.price*0.95)}</b>5 a 9 ${p.unit.toLowerCase()}s · −5%</div><div><b class="num">${brl(p.price*0.9)}</b>10+ ${p.unit.toLowerCase()}s · −10%</div></div>
<div class="row"><span class="qty"><button data-d="-1" aria-label="Menos">−</button><input type="number" value="1" min="1" aria-label="Quantidade"><button data-d="1" aria-label="Mais">+</button></span><button class="add" data-add="${p.sku}">Adicionar ao carrinho</button></div>
<div class="stock">${p.stock>0?`<span><b>Pronta entrega</b> · ${p.stock} ${p.unit.toLowerCase()}s em estoque</span>`:'<span>Sob encomenda · prazo de 7 dias</span>'}<span>Faturamento em 24h</span><span>Retire em Curitiba</span></div></div>
<table class="specs"><tr><td>Embalagem</td><td>${p.pct>1?`${p.pct} pacotes com ${p.un} unidades (${p.total} un)`:`${p.un} unidade${p.un>1?'s':''} por ${p.unit.toLowerCase()}`}</td></tr><tr><td>Material</td><td>Polipropileno atóxico</td></tr><tr><td>Compatível com</td><td>Balões látex nº 9 e nº 11, bubble 18″</td></tr><tr><td>Origem</td><td>Nacional</td></tr><tr><td>Código de barras</td><td>789${p.sku.replace(/\D/g,'').padEnd(10,'0')}</td></tr></table>
<div class="pdesc"><h2>Sobre o produto</h2><p>Vareta com copinho encaixável, ideal para centros de mesa, lembrancinhas e arranjos de balcão. A ponta afunilada evita que o balão gire e o copinho segura o nó sem precisar amarrar.</p><p>Vendida em ${p.unit.toLowerCase()} — a melhor relação custo por unidade para revenda e decoradores que trabalham com volume.</p></div></div></div>
<section class="sec" style="border-top:1px solid var(--g2)"><div class="sec-h"><h2>Quem compra este item também leva</h2><a href="#/c/acessorios-para-balao?sub=${p.sub}">Ver tudo em ${sname} →</a></div><div class="rail">${rel.map(x=>card(x,true)).join('')}</div></section></div>`;
setLD({'@context':'https://schema.org','@graph':[bcLD([['Home','/'],['Festas','/festas/'],['Balões','/festas/baloes/'],['Acessórios para Balão','/festas/baloes/acessorios-para-balao/'],[p.name,`/p/${p.sku.toLowerCase()}/`]]),{'@type':'Product',name:p.name,sku:p.sku,brand:{'@type':'Brand',name:p.brand},description:'Vareta com copinho para balão, venda em '+p.unit.toLowerCase(),offers:{'@type':'Offer',priceCurrency:'BRL',price:p.price.toFixed(2),availability:p.stock>0?'https://schema.org/InStock':'https://schema.org/PreOrder',seller:{'@type':'Organization',name:'Flex Atacadista'},eligibleQuantity:{'@type':'QuantitativeValue',value:p.total,unitText:'unidades por '+p.unit.toLowerCase()}}}]});}

function search(q){document.title=`Busca: ${q} — Flex Atacadista`;const v=q.toLowerCase();const subs=[];F.D.forEach(d=>d.cats.forEach(c=>c.subs.forEach(s=>{if(s.name.toLowerCase().includes(v))subs.push(s);})));F.ACESS_SUBS.forEach(s=>{if(s.name.toLowerCase().includes(v))subs.push({...s,parent:true});});
const ps=F.P.filter(p=>(p.name+' '+p.brand+' '+p.sku).toLowerCase().includes(v));$('#q').value=q;
$('#main').innerHTML=`<div class="wrap">${bc([['Home','','#/'],['Busca']])}<header class="shead"><h1>Resultados para <em>“${esc(q)}”</em></h1><p>${ps.length} produto${ps.length===1?'':'s'} e ${subs.length} categoria${subs.length===1?'':'s'} encontrados</p>${subs.length?`<div class="smatch">${subs.map(s=>`<a href="#/c/${s.parent?'acessorios-para-balao?sub='+s.slug:s.slug}">${s.name}<span>${s.count}</span></a>`).join('')}</div>`:''}</header>
${ps.length?`<div class="tools"><span class="cnt">Mostrando <b>${ps.length}</b> produtos</span><label class="sort">Ordenar <select><option>Relevância</option><option>Menor preço</option><option>Menor preço por unidade</option></select></label></div><div class="grid">${ps.map(p=>card(p)).join('')}</div>`:`<div class="empty"><h3>Não encontramos “${esc(q)}”</h3><p>Confira a grafia ou navegue pelos departamentos abaixo.</p><div class="smatch" style="justify-content:center">${F.D.map(d=>`<a href="#/d/${d.slug}">${d.name}</a>`).join('')}</div></div>`}
<section class="sec" style="padding-bottom:60px"><div class="sec-h"><h2 style="font-size:20px">Também procuram por</h2></div><div class="smatch" style="margin:0">${['balão metalizado número','bomba para balão','arco de balão','cake board','sacola de papel kraft'].map(t=>`<a href="#/busca?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div></section></div>`;
setLD({'@context':'https://schema.org','@type':'SearchResultsPage',name:`Busca: ${q}`});}

function cartPage(){document.title='Carrinho — Flex Atacadista';
const rows=state.items.map(it=>({...it,p:F.P.find(x=>x.sku===it.sku)}));
const full=rows.reduce((a,r)=>a+r.n*r.p.price,0),sub=rows.reduce((a,r)=>a+r.n*tierPrice(r.p,r.n),0),saved=full-sub;
const un=rows.reduce((a,r)=>a+r.n*r.p.total,0),falta=Math.max(0,MIN-sub);
const freteV=sub>=1200?0:(state.frete?49.9:null);
const tot=sub+(freteV||0)-(state.cupom?sub*0.05:0);
$('#main').innerHTML=`<div class="wrap">${bc([['Home','','#/'],['Carrinho']])}
<header class="cphead"><h1>Seu carrinho</h1><p>${rows.length?`${state.cart} ${state.cart===1?'item':'itens'} · ${un.toLocaleString('pt-BR')} unidades no total`:'Nenhum item adicionado ainda.'}</p></header>
${rows.length?`<div class="cpage">
<section class="cplist">
 <div class="cphd"><span>Produto</span><span>Preço</span><span>Qtd.</span><span>Total</span><span></span></div>
 ${rows.map(r=>`<div class="cprow"><a class="cimg" href="#/p/${r.p.sku}"><img src="${pimg(r.p)}" alt=""></a>
 <div class="cpbd"><span class="brand">${r.p.brand}</span><a class="cpname" href="#/p/${r.p.sku}">${esc(r.p.name)}</a><div class="cpmeta">Cód. ${r.p.sku} · ${r.p.pct>1?`${r.p.pct} pct × ${r.p.un} un`:`${r.p.un} un`} por ${r.p.unit.toLowerCase()}</div><div class="cpst ${r.p.stock>0?'':'pre'}">${r.p.stock>0?'Pronta entrega':'Sob encomenda · 7 dias'}</div></div>
 <div class="cpprice"><b class="num">${brl(tierPrice(r.p,r.n))}</b><small>por ${r.p.unit.toLowerCase()}</small>${r.n>=5?`<em>−${r.n>=10?10:5}% volume</em>`:'<span class="hint">5+ leva −5%</span>'}</div>
 <span class="qty"><button data-cq="${r.sku}" data-d="-1" aria-label="Menos">−</button><input value="${r.n}" readonly aria-label="Quantidade"><button data-cq="${r.sku}" data-d="1" aria-label="Mais">+</button></span>
 <b class="cptot num">${brl(r.n*tierPrice(r.p,r.n))}</b>
 <button class="crm" data-crm="${r.sku}" aria-label="Remover item">×</button></div>`).join('')}
 <div class="cpact"><a href="#/c/acessorios-para-balao" class="lnk">Continuar comprando</a><button class="lnk" id="cpclear">Esvaziar carrinho</button></div>
</section>
<aside class="cpsum">
 <h2>Resumo do pedido</h2>
 <div class="ln"><span>Subtotal</span><b class="num">${brl(full)}</b></div>
 ${saved>0?`<div class="ln ok"><span>Desconto por volume</span><b class="num">−${brl(saved)}</b></div>`:''}
 ${state.cupom?`<div class="ln ok"><span>Cupom ${state.cupom}</span><b class="num">−${brl(sub*0.05)}</b></div>`:''}
 <div class="ln"><span>Frete</span><b class="num">${freteV===0?'Grátis':freteV?brl(freteV):'—'}</b></div>
 <div class="ln tot"><span>Total</span><b class="num">${brl(tot)}</b></div>
 <small class="pix">${brl(tot*0.97)} no Pix (−3%) · ou 6× de ${brl(tot*1.08/6)}</small>
 ${falta>0?`<div class="cpmin"><div class="bar"><i style="width:${Math.min(100,sub/MIN*100)}%"></i></div><p>Faltam <b>${brl(falta)}</b> para o pedido mínimo de ${brl(MIN)}</p></div>`:sub<1200?`<div class="cpmin ok"><p>Faltam <b>${brl(1200-sub)}</b> para frete grátis no Sul</p></div>`:''}
 <button class="btn p" ${falta>0?'disabled':''} id="cpfin">${falta>0?'Complete o pedido mínimo':'Finalizar pedido'}</button>
 <div class="cpfield"><label for="cep">Calcular frete</label><div class="row"><input id="cep" placeholder="CEP 00000-000" inputmode="numeric" value="${state.frete||''}"><button id="cepb">OK</button></div>${state.frete?'<small>Curitiba e região · chegada em 2 dias úteis</small>':''}</div>
 <div class="cpfield"><label for="cup">Cupom</label><div class="row"><input id="cup" placeholder="Ex.: FLEX5"><button id="cupb">Aplicar</button></div>${state.cupomErr?'<small class="err">Cupom inválido.</small>':''}</div>
 <ul class="cptrust"><li>Faturamento em 24h</li><li>Pix, boleto ou cartão em até 6×</li><li>Retirada grátis em Curitiba</li></ul>
</aside></div>
<section class="sec" style="border-top:1px solid var(--g2)"><div class="sec-h"><h2>Aproveite e complete o pedido</h2><a href="#/c/acessorios-para-balao">Ver categoria</a></div><div class="rail">${F.HOME_BEST.slice(0,5).map(x=>card(x,true)).join('')}</div></section>`
:`<div class="cpempty"><h2>Seu carrinho está vazio</h2><p>Explore os departamentos e monte seu pedido no atacado.</p><div class="ctas"><a class="btn p" href="#/c/acessorios-para-balao">Ver acessórios para balão</a><a class="btn s" href="#/">Voltar à home</a></div></div>
<section class="sec"><div class="sec-h"><h2>Mais vendidos</h2></div><div class="rail">${F.HOME_BEST.slice(0,5).map(x=>card(x,true)).join('')}</div></section>`}
</div>${strip()}`;
const on=(id,fn)=>{const e=$('#'+id);if(e)e.onclick=fn;};
$('#main').querySelectorAll('[data-cq]').forEach(b=>b.onclick=()=>{const it=state.items.find(x=>x.sku===b.dataset.cq);it.n+=+b.dataset.d;if(it.n<=0)state.items=state.items.filter(x=>x!==it);renderCart();cartPage();});
$('#main').querySelectorAll('[data-crm]').forEach(b=>b.onclick=()=>{state.items=state.items.filter(x=>x.sku!==b.dataset.crm);renderCart();cartPage();});
on('cpclear',()=>{state.items=[];state.cupom=null;renderCart();cartPage();});
on('cepb',()=>{state.frete=($('#cep').value||'').trim()||null;cartPage();});
on('cupb',()=>{const v=($('#cup').value||'').trim().toUpperCase();if(v==='FLEX5'){state.cupom='FLEX5';state.cupomErr=false;}else{state.cupom=null;state.cupomErr=!!v;}cartPage();});
on('cpfin',()=>toast('<b>Pedido enviado.</b> Nossa equipe confirma por WhatsApp em até 24h'));
setLD({'@context':'https://schema.org','@type':'WebPage',name:'Carrinho'});}

/* ---------- router ---------- */
function route(){toggleMega(false);openDrawer(false);openCart(false);const h=location.hash||'#/';const [path,qs]=h.slice(1).split('?');const seg=path.split('/').filter(Boolean);
document.querySelectorAll('.dnav .lk').forEach(a=>a.classList.remove('on'));
if(seg[0]==='d')dept(seg[1]);else if(seg[0]==='c')category(seg[1]);else if(seg[0]==='p')product(seg[1]);else if(seg[0]==='carrinho')cartPage();else if(seg[0]==='busca')search(new URLSearchParams(qs).get('q')||'');else if(seg[0]==='ofertas'){category('acessorios-para-balao');}else home();
const dslug=seg[0]==='d'?seg[1]:seg[0]==='c'?(F.findSub(seg[1])||ACESS).cat.dept.slug:seg[0]==='p'?'festas':null;if(dslug)document.querySelector(`.dnav .lk[data-d="${dslug}"]`)?.classList.add('on');
window.scrollTo(0,0);}
shell();window.addEventListener('hashchange',route);route();
})();
