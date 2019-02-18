const Discord = require("discord.js")

const db_handler = require("../scripts/db_handler.js");

exports.run = (client, message, args) => {

  db_handler.run(client, `SELECT * FROM users WHERE user_id = ${message.author.id}`);
  console.log(db_handler.results);
  
  const stradEmoji = "<:strad:544057514589683723>";

  // const embedMoney = new Discord.RichEmbed()
  //   .setAuthor(message.author.tag, message.author.avatarURL)
  //   .setThumbnail(message.author.avatarURL)
  //   .addField("Valeur du compte", `${results["money"]} ${stradEmoji}`, true)
  //   .addField("Nombre de Créas", `${results["creas_amount"]}`, true)
  //   .addField("ID du propriétaire", message.author.id, true)
  //   .addField("Rang artistique", "unknown", true)
  //   .setFooter("Strad rank")
  //   .setColor(message.member.displayColor);

  //   client.channels.get('413678978990080010').send(embedMoney);
  //   message.delete();

};