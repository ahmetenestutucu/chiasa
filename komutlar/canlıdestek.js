const Discord = require('discord.js')
const fs = require('fs');
const ms = require("ms")
const db = require('quick.db')
exports.run = async (client, message, args) => {
  	if (!message.guild) {
    const ozelmesajuyari = new Discord.MessageEmbed()
    .setColor(0xFF0000)
    .setTimestamp()
    .setAuthor(message.author.username, message.author.avatarURL())
    .addField(':warning: Uyarı :warning:', '`!sunucutanıt` adlı komutu özel mesajlarda kullanamazsın.')
    return message.author.send(ozelmesajuyari); }
    if(!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("Bu Komutu kullanmanız için `Sunucu_Yönet` Yetkisine sahip olmalısınız.")
    let kullanildii = JSON.parse(fs.readFileSync('./canlıdesteksistemi.json', 'utf8'));
  if (!kullanildii[message.guild.id]) kullanildii[message.guild.id] = {
    gunlukkullanim: 0
  }
  if (kullanildii[message.guild.id].gunlukkullanim == 0)
  {
        const embed = new Discord.MessageEmbed()
  .setTitle('BAŞARILI')
  .setDescription('Sunucu [Burada](https://discord.gg/KqNZDxdg5t) Tanıtıldı! \n\n 12 Saat Sonra Tekrar Yardım isteyebilirsin. \n\n Sunucuna  Beni [Ekle!](https://discord.com/api/oauth2/authorize?client_id=780832064664502302&permissions=8&scope=bot)')
  .setColor('GREEN')
 message.channel.send(embed);
    message.channel.createInvite({maxAge: 0}).then((invite) => {
        const embed = new Discord.MessageEmbed()
            .addField(` Sunucu Sahibi`, message.author.tag, true)
            .addField(` Sunucu İsmi`, message.guild.name, true)
      .addField(` Sunucudakı Üye Sayısı`, message.guild.members.cache.size, true)
      .addField(` Sunucu Davet Linki`, invite.url, true)
            .setColor('RANDOM')
      .setThumbnail(message.guild.iconURL())
       client.channels.cache.get('808215668515536896').send(embed)
            });
  kullanildii[message.guild.id].gunlukkullanim = 1
    
  fs.writeFile('./canlıdesteksistemi.json', JSON.stringify(kullanildii), (err) => {
      if (err) console.error(err)
    })
  return
  }
  setTimeout(async() => {
    kullanildii[message.guild.id].gunlukkullanim = 0
    fs.writeFile('./canlıdesteksistemi.json', JSON.stringify(kullanildii), (err) => {
      if (err) console.error(err)
    })
  }, ms('12h'));
  
  if (kullanildii[message.guild.id].gunlukkullanim == 1)
  {
  message.channel.send({embed: {
      description: '**BAŞARISIZ TANITIM** \n\nBu komut zaten kullanılmış!\n\n 12 Saatte 1 defa yardım isteyebilirsin \n\n[Botu davet Et](https://discord.com/api/oauth2/authorize?client_id=780832064664502302&permissions=8&scope=bot)'
            }});
  }
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['canlıdestek'],
    permLevel: 2,
}
exports.help = {
    name: 'canlıdestek',
    description: 'Sunuzunuzu Tanıtmak İçin En Uygun Kod!',
    usage: 'canlıdestek'
}//sunucutanıt.json oluşturup içine {} yazın.