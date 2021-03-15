const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Moderasyon Yardım Menüsü`)
 .setDescription(`
 <a:ayarlar:816968650758160394>**${prefix}anti-raid aç** \n -> Anti Raid sistemini açar. 
<a:ayarlar:816968650758160394>**${prefix}bot-izni ver <botID>** \n Anti Raid İçin izin verirsiniz.
<a:ayarlar:816968650758160394>**${prefix}bot-izni kaldır <botID>** \n Anti Raid İçin izini kaldırırsınız.
<a:ayarlar:816968650758160394>**${prefix}prefix ** \n Prefix Değiştirme Yöntemi.
<a:ayarlar:816968650758160394>**${prefix}nuke ** \n Kanalı yeniden Başlatır.
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['mod2'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'moderasyon2',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};