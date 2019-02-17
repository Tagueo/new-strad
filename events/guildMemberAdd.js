const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');

const welcome_categ_id = "443782424653070346";

module.exports = (client, member) => {
  const logs = client.channels.get(client.config.logsChannel)

  if (member.guild.id = '412369732679893004') {
    const apprenti = member.guild.roles.find(x => x.name === "Apprenti(e)");
    member.addRole(apprenti).catch(console.error);

    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Nouveau Membre")
      .setDescription(`**<@${member.user.id}>** vient de rejoindre le serveur !`)

    member.guild.channels.find("id", welcome_categ_id).setName("STRADIVARIUS | " + member.guild.memberCount)
    logs.send(embed)
    console.log(member.user.username + " a rejoint le serveur !");
  }
}