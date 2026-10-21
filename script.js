/* SAZU SILK EXPORT main script. Sections: nav, hero, scrub (intro+ship), cards, filter, timeline, video, form */
(function($){
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches, MOB=innerWidth<768;
AOS.init({duration:RM?0:800,once:true,offset:60});
$('#yr').text(new Date().getFullYear());
// NAV: sticky style + smooth anchors (also applies product filter from links)
const nav=$('#nav');
addEventListener('scroll',()=>nav.toggleClass('stuck',scrollY>60),{passive:true});
$('a[href^="#"]').on('click',function(e){const t=$(this.getAttribute('href'));if(t.length){e.preventDefault();t[0].scrollIntoView({behavior:RM?'auto':'smooth'});history.pushState(null,'',this.hash);
 if(this.dataset.f)filter(this.dataset.f);if(this.dataset.prod)$('#pc').val(this.dataset.prod);bootstrap.Collapse.getInstance(document.getElementById('menu'))?.hide();}});
// HERO: 6s autoplay, crossfade, pause button
const S=$('.slide'),C=$('.copy'),D=$('.dots button');let i=0,timer,paused=RM;
function show(n){i=(n+S.length)%S.length;S.removeClass('on').eq(i).addClass('on');C.removeClass('on').eq(i).addClass('on');D.removeClass('on');void D[i].offsetWidth;D.eq(i).addClass('on');}
function run(){clearInterval(timer);if(!paused)timer=setInterval(()=>show(i+1),6000);}
D.each((k,b)=>b.onclick=()=>{show(k);run()});
$('#pp').on('click',function(){paused=!paused;$(this).find('i').toggleClass('fa-pause fa-play');$(this).attr('aria-label',paused?'Play slideshow':'Pause slideshow');run();});
show(0);run();
// SCRUB: sets --p (0..1) on [data-scrub] sections. GSAP ScrollTrigger if loaded, else passive scroll fallback.
const sh=document.querySelector('g.ship');
function paint(el,p){el.style.setProperty('--p',p.toFixed(3));if(el.id==='network'&&sh)sh.setAttribute('transform','translate('+(-320+p*1500)+' 285)');}
document.querySelectorAll('[data-scrub]').forEach(el=>{
 if(window.ScrollTrigger&&!RM){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.create({trigger:el,start:'top top',end:'bottom bottom',scrub:true,onUpdate:s=>paint(el,s.progress)});}
 else{const f=()=>{const r=el.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));paint(el,RM?1:p)};addEventListener('scroll',f,{passive:true});f();}
});
if(sh)sh.setAttribute('transform','translate(-320 285)');
// CARDS: parallax bg + shrink/dim a card as the next one covers it (off on reduced motion; no parallax on mobile)
if(!RM){const cs=[...document.querySelectorAll('.card-s')];let tick=false;
 const u=()=>{tick=false;cs.forEach((c,k)=>{const r=c.getBoundingClientRect(),bg=c.querySelector('.bg');
  if(!MOB)bg.style.transform='translateY('+(r.top*-.08)+'px)';
  const n=cs[k+1];if(n){const t=Math.max(0,Math.min(1,1-n.getBoundingClientRect().top/innerHeight));c.style.transform='scale('+(1-t*.06)+')';c.style.filter='brightness('+(1-t*.45)+')';}})};
 addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(u)}},{passive:true});u();}
// PRODUCT FILTER
function filter(f){$('.filters button').removeClass('on').filter('[data-f="'+f+'"]').addClass('on');$('.item').each(function(){$(this).toggleClass('hide',f!=='all'&&this.dataset.c!==f)});}
$('.filters button').on('click',function(){filter(this.dataset.f)});
// TIMELINE + COUNTERS via IntersectionObserver
$('.tl li').each((k,l)=>l.style.setProperty('--i',k));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.3});
io.observe(document.querySelector('.tl'));
document.querySelectorAll('[data-count]').forEach(n=>new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){const T=+n.dataset.count,t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400);n.textContent=Math.round(T*k);if(k<1)requestAnimationFrame(f)})(t0);o.disconnect()}}).observe(n));
// VIDEO: no autoplay for reduced motion, data saver or mobile; manual control always works
const v=document.getElementById('bgv');
if(RM||(navigator.connection&&navigator.connection.saveData)||MOB){v.removeAttribute('autoplay');v.pause();$('#vp i').attr('class','fa-solid fa-play')}else v.preload='auto';
$('#vp').on('click',function(){if(v.paused){v.play();$(this).find('i').attr('class','fa-solid fa-pause')}else{v.pause();$(this).find('i').attr('class','fa-solid fa-play')}});
// FORM: validate, then POST to data-endpoint. With no endpoint configured, nothing is sent and the user is told so.
$('#f').on('submit',async function(e){e.preventDefault();let ok=true;
 const chk=(id,test,msg)=>{const el=$('#'+id),bad=!test(el);el.attr('aria-invalid',bad);$('#'+id+'-e').text(bad?msg:'');if(bad&&ok){el.trigger('focus');ok=false}};
 chk('n',e=>e.val().trim(),'Enter your name.');chk('em',e=>/^[^@\s]+@[^@\s]+\.\S+$/.test(e.val()),'Enter a valid email address.');
 chk('m',e=>e.val().trim().length>9,'Enter a message of at least 10 characters.');chk('cs',e=>e.prop('checked'),'Tick the consent box to continue.');
 if(!ok)return;const st=$('#st'),ep=this.dataset.endpoint,b=$(this).find('button[type=submit]').prop('disabled',true);
 if(!ep){st.text('The form is not connected yet. Please email us directly.');b.prop('disabled',false);return}
 st.text('Sending…');
 try{const r=await fetch(ep,{method:'POST',headers:{Accept:'application/json'},body:new FormData(this)});if(!r.ok)throw 0;st.text('Thank you. Your inquiry was sent.');this.reset()}
 catch(_){st.text('Sending failed. Please try again or email us.')}b.prop('disabled',false);});
})(jQuery);
