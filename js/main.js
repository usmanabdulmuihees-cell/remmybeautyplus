// Edit this single list to update services across the public site and booking flow.
window.REMMY_SERVICES = [
  // Prices and durations are editable estimates until the final service menu is supplied.
  {id:'bohemian-braids',name:'Bohemian Braids',price:200,duration:4.5,image:'images/bohemian-braids.webp',description:'Flowing curls woven through beautiful braids for soft, effortless texture.'},
  {id:'twists',name:'Twists',price:160,duration:4,image:'images/remmy-hero.webp',description:'Neat, lightweight twists customized to your preferred length and finish.'},
  {id:'crochet',name:'Crochet',price:120,duration:3,image:'images/soft-locs.webp',description:'A versatile protective style installed carefully for a natural finish.'},
  {id:'cornrows',name:'Cornrows',price:100,duration:2.5,image:'images/stitch-braids.webp',description:'Clean, creative cornrow styles with precise parting and lasting hold.'},
  {id:'soft-locs',name:'Soft Locs',price:180,duration:4.5,image:'images/soft-locs.webp',description:'Soft, natural-looking locs with movement and a beautifully relaxed finish.'},
  {id:'stitch-braids',name:'Stitch Braids',price:140,duration:3,image:'images/stitch-braids.webp',description:'Crisp stitch detailing and sculpted rows for a polished statement style.'},
  {id:'individual-scalp-hair',name:'Individual Scalp Hair',price:180,duration:4,image:'images/stitch-braids.webp',description:'Individual scalp styling tailored to your desired size, length, and look.'},
  {id:'human-hair-wigs',name:'Human Hair Wigs',price:250,duration:2,image:'images/bohemian-braids.webp',description:'Custom human-hair wig preparation and styling for a seamless result.'},
  {id:'braided-wigs',name:'Braided Wigs',price:200,duration:3,image:'images/remmy-hero.webp',description:'Beautifully constructed braided wigs made for convenience and versatility.'},
  {id:'wig-revamp',name:'Revamping of Old Wigs',price:80,duration:2,image:'images/soft-locs.webp',description:'Refresh, restore, and restyle an existing wig to bring it back to life.'},
  {id:'blend-wigs',name:'Blend Wigs',price:180,duration:2.5,image:'images/bohemian-braids.webp',description:'Customized blended wig styling for a polished, natural-looking finish.'}
];
// Admin-managed services override the built-in starter list.
try{const managed=JSON.parse(localStorage.getItem('remmy_services'));if(Array.isArray(managed))window.REMMY_SERVICES=managed}catch(error){console.warn('Could not load managed services.',error)}

document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-header nav');
  if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.textContent=open?'×':'☰';document.body.classList.toggle('menu-open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open')}))}
  const grid=document.querySelector('#serviceGrid');
  if(grid) grid.innerHTML=window.REMMY_SERVICES.filter(s=>s.available!==false).map(s=>`<article class="service-card"><div class="service-image"><img src="${s.image}" alt="${s.name}" loading="lazy"></div><div class="service-content"><h3>${s.name}</h3><div class="service-meta"><b>$${s.price}</b><span>${formatDuration(s.duration)}</span></div><a class="btn btn-small rounded" href="booking.html?service=${s.id}">Book</a></div></article>`).join('');
  const tiktokButton=document.querySelector('.compact-contact a[href*="tiktok.com"]');
  if(tiktokButton)tiktokButton.insertAdjacentHTML('afterbegin','<svg class="tiktok-logo" viewBox="0 0 24 24" aria-hidden="true"><path class="tk-cyan" d="M14.3 3v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V3h2.55c.2 1.75 1.32 3.24 2.9 3.96V9.6a7.55 7.55 0 0 1-2.9-1.35V3z"/><path class="tk-pink" d="M15.1 2.2v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V2.2h2.55c.2 1.75 1.32 3.24 2.9 3.96V8.8a7.55 7.55 0 0 1-2.9-1.35V2.2z"/><path class="tk-white" d="M14.7 2.6v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V2.6h2.55c.2 1.75 1.32 3.24 2.9 3.96V9.2a7.55 7.55 0 0 1-2.9-1.35V2.6z"/></svg>');

  // Reveal content gently as it enters the viewport.
  const animated=document.querySelectorAll('.section-head,.service-card,.gallery figure,.compact-contact>*');
  animated.forEach((element,index)=>{element.classList.add('reveal');element.style.setProperty('--reveal-delay',`${(index%6)*70}ms`)});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}),{threshold:.12});animated.forEach(element=>observer.observe(element))}else animated.forEach(element=>element.classList.add('revealed'));
});
function formatDuration(hours){const whole=Math.floor(hours),mins=(hours%1)*60;return `${whole} hr${whole!==1?'s':''}${mins?` ${mins} min`:''}`}
window.formatDuration=formatDuration;
