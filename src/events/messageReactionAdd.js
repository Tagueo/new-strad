import { acceptPresentation } from '../functions/acceptPresentation';
import { feedbackManager } from '../functions/feedback/feedbackManager';
import { report } from '../functions/report';
import { toggleCreatorRoles } from '../functions/roles/toggleCreatorRoles';
import { toggleNotificationRoles } from '../functions/roles/toggleNotificationRoles';
import { client, creationChannels, stradivariusID } from '../globals';

const messageReactionAdd = (reaction, user) => {
  const stradivarius = client.guilds.find(guild => guild.id === stradivariusID);

  if (reaction.message.channel.type !== 'text') return;
  if (client.config.mtnMode === 'true') return;

  // Si la réaction ne provient pas d'un salon du serveur Stradivarius ou s'il vient de Strad, alors le script s'arrête.
  if (reaction.message.member.guild.id !== stradivariusID || user.bot) return;

  // Distributeur de rôles
  if (reaction.message.id === '570618282177069076')
    toggleCreatorRoles(stradivarius, reaction, user);
  if (reaction.message.id === '601739344163897344')
    toggleNotificationRoles(stradivarius, reaction, user);

  // Si la réaction provient d'un salon "créatif", on s'occupe du système de feedback
  if (creationChannels.includes(reaction.message.channel.id))
    feedbackManager(reaction, user);

  // Si la réaction provient du salon présentation, on procède à l'acceptation de la présentation ciblée
  if (
    reaction.message.channel.id === '412557168529899541' &&
    reaction.count === 1
  )
    acceptPresentation(reaction);

  // Si la réaction correspond à la réaction de report, ce bloc s'exécute.
  if (reaction.emoji.id === client.assets.emojiIds.REPORT)
    report(reaction, user);
};

export { messageReactionAdd };

