import Discord from 'discord.js';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 */
const repo = message => {
    const repoLink = 'https://github.com/Tagueo/new-strad';
    const embed = new Discord.RichEmbed()
        .setAuthor('Dépôt de Strad', client.user.avatarURL)
        .setColor('#21b1ff')
        .setDescription(
            `Tu veux participer à mon développement ? Tu peux contribuer dès maintenant sur mon dépôt GitHub :smile:
      N'oublie pas de mettre une petite étoile si tu me trouves cool :blue_heart:`
        )
        .addField('Lien', repoLink)
        .setURL(repoLink);

    client.channels.get(commandChannelID).send(embed);
    message.delete();
};

export { repo };
