import { toggleCreatorRoles } from '../functions/roles/toggleCreatorRoles';
import { toggleNotificationRoles } from '../functions/roles/toggleNotificationRoles';
import { stradivariusID } from '../globals';

const messageReactionRemove = (client, reaction, user) => {
  const stradivarius = client.guilds.find(guild => guild.id === stradivariusID);

  if (reaction.message.channel.type !== 'text') return;
  if (client.config.mtnMode === 'true') return;

  // Si la réaction ne provient pas d'un salon du serveur Stradivarius ou s'il vient de Strad, alors le script s'arrête.
  if (reaction.message.member.guild.id !== stradivariusID || user.bot)
    return;

  // Distributeur de rôles
  if (reaction.message.id === '570618282177069076')
    toggleCreatorRoles(stradivarius, reaction, user);
  if (reaction.message.id === '601739344163897344')
    toggleNotificationRoles(stradivarius, reaction, user);
};

export { messageReactionRemove };

