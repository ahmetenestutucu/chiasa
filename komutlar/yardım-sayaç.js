const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Sayaç Yardım Menüsü`)
 .setDescription(`
 <a:mavi:772331912579645449>**${prefix}sayaç <kişisayısı>** : Sayacın kişi sayısını ayarlarsınız.
<a:mavi:772331912579645449>**${prefix}sayaç-kanal-ayarla** : Sayac kanalını ayarlarsınız. 
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['sayaçyardım'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'sayaçyardım',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};