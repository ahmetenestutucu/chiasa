const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Moderasyon Yardım Menüsü`)
 .setDescription(`
 <a:mavi:772331912579645449> **${prefix}gold-sürem**: \n -> Gold Sürenizi Gösterir.
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['diğer'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'diğer',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};