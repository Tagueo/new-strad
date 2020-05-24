import Discord from 'discord.js';
import { colors } from '../colors';
import { sendEmdedThenDelete } from '../functions/sendMessage/sendEmdedThenDelete';
import { sendLog } from '../functions/sendMessage/sendLog';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const ban = async (message, args) => {
    if (!message.member.roles.find(role => role.name === 'Modérateur')) {
        message.delete();
        return;
    }

    if (args.length < 1) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'Le nombre d\'arguments est insuffisant. Utilisation : `Strad ban <@membre> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }

    const bannedMember = message.mentions.members.first();
    if (!bannedMember) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Échec de la commande')
            .setDescription(
                'Le membre concerné est introuvable. Utilisation : `Strad ban <@membre> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }

    const reason = args.splice(1).join(' ');
    if (reason.length < 10) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Raison insuffisante')
            .setDescription(
                'La raison doit contenir au moins 10 caractères. Utilisation : `Strad ban <@membre> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }

    try {
        await bannedMember.ban(reason);
        sendLog(
            'Bannissement',
            `${bannedMember} a été banni de Stradivarius.
            Raison : "${reason}"`,
            colors.ALERT
        );

        const succesEmbed = new Discord.RichEmbed()
            .setTitle('Bannissement')
            .setDescription(
                `${bannedMember} a été banni de Stradivarius.
            Raison : "${reason}"`
            )
            .setColor(colors.ALERT);

        sendEmdedThenDelete(message, succesEmbed);
    } catch (error) {
        message.delete();
        console.log(error);
    }
};

export { ban };
