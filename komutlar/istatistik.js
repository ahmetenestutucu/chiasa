const Discord = require("discord.js");
const moment = require("moment");
const os = require("os");
require("moment-duration-format");
exports.run = async (client, message, args) => {
  const seksizaman = moment
    .duration(client.uptime)
    .format(" D [gün], H [saat], m [dakika], s [saniye]");
  const istatistikler = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setTimestamp()
    .setFooter("© 2021 Wings Bot", client.user.avatarURL())
    .addField(" <a:nymphdora_sari:809866423689674772> **Botun Sahibi**", "<@694493379869802587>  ")
.addField(" <a:nymphdora_sari:809866423689674772> **Geliştirici**", " <@647732588949012512>")
    .addField("<a:nymphdora_sari:809866423689674772> **Gecikme süreleri**","Mesaj Gecikmesi: {ping1} ms \nBot Gecikmesi: {ping2} ms"
        .replace("{ping1}", new Date().getTime() - message.createdTimestamp)
        .replace("{ping2}", client.ws.ping),true)
    .addField("<a:nymphdora_sari:809866423689674772> **Bellek kullanımı**",(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2) + " MB",true)
    .addField("<a:nymphdora_sari:809866423689674772> **Çalışma süresi**", seksizaman, true)
    .addField("<a:nymphdora_sari:809866423689674772> **Kullanıcılar**",client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString(), true)
    .addField("<a:nymphdora_sari:809866423689674772> **Sunucular**", client.guilds.cache.size.toLocaleString(), true)
    .addField("<a:nymphdora_sari:809866423689674772> **Kanallar**", client.channels.cache.size.toLocaleString(), true)
    .addField("<a:nymphdora_sari:809866423689674772> **Discord.JS sürüm**", "v" + Discord.version, true)
    .addField("<a:nymphdora_sari:809866423689674772> **Node.JS sürüm**", `${process.version}`, true)
    .addField("<a:nymphdora_sari:809866423689674772> **Bit**", `\`${os.arch()}\``, true)
    .addField("**» Bot Davet**"," [Davet Et](https://discordapp.com/oauth2/authorize?client_id=" + client.user.id + "&scope=bot&permissions=8)");
  return message.channel.send(istatistikler);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["i"],
  permLevel: 0
};

exports.help = {
  name: "istatistik",
  description: "Botun istatistiklerini gösterir",
  usage: "istatistik"
};
