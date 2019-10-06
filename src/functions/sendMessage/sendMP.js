import Discord from 'discord.js';
import { colors } from '../../colors';
import { client, commandChannelID } from '../../globals';

/**
 * @param  {String} messageContent
 * @param  {User} user
 */
const sendMP = (messageContent, user) => {
  user.send(messageContent).catch(() => {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Envoi de message privé impossible')
      .setDescription(
        `Merci de signaler à ${user} que je ne peux pas lui envoyer de message privé car il m'a bloqué.`
      )
      .setColor(colors.ALERT);
    client.channels.get(commandChannelID).send(errorEmbed);
  });
};

export { sendMP };
