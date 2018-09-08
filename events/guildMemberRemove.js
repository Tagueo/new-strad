const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, member) => {
  const logs = client.channels.get("419506197847343132")

  if (member.guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#f44242")
      .setTitle("Ancien Membre")
      .setDescription(`**${member.user.tag}** vient de quitter le serveur :/`)

    logs.send(embed)
  }
}
