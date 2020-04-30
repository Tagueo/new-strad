import Discord from 'discord.js';
import { colors } from '../colors';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 */
const help = message => {
    const embed = new Discord.RichEmbed()
        .setTitle('Help')
        .setDescription(
            `Pour m'appeler, utilise le préfixe **Strad** (c'est mon nom !).
    Exemple : \`Strad help\` pour afficher cet encart ^^`
        )
        .setColor(colors.NEUTRAL_BLUE)
        .addField(
            'Général',
            `\`help\` • Affiche cet encart.
      \`rank\` • Affiche ton profil.
      \`top\` • Affiche le classement du serveur.
      \`daily\` • Permet de récupérer ta récompense journalière !
      \`key <valeur>\` • Crée une clé ayant la valeur en Blocs définie en argument.
      \`redeem <clé>\` • Utilise la clé spécifiée en argument afin que tu puisses récupérer sa valeur en Blocs.
      \`check <empreinte>\` • Permet de vérifier l'existence, la validité, la propriété, la valeur et l'apparence d'une clé en spécifiant son empreinte en argument.`
        )
        .addField(
            'Premium',
            `\`nick <pseudonyme>\` • Change de pseudonyme et ce, seulement sur Stradivarius !
      \`say <message>\` • Fais parler Strad avec le message de ton choix !`
        )
        .addField(
            'Boutique',
            `\`shop\` • Ouvre la boutique du serveur.
      \`buy <numéro de l'article>\` • Permet d'acheter l'article de boutique dont le numéro est spécifié en argument.`
        )
        .addField(
            'Divers',
            `\`repo\` • Affiche le lien vers mon dépôt GitHub.
      \`stats\` • Affiche des informations me concernant.`
        )
        .setFooter('Strad help', client.user.avatarURL)
        .setColor(colors.NEUTRAL_BLUE);

    if (message.member.roles.find(role => role.name === 'Modérateur')) {
        const privateEmbed = new Discord.RichEmbed()
            .setTitle('Help (suite)')
            .setDescription(
                'Les commandes affichées ci-dessous sont réservées aux Modérateurs (et au-dessus).'
            )
            .setColor(colors.MODERATOR)
            .addField(
                'Commandes',
                `\`mute <@membre> <durée> <raison>\` • Réduit au silence le membre mentionné et ce, pour la durée spécifiée en argument (entre 1 et 360 minutes - soit 6 heures). Nécessite de spécifier une raison.'kick <@membre> <raison>• Expulse le membre mentionné. Nécessite de spécifier une raison.
      \`ban <@membre> <raison>\` • Bannit de manière permanente le membre mentionné. Nécessite de spécifier une raison.`
            );
        message.author.send(privateEmbed);
    }

    client.channels.get(commandChannelID).send(embed);
    message.delete();
};

export { help };
