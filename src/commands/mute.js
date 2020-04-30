import Discord from 'discord.js';
import { colors } from '../colors';
import { sendEmdedThenDelete } from '../functions/sendMessage/sendEmdedThenDelete';
import { sendLog } from '../functions/sendMessage/sendLog';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const mute = async (message, args) => {
    if (!message.member.roles.find(role => role.name === 'Modérateur')) {
        message.delete();
        return;
    }

    const muteRole = message.guild.roles.find(
        role => role.name === 'Réduit au silence'
    );
    if (args.length < 2) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'Le nombre d\'arguments est insuffisant. Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    const mutedMember = message.mentions.members.first();

    if (!mutedMember) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Échec de la commande')
            .setDescription(
                'Le membre concerné est introuvable. Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    const muteDuration = parseInt(args[0], 10);
    if (isNaN(muteDuration)) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'La durée spécifiée en argument est invalide. Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    if (muteDuration < 1 || muteDuration > 360) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Durée non conforme')
            .setDescription(
                'La durée doit être comprise entre 1 et 360 minutes (6 heures). Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    const reason = args.slice(1).join(' ');
    if (reason.length < 10) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Raison insuffisante')
            .setDescription(
                'La raison doit contenir au moins 10 caractères. Utilisation : `Strad mute <@membre> <durée en minutes> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    try {
        await mutedMember.addRole(
            muteRole,
            `${reason} • ${muteDuration} minute(s)`
        );

        const logEmbed = new Discord.RichEmbed()
            .setTitle('Réduction au silence')
            .setDescription(
                `${mutedMember} a été réduit au silence pour une durée de ${muteDuration} minute(s).
        Raison : "${reason}"`
            )
            .setColor(colors.ALERT);
        sendLog(logEmbed);

        setTimeout(() => {
            mutedMember.removeRole(
                muteRole,
                `Fin de la réduction au silence de ${mutedMember}.`
            );
        }, muteDuration * 60000);

        const succesEmbed = new Discord.RichEmbed()
            .setTitle('Réduction au silence')
            .setDescription(
                `${mutedMember} a été réduit au silence pour une durée de ${muteDuration} minute(s).
        Raison : "${reason}"`
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, succesEmbed);
    } catch (error) {
        message.delete();
        console.log(error);
    }
};

export { mute };
