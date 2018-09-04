const Discord = require("discord.js")

exports.run = (client, message, args) => {
  var embed = new Discord.RichEmbed()
    .setAuthor('Help', client.user.avatarURL)
    .setColor("#21b1ff")
    .setDescription(`Pour m'appeler, utilise le prefix **Strad** (c'est mon nom !).\nExemple : \`Strad help\` pour afficher cet encart ^^`)
    .addField(`Commandes`, `**help •** Permet d'afficher cet encart.\n**stats •** Permet d'afficher des statistiques sur le bot.`)

  client.channels.get('415633143861739541').send(embed);
  message.delete();
};
