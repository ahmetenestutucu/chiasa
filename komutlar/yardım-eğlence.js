const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Eğlence Yardım Menüsü`)
 .setDescription(`
 <a:mavi:772331912579645449>**${prefix}kralol** -> Kral Olmak kulağa güzel geliyor... 
<a:mavi:772331912579645449>**${prefix}kaçcm** -> Malafatınızı Ölçmek Kulağa hoş geliyor...
<a:mavi:772331912579645449>**${prefix}boğazla** -> Birini boğazlarsınız dikkatli ol ölmesin.
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['eğlence'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'eğlence',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};