const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, member) => {
  const logs = client.channels.get(client.config.logsChannel)

  if (member.guild.id = '412369732679893004') {
    const apprenti = member.guild.roles.find(x => x.name === "Apprenti(e)");
    member.addRole(apprenti).catch(console.error);

    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Nouveau Membre")
      .setDescription(`**<@${member.user.id}>** vient de rejoindre le serveur !`)

    logs.send(embed)
  }
  console.log(member.user.username + " a rejoint le serveur !");
}
