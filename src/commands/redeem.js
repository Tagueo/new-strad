import Discord from 'discord.js';
import moment from 'moment';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { findKey } from '../functions/key/findKey';
import { sendLog } from '../functions/sendMessage/sendLog';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const redeem = async (message, args) => {
    const blockEmoji = client.assets.emojis.BLOCK;

    const commandChannel = client.channels.get(commandChannelID);

    if (!args[0]) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'Merci de saisir la clé à utiliser. Utilisation : `Strad redeem <clé>`.'
            )
            .setColor(colors.ALERT);
        commandChannel.send(errorEmbed);
        message.delete();
        return;
    }

    const connection = connectDatabase();
    const keyFace = args[0];
    const todayDate = moment().format('DD/MM/YY');

    const keys = await connection.query(`SELECT * FROM blocks_keys`);

    if (keys[0]) {
        const key = findKey(keys, keyFace);

        if (!key) {
            const errorEmbed = new Discord.RichEmbed()
                .setTitle('Récupération impossible')
                .setDescription(
                    `La clé \`${keyFace}\` n'est pas valide.
        Format : \`XXXX-XXXX-XXXX-XXXX\`.`
                )
                .setColor(colors.ALERT);
            commandChannel.send(errorEmbed);
            connection.end();
            message.delete();
            return;
        }

        if (!key.recipient_id) {
            await connection.query(
                `UPDATE blocks_keys SET recipient_id = "${message.author.id}", redeem_date = "${todayDate}" WHERE key_id = ${key.key_id}`
            );
            await connection.query(
                `UPDATE users SET money = money + ${
                    key['key_value']
                } WHERE user_id = "${message.author.id}"`
            );

            const successEmbed = new Discord.RichEmbed()
                .setTitle('Récupération réussie')
                .setDescription(
                    `Youpi ! Tu viens de recevoir **${key.key_value}** ${blockEmoji} !`
                )
                .setColor(colors.VALID)
                .setFooter('Strad redeem <clé>');
            message.delete();
            commandChannel.send(successEmbed);

            sendLog(
                'Récupération de clé',
                `${message.author} a utilisé la clé \`${keyFace}\` d'une valeur de **${key.key_value}** ${blockEmoji}.`,
                colors.NEUTRAL_BLUE
            );
        } else {
            const errorEmbed = new Discord.RichEmbed()
                .setTitle('Récupération impossible')
                .setDescription(
                    `La clé \`${keyFace}\` a déjà été utilisée. En cas de litige, contacte un Mentor en message privé.`
                )
                .setColor(colors.ALERT);
            message.delete();
            commandChannel.send(errorEmbed);
        }
    } else {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Récupération impossible')
            .setDescription(
                `La clé \`${keyFace}\` n'est pas valide.
      Format : \`XXXX-XXXX-XXXX-XXXX\`.`
            )
            .setColor(colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
    }
    connection.end();
};

export { redeem };
