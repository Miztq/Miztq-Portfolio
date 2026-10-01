(function(){
  var tl=document.getElementById('tlb'),head=document.getElementById('head'),tc=document.getElementById('tc');
  var left=35, total=120;
  function pad(n){return (n<10?'0':'')+n}
  function move(e){
    var r=tl.getBoundingClientRect(),x=Math.min(Math.max(e.clientX-r.left,left),r.width-1);
    head.style.left=x+'px';
    var s=Math.round((x-left)/(r.width-left)*total);
    tc.textContent='00:'+pad(Math.floor(s/60))+':'+pad(s%60);
  }
  var box=document.getElementById('tl'),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  var auto=!reduce,x=left,t0=0;
  function tick(t){
    if(auto){
      if(t0)x+=(t-t0)*0.06;
      t0=t;
      if(x>tl.getBoundingClientRect().width-1)x=left;
      head.style.left=x+'px';
      var s=Math.round((x-left)/(tl.getBoundingClientRect().width-left)*total);
      tc.textContent='00:'+pad(Math.floor(s/60))+':'+pad(s%60);
    }else t0=0;
    requestAnimationFrame(tick);
  }
  if(!reduce)requestAnimationFrame(tick);
  box.addEventListener('pointerenter',function(){auto=false});
  box.addEventListener('pointermove',function(e){auto=false;move(e)});
  box.addEventListener('pointerleave',function(){x=parseFloat(head.style.left)||left;t0=0;auto=!reduce});
  document.querySelectorAll('.clip').forEach(function(c,i){c.style.setProperty('--i',i)});
  var tiles=document.querySelectorAll('.work a');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
    tiles.forEach(function(el,i){el.style.transitionDelay=(i%3)*80+'ms';io.observe(el)});
  }else{tiles.forEach(function(el){el.classList.add('in')})}
})();

(function(){
  // EDIT ME: paste your payment link (Stripe, Razorpay, PayPal etc.) into PAY_LINK to switch on the deposit button.
  var PAY_LINK='', EMAIL='miztq69@gmail.com', CUR='₹';
  var home=document.getElementById('home'),hire=document.getElementById('hire');
  var $=function(id){return document.getElementById(id)};
  function route(){
    var h=location.hash==='#/hire';
    home.hidden=h;hire.hidden=!h;
    if(h){window.scrollTo(0,0)}
    else if(location.hash.length>1){var t=document.querySelector(location.hash);if(t)t.scrollIntoView()}
  }
  window.addEventListener('hashchange',route);route();
  var pay=$('pay'),note=$('note');
  function money(n){return CUR+n.toLocaleString('en-IN')}
  function calc(){
    var p=document.querySelector('input[name=pkg]:checked');
    var q=Math.max(1,Math.min(50,parseInt($('qty').value,10)||1));
    var perMinute=p.dataset.rate==='minute';
    var mins=Math.max(1,Math.min(180,parseInt($('mins').value,10)||1));
    $('minutesWrap').hidden=!perMinute;
    var total=+p.dataset.price*q*(perMinute?mins:1);
    var label=p.value+(perMinute?' · '+mins+' min':'')+' x '+q;
    var lines=[[label,total]];
    document.querySelectorAll('input[name=add]:checked').forEach(function(a){
      var amt=+a.dataset.price*(a.dataset.per==='video'?q:1);
      lines.push([a.value,amt]);total+=amt;
    });
    $('lines').innerHTML=lines.map(function(l){return '<li><span>'+l[0]+'</span><span>'+money(l[1])+'</span></li>'}).join('');
    var tt=$('total'),nt=money(total);
    if(tt.textContent!==nt){tt.textContent=nt;tt.classList.remove('pop');void tt.offsetWidth;tt.classList.add('pop')}
    $('dep').textContent=money(Math.round(total/2));
    var body=lines.map(function(l){return l[0]+': '+money(l[1])}).join('\n')+'\nEstimated total: '+money(total)+'\n\nName: '+$('nm').value+'\nEmail: '+$('em').value+'\n\nProject details:\n'+$('dt').value;
    $('mail').href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Project request: '+p.value)+'&body='+encodeURIComponent(body);
  }
  hire.addEventListener('input',calc);hire.addEventListener('change',calc);calc();
  if(PAY_LINK){pay.href=PAY_LINK;pay.target='_blank';pay.rel='noopener'}
  pay.addEventListener('click',function(e){
    if(!PAY_LINK){e.preventDefault();note.textContent='Online payment is not switched on yet. Use "Email request" and I will send a payment link.'}
  });
})();
