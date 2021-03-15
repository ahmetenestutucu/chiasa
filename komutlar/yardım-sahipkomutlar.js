const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
if(message.author.id !== "694493379869802587") {
 return message.reply('Bu komutu sadece sahibim kullanabilir.')
}
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Sahip  Yardım Menüsü`)
 .setDescription(`
 <a:nymphdora_elmas:809866428797943869> **${prefix}eval -> Kod deneme 
 <a:nymphdora_elmas:809866428797943869> **${prefix}top 10 -> ölesine komut
 <a:nymphdora_elmas:809866428797943869> **${prefix}ping -> pinge bakarız 
<a:nymphdora_elmas:809866428797943869> **${prefix}bakım -> Botu Bakıma alırsınız
<a:nymphdora_elmas:809866428797943869> ${prefix}sunucular -> Sunuculara bakarsın
<a:nymphdora_elmas:809866428797943869> ${prefix}gold-yap -> gold yaparsın

`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['wings'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'wings',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};