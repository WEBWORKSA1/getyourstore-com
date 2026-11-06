/* GetYourStore.com — free tools (all client-side) */
(function(){
  'use strict';
  var $=GYS.$,$$=GYS.$$,store=GYS.store,esc=GYS.esc;
  function num(id){var el=document.getElementById(id);var v=parseFloat(el&&el.value);return isNaN(v)?0:v}
  function money(v){var s=v<0?'-':'';v=Math.abs(v);return s+'$'+v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
  function money0(v){return '$'+Math.round(v).toLocaleString()}
  function pct(v){return isFinite(v)?(v*100).toFixed(1)+'%':'—'}
  function set(id,v,cls){var el=document.getElementById(id);if(!el)return;el.textContent=v;if(cls!==undefined){var k=el.closest('.kpi');if(k){k.classList.remove('good','bad');if(cls)k.classList.add(cls)}}}
  function copy(t,btn){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){if(btn){var o=btn.textContent;btn.textContent='Copied';setTimeout(function(){btn.textContent=o},1200)}}).catch(function(){window.prompt('Copy:',t)})}

  /* 1. Platform Picker Quiz */
  var quiz=$('#quiz');
  if(quiz){
    var P={shopify:{n:'Shopify',d:'Hosted all-rounder with a huge app and theme ecosystem. Strong for physical products that need room to scale.'},
      woocommerce:{n:'WooCommerce',d:'Free, open-source plugin for WordPress. Maximum control and ownership, but you manage hosting and updates.'},
      wix:{n:'Wix eCommerce',d:'Drag-and-drop builder with strong design freedom. Great for small catalogues and brand-led sites.'},
      squarespace:{n:'Squarespace Commerce',d:'Beautiful templates, simple to run. Ideal for creatives, small catalogues and services.'},
      bigcommerce:{n:'BigCommerce',d:'Hosted platform with lots of built-in features. Good for large catalogues and B2B.'},
      square:{n:'Square Online',d:'Ties into Square point of sale. Best if you also sell in person or run a café or shop.'},
      ecwid:{n:'Ecwid by Lightspeed',d:'Add a store to a site you already have. Simple, light and budget-friendly.'},
      bigcartel:{n:'Big Cartel',d:'Minimal store for artists and makers with small catalogues.'},
      etsy:{n:'Etsy',d:'Marketplace with built-in buyer traffic for handmade, vintage and craft goods. Ideal for testing demand.'},
      creator:{n:'Creator platforms (Payhip, Sellfy, Gumroad)',d:'Purpose-built for digital downloads, courses and memberships, with the fastest setup.'}};
    var Q=[
      {q:'What will you mainly sell?',o:[['Physical products I stock or ship',{shopify:3,woocommerce:2,bigcommerce:2,wix:2,square:1}],['Digital downloads, courses or memberships',{creator:5,woocommerce:2,squarespace:1,shopify:1}],['Services, bookings or classes',{squarespace:4,wix:4,square:2}],['Handmade, art or vintage',{etsy:4,bigcartel:4,squarespace:2,shopify:1}],['Wholesale / B2B or a huge catalogue',{bigcommerce:5,shopify:2,woocommerce:2}]]},
      {q:'How comfortable are you with tech?',o:[['Not at all: keep it simple',{squarespace:2,wix:2,shopify:2,etsy:2,creator:2,bigcartel:2,square:2}],['I can follow a tutorial',{shopify:2,wix:1,bigcommerce:1,ecwid:1,woocommerce:1}],["I'm a developer or have one",{woocommerce:4,shopify:2,bigcommerce:2}]]},
      {q:"What's your monthly budget for the platform?",o:[['As close to zero as possible',{etsy:2,bigcartel:2,ecwid:2,creator:2,square:2,woocommerce:1}],['Moderate: whatever is fair',{shopify:2,wix:2,squarespace:2,bigcommerce:1}],['Flexible: growth matters more',{shopify:3,bigcommerce:3}]]},
      {q:'Do you also sell in person (markets, pop-ups, a shop)?',o:[['Yes, regularly',{square:5,shopify:3}],['Occasionally',{square:2,shopify:2}],['No, online only',{woocommerce:1,wix:1,bigcommerce:1}]]},
      {q:'What matters most?',o:[['A beautiful, on-brand design',{squarespace:4,wix:3,shopify:1}],['Apps, integrations and room to scale',{shopify:4,bigcommerce:3,woocommerce:2}],['Lowest running cost',{woocommerce:2,ecwid:2,bigcartel:2,etsy:1,creator:1}],['Built-in buyer traffic',{etsy:5}],['Full control and data ownership',{woocommerce:5}]]},
      {q:'How many products at launch?',o:[['Under 20',{bigcartel:2,squarespace:2,wix:2,creator:2,ecwid:1,etsy:1}],['20 to 500',{shopify:3,woocommerce:2,wix:1,bigcommerce:1}],['500 or more',{bigcommerce:4,shopify:3,woocommerce:2}]]}];
    var ans=[],qi=0,box=$('#quiz-box'),res=$('#quiz-result');
    function draw(){if(qi>=Q.length)return result();var q=Q[qi];
      box.innerHTML='<p class="step-label">Question '+(qi+1)+' of '+Q.length+'</p><div class="steps-bar"><i style="width:'+((qi)/Q.length*100)+'%"></i></div><h2 style="font-size:1.5rem">'+esc(q.q)+'</h2><div class="opts">'+q.o.map(function(o,i){return '<button class="opt" type="button" data-i="'+i+'">'+esc(o[0])+'</button>'}).join('')+'</div>'+(qi?'<p style="margin-top:14px"><button class="btn btn-ghost btn-sm" type="button" id="q-back">← Back</button></p>':'');
      $$('.opt',box).forEach(function(b){b.addEventListener('click',function(){ans[qi]=+b.getAttribute('data-i');qi++;draw()})});
      var bk=$('#q-back');if(bk)bk.addEventListener('click',function(){qi--;draw()})}
    function result(){var s={};Object.keys(P).forEach(function(k){s[k]=0});var max=0;
      Q.forEach(function(q,i){var w=q.o[ans[i]][1];for(var k in w)s[k]+=w[k];var m=0;q.o.forEach(function(o){for(var k in o[1])m=Math.max(m,o[1][k])});max+=m});
      var top=Object.keys(s).sort(function(a,b){return s[b]-s[a]}).slice(0,3);
      box.hidden=true;res.hidden=false;
      $('#quiz-recs').innerHTML=top.map(function(k,i){var sc=Math.min(99,Math.round(s[k]/max*100)+20);return '<div class="rec'+(i===0?' top':'')+'"><span class="score">'+sc+'%</span><h3>'+(i===0?'🏆 ':'')+esc(P[k].n)+'</h3><div class="meter"><i style="width:'+sc+'%"></i></div><p style="margin:0">'+esc(P[k].d)+'</p></div>'}).join('');
      var cta=$('#quiz-cta');if(cta)cta.href='/get-your-store-built.html?platform='+encodeURIComponent(P[top[0]].n.split(' ')[0]);
      store.set('gys-quiz',top[0]);res.scrollIntoView({behavior:'smooth',block:'start'})}
    $('#quiz-restart').addEventListener('click',function(){ans=[];qi=0;box.hidden=false;res.hidden=true;draw()});
    draw();
  }

  /* 2. Store Name Generator */
  var ng=$('#ng-form');
  if(ng){
    var STY={modern:{pre:['Neo','Nova','Flux','Pixel','Zen','Vibe','Loop','Snap','Bold','Echo'],suf:['ly','ify','io','hub','lab','co','base','spot','grid','wave'],tpl:['{k}ly','{k}ify','Get{K}','{K}Lab','{K}Hub','{K}Co','{P}{K}','{K}{S}','{K} Supply','Try{K}']},
      classic:{pre:['Royal','Heritage','Crown','Oak','Union','Atlas','Sterling','Harbor','Liberty','Noble'],suf:[' & Co',' Goods',' Trading',' House',' Supply',' Mercantile',' Outfitters',' Provisions',' Collective',' Atelier'],tpl:['The {K} Shop','{P} {K}','{K}{S}','{K} & Sons','House of {K}','{K} General Store','{P} & {K}','{K} Emporium']},
      playful:{pre:['Happy','Lucky','Little','Jolly','Peachy','Sunny','Bubbly','Cosmic','Wiggly','Merry'],suf:['ville','tastic','oodle','zy','pop','bop','licious','boo','kins','bug'],tpl:['{P} {K}','{K}{S}','{K} Party','Oh My {K}','{K} & Friends','Hello {K}','{K} Planet','Go Go {K}']},
      luxe:{pre:['Maison','Velvet','Aurum','Lumiere','Opal','Ivory','Noir','Silk','Gilded','Atelier'],suf:[' Studio',' Maison',' Atelier',' Luxe',' Gallery',' Edit',' Collection',' Rare',' Privé',' Society'],tpl:['{P} {K}','{K}{S}','The {K} Edit','{K} by Design','{P}{k}','Haus {K}','{K} Noir']},
      eco:{pre:['Green','Leaf','Terra','Wild','Root','Moss','Fern','Earth','Bloom','Sprout'],suf:[' & Leaf',' Earth',' Roots',' Grove',' Bloom',' Nature',' Field',' Pure',' Harvest',' Wild'],tpl:['{P}{K}','{K}{S}','The {K} Garden','{K} Naturals','Simply {K}','{K} & Moss','Pure {K}','{K} Botanica']}};
    function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
    function blend(a,b){var x=a.slice(0,Math.ceil(a.length*0.6)),y=b.slice(Math.floor(b.length*0.4));return cap(x+y)}
    function gen(){var raw=$('#ng-kw').value.toLowerCase().replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean);if(!raw.length)raw=['store'];
      var st=STY[$('#ng-style').value]||STY.modern,maxLen=+$('#ng-len').value||99,out={},rnd=function(a){return a[Math.floor(Math.random()*a.length)]};
      var guard=0;while(Object.keys(out).length<30&&guard<600){guard++;var k=rnd(raw),K=cap(k),t=rnd(st.tpl),n;
        if(guard%5===0&&raw.length>1){n=blend(raw[0],raw[1])}else if(guard%7===0){n=blend(k,rnd(st.pre).toLowerCase())}
        else{n=t.replace('{k}',k).replace('{K}',K).replace('{P}',rnd(st.pre)).replace('{S}',rnd(st.suf))}
        n=n.replace(/\s+/g,' ').trim();if(n.replace(/[^a-z]/gi,'').length<=maxLen)out[n]=1}
      var favs=JSON.parse(store.get('gys-favs')||'[]');
      $('#ng-out').innerHTML=Object.keys(out).map(function(n){var dom=n.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'')+'.com';
        return '<div class="name-item"><div><b>'+esc(n)+'</b><br><small class="muted">'+dom+'</small></div><div class="acts"><button type="button" class="fav" data-n="'+esc(n)+'" aria-label="Save '+esc(n)+'">'+(favs.indexOf(n)>-1?'★':'☆')+'</button><a href="https://lookup.icann.org/en/lookup?name='+dom+'" target="_blank" rel="noopener nofollow">Check</a></div></div>'}).join('');
      $$('#ng-out .fav').forEach(function(b){b.addEventListener('click',function(){var n=b.getAttribute('data-n'),f=JSON.parse(store.get('gys-favs')||'[]'),i=f.indexOf(n);
        if(i>-1){f.splice(i,1);b.textContent='☆'}else{f.push(n);b.textContent='★'}store.set('gys-favs',JSON.stringify(f));drawFavs()})})}
    function drawFavs(){var f=JSON.parse(store.get('gys-favs')||'[]'),el=$('#ng-favs');if(!el)return;
      el.innerHTML=f.length?f.map(function(n){return '<span class="pill">'+esc(n)+'</span>'}).join('')+' <button class="btn btn-ghost btn-sm" type="button" id="ng-copy">Copy list</button>':'<span class="muted small">Tap ☆ to save names you like.</span>';
      var c=$('#ng-copy');if(c)c.addEventListener('click',function(){copy(f.join('\n'),c)})}
    ng.addEventListener('submit',function(e){e.preventDefault();gen()});
    drawFavs();gen();
  }

  /* 3. Profit Margin Calculator */
  if($('#pm-form')){
    function pm(){var cost=num('pm-cost'),price=num('pm-price'),ship=num('pm-ship'),fp=num('pm-feep')/100,ff=num('pm-feef'),plat=num('pm-plat')/100,ad=num('pm-ad'),tgt=num('pm-target')/100;
      var fees=price*(fp+plat)+ff,total=cost+ship+fees+ad,profit=price-total,margin=price?profit/price:0,markup=cost?(price-cost)/cost:0;
      var need=(cost+ship+ff+ad)/(1-fp-plat-tgt);
      set('pm-profit',money(profit),profit>=0?'good':'bad');set('pm-margin',pct(margin),margin>=.2?'good':(margin<0?'bad':''));set('pm-markup',pct(markup));
      set('pm-fees',money(fees));set('pm-total',money(total));set('pm-need',need>0&&isFinite(need)?money(need):'—');
      set('pm-per100',money(profit*100));
      var v=$('#pm-verdict');if(v)v.textContent=margin<0?'You lose money on every order. Raise the price, cut costs or drop the ads for this product.':margin<.15?'Thin margin. One returned order or a price rise from your supplier could wipe out profit.':margin<.3?'Workable margin. Look for bundles and upsells to raise your average order value.':'Healthy margin. You have room for ads, discounts and free-shipping offers.'}
    $$('#pm-form input').forEach(function(i){i.addEventListener('input',pm)});pm();
  }

  /* 4. Startup Cost Estimator */
  if($('#sc-items')){
    var ITEMS=[['Platform / hosting plan','m',[0,39,105]],['Domain name (per year)','o',[12,15,20]],['Theme or template','o',[0,180,350]],['Apps & plugins','m',[0,30,120]],['Logo & branding','o',[0,250,1500]],['Product photography','o',[0,200,1000]],['Starting inventory','o',[300,1500,6000]],['Samples & testing','o',[50,200,500]],['Business registration & legal','o',[50,300,900]],['Packaging & labels','o',[30,150,500]],['Email marketing tool','m',[0,20,60]],['Ads & promotion','m',[50,300,1500]]];
    var lvl=1,box=$('#sc-items');
    function build(){box.innerHTML=ITEMS.map(function(it,i){return '<div class="line-item"><label for="sc-'+i+'">'+it[0]+' <small class="muted">'+(it[1]==='m'?'monthly':'one-time')+'</small></label><input id="sc-'+i+'" type="number" min="0" step="1" value="'+it[2][lvl]+'"><output id="sco-'+i+'"></output></div>'}).join('');
      $$('input',box).forEach(function(i){i.addEventListener('input',calc)});calc()}
    function calc(){var o=0,m=0;ITEMS.forEach(function(it,i){var v=num('sc-'+i);if(it[1]==='m'){m+=v;document.getElementById('sco-'+i).textContent=money0(v*12)+'/yr'}else{o+=v;document.getElementById('sco-'+i).textContent=money0(v)}});
      set('sc-one',money0(o));set('sc-mon',money0(m));set('sc-year',money0(o+m*12));set('sc-3mo',money0(o+m*3))}
    $$('#sc-seg button').forEach(function(b){b.addEventListener('click',function(){$$('#sc-seg button').forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');lvl=+b.getAttribute('data-l');build()})});
    build();
  }

  /* 5. Platform Fee Calculator */
  if($('#fc-form')){
    function fc(){var orders=num('fc-orders'),aov=num('fc-aov'),rev=orders*aov,best=null,rows=[];
      ['a','b','c'].forEach(function(k){var name=$('#fc-'+k+'-name').value||('Plan '+k.toUpperCase()),plan=num('fc-'+k+'-plan'),pp=num('fc-'+k+'-pp')/100,pf=num('fc-'+k+'-pf'),tx=num('fc-'+k+'-tx')/100;
        var tot=plan+rev*(pp+tx)+orders*pf,rate=rev?tot/rev:0;rows.push({k:k,name:name,tot:tot,rate:rate});if(!best||tot<best.tot)best={k:k,tot:tot}});
      $('#fc-out').innerHTML=rows.map(function(r){var b=r.k===best.k;return '<div class="kpi'+(b?' good':'')+'"><small>'+esc(r.name)+(b?' · lowest':'')+'</small><strong>'+money0(r.tot)+'/mo</strong><span style="color:#cfd1d6;font-size:.85rem">'+pct(r.rate)+' effective · '+money0(r.tot*12)+'/yr</span></div>'}).join('');
      set('fc-rev',money0(rev));
      var diff=rows.map(function(r){return r.tot}).sort(function(a,b){return a-b});set('fc-save',money0((diff[2]-diff[0])*12))}
    $$('#fc-form input').forEach(function(i){i.addEventListener('input',fc)});fc();
  }

  /* 6. Break-even & ROAS */
  if($('#be-form')){
    function be(){var fixed=num('be-fixed'),price=num('be-price'),varc=num('be-var'),goal=num('be-goal');
      var cm=price-varc,cmr=price?cm/price:0,units=cm>0?Math.ceil(fixed/cm):Infinity,goalU=cm>0?Math.ceil((fixed+goal)/cm):Infinity;
      set('be-cm',money(cm),cm>0?'good':'bad');set('be-cmr',pct(cmr));set('be-units',isFinite(units)?units.toLocaleString()+' / mo':'Never');set('be-rev',isFinite(units)?money0(units*price):'—');
      set('be-roas',cmr>0?(1/cmr).toFixed(2)+'×':'—');set('be-cpa',cm>0?money(cm):'—');set('be-goalu',isFinite(goalU)?goalU.toLocaleString()+' / mo':'—');
      set('be-day',isFinite(units)?Math.ceil(units/30)+' orders/day':'—')}
    $$('#be-form input').forEach(function(i){i.addEventListener('input',be)});be();
  }

  /* 7. Launch Checklist */
  var cl=$('#checklist');
  if(cl){
    var G=[['Foundation',['Validate demand (search volume, competitors, pre-orders or a waitlist)','Choose a business model (inventory, dropshipping, print-on-demand, digital)','Pick a platform and plan','Register a business name and check trademarks in your country','Buy a matching domain and set up a branded email']],
      ['Brand & design',['Logo, colour palette and fonts chosen','Theme installed and customised for mobile first','Homepage: one clear promise and one clear call to action','About page with a real story and a face','Favicon and social share image set']],
      ['Products',['Product titles written for search','Benefit-led descriptions with specs and FAQs','At least 3 consistent photos per product','Variants, SKUs and inventory counts set','Prices checked against margin (use the Profit Margin Calculator)','Collections/categories organised','Product reviews app or widget ready']],
      ['Payments, shipping & tax',['Payment gateway connected and verified','Test order completed on mobile with a real card','Shipping zones and rates configured','Free-shipping threshold decided','Sales tax / VAT / GST settings checked for your regions','Order confirmation and shipping emails customised']],
      ['Legal & trust',['Privacy Policy published','Terms of Service published','Refund & Returns Policy published','Shipping Policy published','Contact page with response time','Cookie consent configured where required','Trust badges and secure-checkout messaging']],
      ['SEO & analytics',['Page titles and meta descriptions written','Google Search Console verified and sitemap submitted','Analytics installed and a test purchase tracked','Image alt text added','Page speed checked on mobile (aim for under 3 seconds)']],
      ['Marketing & launch',['Email capture with an incentive live','Welcome email series ready','Abandoned-cart emails turned on','Social profiles claimed with links to the store','Launch email/message written to friends and family','First 3 pieces of content or posts scheduled','Launch-day offer decided','Post-launch: ask the first buyers for reviews']]];
    var saved=JSON.parse(store.get('gys-checklist')||'{}'),total=0;
    cl.innerHTML=G.map(function(g,gi){return '<div class="cl-group"><h3><span>'+g[0]+'</span><small class="muted" id="clg-'+gi+'"></small></h3>'+g[1].map(function(t,ti){total++;var id='c'+gi+'-'+ti,ck=saved[id];return '<label class="cl-item'+(ck?' done':'')+'"><input type="checkbox" data-id="'+id+'" data-g="'+gi+'"'+(ck?' checked':'')+'><span>'+esc(t)+'</span></label>'}).join('')+'</div>'}).join('');
    function upd(){var done=0;G.forEach(function(g,gi){var n=0;g[1].forEach(function(t,ti){if(saved['c'+gi+'-'+ti])n++});done+=n;document.getElementById('clg-'+gi).textContent=n+'/'+g[1].length});
      $('#cl-bar').style.width=(done/total*100)+'%';set('cl-count',done+' of '+total+' done ('+Math.round(done/total*100)+'%)')}
    $$('input',cl).forEach(function(i){i.addEventListener('change',function(){saved[i.getAttribute('data-id')]=i.checked;i.parentNode.classList.toggle('done',i.checked);store.set('gys-checklist',JSON.stringify(saved));upd()})});
    $('#cl-reset').addEventListener('click',function(){if(confirm('Clear all ticks?')){saved={};store.set('gys-checklist','{}');$$('input',cl).forEach(function(i){i.checked=false;i.parentNode.classList.remove('done')});upd()}});
    $('#cl-print').addEventListener('click',function(){window.print()});
    upd();
  }

  /* 8. Product Description Writer */
  if($('#dw-form')){
    var TONE={friendly:{open:['Meet your new favourite','Say hello to','Here\'s the','Introducing the'],close:['You\'re going to love it.','Treat yourself, you deserve it.','Order today and see the difference.'],adj:'easy-going'},
      luxe:{open:['Discover the','Experience the','Elevate your everyday with the','Indulge in the'],close:['Crafted to be treasured.','Because the details matter.','Quiet luxury, delivered.'],adj:'refined'},
      bold:{open:['Stop settling. Get the','Built different: the','The only','Level up with the'],close:['Grab yours before it sells out.','No compromises. No excuses.','Ready when you are.'],adj:'high-performance'},
      minimal:{open:['The','Simply, the','Designed with purpose: the','Less noise. The'],close:['Nothing extra. Everything you need.','Made to last.','Simple, by design.'],adj:'considered'}};
    function benefit(f){f=f.trim().replace(/\.$/,'');if(!f)return '';var l=f.toLowerCase();
      if(/waterproof|water-resistant/.test(l))return f+', so rain, spills and splashes are no problem';
      if(/organic|natural|vegan|eco|recycled/.test(l))return f+', better for you and the planet';
      if(/handmade|hand-made|handcrafted/.test(l))return f+', so every piece is one of a kind';
      if(/light|lightweight/.test(l))return f+', so you barely notice you\'re carrying it';
      if(/fast|quick|instant/.test(l))return f+', saving you time every single day';
      if(/durable|steel|leather|solid/.test(l))return f+', built to last for years, not months';
      if(/soft|comfort|cotton|cushion/.test(l))return f+' for all-day comfort';
      return f+', made to make life a little easier'}
    function rnd(a){return a[Math.floor(Math.random()*a.length)]}
    function write(){var name=$('#dw-name').value.trim()||'product',type=$('#dw-type').value.trim(),aud=$('#dw-aud').value.trim()||'anyone who wants the best',tone=TONE[$('#dw-tone').value]||TONE.friendly,
      feats=$('#dw-feat').value.split(/\n|,/).map(function(s){return s.trim()}).filter(Boolean).slice(0,6);if(!feats.length)feats=['quality materials'];
      var bens=feats.map(benefit);
      var short=rnd(tone.open)+' '+name+(type?' '+type:'')+': '+tone.adj+', made for '+aud+'. '+cap1(bens[0])+'. '+rnd(tone.close);
      var long=rnd(tone.open)+' '+name+(type?', the '+tone.adj+' '+type:'')+' made for '+aud+'.\n\n'+'We designed it around what matters most to you: '+bens.slice(0,2).map(lc1).join(' and ')+'.'+(bens[2]?' Plus, '+lc1(bens[2])+'.':'')+'\n\nWhy you\'ll love it:\n'+bens.map(function(b){return '• '+cap1(b)}).join('\n')+'\n\n'+rnd(tone.close);
      var meta=(name+(type?' '+type:'')+' for '+aud+'. '+cap1(feats.slice(0,2).join(', '))+'. Fast shipping & easy returns.');if(meta.length>155)meta=meta.slice(0,152).replace(/\s+\S*$/,'')+'…';
      var bullets=feats.map(function(f){return '✔ '+cap1(f)}).join('\n');
      var outs=[['Short (listing / social)',short],['Long (product page)',long],['Bullet points',bullets],['SEO meta description ('+meta.length+' chars)',meta]];
      $('#dw-out').innerHTML=outs.map(function(o,i){return '<h3 style="font-size:1rem;color:#fff">'+o[0]+'</h3><div class="out-box" style="color:var(--ink)" id="dwo-'+i+'">'+esc(o[1])+'</div><p><button class="btn btn-ghost btn-sm" style="color:#fff!important;border-color:#555" type="button" data-c="'+i+'">Copy</button></p>'}).join('');
      $$('#dw-out [data-c]').forEach(function(b){b.addEventListener('click',function(){copy(outs[+b.getAttribute('data-c')][1],b)})})}
    function cap1(s){return s.charAt(0).toUpperCase()+s.slice(1)}function lc1(s){return s.charAt(0).toLowerCase()+s.slice(1)}
    $('#dw-form').addEventListener('submit',function(e){e.preventDefault();write()});write();
  }
})();
