import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { findKey } from '../functions/key/findKey';
import { client, commandChannelID, stradivariusID } from '../globals';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const check = async (message, args) => {
    const blockEmoji = client.assets.emojis.BLOCK;
    const validEmoji = client.assets.emojis.KEY_VALID;
    const usedEmoji = client.assets.emojis.KEY_USED;

    const commandChannel = client.channels.get(commandChannelID);

    if (!args[0]) {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Commande erronée')
            .setDescription(
                'Merci de saisir l\'empreinte de la clé à vérifier. Utilisation : `Strad check <empreinte>`.'
            )
            .setColor(colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        return;
    }

    const keyPrint = args[0];
    const connection = connectDatabase();
    const keys = await connection.query(`SELECT * FROM blocks_keys`);

    const key = findKey(keys, keyPrint);
    if (key) {
        const embedColor = key.recipient_id ? colors.ALERT : colors.VALID;
        const keyOwner = client.guilds
            .find(guild => guild.id === stradivariusID)
            .members.find(member => member.id === key.creator_id).user;
        const keyUser = key.recipient_id
            ? client.guilds
                .find(guild => guild.id === stradivariusID)
                .members.find(member => member.id === key.recipient_id).user
            : '-';
        const validity = key.recipient_id
            ? `Utilisée ${usedEmoji}`
            : `Valide ${validEmoji}`;
        const redeemDate = key.recipient_id ? ', le ' + key.redeem_date : '';
        const keySimFace = `**${key.key_face.slice(
            0,
            1
        )}**???-????-???**${key.key_face.slice(-1)}**`;

        const infoEmbed = new Discord.RichEmbed()
            .setTitle(`Clé d'empreinte ${keyPrint}`)
            .setDescription(
                `Les informations concernant la clé d'empreinte \`${keyPrint}\` sont affichées ci-dessous.`
            )
            .setColor(embedColor)
            .addField('Apparence de la clé', keySimFace)
            .addField('Créée par', `${keyOwner}, le ${key.creation_date}`)
            .addField('Utilisée par', `${keyUser}${redeemDate}`)
            .addField('Validité', validity)
            .addField('Valeur', `${key.key_value} ${blockEmoji}`)
            .setFooter('Strad check <empreinte>');
        message.delete();
        commandChannel.send(infoEmbed);
        connection.end();
    } else {
        const errorEmbed = new Discord.RichEmbed()
            .setTitle('Clé introuvable')
            .setDescription(
                `L'empreinte \`${keyPrint}\` n'est liée à aucune clé existante.
          Format : \`XX-XXXX\`.`
            )
            .setColor(colors.ALERT);
        message.delete();
        commandChannel.send(errorEmbed);
        connection.end();
    }
};

export { check };
