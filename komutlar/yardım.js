const Discord = require('discord.js')
const client = new Discord.Client()
const db = require('quick.db')
exports.run = (client, message, args, member) => {
const yardım = new Discord.MessageEmbed()
  .setAuthor(`Wings Yardım Menüsü`, client.user.avatarURL())
  .setColor("0x36393F")
  .setThumbnail(client.user.avatarURL())
  .setDescription(`<a:nymphdora_yildiz:809891719856128071> • Hey! <@${message.author.id}> beni kullandığın için teşekkür ederim!\n <a:nymphdora_yildiz:809891719856128071> •  Prefixim: **w!**\n <a:nymphdora_yildiz:809891719856128071> • Dilim: **TR** :flag_tr:\n <a:nymphdora_yildiz:809891719856128071> • Üyelik durumu: ${db.has(`üyelikk_${message.author.id}`, "üyelik") ? `**Gold üye!**` : `**Normal üye!**`}`)
  .addField(" • Kategoriler:", `<a:nymphdora_warning:809866433878032435> • w!kullanıcı: **Kullanıcı yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!moderasyon: **Moderasyon yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!kayıtsistemi: ** Kayıt sistemi yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!korumasistemi: ** Koruma sistemi yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!logosistemi: ** Logo sistemi yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!çekilişsistemi: ** Çekiliş sistemi yardım menüsünü gösterir.**\n <a:nymphdora_warning:809866433878032435> • w!moderasyon2:** Moderasyon 2 sayfayı Açar.**\n <a:nymphdora_warning:809866433878032435> • w!wings:**Sahip Komutlarını açar.**\n <a:nymphdora_warning:809866433878032435> • w!diğer : **Diğer komutları gösterir.**`)
  .addField(" <a:nymphdora_yildiz:809891719856128071> • Güncelleme Notları:", "<a:nymphdora_yildiz:809891719856128071> **Güncelleme v0.7:** Anti raid Sistemi Eklendi !! \n <a:nymphdora_yildiz:809891719856128071> **Güncelleme v0.5:** Emoji Kurma sistemi Eklendi !!")

  .addField(" • Linkler:", "• [Davet Et](https://discord.com/api/oauth2/authorize?client_id=780832064664502302&permissions=8&scope=bot) • [Destek Sunucusu](https://discord.gg/uGaVXZxA8C) • [Web Site](Link) •")
  .setImage("")
.setFooter("Wings", message.author.avatarURL())
.setTimestamp()
  message.channel.send(yardım)
}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["y", "help", "h"],
    permLevel: 0
}

exports.help = {
    name: "yardım",
    description: "westra",
    usage: "westra"
}