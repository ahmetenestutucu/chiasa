const WestraDiscord = require('discord.js');
const WestraClient = new WestraDiscord.Client();
const ayarlar = require('../ayarlar.json');
let prefix = ayarlar.prefix

exports.run = (client, message) => {
 const WestraEmbed = new WestraDiscord.MessageEmbed()
  .setColor(0x36393F)
 .setAuthor(`${client.user.username} | Kullanıcı Yardım Menüsü`)
 .setDescription(`
 <a:nymphdora_yildiz:809891719856128071>**${prefix}davet** \n-> Botu davet edersiniz.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}shardbilgi** \n-> Botun shard bilgilerini gösterir.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}avatar** \n-> Etiketlediğiniz kişinin avatarını gösterir.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}randompp** \n-> Botun ekli olduğu sunuculardaki her hangi birinin avatarını atar.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}öneri** \n-> Bota öneri belirtirsiniz.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}istatistik** \n-> Botun istatistiğini gösterir.
 <a:nymphdora_yildiz:809891719856128071>**${prefix}sonmesaj** \n-> Yazdığınız son mesajı gösterir.
`)
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
  name: 'kullanıcı',
  description: 'Bot ile ilgili bilgi verir.',
  usage: 'bilgi'
};