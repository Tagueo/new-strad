import chalk from 'chalk';
import moment from 'moment';
import { colors } from '../colors';
import { commands } from '../commands';
import { checkFeedbackable } from '../functions/feedback/checkFeedbackable';
import { logger } from '../functions/logs/logger';
import { sendLog } from '../functions/sendMessage/sendLog';
import { sendMP } from '../functions/sendMessage/sendMP';
import { client, creationChannels, prefix } from '../globals';

/**
 * @param  {Message} message
 */
const message = async message => {
    if (message.channel.type !== 'text') return;

    // Écriture dans les logs
    logger(message);

    // Suppression des messages envoyés par les sanctionnés
    if (message.member.roles.find(role => role.name === 'Sanctionné(e)'))
        message.delete(20000);

    // Vérification du contenu du message
    if (
        message.content.match(/discord\.(me|gg)/gi) &&
        !message.member.roles.find(role => role.name === 'Mentor')
    ) {
        await message.delete();
        const messageBot = await message.channel.send(
            `${message.author}, la publicité pour les serveurs Discord est défendue sur Stradivarius.`
        );
        messageBot.delete(5000);
        sendLog(
            'Tentative de publicité',
            `${message.author} a tenté de faire sa publicité dans le salon ${message.channel}.
      Contenu du message : *${message.cleanContent}*`,
            colors.WARNING
        );
    }

    if (creationChannels.includes(message.channel.id)) {
        if (message.content.includes('[RES]')) message.pin();
        if (message.type === 'PINS_ADD') message.delete();

        // Conditions d'éligibilité au feedback : fichier joint (sans "[POST]" nécessaire) ou URL (mention "[POST]")
        if (checkFeedbackable(message)) {
            let sparkles = client.emojis.get(client.assets.emojiIds.ENABLE_VOTES)
            message.react(sparkles);
            const messageBot = await message.channel.send(
                `(Clique sur ${sparkles} si tu souhaites recevoir un feedback)`
            );
            messageBot.delete(3500);
        }
    } else if (
        message.channel.id === '568677435793604649' &&
        message.attachments.size === 0
    ) {
        sendMP(
            `Hey, tu ne peux poster qu'un montage de tes créations dans le salon #before-after ! :smile:
      Crée une image avec quelques-unes de tes premières créations avec, à côté, certaines de tes dernières !
      On pourra ainsi voir les progrès que tu as fait sur Stradivarius :wink:`,
            message.member
        );
        message.delete();
    }

    if (
        message.channel.id === '412557168529899541' &&
        message.member.roles.find(role => role.name === 'Apprenti(e)')
    ) {
        message.member.addRole(
            message.guild.roles.find(role => role.name === 'En attente...')
        );
        message.member.send(
            'Merci de t\'être présenté ! Nous t\'avons mis en attente. Tu auras très bientôt ta place parmi nous ! <:sdvr_heart:623611615404621874>'
        );
    }

    // Ignores all bots
    if (message.author.bot) return;

    // Checks automatic answers
    if (client.answers[message.cleanContent.toLowerCase()])
        message.channel.send(client.answers[message.cleanContent.toLowerCase()]);

    // Ignores messages not starting with the prefix
    if (!message.content.startsWith(prefix)) return;

    // Standard argument/command name definition.
    const args = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!commands.hasOwnProperty(command)) return;

    // Run the command
    if (
        (client.config.mtnMode !== 'true' ||
            message.member.roles.find(role => role.name === 'Mentor')) &&
        !message.member.roles.find(role => role.name === 'Sanctionné(e)')
    ) {
        commands[command](message, args);
        console.log(
            `[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(
                message.author.tag
            )}] used ${chalk.green(command)} ${chalk.cyan(args.join(' '))}`
        );
    } else {
        message.reply(
            'Une maintenance est en cours. Merci de bien vouloir patienter ! :sweat_smile:'
        );
    }
};

export { message };
