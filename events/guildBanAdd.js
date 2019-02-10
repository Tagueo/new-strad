const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger.js');

module.exports = (client, guild, user) => {
  const logs = client.channels.get(client.config.logsChannel);

  if (guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#f44242")
      .setTitle("Membre Banni")
      .setDescription(`**${user.tag}** vient de se faire bannir.`)

    logger.run(`${user.tag} a été banni du serveur ${guild.name}.`)
    logs.send(embed);
  }
}