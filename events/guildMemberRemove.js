const Discord = require('discord.js');
const client = new Discord.Client();

const chalk = require('chalk');
const moment = require('moment');

const welcome_categ_id = "443782424653070346";

module.exports = (client, member) => {
  const logs = client.channels.get(client.config.logsChannel)

  if (member.guild.id = '412369732679893004') {

    var embed = new Discord.RichEmbed()
      .setColor("#f44242")
      .setTitle("Ancien Membre")
      .setDescription(`**${member.user.tag}** vient de quitter le serveur :/`)

    member.guild.channels.find("id", welcome_categ_id).setName("STRADIVARIUS | " + member.guild.memberCount + " MEMBRES")
    logs.send(embed)
  }
}
