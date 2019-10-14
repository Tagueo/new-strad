import Discord from 'discord.js';
import { logger } from '../functions/logs/logger';
import { client, stradivariusID } from '../globals';

/**
 * @param  {Guild} guild
 * @param  {User} user
 */
const guildBanRemove = (guild, user) => {
  const logChannel = client.channels.get(client.config.logsChannel);

  if (guild.id !== stradivariusID) return;
  // TODO Nettoyer le code
  const embed = new Discord.RichEmbed()
    .setTitle('Membre Débanni')
    .setDescription(`**${user.tag}** vient de se faire débannir.`)
    .setColor('#21b1ff');
  logger.run(`${user.tag} a été débanni du serveur ${guild.name}.`);
  logChannel.send(embed);
};

export { guildBanRemove };
