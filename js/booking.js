const state={step:1,service:null,date:null,time:null};
const $=selector=>document.querySelector(selector),form=$('#bookingForm'),steps=[...document.querySelectorAll('.form-step')];
const minutesToTime=total=>`${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;
const endTime=(start,duration)=>{const [h,m]=start.split(':').map(Number);return minutesToTime(h*60+m+duration*60)};
const overlaps=(aStart,aEnd,bStart,bEnd)=>aStart<bEnd&&aEnd>bStart;

function isTimeAvailable(date,startTime,duration){
  const end=endTime(startTime,duration);
  return !RemmyStore.getBookings().filter(b=>b.status!=='cancelled'&&b.date===date).some(b=>overlaps(startTime,end,b.startTime,b.endTime));
}
function getAvailableTimes(date,duration){
  const hours=RemmyStore.getBusinessHours()[new Date(`${date}T12:00:00`).getDay()];
  if(!hours?.available||RemmyStore.getBlockedDates().some(item=>item.date===date))return[];
  const [openH,openM]=hours.start.split(':').map(Number),[closeH,closeM]=hours.end.split(':').map(Number),custom=hours.times||[];
  const available=[],now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const candidates=custom.length?custom:Array.from({length:Math.max(0,Math.ceil(((closeH*60+closeM)-(openH*60+openM))/60))},(_,i)=>minutesToTime(openH*60+openM+i*60));
  for(const time of candidates){const [h,m]=time.split(':').map(Number),minute=h*60+m;if(minute<openH*60+openM||minute+duration*60>closeH*60+closeM)continue;if(date===today&&minute<=now.getHours()*60+now.getMinutes())continue;if(isTimeAvailable(date,time,duration))available.push(time)}
  return available;
}
window.isTimeAvailable=isTimeAvailable;window.getAvailableTimes=getAvailableTimes;

function displayTime(time){const [h,m]=time.split(':').map(Number);return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}
function depositAmount(){return Number(state.service?.deposit??30)}
function niceDate(date){return new Intl.DateTimeFormat('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(new Date(`${date}T12:00:00`))}
function fail(message){$('#formError').textContent=message;return false}function clearError(){$('#formError').textContent=''}
function renderServices(){
  const requested=new URLSearchParams(location.search).get('service');
  const services=window.REMMY_SERVICES.filter(s=>s.available!==false);$('#bookingServices').innerHTML=services.map(s=>`<button type="button" class="service-option ${requested===s.id?'selected':''}" data-id="${s.id}"><img src="${s.image}" alt=""><span><b>${s.name}</b><small>$${s.price} · ${formatDuration(s.duration)}</small></span><i>✓</i></button>`).join('');
  if(requested)state.service=services.find(s=>s.id===requested)||null;
  document.querySelectorAll('.service-option').forEach(button=>button.addEventListener('click',()=>{state.service=window.REMMY_SERVICES.find(s=>s.id===button.dataset.id);document.querySelectorAll('.service-option').forEach(item=>item.classList.toggle('selected',item===button));updateAside();clearError();setTimeout(()=>go(2),220)}));
  updateAside();return Boolean(state.service);
}
function renderQuickDates(){
  const dates=[];let cursor=new Date();cursor.setHours(12,0,0,0);
  while(dates.length<6){const local=new Date(cursor),value=`${local.getFullYear()}-${String(local.getMonth()+1).padStart(2,'0')}-${String(local.getDate()).padStart(2,'0')}`;if(getAvailableTimes(value,state.service.duration).length)dates.push({value,date:local});cursor.setDate(cursor.getDate()+1)}
  $('#quickDates').innerHTML=dates.map(item=>`<button type="button" class="quick-date ${state.date===item.value?'selected':''}" data-date="${item.value}"><small>${item.date.toLocaleDateString('en-US',{weekday:'short'})}</small><b>${item.date.getDate()}</b><span>${item.date.toLocaleDateString('en-US',{month:'short'})}</span></button>`).join('');
  document.querySelectorAll('.quick-date').forEach(button=>button.onclick=()=>{state.date=button.dataset.date;state.time=null;$('#bookingDate').value=state.date;document.querySelectorAll('.quick-date').forEach(item=>item.classList.toggle('selected',item===button));renderTimes();updateAside();clearError()});
}
function renderTimes(){
  const times=getAvailableTimes(state.date,state.service.duration);$('#timeSection').classList.remove('hidden');
  $('#timeGrid').innerHTML=times.map(time=>`<button type="button" class="time-btn" data-time="${time}">${displayTime(time)}</button>`).join('');
  $('#timeNote').textContent=times.length?'Choose one available start time.':'No appointments fit on this date. Please choose another.';
  document.querySelectorAll('.time-btn').forEach(button=>button.addEventListener('click',()=>{state.time=button.dataset.time;document.querySelectorAll('.time-btn').forEach(item=>item.classList.toggle('selected',item===button));updateAside();clearError()}));
}
function updateAside(){if(!state.service)return;$('#asideSelection').classList.remove('hidden');$('#asideService').textContent=state.service.name;$('#asideWhen').textContent=state.date?`${niceDate(state.date)}${state.time?` · ${displayTime(state.time)}`:''}`:'Choose a date and time'}
function validateStep(){
  if(state.step===1&&!state.service)return fail('Please select a service.');
  if(state.step===2){const input=$('#bookingDate'),hours=RemmyStore.getBusinessHours()[new Date(`${input.value}T12:00:00`).getDay()];if(!input.value)return fail('Please select a date.');if(input.value<input.min)return fail('Past dates cannot be booked.');if(!hours?.available)return fail('The studio is closed on that day.');if(RemmyStore.getBlockedDates().some(item=>item.date===input.value))return fail('That date is unavailable.');if(!state.time)return fail('Please select an available time.');}
  if(state.step===3){for(const input of form.querySelectorAll('[data-step="3"] input[required]'))if(!input.checkValidity())return fail(input.type==='email'?'Enter a valid email address.':'Complete all required fields.');}
  return true;
}
function go(step){state.step=step;steps.forEach(item=>item.classList.toggle('active',+item.dataset.step===step));document.querySelectorAll('.progress-labels span').forEach((item,index)=>item.classList.toggle('active',index<step));$('#progressFill').style.width=`${step*25}%`;$('#backBtn').classList.toggle('hidden',step===1);$('#nextBtn').classList.toggle('hidden',step===4);$('#payBtn').classList.toggle('hidden',step!==4);$('#payBtn').textContent=`Pay $${depositAmount()} deposit & confirm`;if(step===2&&state.service)renderQuickDates();if(step===4)renderSummary();clearError();scrollTo({top:0,behavior:'smooth'})}
function customerName(){return `${form.firstName.value} ${form.lastName.value}`.trim()}
function renderSummary(target='#bookingSummary'){const s=state.service,deposit=depositAmount();$(target).innerHTML=`<div class="summary-feature"><small>Service</small><strong>${s.name}</strong><span>${niceDate(state.date)} · ${displayTime(state.time)}</span></div><div class="summary-row"><span>Duration</span><b>${formatDuration(s.duration)}</b></div><div class="summary-row"><span>Service price</span><b>$${s.price}</b></div><div class="summary-row"><span>Deposit</span><b>$${deposit}</b></div><div class="summary-row total"><span>Remaining balance</span><b>$${Math.max(0,s.price-deposit)}</b></div>${target==='#bookingSummary'?`<div class="summary-row"><span>Customer</span><b>${customerName()}</b></div>`:''}`;const policyDeposit=document.querySelector('.policy-brief li');if(policyDeposit)policyDeposit.textContent=`A $${deposit} non-refundable deposit is required to secure your appointment.`}
function makeReference(){return `RBP-${Math.floor(1000+Math.random()*9000)}`}
function startStripeCheckout(){/* Replace with a secure Stripe Checkout or Square redirect in production. */return Promise.resolve({demo:true,paid:true})}
async function notifyStylist(booking){try{return(await fetch('/api/notify-booking',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(booking)})).ok}catch{return false}}
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.policies.checked)return fail('Please agree to the booking policy.');if(!isTimeAvailable(state.date,state.time,state.service.duration))return fail('That time was just booked. Please choose another.');$('#payBtn').disabled=true;const payment=await startStripeCheckout();if(!payment.paid)return fail('Payment could not be completed.');const data=new FormData(form),booking={id:makeReference(),serviceId:state.service.id,service:state.service.name,price:state.service.price,duration:state.service.duration,date:state.date,startTime:state.time,endTime:endTime(state.time,state.service.duration),customerName:customerName(),email:data.get('email'),phone:data.get('phone'),instagram:data.get('instagram'),notes:data.get('notes'),deposit:depositAmount(),depositStatus:'paid-demo',status:'confirmed',createdAt:new Date().toISOString()};RemmyStore.saveBooking(booking);notifyStylist(booking);form.classList.add('hidden');$('#confirmation').classList.remove('hidden');$('#bookingRef').textContent=booking.id;renderSummary('#confirmationSummary');$('#calendarBtn').onclick=()=>downloadCalendar(booking)});
function downloadCalendar(b){const start=new Date(`${b.date}T${b.startTime}:00`),end=new Date(`${b.date}T${b.endTime}:00`),settings=RemmyStore.getReminderSettings(),hours=settings.hoursBefore==='custom'?Number(settings.customHours||24):Number(settings.hoursBefore||24),description=`Customer: ${b.customerName}\nService: ${b.service}\nDuration: ${formatDuration(b.duration)}\nPhone: ${b.phone}\nEmail: ${b.email}\nBooking reference: ${b.id}`,clean=value=>String(value).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;'),alarm=hours>0?`BEGIN:VALARM\r\nTRIGGER:-PT${hours}H\r\nACTION:DISPLAY\r\nDESCRIPTION:Upcoming Remmybeautyplus appointment\r\nEND:VALARM\r\n`:'';const ics=`BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Remmybeautyplus//Booking//EN\r\nBEGIN:VEVENT\r\nUID:${b.id}@remmybeautyplus.com\r\nDTSTAMP:${icsDate(new Date())}\r\nDTSTART:${icsDate(start)}\r\nDTEND:${icsDate(end)}\r\nSUMMARY:${clean(`${b.service} — Remmybeautyplus`)}\r\nDESCRIPTION:${clean(description)}\r\nLOCATION:Remmybeautyplus\r\n${alarm}END:VEVENT\r\nEND:VCALENDAR`,url=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})),a=document.createElement('a');a.href=url;a.download=`${b.id}.ics`;a.click();URL.revokeObjectURL(url)}
const icsDate=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
$('#nextBtn').onclick=()=>{if(validateStep())go(state.step+1)};$('#backBtn').onclick=()=>go(state.step-1);$('#bookingDate').addEventListener('change',event=>{state.date=event.target.value;state.time=null;if(state.date&&state.service){renderQuickDates();renderTimes();updateAside()}clearError()});$('#anotherBtn').onclick=()=>location.reload();const today=new Date();today.setMinutes(today.getMinutes()-today.getTimezoneOffset());$('#bookingDate').min=today.toISOString().split('T')[0];const hasRequestedService=renderServices();go(hasRequestedService?2:1);
