import Discord from 'discord.js';
import { connectDatabase } from '../functions/connectDatabase';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 */
const rank = async message => {
  const blockEmoji = client.assets.emojis.BLOCK;
  const creaEmoji = client.assets.emojis.CREA;

  const connection = connectDatabase();

  const user = (await connection.query(
    `SELECT * FROM users WHERE user_id = "${message.author.id}"`
  ))[0];

  if (!user) {
    connection.end();
    return;
  }

  const userRanking = await connection.query(
    `SELECT * FROM users ORDER BY creas_amount DESC`
  );
  const userItems = await connection.query(
    `SELECT has_items.item_id AS id, item_emoji AS emoji, has_items.amount AS amount FROM has_items INNER JOIN items ON items.item_id = has_items.item_id WHERE user_id = "${message.author.id}" AND amount != 0 ORDER BY has_items.item_id ASC`
  );
  const userInventory =
    (userItems[0]
      ? userItems.map(item => `${item.emoji} x ${item.amount}`)
      : []
    ).join(' • ') ||
    'Ton inventaire est vide. Fais `Strad shop` pour acheter des items !';
  const userRank = userRanking.indexOf(user) + 1;

  const rankEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL)
    .setThumbnail(message.author.avatarURL)
    .addField('Valeur du compte', `${user.money} ${blockEmoji}`, true)
    .addField('Nombre de Créas', `${user.creas_amount} ${creaEmoji}`, true)
    .addField('Rang', `#${userRank}`, true)
    .addField('Titre artistique', user.rank, true)
    .addField('Inventaire', userInventory)
    .setFooter('Strad rank')
    .setColor(message.member.displayColor);

  client.channels.get(commandChannelID).send(rankEmbed);
  message.delete();

  connection.end();
};

export { rank };
