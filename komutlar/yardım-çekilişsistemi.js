const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let Prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Çekiliş Sistemi Yardım Menüsü`)
 .setDescription(`
 <a:nymphdora_party:809866432523141210>**${Prefix}çekiliş** \n-> Çekiliş başlatır.
 <a:nymphdora_party:809866432523141210>**${Prefix}reroll** \n-> Çekilişi yeniden çeker.
 <a:nymphdora_party:809866432523141210>**${Prefix}çekilişbitir** \n-> Çekilişi bitirir.
`)
 .setFooter(`Wing's `)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'çekilişsistemi',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};