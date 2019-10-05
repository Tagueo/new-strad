import Discord from 'discord.js';
import { colors } from '../colors';
import { client } from '../globals';
import { logger } from './logs/logger';
import { sendMP } from './sendMessage/sendMP';

const report = (reaction, user) => {
  const reactedRecently = [];
  if (reaction.message.member.user.bot) {
    reaction.remove(user);
    sendMP(
      "Tu ne peux pas signaler mes messages. C'est vraiment l'hôpital qui se fout de la charité !",
      user
    );
    return;
    // Si la réaction se trouve sur un message de Strad, alors le script s'arrête.
  }
  if (user.id === reaction.message.author.id) {
    reaction.remove(user);
    sendMP('Tu ne peux pas signaler ton propre message.', user);
    return;
    // Si la réaction se trouve sur un message de la personne qui réagit, alors le script s'arrête.
  }
  if (
    reaction.message.member.roles.find(
      role => role.name === client.config.modRole
    ) ||
    reaction.message.member.roles.find(role => role.name === 'Assistant')
  ) {
    reaction.remove(user);
    sendMP("Tu ne peux pas signaler le message d'un membre du staff.", user);
    return;
    // Si la réaction se trouve sur un message d'un membre du Staff, alors le script s'arrête.
  }
  if (
    [
      ...reaction.message.reactions.find(
        reaction => reaction.emoji.id === client.assets.emojiIds.REPORT
      ).users
    ].length > 1
  ) {
    sendMP('Ce message a déjà été signalé, merci pour ta contribution !', user);
    return;
    // Si le message a déjà été reporté, alors le script s'arrête MAIS ON NE RETIRE PAS LA RÉACTION DE L'UTILISATEUR.
  }
  if (reactedRecently.includes(user.id)) {
    reaction.remove(user);
    sendMP('Tu ne peux signaler un message que toutes les 30 secondes !', user);
    return;
    // Si l'utilisateur a déjà signalé un message il y a moins de 30 secondes, alors le script s'arrête.
  } else {
    // Adds the user to the set so that they can't talk for a minute
    reactedRecently.add(user.id);
    setTimeout(() => {
      // Removes the user from the set after a minute
      reactedRecently.delete(user.id);
    }, 30000);
  }

  console.log('Report !');
  const reportedMessage = reaction.message.cleanContent;
  logger(
    `${user.tag} a signalé un message dans le salon #${reaction.message.channel.name} du serveur ${reaction.message.guild.name}.`
  );
  const reportEmbed = new Discord.RichEmbed()
    .setTitle('Message signalé')
    .setDescription(`Un nouveau message a été signalé par ${user}.`)
    .setColor(colors.WARNING)
    .addField('Contenu', reportedMessage, true)
    .addField('Localisation', reaction.message.channel, true)
    .addField('Lien direct', reaction.message.url, true);

  reaction.message.member.guild.channels
    .find(channel => channel.id === client.config.logsChannel)
    .send(reportEmbed);
};

export { report };

