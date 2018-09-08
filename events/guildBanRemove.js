const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, guild, user) => {
  const logs = client.channels.get("419506197847343132")

  if (guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Membre Débanni")
      .setDescription(`**${user.tag}** vient de se faire débannir.`)

    logs.send(embed)
  }
}
