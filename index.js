const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
});

client.on('qr', qr => {
  console.log('ESCANEA ESTE QR CON TU IPHONE EXTRA:');
  qrcode.generate(qr, {small: true});
});

client.on('ready', () => console.log('✅ Bot listo y en el grupo!'));

client.on('message', async msg => {
  if (msg.isStatus) return;
  const match = msg.body.match(/(\d{3}[\s-]?\d{3}[\s-]?\d{4})/);
  if (!match) return;

  const tel = match[0].replace(/\D/g,'');
  let servicio = '📦 Otro';
  if(/pipa|agua|tinaco/i.test(msg.body)) servicio = '💧 Pipa';
  if(/plomero|fuga|lavavajillas|drenaje/i.test(msg.body)) servicio = '🔧 Plomería';
  if(/filtro|impac/i.test(msg.body)) servicio = '🧊 Filtro';
  if(/luz|electric/i.test(msg.body)) servicio = '🔌 Electricista';
  if(/cerrajero|chapa/i.test(msg.body)) servicio = '🔑 Cerrajero';

  console.log(`Nuevo: ${servicio} - ${tel} de ${msg._data.notifyName}`);
  await msg.reply(`✅ Guardado en directorio:\n${servicio}\n📞 ${tel}\n👤 ${msg._data.notifyName}\n🔗 wa.me/52${tel}`);
});

client.initialize();
