import Discord from 'discord.js';
import { logger } from '../functions/logs/logger';
import { client, stradivariusID } from '../globals';

const guildBanAdd = (guild, user) => {
  const logChannel = client.channels.get(client.config.logsChannel);

  if (guild.id !== stradivariusID) return;
  // TODO Nettoyer le code
  const embed = new Discord.RichEmbed()
    .setTitle('Membre Banni')
    .setDescription(`**${user.tag}** vient de se faire bannir.`)
    .setColor('#f44242');
  logger.run(`${user.tag} a été banni du serveur ${guild.name}.`);
  logChannel.send(embed);
};

export { guildBanAdd };

