const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger.js');

module.exports = (client, guild, user) => {
  const logs = client.channels.get(client.config.logsChannel)

  if (guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Membre Débanni")
      .setDescription(`**${user.tag}** vient de se faire débannir.`)

    logger.run(`${user.tag} a été débanni du serveur ${guild.name}.`)
    logs.send(embed)
  }
}