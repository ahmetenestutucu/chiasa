const Discord = require('discord.js');

exports.run = async (client, message, args) => {// can#0002

let target = message.mentions.users.first() || message.author;
message.channel.send(new Discord.MessageEmbed()
.setAuthor(target.tag, target.displayAvatarURL({ dynamic: true }))
.setTitle('<a:nymphdora_yildiz:809891719856128071> İşte avatarın dostum ')
.setImage(target.displayAvatarURL({ dynamic: true, size: 512 })));
                     
}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['av'],
  permLevel: 0
};
 
exports.help = {
  name: 'avatar'
};// codare 