import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { sendLog } from '../functions/sendMessage/sendLog';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 * @param  {String[]} args
 */
const say = async (message, args) => {
  const commandChannel = client.channels.get(commandChannelID);

  if (!args[0]) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Aide')
      .setDescription('Faire parler Strad : `Strad say <message>`.')
      .setColor(colors.NEUTRAL_BLUE);
    commandChannel.send(errorEmbed);
    message.delete();
    return;
  }

  const msg = args.join(' ');
  const itemId = 2;
  const connection = connectDatabase();

  const sayItem = (await connection.query(
    `SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`
  ))[0];

  if (!sayItem || sayItem.amount < 1) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Boutique')
      .setDescription('Pour avoir accès à ça, fais `Strad shop` !')
      .setColor(colors.SHOP);
    commandChannel.send(errorEmbed);
    connection.end();
    message.delete();
    return;
  }

  message.delete();
  message.channel.send(msg); // Envoi du message personnalisé

  sendLog(
    'Strad say',
    `${message.author} a envoyé un message via Strad : "${msg}"`,
    colors.NEUTRAL_BLUE
  );

  await connection.query(
    `UPDATE has_items SET amount = amount - 1 WHERE user_id = "${message.member.id}" AND item_id = ${itemId}`
  );

  connection.end();
};

export { say };
