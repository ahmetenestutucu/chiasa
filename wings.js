const Discord = require("discord.js");
const client = new Discord.Client();
const asreaper = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
require("./util/eventLoader.js")(client);
const db = require("quick.db");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

//-----------------------------------------------\\
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log("Asreaper pinglendi.");
  response.sendStatus(200);
});
//app.listen(8000);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);
//-----------------------------------------------\\

var prefix = asreaper.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === asreaper.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(asreaper.token);

///reklam-engel

const reklam = [
  ".com",
  ".net",
  ".xyz",
  ".tk",
  ".pw",
  ".io",
  ".me",
  ".gg",
  "www.",
  "https",
  "http",
  ".gl",
  ".org",
  ".com.tr",
  ".biz",
  "net",
  ".rf",
  ".gd",
  ".az",
  ".party",
  ".gf"
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`reklam.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`reklam.${nev.member.guild.id}.kanal`);
    if (i) {
      if (reklam.some(word => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
        const embed = new Discord.MessageEmbed()
          .setColor(0x36393f)
          .setDescription(
            ` ${nev.author} , <a:unlem:772331901033512960> ** Dostum ben akıllı bir botum Mesajını editleyerek reklam yapmaya çalışma!!!**`
          )
          .addField("Mesajı:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor(0x36393f)
          .setDescription(
            ` ${nev.author} , <a:unlem:772331901033512960> **Hey!! Mesajı editleyerek reklam yapamana izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`reklam.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`reklam.${msg.member.guild.id}.durum`);
  if (i) {
    if (reklam.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor(0x36393f)
            .setDescription(
              ` <@${msg.author.id}> , <a:unlem:772331901033512960> **Hey !! Bu sunucuda Reklamı engelliyorum !!**`
            );
          msg.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
          const embed = new Discord.MessageEmbed()
            .setColor(0x36393f)
            .setDescription(` ${msg.author} , <a:unlem:772331901033512960>** Hey!! Bu sunucuda reklamları engelliyorum !!**`)
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//reklam engel son //

client.on("guildBanAdd", async (guild, user) => {
  let kontrol = await db.fetch(`dil_${guild.id}`);
  let kanal = await db.fetch(`bank_${guild.id}`);
  let rol = await db.fetch(`banrol_${guild.id}`);
  if (!kanal) return;
  if (kontrol == "agayokaga") {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor(0x36393f)
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan açıldı!\nve yasaklanan kişinin yasağı kalktı!`
      );
    client.channels.cache.get(kanal).send(embed);
  } else {
    const entry = await guild
      .fetchAuditLogs({ type: "GUILD_BAN_ADD" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    guild.members.unban(user.id);
    guild.members.cache.get(entry.executor.id).kick();
    const embed = new Discord.MessageEmbed()
      .setTitle(`Biri Yasaklandı!`)
      .setColor(0x36393f)
      .addField(`Yasaklayan:`, entry.executor.tag)
      .addField(`Yasaklanan Kişi:`, user.name)
      .addField(
        `Sonuç:`,
        `Yasaklayan kişi sunucudan atıldı ve yasaklanan kişinin yasağı kalktı. `
      );
    client.channels.cache.get(kanal).send(embed);
  }
});
client.on("roleDelete", async role => {
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  let rol = await db.fetch(`rolrol_${role.guild.id}`);
  let kontrol = await db.fetch(`dil_${role.guild.id}`);
  let kanal = await db.fetch(`rolk_${role.guild.id}`);
  if (!kanal) return;
  if (kontrol == "TR_tr") {
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == role.guild.owner.id) return;
    role.guild.roles
      .create({
        data: {
          name: role.name
        }
      })
      .then(r => r.setPosition(role.position));

    const embed = new Discord.MessageEmbed()
      .setTitle(`Bir Rol Silindi!`)
      .setColor(0x36393f)
      .addField(`Silen:`, entry.executor.tag)
      .addField(`Silinen Rol:`, role.name)
      .addField(`Sonuç:`, `Rol Geri Açıldı!`);
    client.channels.cache.get(kanal).send(embed);
  } else {
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == role.guild.owner.id) return;
    role.guild.roles
      .create({
        data: {
          name: role.name
        }
      })
      .then(r => r.setPosition(role.position));

    const embed = new Discord.MessageEmbed()
      .setTitle(`Bir Rol Silindi!`)
      .setColor(0x36393f)
      .addField(`Silen:`, entry.executor.tag)
      .addField(`Silinen Rol:`, role.name)
      .addField(`Sonuç:`, `Silinen Rol Geri Açıldı!`);
    client.channels.cache.get(kanal).send(embed);
  }
});

/// modlog sistemi

client.on("messageDelete", async message => {
  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "");

  log.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let modlog = await db.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

    .addField("**Eylem:**", "Mesaj Düzenleme")

    .addField(
      "**Mesajın sahibi:**",
      `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
    )

    .addField("**Eski Mesajı:**", `${oldMessage.content}`)

    .addField("**Yeni Mesajı:**", `${newMessage.content}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
      oldMessage.guild.iconURL()
    )

    .setThumbnail(oldMessage.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelCreate", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `<#${channel.id}>`;

  if (channel.type === "voice") kanal = `\`${channel.name}\``;

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal:**", `${kanal}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconUR);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelDelete", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal:**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleCreate", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Oluşturma")

    .addField("**Rolü oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Silme")

    .addField("**Rolü silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Oluşturma")

    .addField("**Emojiyi oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan emoji:**", `${emoji} - İsmi: \`${emoji.name}\``)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Silme")

    .addField("**Emojiyi silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen emoji:**", `${emoji}`)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Güncelleme")

    .addField("**Emojiyi güncelleyen kişi:**", `<@${entry.executor.id}>`)

    .addField(
      "**Güncellenmeden önceki emoji:**",
      `${oldEmoji} - İsmi: \`${oldEmoji.name}\``
    )

    .addField(
      "**Güncellendikten sonraki emoji:**",
      `${newEmoji} - İsmi: \`${newEmoji.name}\``
    )

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
      oldEmoji.guild.iconURL
    )

    .setThumbnail(oldEmoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanAdd", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasaklama")

    .addField("**Kullanıcıyı yasaklayan yetkili:**", `<@${entry.executor.id}>`)

    .addField("**Yasaklanan kullanıcı:**", `**${user.tag}** - ${user.id}`)

    .addField("**Yasaklanma sebebi:**", `${entry.reason}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanRemove", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasak kaldırma")

    .addField("**Yasağı kaldıran yetkili:**", `<@${entry.executor.id}>`)

    .addField(
      "**Yasağı kaldırılan kullanıcı:**",
      `**${user.tag}** - ${user.id}`
    )

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});
// mod log son ///

// çekiliş sistemi

const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: "#FF0000",
    reaction: "🎉"
  } //#FF0000
});

//// otorol sistemi

client.on("guildMemberAdd", async member => {
  let kanal = await db.fetch(`otoRK_${member.guild.id}`);
  let rol = await db.fetch(`otoRL_${member.guild.id}`);
  let mesaj = db.fetch(`otoRM_${member.guild.id}`);
  if (!rol) return;
  const benwestranasilsinizefenimmmmasdasd = new Discord.MessageEmbed()
    .setColor("BLUE")
    .setTimestamp()
    .setFooter(`Asreaper`)
    .setDescription(
      " **" +
        member.user.username +
        "** hoş geldin! Otomatik rolün verildi. Seninle beraber **" +
        member.guild.memberCount +
        " **kişiyiz!"
    );
  if (!mesaj) {
    client.channels.cache.get(kanal).send(benwestranasilsinizefenimmmmasdasd);
    return member.roles.add(rol);
  }

  if (mesaj) {
    var mesajs = mesaj
      .replace("-uye-", `${member.user}`)
      .replace("-uyetag-", `${member.user.tag}`)
      .replace("-rol-", `${member.guild.roles.cache.get(rol).name}`)
      .replace("-server-", `${member.guild.name}`)
      .replace("-uyesayisi-", `${member.guild.memberCount}`)
      .replace(
        "-botsayisi-",
        `${member.guild.members.cache.filter(m => m.user.bot).size}`
      )
      .replace("-bolge-", `${member.guild.region}`)
      .replace("-kanalsayisi-", `${member.guild.channels.cache.size}`);
    member.roles.add(rol);
    return client.channels.cache.get(kanal).send(mesajs);
  }
});

//////

// spam engel

const dctrat = require("dctr-antispam.js");

var authors = [];
var warned = [];

var messageLog = [];

client.on("message", async message => {
  const spam = await db.fetch(`spam.${message.guild.id}`);
  if (!spam) return;
  const maxTime = await db.fetch(
    `max.${message.guild.id}.${message.author.id}`
  );
  const timeout = await db.fetch(
    `time.${message.guild.id}.${message.author.id}`
  );
  db.add(`mesaj.${message.guild.id}.${message.author.id}`, 1);
  if (timeout) {
    const sayı = await db.fetch(
      `mesaj.${message.guild.id}.${message.author.id}`
    );
    if (Date.now() < maxTime) {
      const westraaaaam = new Discord.MessageEmbed()
        .setColor(0x36393f)
        .setDescription(
          ` <@${message.author.id}> , **Bu sunucuda spam yapmak yasak!**`
        );
      // .setFooter(`Bu mesaj otomatik olarak silinecektir.`)
      if (message.member.hasPermission("BAN_MEMBERS")) return;
      message.channel
        .send(westraaaaam)
        .then(msg => msg.delete({ timeout: 1500 }));
      return message.delete();
    }
  } else {
    db.set(`time.${message.guild.id}.${message.author.id}`, "ok");
    db.set(`max.${message.guild.id}.${message.author.id}`, Date.now() + 3000);
    setTimeout(() => {
      db.delete(`mesaj.${message.guild.id}.${message.author.id}`);
      db.delete(`time.${message.guild.id}.${message.author.id}`);
    }, 500); // default : 500
  }
});

/////

/ AYARLANABİLİR KAYIT KANAL / /
  client.on("guildMemberAdd", member => {
    let guild = member.guild;
    let kanal = db.fetch(`kayıthg_${member.guild.id}`);
    let kayıtçı = db.fetch(`kayıtçırol_${member.guild.id}`);
    let aylartoplam = {
      "01": "Ocak",
      "02": "Şubat",
      "03": "Mart",
      "04": "Nisan",
      "05": "Mayıs",
      "06": "Haziran",
      "07": "Temmuz",
      "08": "Ağustos",
      "09": "Eylül",
      "10": "Ekim",
      "11": "Kasım",
      "12": "Aralık"
    };
    let aylar = aylartoplam;

    let user = client.users.cache.get(member.id);
    require("moment-duration-format");

    const kurulus = new Date().getTime() - user.createdAt.getTime();
    const ayyy = moment.duration(kurulus).format("M");
    var kontrol = [];

    if (ayyy < 1) {
      kontrol = ":x: **Şüpheli** ";
    }
    if (ayyy > 1) {
      kontrol = "<:dogruland:798063635045679135> **Güvenilir** ";
    }

    if (!kanal) return;

    ///////////////////////

    let randomgif = [
      "https://media.discordapp.net/attachments/744976703163728032/751451554132918323/tenor-1.gif",
      "https://media.discordapp.net/attachments/744976703163728032/751451693992116284/black.gif",
      "https://media.discordapp.net/attachments/765870655958548490/765871557993824256/tumblr_ozitqtbIIf1tkflzao1_540.gif",
      "https://media.discordapp.net/attachments/765870655958548490/765871565257965578/68747470733a2f2f692e70696e696d672e636f6d2f6f726967696e616c732f32622f61352f31312f32626135313161663865.gif"
    ];

    ///////////////////
    const embed = new Discord.MessageEmbed()
      .setColor(0x36393f)
      .setImage(randomgif[Math.floor(Math.random() * randomgif.length)])
      .setThumbnail(
        user.avatarURL({
          dynamic: true,
          format: "gif",
          format: "png",
          format: "jpg",
          size: 2048
        })
      )

      //
      .setDescription(
        ` <:wings_ok:807849102582612029> **Hoş geldin!** ${member.user}, seninle beraber **${
          guild.memberCount
        }** kişi olduk! \n <:daimon_GzKrpanYzPng:797878342530367518>  Kaydının yapılması için **isim** ve **yaş** yazman gerek. \n <:daimon_dedektifpink:795707757705035826>  Hesap kuruluş tarihi: **${moment(
          user.createdAt
        ).format("DD")} ${aylar[moment(user.createdAt).format("MM")]} ${moment(
          user.createdAt
        ).format(
          "YYYY HH:mm:ss"
        )}** \n  Bu vatandaş: ${kontrol} \n  <@&${kayıtçı}> rolündeki yetkililer sizinle ilgilenecektir.`
      );
    //
    client.channels.cache.get(kanal).send(embed);
    client.channels.cache.get(kanal).send(`<@&${kayıtçı}>`);
  });

//kayıt kanal son //

/// modlog sistemi

client.on("messageDelete", async message => {
  if (message.author.bot || message.channel.type == "dm") return;

  let log = message.guild.channels.cache.get(
    await db.fetch(`log_${message.guild.id}`)
  );

  if (!log) return;

  const embed = new Discord.MessageEmbed()

    .setTitle(message.author.username + " | Mesaj Silindi")

    .addField("Kullanıcı: ", message.author)

    .addField("Kanal: ", message.channel)

    .addField("Mesaj: ", "" + message.content + "");

  log.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  let modlog = await db.fetch(`log_${oldMessage.guild.id}`);

  if (!modlog) return;

  let embed = new Discord.MessageEmbed()

    .setAuthor(oldMessage.author.username, oldMessage.author.avatarURL())

    .addField("**Eylem:**", "Mesaj Düzenleme")

    .addField(
      "**Mesajın sahibi:**",
      `<@${oldMessage.author.id}> === **${oldMessage.author.id}**`
    )

    .addField("**Eski Mesajı:**", `${oldMessage.content}`)

    .addField("**Yeni Mesajı:**", `${newMessage.content}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${oldMessage.guild.name} - ${oldMessage.guild.id}`,
      oldMessage.guild.iconURL()
    )

    .setThumbnail(oldMessage.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelCreate", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_CREATE" })
    .then(audit => audit.entries.first());

  let kanal;

  if (channel.type === "text") kanal = `<#${channel.id}>`;

  if (channel.type === "voice") kanal = `\`${channel.name}\``;

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Oluşturma")

    .addField("**Kanalı Oluşturan Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturduğu Kanal:**", `${kanal}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconUR);

  client.channels.cache.get(modlog).send(embed);
});

client.on("channelDelete", async channel => {
  let modlog = await db.fetch(`log_${channel.guild.id}`);

  if (!modlog) return;

  const entry = await channel.guild
    .fetchAuditLogs({ type: "CHANNEL_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Kanal Silme")

    .addField("**Kanalı Silen Kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen Kanal:**", `\`${channel.name}\``)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${channel.guild.name} - ${channel.guild.id}`,
      channel.guild.iconURL()
    )

    .setThumbnail(channel.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleCreate", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Oluşturma")

    .addField("**Rolü oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("roleDelete", async role => {
  let modlog = await db.fetch(`log_${role.guild.id}`);

  if (!modlog) return;

  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Rol Silme")

    .addField("**Rolü silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen rol:**", `\`${role.name}\` **=** \`${role.id}\``)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${role.guild.name} - ${role.guild.id}`,
      role.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(role.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiCreate", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_CREATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Oluşturma")

    .addField("**Emojiyi oluşturan kişi:**", `<@${entry.executor.id}>`)

    .addField("**Oluşturulan emoji:**", `${emoji} - İsmi: \`${emoji.name}\``)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiDelete", async emoji => {
  let modlog = await db.fetch(`log_${emoji.guild.id}`);

  if (!modlog) return;

  const entry = await emoji.guild
    .fetchAuditLogs({ type: "EMOJI_DELETE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Silme")

    .addField("**Emojiyi silen kişi:**", `<@${entry.executor.id}>`)

    .addField("**Silinen emoji:**", `${emoji}`)

    .setTimestamp()

    .setFooter(
      `Sunucu: ${emoji.guild.name} - ${emoji.guild.id}`,
      emoji.guild.iconURL
    )

    .setColor(0x36393f)

    .setThumbnail(emoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
  let modlog = await db.fetch(`log_${oldEmoji.guild.id}`);

  if (!modlog) return;

  const entry = await oldEmoji.guild
    .fetchAuditLogs({ type: "EMOJI_UPDATE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Emoji Güncelleme")

    .addField("**Emojiyi güncelleyen kişi:**", `<@${entry.executor.id}>`)

    .addField(
      "**Güncellenmeden önceki emoji:**",
      `${oldEmoji} - İsmi: \`${oldEmoji.name}\``
    )

    .addField(
      "**Güncellendikten sonraki emoji:**",
      `${newEmoji} - İsmi: \`${newEmoji.name}\``
    )

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(
      `Sunucu: ${oldEmoji.guild.name} - ${oldEmoji.guild.id}`,
      oldEmoji.guild.iconURL
    )

    .setThumbnail(oldEmoji.guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanAdd", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasaklama")

    .addField("**Kullanıcıyı yasaklayan yetkili:**", `<@${entry.executor.id}>`)

    .addField("**Yasaklanan kullanıcı:**", `**${user.tag}** - ${user.id}`)

    .addField("**Yasaklanma sebebi:**", `${entry.reason}`)

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});

client.on("guildBanRemove", async (guild, user) => {
  let modlog = await db.fetch(`log_${guild.id}`);

  if (!modlog) return;

  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" })
    .then(audit => audit.entries.first());

  let embed = new Discord.MessageEmbed()

    .setAuthor(entry.executor.username, entry.executor.avatarURL())

    .addField("**Eylem:**", "Yasak kaldırma")

    .addField("**Yasağı kaldıran yetkili:**", `<@${entry.executor.id}>`)

    .addField(
      "**Yasağı kaldırılan kullanıcı:**",
      `**${user.tag}** - ${user.id}`
    )

    .setTimestamp()

    .setColor(0x36393f)

    .setFooter(`Sunucu: ${guild.name} - ${guild.id}`, guild.iconURL)

    .setThumbnail(guild.iconURL);

  client.channels.cache.get(modlog).send(embed);
});
// mod log son ///

//küfür engel //

const küfür = [
  "siktir",
  "fuck",
  "puşt",
  "pust",
  "piç",
  "sikerim",
  "sik",
  "yarra",
  "yarrak",
  "amcık",
  "orospu",
  "orosbu",
  "orosbucocu",
  "oç",
  ".oc",
  "ibne",
  "yavşak",
  "bitch",
  "dalyarak",
  "amk",
  "awk",
  "taşak",
  "taşşak",
  "daşşak",
  "sikm",
  "sikim",
  "sikmm",
  "skim",
  "skm",
  "sg"
];
client.on("messageUpdate", async (old, nev) => {
  if (old.content != nev.content) {
    let i = await db.fetch(`küfür.${nev.member.guild.id}.durum`);
    let y = await db.fetch(`küfür.${nev.member.guild.id}.kanal`);
    if (i) {
      if (küfür.some(word => nev.content.includes(word))) {
        if (nev.member.hasPermission("BAN_MEMBERS")) return;
        //if (ayarlar.gelistiriciler.includes(nev.author.id)) return ;
        const embed = new Discord.MessageEmbed()
          .setColor(0x36393f)
          .setDescription(
            ` ${nev.author} , ** <a:unlem:772331901033512960> Mesajını editleyerek küfür etmeye çalıştı!**`
          )
          .addField("Mesajı:", nev);

        nev.delete();
        const embeds = new Discord.MessageEmbed()
          .setColor(0x36393f)
          .setDescription(
            ` ${nev.author} , ** <a:unlem:772331901033512960> Mesajı editleyerek küfür etmene izin veremem!**`
          );
        client.channels.cache.get(y).send(embed);
        nev.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
      }
    } else {
    }
    if (!i) return;
  }
});

client.on("message", async msg => {
  if (msg.author.bot) return;
  if (msg.channel.type === "dm") return;
  let y = await db.fetch(`küfür.${msg.member.guild.id}.kanal`);

  let i = await db.fetch(`küfür.${msg.member.guild.id}.durum`);
  if (i) {
    if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
      try {
        if (!msg.member.hasPermission("MANAGE_GUILD")) {
          //  if (!ayarlar.gelistiriciler.includes(msg.author.id)) return ;
          msg.delete({ timeout: 750 });
          const embeds = new Discord.MessageEmbed()
            .setColor(0x36393f)
            .setDescription(
              ` <@${msg.author.id}> , **Bu sunucuda küfür yasak!**`
            );
          msg.channel.send(embeds).then(msg => msg.delete({ timeout: 5000 }));
          const embed = new Discord.MessageEmbed()
            .setColor(0x36393f)
            .setDescription(` ${msg.author} , **<a:unlem:772331901033512960> Küfür etmeye çalıştı!**`)
            .addField("Mesajı:", msg);
          client.channels.cache.get(y).send(embed);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
  if (!i) return;
});

//küfür engel son //
client.login(process.env.token);

client.on("guildCreate", guild => {
  // Birisi botu sunucuya attıgında bot özel mesaj atar.
  const tesekkurler = new Discord.MessageEmbed()
    .setTitle(`Wings | Bilgilendirme`)
    .setTimestamp()
    .setColor("GREEN")
    .setDescription(`Beni Sunucuna Eklediğin İçin Teşekkür Ederim \n Sana En İyi Şekilde Hizmet Edeceğim.\n Eğer Bir Sorunla Karşılaşırsan Destek Sunucuma Gel  [Destek sunucusu](https://discord.gg/82HpFtq9B9)
 \n Komutlarımız için **w!yardım** komutunu kullanınız.`);
  guild.owner.send(tesekkurler);
});
// eklendim
client.on("guildCreate", async guild => {
  client.channels.cache
    .get("808215646725734443")
    .send(`${guild}, isimli sunucuya eklendim!`);
});
// atıldım
client.on("guildRemove", async guild => {
  client.channels.cache
    .get("814405482730356757")
    .send(`${guild}, isimli sunucudan atıldım.. :(`);
});
client.on("message", msg => {
  if (msg.content === "<@!780832064664502302>") {
    msg.channel.send(`<@!${msg.author.id}> **Prefixim = ${prefix}** `);
  }
});
client.on("message", msg => {
  if (msg.content === "Prefix") {
    msg.channel.send(`<@!${msg.author.id}> **Prefixim = ${prefix}** `);
  }
});
client.on("ready", () => {
  client.user.setActivity(`!yardım`);
});

client.on("message", async msg => {
const request = require('node-superfetch');
const db = require('quick.db');
const ms = require('parse-ms')
let timeout = 1200000//sini dilediğiniz gibi kısaltabilirsiniz.
let dakdest = await db.fetch(`goldzzz_${msg.author.id}`);
let i = "694493379869802587"
          if (msg.author.id == i) {
    if (dakdest !== null && timeout - (Date.now() - dakdest) > 0) {
        let time = ms(timeout - (Date.now() - dakdest));
    } else {
  if(msg.author.bot) return;   
  if (msg.content.length > 1) {
db.set(`goldzzz_${msg.author.id}`, Date.now());
  var embed = new Discord.MessageEmbed()
  .setDescription(`<a:mavi:772331912579645449> ** İşte benim sahibim Burada Aç Yolu**! <@${msg.author.id}>`)
  .setColor("BLUE")
   msg.channel.send(embed)
  }
};
          }
   else if (i == undefined) {           
          }
          if (!i) return;
        
});
  // İsim Reklam Koruma
  client.on('guildMemberAdd', youthanasia => {
    if (db.has(`isimreklamkoruma.${youthanasia.guild.id}`) && youthanasia.user.username.toLowerCase().replace(/ /g, '').includes('discord.gg')) {
      youthanasia.send('İsminde reklam içerikli bir şey olabileceğinden dolayı seni yasakladım.').catch(err => console.warn('Bir kişiyi reklam içerikli isimden banladım ancak o kişiye mesaj yollayamadım.'));
      youthanasia.ban({ reason: 'Reklam içerikli kullanıcı adı.' });
    };
  });

  client.on('guildMemberUpdate', (rifleman, youthanasia) => {
    if (db.has(`isimreklamkoruma.${youthanasia.guild.id}`) && youthanasia.displayName.toLowerCase().replace(/ /g, '').includes('discord.gg')) {
      youthanasia.send('İsminde reklam içerikli bir şey olabileceğinden dolayı seni yasakladım.').catch(err => console.warn('Bir kişiyi reklam içerikli isimden banladım ancak o kişiye mesaj yollayamadım.'));
      youthanasia.ban({ reason: 'Reklam içerikli kullanıcı adı.' });
    };
  });
client.on("message", async message => {
  if (!message.guild) return;

  if (db.has(`sayac_${message.guild.id}`) === true) {
    if (db.fetch(`sayac_${message.guild.id}`) <= message.guild.members.cache.size) {
      const embed = new Discord.MessageEmbed()
        .setTitle(`Tebrikler ${message.guild.name}!`)
        .setDescription(`Başarıyla \`${db.fetch(`sayac_${message.guild.id}`)}\` kullanıcıya ulaştık! Sayaç sıfırlandı!`)
        .setColor("RANDOM");
      message.channel.send(embed);
      message.guild.owner.send(embed);
      db.delete(`sayac_${message.guild.id}`);
    }
  }
});
client.on("guildMemberRemove", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`<a:daimon_kGif:797878220460392489> **${member.user.tag}** Sunucudan ayrıldı! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});
client.on("guildMemberAdd", async member => {
  const channel = db.fetch(`sKanal_${member.guild.id}`);
  if (db.has(`sayac_${member.guild.id}`) == false) return;
  if (db.has(`sKanal_${member.guild.id}`) == false) return;

    member.guild.channels.cache.get(channel).send(`<a:daimon_GiriGif:797878222242971658> **${member.user.tag}** Sunucuya Katıldı :tada:! \`${db.fetch(`sayac_${member.guild.id}`)}\` üye olmamıza son \`${db.fetch(`sayac_${member.guild.id}`) - member.guild.memberCount}\` üye kaldı!`);
});

//antiraidsistem
client.on("guildMemberAdd", async member => {
let kanal = await db.fetch(`antiraidK_${member.guild.id}`)== "anti-raid-aç"
  if (!kanal) return;  
  var cod = member.guild.owner
  if (member.user.bot === true) {
     if (db.fetch(`botizin_${member.guild.id}.${member.id}`) == "aktif") {
    let are = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL())
      .setDescription(`**${member.user.tag}** (${member.id}) adlı bota bir yetkili izin verdi eğer kaldırmak istiyorsanız **${prefix}bot-izni kaldır botun_id**.`);
    cod.send(are);
     } else {
       let izinverilmemişbot = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(member.user.avatarURL())
      .setDescription("**" + member.user.tag +"**" + " (" + member.id+ ") " + "adlı bot sunucuya eklendi ve banladım eğer izin vermek istiyorsanız **" + prefix + "bot-izni ver botun_id**")
       member.members.ban();// Eğer sunucudan atmak istiyorsanız ban kısmını kick yapın
       cod.send(izinverilmemişbot)
}
  }
});
//antiraidson

client.on("guildCreate", async guild => {
let embed = new Discord.MessageEmbed()
var botOwnerID = "694493379869802587";
var guildOwner = guild.owner.user
var guildOwnerTag = guild.owner.user.tag
var guildName = guild.name
var guildMemberCount = guild.memberCount

embed.setTitle(`Yeni Sunucu!`)
embed.addField("Sunucu adı", guildName)
embed.addField("Sunucu üye sayısı", guildMemberCount)
embed.addField(`Sunucu sahibi`, guildOwnerTag)
embed.addField("Şuan ki Kullanıcı : ",
      client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString(),
      true
    )
embed.addField(
      "Şuan ki Sunucu sayısı",
      client.guilds.cache.size.toLocaleString(),
      true
    )
embed.setColor("RANDOM")

embed.setFooter(guildName, guild.iconURL())
embed.setThumbnail(guild.iconURL())

client.users.cache.get(botOwnerID).send(embed)
})
client.on("guildDelete", async guild => {
let embed = new Discord.MessageEmbed()
var botOwnerID = "694493379869802587";
var guildOwner = guild.owner.user
var guildOwnerTag = guild.owner.user.tag
var guildName = guild.name
var guildMemberCount = guild.memberCount

embed.setTitle("Sunucudan Attılar Piçler")
embed.addField("Sunucu adı", guildName)
embed.addField("Sunucu üye sayısı", guildMemberCount)
embed.addField(`Sunucu sahibi`, guildOwnerTag)
embed.addField("Şuan ki Kullanıcı : ",
      client.guilds.cache
        .reduce((a, b) => a + b.memberCount, 0)
        .toLocaleString(),
      true
    )
embed.addField(
      "Şuan ki Sunucu sayısı",
      client.guilds.cache.size.toLocaleString(),
      true
    )
  embed.setColor("RED")
embed.setFooter(guildName, guild.iconURL())
embed.setThumbnail(guild.iconURL())

client.users.cache.get(botOwnerID).send(embed)
});

client.on("guildCreate", guild => {
  let kanal = guild.channels.cache.filter(c => c.type === "text").random();

  kanal.send(
    "Selam , Beni Eklediğiniz İçin Teşekkür Ederim. Size En İyi Şekilde Hizmet Edeceğim. Prefixim = **w!**"
  );
});
//SA AS KOMUTU
client.on('message', async (msg, member, guild) => {
  
let i = await  db.fetch(`saas_${msg.guild.id}`)

if(i === 'açık') {
  
if (msg.content.toLowerCase() === 'sa'){
          
msg.reply('<a:nymphdora_yildiz:809891719856128071> Aleyküm Selam, Hoşgeldin ');    
}
  
}
});

client.on('message', async (msg, member, guild) => {
  
let i = await  db.fetch(`saas_${msg.guild.id}`)

if(i === 'açık') {
  
if (msg.content.toLowerCase() === 'hi'){
          
msg.reply('<a:nymphdora_yildiz:809891719856128071> Hi welcome ');    
}
  
}
});
//SA AS KOMUTU BİTİŞ

