const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');

const reactedRecently = new Set();

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger.js');

module.exports = (client, messageReaction, user) => {
  if (messageReaction.message.member.guild.id !== "412369732679893004") { // Si la réaction ne provient pas d'un salon du serveur Stradivarius, alors le script s'arrête.
    return;
  }

  let msg = messageReaction.message.content.toUpperCase(); // Récupération du contenu du message (en majuscules)
  let creativeChannels = new Set("412622887317405707", "412622912043089920", "412622999267704834", "416227695429550100", "425739003623374848", "438794104621629441", "442374005177974825");

  if (creativeChannels.has(messageReaction.message.channel.id)) { // Si la réaction provient d'un salon "créatif"...
    if (msg.includes("[PARTAGE]")) {
      messageReaction.remove(user);
    }
  }

  // Rôles
  let membre = messageReaction.message.guild.roles.find("name", "Membre");
  let apprenti = messageReaction.message.guild.roles.find("name", "Apprenti(e)");
  let enattente = messageReaction.message.guild.roles.find("name", "En attente...");

  if (user.id === "412910522833436672") {
    return;
    // Si la réaction vient de Strad, alors le script s'arrête.
  }

  if (messageReaction.message.channel.id === "412557168529899541") {

    if (messageReaction.emoji.identifier === "true:413685423202893826") {

      if (messageReaction.message.member.roles.has(apprenti) || messageReaction.message.member.roles.has(enattente)) {

        // Le membre est un apprenti/en attente : on lui ajoute le rôle membre
        messageReaction.message.member.addRole(membre);
        messageReaction.message.member.removeRole(apprenti);
        messageReaction.message.member.removeRole(enattente);

      }

    }

  }

  //Si la réaction correspond à la réaction de report, ce bloc s'exécute.
  if (messageReaction.emoji.identifier === "report:418441210475053056") {

    if (messageReaction.message.member.user.bot) {
      messageReaction.remove(user);
      user.send(`Tu ne peux pas signaler les messages de Strad.`);
      return;
      //Si la réaction se trouve sur un message de Strad, alors le script s'arrête.
    }
    if (messageReaction.users.first().id === messageReaction.message.author.id) {
      messageReaction.remove(user);
      user.send(`Tu ne peux pas signaler ton propre message.`);
      return;
      //Si la réaction se trouve sur un message de la personne qui réagit, alors le script s'arrête.
    }
    if (messageReaction.message.member.roles.find("name", client.config.modRole) || messageReaction.message.member.roles.find("name", "Assistant")) {
      messageReaction.remove(user);
      user.send(`Tu ne peux pas signaler le message d'un membre du staff.`);
      return;
      //Si la réaction se trouve sur un message d'un membre du Staff, alors le script s'arrête.
    }
    if (reactedRecently.has(user.id)) {
      messageReaction.remove(user);
      user.send(`Tu ne peux signaler un message que toutes les 30 secondes !`);
      return;
      //Si l'utilisateur a déjà signalé un message il y a moins de 30 secondes, alors le script s'arrête.
    } else {
      // Adds the user to the set so that they can't talk for a minute
      reactedRecently.add(user.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        reactedRecently.delete(user.id);
      }, 30000);
    }

    //console.log(messageReaction.users.first().username);
    //messageReaction.message.react(bot.emojis.get("418441210475053056"));
    console.log("Report !");
    var reportedMessage = messageReaction.message.cleanContent;
    logger.run(`${user.tag} a reporté un message dans le salon #${messageReaction.message.channel.name} du serveur ${messageReaction.message.guild.name}.`);
    messageReaction.message.member.guild.channels.find("id", client.config.logsChannel).send({
      embed: {
        title: "Message signalé",
        description: `Nouveau message reporté par **${messageReaction.users.first().username}** : *${reportedMessage}* (dans <#${messageReaction.message.channel.id}>, par **${messageReaction.message.author.username}**)`,
        color: 0xffac00
      }
    });
  }
}