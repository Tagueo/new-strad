const Discord = require("discord.js");
const db = require("../scripts/db");
const mp = require("../scripts/msgPresets"); // TODO À retirer
const mLog = require("../scripts/mLog");
const sendMP = require("../scripts/sendMP");
var moment = require("moment");

exports.run = (client, message, args) => {

    let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Commande obsolète")
        .setDescription("La commande ``Strad ckey <valeur>`` change de nom ! Merci d'utiliser dorénavant la commande ``Strad key <valeur>``.")
        .setColor(mLog.colors.ALERT);
    message.delete();

    client.channels.get('415633143861739541').send()

};