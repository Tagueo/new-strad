const Discord = require("discord.js")

var mysql = require("mysql")

exports.run = (client, message, args) => {

  var con = mysql.createConnection({
    
  })

  const stradEmoji = "<:strad:544057514589683723>";

  const embedMoney = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setThumbnail(message.author.avatarURL)
    .addField("Valeur du compte", `{unknown} <:strad:544057514589683723>`, true)
    .addField("Nombre de Créas", `{unknown}`, true)
    .addField("ID du propriétaire", message.author.id, true)
    .addField("Rang artistique", "unknown", true)
    .setFooter("Strad rank")
    .setColor(message.member.displayColor);

    client.channels.get('413678978990080010').send(embedMoney);
    message.delete();
};