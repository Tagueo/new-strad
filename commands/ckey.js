const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = (client, message, args) => {

    let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Commande obsolète")
        .setDescription("La commande ``Strad ckey <valeur>`` change de nom ! Dorénavant, merci d'utiliser la commande ``Strad key <valeur>``.")
        .setColor(mLog.colors.ALERT);
    message.delete();

    client.channels.get('415633143861739541').send()

};