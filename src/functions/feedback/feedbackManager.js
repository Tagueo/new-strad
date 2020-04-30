import Discord from 'discord.js';
import moment from 'moment';
import probe from 'probe-image-size';
import { colors } from '../../colors';
import { client } from '../../globals';
import { assets } from '../../static_data/assets';
import { connectDatabase } from '../connectDatabase';
import { checkFeedbackable } from './checkFeedbackable';
import { checkFeedbackActivation } from './checkFeedbackActivation';

/**
 * @param  {MessageReaction} reaction
 * @param  {User} user
 */
const feedbackManager = async (reaction, user) => {
    const upVoteEmoji = assets.emojiIds.UPVOTE;
    const blockEmoji = assets.emojis.BLOCK;
    const downVoteEmoji = assets.emojiIds.DOWNVOTE;
    const enableVotesEmoji = assets.emojis.ENABLE_VOTES;
    const downloadEmoji = assets.emojiIds.DOWNLOAD;
    const connection = connectDatabase();
    if (
        checkFeedbackActivation(reaction.message) &&
        reaction.emoji.id === downloadEmoji
    ) {
        if (
            reaction.message.author.id === user.id ||
            !reaction.message.attachments
        ) {
            reaction.remove(user);
            return;
        }

        const attachment = reaction.message.attachments.first();
        const imageInformations = await probe(attachment.url).catch(console.error);
        const dimensions = imageInformations
            ? `${imageInformations.width}${imageInformations.hUnits} x ${imageInformations.height}${imageInformations.hUnits}`
            : 'Dimension inconnue';
        const description = `En téléchargeant la création de ${reaction.message.member.displayName}, tu as ajouté **2** ${blockEmoji} sur sa prochaine récompense !`;
        const fileExtension = imageInformations
            ? imageInformations.type
            : 'Extension inconnue';

        const response = await connection.query(
            `SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${reaction.message.id}" AND type = "DL"`
        );
        if (!response[0]) {
            await connection.query(
                `INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date) VALUES ("${
                    reaction.message.id
                }", "${reaction.message.author.id}", "${
                    user.id
                }", "DL", "${moment().format('DD/MM/YY')}")`
            );
        }

        const downloadEmbed = new Discord.RichEmbed()
            .setTitle(`Téléchargement de ${attachment.filename}`)
            .setDescription(
                `${description}
      Dimensions : ${dimensions} / Type : ${fileExtension}`
            )
            .setColor(colors.DOWNLOAD)
            .addField(`Lien de téléchargement`, attachment.proxyURL);
        user.send(downloadEmbed);
    } else if (
        !checkFeedbackable(reaction.message) &&
        reaction.emoji.name === enableVotesEmoji
    ) {
        reaction.remove(user);

    } else if (
        reaction.emoji.id === upVoteEmoji ||
        reaction.emoji.id === downVoteEmoji
    ) {
        if (
            reaction.message.author.id === user.id ||
            !checkFeedbackActivation(reaction.message)
        ) {
            reaction.remove(user);
            return;
        }

        const voteType = reaction.emoji.id === upVoteEmoji ? 'UV' : 'DV';

        const response = await connection.query(
            `SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${reaction.message.id}" AND type IN ("UV", "DV")`
        );
        if (response[0]) return;

        await connection.query(
            `INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date) VALUES ("${
                reaction.message.id
            }", "${reaction.message.author.id}", "${
                user.id
            }", "${voteType}", "${moment().format('DD/MM/YY')}")`
        );

        connection.end();
    } else if (reaction.emoji.name === enableVotesEmoji) {
        if (
            user.id === reaction.message.author.id &&
            !checkFeedbackActivation(reaction.message)
        ) {
            await reaction.remove(client.user);
            await reaction.message.react(
                client.emojis.get(client.assets.emojiIds.UPVOTE)
            );
            await reaction.message.react(
                client.emojis.get(client.assets.emojiIds.DOWNVOTE)
            );
            if (reaction.message.attachments)
                await reaction.message.react(
                    client.emojis.get(client.assets.emojiIds.DOWNLOAD)
                );
        }
        reaction.remove(user);
    }
};

export { feedbackManager };
