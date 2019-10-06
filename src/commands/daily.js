import Discord from 'discord.js';
import moment from 'moment';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 */
const daily = async message => {
  moment.locale('fr');

  const creaEmoji = client.assets.emojis.CREA;
  const blockEmoji = client.assets.emojis.BLOCK;
  const upvoteEmoji = client.assets.emojis.UPVOTE;
  const downvoteEmoji = client.assets.emojis.DOWNVOTE;
  const downloadEmoji = client.assets.emojis.DOWNLOAD;

  const todayDate = moment().format('DD/MM/YY');
  const connection = connectDatabase();
  const user = await connection.query(
    `SELECT * FROM users WHERE user_id = "${message.author.id}"`
  )[0];

  if (user.lastdaily !== todayDate) {
    // Si l'utilisateur n'a pas encore demandé son daily aujourd'hui, alors...
    const upvotesList = await connection.query(
      `SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "UV") AND (daily_date IS NULL)`
    );
    const downvotesList = await connection.query(
      `SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "DV") AND (daily_date IS NULL)`
    );
    const downloadsList = await connection.query(
      `SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "DL") AND (daily_date IS NULL)`
    );
    const { length: upvotes } = upvotesList || [];
    const { length: downvotes } = downvotesList || [];
    const { length: downloads } = downloadsList || [];
    const finalCreaReward = downvotes < upvotes ? upvotes - downvotes : 0;
    const finalBlockReward = 50 + upvotes * 5 + downloads * 2;

    await connection.query(
      `UPDATE rewards SET daily_date = "${todayDate}" WHERE (daily_date IS NULL) AND (rewarded_id = "${message.author.id}")`
    ); // Suppression des votes
    await connection.query(
      `UPDATE users SET money = money + ${finalBlockReward}, creas_amount = creas_amount + ${finalCreaReward}, usertag = "${message.member.displayName}" WHERE user_id = "${message.author.id}"`
    ); // Ajout des Blocs et des Créas
    await connection.query(
      `UPDATE users SET lastdaily = "${todayDate}" WHERE user_id = "${message.author.id}"`
    ); // Mise à jour de la date du dernier daily

    const successEmbed = new Discord.RichEmbed()
      .setAuthor(
        `Récompense quotidienne (${message.member.displayName})`,
        message.author.avatarURL
      )
      .setColor(colors.VALID)
      .addField('Blocs', `+ **${finalBlockReward}** ${blockEmoji}`, true)
      .addField('Créas', `+ **${finalCreaReward}** ${creaEmoji}`, true)
      .setDescription(
        `Voici ta récompense journalière ! Pour accéder à ton compte, fais \`Strad rank\`.
        **${upvotes}** ${upvoteEmoji} • **${downvotes}** ${downvoteEmoji} • **${downloads}** ${downloadEmoji}`
      )
      .setFooter('Strad daily');

    client.channels.get(commandChannelID).send(successEmbed);
    message.delete();

    connection.end();
  } else {
    const errorEmbed = new Discord.RichEmbed()
      .setAuthor(
        `Récompense quotidienne (${message.member.displayName})`,
        message.author.avatarURL
      )
      .setColor(colors.ALERT)
      .setDescription(
        `Tu as déjà obtenu ta récompense aujourd'hui.
        Récupère-la ${moment()
          .endOf('day')
          .fromNow()} !`
      )
      .setFooter('Strad daily');

    client.channels.get(commandChannelID).send(errorEmbed);
    message.delete();

    connection.end();
  }
};

export { daily };
