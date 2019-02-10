const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, guild, user) => {
  const logs = client.channels.get("419506197847343132");

  if (guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#f44242")
      .setTitle("Membre Banni")
      .setDescription(`**${user.tag}** vient de se faire bannir.`)

    logs.send(embed);
  }
}