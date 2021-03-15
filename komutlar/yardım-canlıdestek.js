const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Canlı Destek Sistemi Yardım Menüsü `)
 .setDescription(`
 **${prefix}canlıdestek \n Destek sunucumuza canlı destek talebinde bulunursunuz.**
 
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["canlıdesteksistemi"] ,
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'canlıdesteksistemi',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};