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
  const WHATSAPP_NUMBER='12404864423';
  const whatsappMessage=encodeURIComponent('Hi Remmybeautyplus, I would like to ask about booking an appointment.');
  document.body.insertAdjacentHTML('beforeend',`<a class="whatsapp-chat" href="https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}" target="_blank" rel="noopener noreferrer" aria-label="Chat with Remmybeautyplus on WhatsApp"><span class="whatsapp-tooltip">Chat with us</span><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16.04 3C9.4 3 4 8.34 4 14.9c0 2.3.67 4.54 1.93 6.45L4 28.38l7.24-1.88a12.1 12.1 0 0 0 4.8.99h.01C22.69 27.49 28 22.15 28 15.58 28 8.99 22.68 3 16.04 3Zm0 22.48a10.1 10.1 0 0 1-4.35-.96l-.31-.15-4.3 1.12 1.15-4.14-.2-.33a9.83 9.83 0 0 1-1.52-5.25c0-5.45 4.47-9.88 9.97-9.88 5.49 0 9.95 4.43 9.95 9.88 0 5.45-4.46 9.71-9.94 9.71Zm5.47-7.39c-.3-.15-1.77-.86-2.04-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.14-1.26-.46-2.39-1.46a8.9 8.9 0 0 1-1.66-2.04c-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.49.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.18-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1-1.04 2.45s1.07 2.85 1.22 3.04c.15.2 2.1 3.17 5.08 4.45.71.3 1.26.49 1.7.63.71.22 1.35.19 1.86.12.57-.09 1.77-.72 2.02-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.34Z"/></svg></a>`);
  const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.site-header nav');
  if(toggle&&nav){const closeMenu=()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');toggle.textContent='☰'};toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');toggle.textContent=open?'×':'☰';document.body.classList.toggle('menu-open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()})}
  const grid=document.querySelector('#serviceGrid');
  const today=new Date().toLocaleDateString('en-CA'),saleIsActive=s=>Boolean(s.saleActive&&Number(s.salePrice)>0&&(!s.saleStartDate||today>=s.saleStartDate)&&(!s.saleEndDate||today<=s.saleEndDate));
  if(grid) grid.innerHTML=window.REMMY_SERVICES.filter(s=>s.available!==false).map(s=>{const regular=Number(s.regularPrice??s.price),onSale=saleIsActive(s),current=onSale?Number(s.salePrice):regular;return `<article class="service-card"><div class="service-image"><img src="${s.image}" alt="${s.name}" loading="lazy"></div><div class="service-content"><h3>${s.name}${onSale?' <span class="sale-badge">Sale</span>':''}</h3><div class="service-meta"><b class="service-price">${onSale?`<del>$${regular}</del><strong>$${current}</strong>`:`$${current}`}</b><span>${formatDuration(s.duration)}</span></div><a class="btn btn-small rounded" href="booking.html?service=${s.id}">Book</a></div></article>`}).join('');
  const tiktokButton=document.querySelector('.compact-contact a[href*="tiktok.com"]');
  if(tiktokButton)tiktokButton.insertAdjacentHTML('afterbegin','<svg class="tiktok-logo" viewBox="0 0 24 24" aria-hidden="true"><path class="tk-cyan" d="M14.3 3v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V3h2.55c.2 1.75 1.32 3.24 2.9 3.96V9.6a7.55 7.55 0 0 1-2.9-1.35V3z"/><path class="tk-pink" d="M15.1 2.2v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V2.2h2.55c.2 1.75 1.32 3.24 2.9 3.96V8.8a7.55 7.55 0 0 1-2.9-1.35V2.2z"/><path class="tk-white" d="M14.7 2.6v10.2a4.4 4.4 0 1 1-3.8-4.36v2.55a1.95 1.95 0 1 0 1.25 1.81V2.6h2.55c.2 1.75 1.32 3.24 2.9 3.96V9.2a7.55 7.55 0 0 1-2.9-1.35V2.6z"/></svg>');

  // Reveal content gently as it enters the viewport.
  const animated=document.querySelectorAll('.section-head,.service-card,.gallery figure,.compact-contact>*');
  animated.forEach((element,index)=>{element.classList.add('reveal');element.style.setProperty('--reveal-delay',`${(index%6)*70}ms`)});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target)}}),{threshold:.12});animated.forEach(element=>observer.observe(element))}else animated.forEach(element=>element.classList.add('revealed'));
});
function formatDuration(hours){const whole=Math.floor(hours),mins=(hours%1)*60;return `${whole} hr${whole!==1?'s':''}${mins?` ${mins} min`:''}`}
window.formatDuration=formatDuration;
