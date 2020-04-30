import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { sendLog } from '../functions/sendMessage/sendLog';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const nick = async (message, args) => {
    const commandChannel = client.channels.get(commandChannelID);

    if (message.member.id === '315816143137013761') {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Changement de pseudonyme')
            .setDescription(
                'Rôôôh Delphi, tu sais très bien que je n\'ai pas la permission de te renommer... :confused:'
            )
            .setColor(colors.ALERT);
        commandChannel.send(errorEmbed);
        message.delete();
        return;
    }

    if (!args[0]) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Aide')
            .setDescription(
                `Changer de pseudonyme : \`Strad nick <pseudonyme>\`.
      Rétablir le pseudonyme par défaut (gratuit) : \`Strad nick default\`.`
            )
            .setColor(colors.NEUTRAL_BLUE);
        commandChannel.send(errorEmbed);
        message.delete();
        return;
    } else if (args[0].toLowerCase() === 'default') {
        message.member.setNickname(message.author.username);
        const successEmbed = new Discord.RichEmbed()
            .setTitle('Changement de pseudonyme')
            .setDescription('Ton pseudonyme est revenu à la normale !')
            .setColor(colors.NEUTRAL_BLUE);
        commandChannel.send(successEmbed);
        message.delete();
        return;
    }

    const newNickname = args.join(' ');
    const itemId = 1;
    const username = message.author.username;
    const connection = connectDatabase();

    const userItems = await connection.query(
        `SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`
    );

    if (!userItems[0] || userItems[0].amount < 1) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Boutique')
            .setDescription('Pour avoir accès à ça, fais `Strad shop` !')
            .setColor(colors.SHOP);
        commandChannel.send(errorEmbed);
        connection.end();
        message.delete();
        return;
    }

    message.member.setNickname(newNickname).catch(() => {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Changement de pseudonyme')
            .setDescription('Je ne peux pas te mettre ce pseudonyme, désolé !')
            .setColor(colors.ALERT);
        commandChannel.send(errorEmbed);
        connection.end();
        message.delete();
        return;
    });

    await connection.query(
        `UPDATE has_items SET amount = amount - 1 WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`
    );

    const successEmbed = new Discord.RichEmbed()
        .setTitle('Changement de pseudonyme')
        .setDescription('Génial, ta nouvelle identité est prête !')
        .setColor(colors.VALID);
    message.delete();
    commandChannel.send(successEmbed);

    sendLog(
        'Changement de pseudonyme',
        `${username} a changé son pseudo en "${newNickname}"`,
        colors.NEUTRAL_BLUE
    );
    connection.end();
};

export { nick };
