const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');

var prefix = ayarlar.prefix;

module.exports = client => {
var oyun = [
        "w!yardım ",
        "loading...",
        "w!logo",
        "w!moderasyon 🌹 ",
       "Botumuz Sizin sayenizde büyüyor 🦋 ",
    ];

    setInterval(function() {

        var random = Math.floor(Math.random()*(oyun.length-0+1)+0);

        client.user.setActivity(oyun[random], "w!yardım" );
        }, 2 * 2500);
    
  };