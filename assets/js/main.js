/* GetYourStore.com — core site script */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var store={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  window.GYS={$:$,$$:$$,store:store};

  /* contact routing — address is never present in page source */
  var _q=[96,98,110,35,97,100,108,96,106,77,60,108,126,102,127,98,122,111,104,122];
  function inbox(){return String.fromCharCode.apply(null,_q.map(function(c){return c^13})).split('').reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from GetYourStore.com');});
  });

  /* year + theme */
  $$('.js-year').forEach(function(el){el.textContent=new Date().getFullYear()});
  var tt=$('#theme-toggle');
  if(tt){tt.addEventListener('click',function(){
    var cur=document.documentElement.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    var nx=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',nx);store.set('gys-theme',nx);});}
  if(!store.get('gys-theme')&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark')}

  /* nav */
  var mb=$('#menu-btn'),nav=$('#main-nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)})}
  $$('.dd-btn').forEach(function(b){b.addEventListener('click',function(){var d=b.parentNode;var o=d.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
  document.addEventListener('click',function(e){$$('.dd.open').forEach(function(d){if(!d.contains(e.target)){d.classList.remove('open')}})});
  var path=location.pathname.replace(/index\.html$/,'');
  $$('.main-nav>a').forEach(function(a){var h=a.getAttribute('href');if(h!=='/'&&path.indexOf(h.replace(/index\.html$/,''))===0)a.setAttribute('aria-current','page')});

  /* cookie banner */
  var ck=$('#cookie');
  if(ck&&!store.get('gys-cookie')){ck.hidden=false}
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){store.set('gys-cookie',b.getAttribute('data-cookie'));ck.hidden=true;
    if(b.getAttribute('data-cookie')==='essential'){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}})});
  if(store.get('gys-cookie')==='essential'){(window.adsbygoogle=window.adsbygoogle||[]).requestNonPersonalizedAds=1}

  /* forms */
  function serialize(f){var d={};$$('input,select,textarea',f).forEach(function(el){
      if(!el.name||el.name==='_honey')return;
      if((el.type==='checkbox'||el.type==='radio')&&!el.checked)return;
      if(d[el.name]){d[el.name]+=', '+el.value}else{d[el.name]=el.value}});return d}
  function send(f,data,done){
    var msg=$('.form-msg',f),btn=$('button[type=submit]',f);
    if($('.hp',f)&&$('.hp',f).value){return}
    if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent='Sending…'}
    data._subject=(f.getAttribute('data-subject')||'GetYourStore.com form')+' — '+(data.name||data.email||'');
    data._template='table';data._captcha='false';data.page=location.href;
    fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success==='false'||j.success===false)throw new Error(j.message||'fail');return j})})
      .then(function(){if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Thanks! We received your message.'}
        f.reset();if(done)done(true)})
      .catch(function(){if(msg){msg.className='form-msg err';msg.innerHTML='Sorry, that didn\'t send. Please try again in a minute, or <a href="#" class="js-mail-fallback">email us directly</a>.';
        var fb=$('.js-mail-fallback',msg);if(fb)fb.addEventListener('click',function(e){e.preventDefault();window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(data._subject)})}
        if(done)done(false)})
      .then(function(){if(btn){btn.disabled=false;btn.textContent=btn.dataset.t}});
  }
  window.GYS.send=send;window.GYS.serialize=serialize;
  $$('form.js-form').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(!f.checkValidity()){f.reportValidity();return}
    var extra=f._extra?f._extra():{};var d=serialize(f);for(var k in extra)d[k]=extra[k];send(f,d,f._done)})});

  /* multi-step forms */
  $$('form.multistep').forEach(function(f){
    var steps=$$('.fstep',f),i=0,bar=$('.steps-bar i',f),lab=$('.step-label',f),key='gys-draft-'+(f.id||'f');
    function show(n){steps.forEach(function(s,j){s.classList.toggle('active',j===n)});i=n;
      if(bar)bar.style.width=((n+1)/steps.length*100)+'%';if(lab)lab.textContent='Step '+(n+1)+' of '+steps.length+' — '+(steps[n].getAttribute('data-title')||'');}
    function valid(s){var ok=true;$$('input,select,textarea',s).forEach(function(el){if(ok&&!el.checkValidity()){el.reportValidity();ok=false}});
      $$('[data-need-one]',s).forEach(function(g){if(ok&&!$$('input:checked',g).length){ok=false;var m=g.getAttribute('data-need-one');alert(m)}});return ok}
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){if(valid(steps[i])){show(Math.min(i+1,steps.length-1));f.scrollIntoView({behavior:'smooth',block:'start'})}})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){show(Math.max(i-1,0))})});
    try{var dr=JSON.parse(store.get(key)||'{}');$$('input,select,textarea',f).forEach(function(el){if(!el.name||!(el.name in dr)||el.type==='hidden')return;
      if(el.type==='checkbox'||el.type==='radio'){el.checked=dr[el.name].split(', ').indexOf(el.value)>-1&&el.name!=='consent'}else{el.value=dr[el.name]}})}catch(e){}
    f.addEventListener('change',function(){var d=serialize(f);delete d.consent;store.set(key,JSON.stringify(d))});
    f._done=function(ok){if(ok){store.set(key,'{}');var s=$('.success',f.parentNode);if(s){f.hidden=true;s.hidden=false;s.scrollIntoView({behavior:'smooth',block:'center'})}}};
    show(0);
  });

  /* reveal */
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    $$('.reveal').forEach(function(el){io.observe(el)})}else{$$('.reveal').forEach(function(el){el.classList.add('in')})}

  /* lite youtube */
  $$('.yt[data-id]').forEach(function(b){
    var id=b.getAttribute('data-id');
    if(!$('img',b)){b.insertAdjacentHTML('afterbegin','<img loading="lazy" alt="" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg"><span class="play"><span>▶</span></span>')}
    b.addEventListener('click',function(){b.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+(b.getAttribute('aria-label')||'YouTube video')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'},{once:true});
  });

  /* guide TOC + read time */
  var prose=$('#prose'),toc=$('#toc');
  if(prose&&toc){$$('h2',prose).forEach(function(h){if(h.closest('.guide-cta'))return;if(!h.id)h.id=h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      toc.insertAdjacentHTML('beforeend','<li><a href="#'+h.id+'">'+h.textContent+'</a></li>')});
    var w=prose.textContent.split(/\s+/).length;$$('.js-readtime').forEach(function(el){el.textContent=Math.max(3,Math.round(w/230))})}

  /* tip of the day */
  var TIPS=["Write product titles for the search box, not for yourself: what would a buyer type?","Show shipping costs before checkout. Surprise fees are the top reason carts get abandoned.","Shoot every product on the same background and in the same light. Consistency reads as trust.","Start with 10–30 products you can describe brilliantly rather than 300 you can't.","Put your returns policy in plain English, and link it from every product page.","Your first customers are people who already know you. Write the launch email before launch day.","Price from margin, not from competitors: know your cost per order including fees and shipping.","Set up Google Search Console on day one so you can see what people search to find you.","Add a FAQ to product pages. Answering objections there lifts conversions and helps SEO.","Test your checkout on a phone, with a real card, before you announce anything.","Collect emails from day one, even with a simple 'notify me' form.","One great product photo beats five mediocre ones. Lead with the hero shot.","Use the customer's words. Read reviews of similar products and mirror their language.","Track one number weekly: revenue per visitor. It combines traffic quality and conversion.","Free shipping thresholds work best set about 20–30% above your average order value.","Turn on abandoned-cart emails. They are the easiest extra revenue you'll ever add.","Write an 'About' page with a face and a story. People buy from people.","Bundle slow sellers with best sellers instead of discounting them.","Before paid ads, get 3–5 organic sales. They prove the offer works.","Keep your homepage to one clear promise and one clear button."];
  var tipEl=$('#tip-text');
  if(tipEl){var day=Math.floor(Date.now()/864e5);tipEl.textContent=TIPS[day%TIPS.length];
    var tn=$('#tip-next');if(tn){var k=day;tn.addEventListener('click',function(){k++;tipEl.textContent=TIPS[k%TIPS.length]})}}

  /* seasonal countdowns (self-updating every year) */
  function nthDow(y,m,dow,n){var d=new Date(y,m,1),c=0;while(true){if(d.getDay()===dow){c++;if(c===n)return new Date(d)}d.setDate(d.getDate()+1)}}
  function events(y){var tg=nthDow(y,10,4,4),bf=new Date(tg);bf.setDate(bf.getDate()+1);var cm=new Date(tg);cm.setDate(cm.getDate()+4);
    return [{n:'Black Friday',d:bf,t:'Plan offers & ads 6 weeks out'},{n:'Cyber Monday',d:cm,t:'Online-only deals peak'},{n:'Christmas',d:new Date(y,11,25),t:'Set shipping cut-off dates early'},
      {n:"Valentine's Day",d:new Date(y,1,14),t:'Gift guides & bundles'},{n:"Mother's Day (US/CA)",d:nthDow(y,4,0,2),t:'Personalised gifts sell'},{n:'Back to school',d:new Date(y,7,15),t:'Start promos in July'},{n:'Singles\' Day 11.11',d:new Date(y,10,11),t:'Huge for global sellers'}]}
  var cdw=$('#countdowns');
  if(cdw){var now=new Date(),y=now.getFullYear(),list=events(y).concat(events(y+1)).filter(function(e){return e.d>now}).sort(function(a,b){return a.d-b.d}).slice(0,4);
    cdw.innerHTML=list.map(function(e){var days=Math.ceil((e.d-now)/864e5);return '<div class="cd"><b>'+e.n+'</b><strong>'+days+'</strong><span>days · '+e.d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})+'<br>'+e.t+'</span></div>'}).join('')}

  /* monthly contest deadline */
  $$('.js-contest-deadline').forEach(function(el){var n=new Date(),end=new Date(n.getFullYear(),n.getMonth()+1,0,23,59,59);
    var days=Math.ceil((end-n)/864e5);el.textContent=end.toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})+' ('+days+' day'+(days===1?'':'s')+' left)'});
  $$('.js-month').forEach(function(el){el.textContent=new Date().toLocaleDateString(undefined,{month:'long',year:'numeric'})});

  /* news feed (updated daily by GitHub Actions) */
  var nl=$$('[data-news]');
  if(nl.length){fetch('/data/news.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(j){
      var items=(j.items||[]);nl.forEach(function(box){var lim=+box.getAttribute('data-news')||30;
        if(!items.length){box.innerHTML='<p class="muted">Fresh headlines load here daily. Check back soon.</p>';return}
        box.innerHTML=items.slice(0,lim).map(function(it){var d=it.date?new Date(it.date):null;
          return '<a class="news-item" href="'+it.link.replace(/"/g,'&quot;')+'" target="_blank" rel="noopener nofollow">'+esc(it.title)+'<small>'+esc(it.source||'')+(d&&!isNaN(d)?' · '+d.toLocaleDateString(undefined,{month:'short',day:'numeric'}):'')+'</small></a>'}).join('');
        var up=$('.js-news-updated');if(up&&j.updated){up.textContent=new Date(j.updated).toLocaleString()}});
    }).catch(function(){nl.forEach(function(b){b.innerHTML='<p class="muted">Headlines are temporarily unavailable.</p>'})})}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  window.GYS.esc=esc;

  /* site search */
  var sm=$('#search-modal'),si=$('#search-input'),sr=$('#search-results'),idx=null;
  function openS(){sm.hidden=false;si.focus();if(!idx){fetch('/search.json').then(function(r){return r.json()}).then(function(j){idx=j;run()}).catch(function(){})}}
  function closeS(){sm.hidden=true}
  function run(){if(!idx)return;var q=si.value.trim().toLowerCase();if(!q){sr.innerHTML='<p class="muted">Try "Shopify", "profit", "dropshipping" or "domain".</p>';return}
    var terms=q.split(/\s+/),res=idx.map(function(p){var hay=(p.title+' '+p.description+' '+p.keywords).toLowerCase(),s=0;
      terms.forEach(function(t){if(p.title.toLowerCase().indexOf(t)>-1)s+=5;if(hay.indexOf(t)>-1)s+=1});return {p:p,s:s}}).filter(function(r){return r.s>0}).sort(function(a,b){return b.s-a.s}).slice(0,10);
    sr.innerHTML=res.length?res.map(function(r){return '<a href="'+r.p.url+'">'+esc(r.p.title)+'<small>'+esc(r.p.description)+'</small></a>'}).join(''):'<p class="muted">No results. Try another word, or <a href="/get-your-store-built.html">ask us directly</a>.</p>'}
  if(sm){$('#search-open').addEventListener('click',openS);$('#search-close').addEventListener('click',closeS);
    sm.addEventListener('click',function(e){if(e.target===sm)closeS()});si.addEventListener('input',run);
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sm.hidden)closeS();if((e.key==='/'&&!/input|textarea|select/i.test(document.activeElement.tagName))||((e.metaKey||e.ctrlKey)&&e.key==='k')){e.preventDefault();openS()}})}

  /* hero live storefront builder */
  var bn=$('#b-name');
  if(bn){var NICHE={fashion:{e:['👕','👟','🧢'],p:['Everyday Tee','Street Runner','Logo Cap'],t:'Clothes that fit your day.'},beauty:{e:['🧴','💄','🌿'],p:['Glow Serum','Velvet Lip','Botanical Mist'],t:'Clean beauty, real results.'},
      home:{e:['🕯️','🪴','🛋️'],p:['Amber Candle','Desk Planter','Linen Throw'],t:'Make home feel like you.'},pets:{e:['🦴','🐾','🧸'],p:['Chew Bone','Paw Balm','Squeaky Pal'],t:'Happy pets, happy humans.'},
      food:{e:['☕','🍫','🍯'],p:['House Roast','Dark Bar 72%','Wild Honey'],t:'Small-batch flavour, shipped fresh.'},digital:{e:['📘','🎨','🎧'],p:['Starter eBook','Icon Pack','Sample Kit'],t:'Instant downloads. Instant value.'},
      fitness:{e:['🏋️','🧘','🥤'],p:['Grip Gloves','Yoga Mat','Shaker Pro'],t:'Gear up. Show up.'},crafts:{e:['🧶','💍','🖼️'],p:['Hand-Knit Scarf','Silver Ring','Art Print'],t:'Handmade with intention.'}};
    var color='#0f7b5f';
    function render(){var name=bn.value.trim()||'Your Store',n=NICHE[$('#b-niche').value]||NICHE.fashion,slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'')||'yourstore';
      $('#m-url').textContent=slug+'.com';$('#m-name').textContent=name;$('#m-title').textContent=n.t;$('#m-tag').textContent='Free shipping over $50';
      $('#m-head').style.background=color;$('#m-btn').style.background=color;
      $('#m-products').innerHTML=n.p.map(function(p,i){var pr=[24,39,58][i];return '<div class="mock-p"><div style="background:'+color+'22">'+n.e[i]+'</div><b>'+esc(p)+'</b>$'+pr+'</div>'}).join('');
      var link=$('#b-cta');if(link)link.href='/get-your-store-built.html?store='+encodeURIComponent(name)+'&niche='+$('#b-niche').value}
    bn.addEventListener('input',render);$('#b-niche').addEventListener('change',render);
    $$('.swatch').forEach(function(s){s.addEventListener('click',function(){$$('.swatch').forEach(function(x){x.setAttribute('aria-pressed','false')});s.setAttribute('aria-pressed','true');color=s.getAttribute('data-c');render()})});
    render()}

  /* prefill brief from query string */
  var qs=new URLSearchParams(location.search);
  ['store','niche','platform','plan'].forEach(function(k){var v=qs.get(k),el=$('[name="'+k+'"]');if(v&&el&&el.type!=='radio'&&el.type!=='checkbox'){if(el.tagName==='SELECT'){$$('option',el).forEach(function(o){if(o.value===v)el.value=v})}else{el.value=v}}});
  if(qs.get('platform')){var pc=$('input[name="platform"][value="'+qs.get('platform')+'"]');if(pc)pc.checked=true}
})();
