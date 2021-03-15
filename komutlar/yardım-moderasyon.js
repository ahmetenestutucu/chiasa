const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Moderasyon Yardım Menüsü`)
 .setDescription(`
 <a:nymphdora_yildiz:809891719856128071>**${prefix}mod-log #kanal** \n-> Mod-log ayarlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}mod-log sıfırla** \n-> Mod-log sıfırlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}bansay** \n-> Sunucuda kaç banlanan üye olduğunu gösterir.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}ban @kullanıcı** \n-> Etiketlediğiniz kullanıcıyı banlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}küfürengel** \n-> Küfür engel açar/kapatır.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}küfürlog #kanal** \n-> Küfür-log ayarlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}reklamengel** \n-> Reklam engel açar/kapatır.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}reklamlog #kanal** \n-> Reklam-log ayarlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}sa-as aç** \n-> SA-AS sistemini açar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}sa-as kapat** \n-> SA-AS sistemini kapatır.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}sil** \n-> Yazdığınız miktar kadar mesaj siler.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}say** \n-> Sunucu bilgilerini gösterir.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}oylama** \n-> Oylama yapar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}otorol-ayarla @rol #kanal** \n-> Otorol ayarlar.
<a:nymphdora_yildiz:809891719856128071>**${prefix}otorol-sıfırla** \n-> Otorol sıfırlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}otorol-mesaj-ayarla** \n-> Otorol mesajı ayarlar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}otorol-mesaj-sıfırla** \n-> Otorol mesajı sıfırlar.
<a:nymphdora_yildiz:809891719856128071>**${prefix}emoji** \n-> Emoji Kurar
<a:nymphdora_yildiz:809891719856128071>**${prefix}isimreklamkoruma**\n-> Sunucunuza reklam yapmak isteyenleri Banlar.
<a:nymphdora_yildiz:809891719856128071>**${prefix}sayaçyardım** \n-> Sayaç yardım sayfasını açar
`)
 .setTimestamp()
 message.channel.send(WestraEmbed)
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['mod'],
  kategori: "Bot",
  permLevel: 0
};

exports.help = {
  name: 'moderasyon',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};