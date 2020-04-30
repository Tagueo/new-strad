import Discord from 'discord.js';
import { colors } from '../colors';
import { sendEmdedThenDelete } from '../functions/sendMessage/sendEmdedThenDelete';
import { sendLog } from '../functions/sendMessage/sendLog';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const kick = async (message, args) => {
    if (!message.member.roles.find(role => role.name === 'Modérateur')) {
        message.delete();
        return;
    }
    if (args.length < 1) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'Le nombre d\'arguments est insuffisant. Utilisation : `Strad kick <@membre> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    const kickedMember = message.mentions.members.first();

    if (!kickedMember) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Échec de la commande')
            .setDescription(
                'Le membre concerné est introuvable. Utilisation : `Strad kick <@membre> <raison>`.'
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
                'La raison doit contenir au moins 10 caractères. Utilisation : `Strad kick <@membre> <raison>`.'
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, errorEmbed);
        return;
    }
    try {
        await kickedMember.kick(reason);

        const logEmbed = new Discord.RichEmbed()
            .setTitle('Expulsion')
            .setDescription(
                `${kickedMember} a été expulsé de Stradivarius.
        Raison : "${reason}"`
            )
            .setColor(colors.ALERT);
        sendLog(logEmbed);

        const succesEmbed = new Discord.RichEmbed()
            .setTitle('Expulsion')
            .setDescription(
                `${kickedMember} a été expulsé de Stradivarius.
        Raison : "${reason}"`
            )
            .setColor(colors.ALERT);
        sendEmdedThenDelete(message, succesEmbed);
    } catch (error) {
        message.delete();
        console.log(error);
    }
};

export { kick };
