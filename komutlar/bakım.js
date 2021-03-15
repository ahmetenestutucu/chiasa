const Discord = require('discord.js')
const db = require('quick.db')

exports.run = (client, message, args) => {
  
  if(message.author.id != "694493379869802587") return
  
  if(!args[0]) return message.channel.send('<a:nymphdora_warning:809866423455055874> Bakım modunu açmak için w!bakım aç')
  
  if(args[0] === 'aç') {
    if(db.fetch(`bakim`)) return message.channel.send('<a:nymphdora_warning:809866423455055874> Bakım modu zaten açık')
    message.channel.send('<a:nymphdora_yildiz:809891719856128071> Bakım modu açıldı.')
    db.set(`bakim`, 'acik')
  }
  if(args[0] === 'kapat'){
    if(!db.fetch(`bakim`)) return message.channel.send('<a:nymphdora_warning:809866423455055874> Bakım modu zaten kapalı.')
    message.channel.send('<a:nymphdora_yildiz:809891719856128071> Bakım modu kapatıldı.')
    db.delete(`bakim`)
  }
  
}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
}

exports.help = {
  name: 'bakım'
}