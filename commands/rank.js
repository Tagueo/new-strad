const Discord = require("discord.js")

var mysql = require("mysql")

exports.run = (client, message, args) => {

  const embedMoney = new Discord.RichEmbed()
    .setAuthor(message.author.usertag, message.author.avatarURL)
    .setThumbnail(message.author.avatarURL)
    .addField("ID du propriétaire", message.author.id, true)
    .addField("Valeur du compte", `**{unknown}** :strad:`, false)
    .addField("Nombre de Créas", `**{unknown} Créas**`, true)
    .addField("Rang artistique", "unknown", false)
    .setFooter("Strad rank")
    .setColor("#21b1ff");

    client.channels.get('413678978990080010').send(embedMoney);
    message.delete();
};
