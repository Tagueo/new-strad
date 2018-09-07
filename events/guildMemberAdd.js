const Discord = require('discord.js');
const client = new Discord.Client({
  disableEveryone: true
});

const chalk = require('chalk');
const moment = require('moment');

module.exports = (client, member) => {
  const apprenti = member.guild.roles.find(x => x.name === "Apprenti(e)");
  const logs = client.channels.get("419506197847343132")

  if (member.guild.id = '412369732679893004') {
    member.addRole(apprenti).catch(console.error);

    var embed = new Discord.RichEmbed()
      .setColor("#21b1ff")
      .setTitle("Nouveau Membre")
      .setDescription(`**${member.user.tag}** vient de rejoindre le serveur !`)

    logs.send(embed)
  }
}
