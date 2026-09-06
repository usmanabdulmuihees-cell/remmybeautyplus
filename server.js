const express = require('express');
const twilio = require('twilio');
const path = require('path');

const app = express();
const port = process.env.PORT || 8000;
const notificationNumber = '+13477813754';

app.use(express.json({limit:'20kb'}));
app.use(express.static(__dirname));

app.post('/api/notify-booking', async (req,res) => {
  const {id,customerName,service,date,startTime,phone} = req.body || {};
  if(!id || !customerName || !service || !date || !startTime || !phone){
    return res.status(400).json({error:'Missing booking information.'});
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;
  if(!accountSid || !authToken || !from){
    console.warn('Booking saved, but Twilio environment variables are not configured.');
    return res.status(503).json({error:'SMS notifications are not configured.'});
  }

  // The destination is kept server-side so visitors cannot use this endpoint to text arbitrary numbers.
  const safe = value => String(value).replace(/[\r\n]/g,' ').slice(0,120);
  const body = `New Remmybeautyplus appointment!\n${safe(customerName)} — ${safe(service)}\n${safe(date)} at ${safe(startTime)}\nClient: ${safe(phone)}\nReference: ${safe(id)}`;
  try{
    const client = twilio(accountSid,authToken);
    const message = await client.messages.create({body,from,to:notificationNumber});
    res.json({sent:true,messageId:message.sid});
  }catch(error){
    console.error('Twilio SMS failed:',error.message);
    res.status(502).json({error:'SMS could not be sent.'});
  }
});

app.listen(port,()=>console.log(`Remmybeautyplus running at http://localhost:${port}`));
