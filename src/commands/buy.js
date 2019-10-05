import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { sendLog } from '../functions/sendMessage/sendLog';
import { client, commandChannelID } from '../globals';


const buy = async (message, args) => {
  const commandChannel = client.channels.get(commandChannelID);
  const blockEmoji = client.assets.emojis.BLOCK;

  if (!args[0] || isNaN(args[0])) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Commande erronée')
      .setDescription("Merci de saisir un numéro d'article valide.")
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    return;
  }
  const chosenId = parseInt(args[0], 10);

  const connection = connectDatabase();
  const { money } = await connection.query(
    `SELECT money FROM users WHERE user_id = "${message.member.id}"`
  )[0];
  const item = await connection.query(
    `SELECT * FROM items WHERE item_id = ${chosenId}`
  )[0];

  if (!item) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Achat impossible')
      .setDescription('Cet article est introuvable.')
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    connection.end();
    return;
  }

  const priceAfterDiscount = Math.round(
    item.price - item.price * (item.discount / 100)
  );

  if (!item.is_buyable) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Achat impossible')
      .setDescription("Cet article n'est pas à vendre.")
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    connection.end();
    return;
  } else if (item.quantity >= 0 && item.quantity < item.buy_amount) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Achat impossible')
      .setDescription(
        `Il ne reste plus assez de stocks pour acheter **${item.buy_amount} x ${item.item_name}**.`
      )
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    connection.end();
    return;
  } else if (money < priceAfterDiscount) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Achat impossible')
      .setDescription(
        `Tu n'as pas assez d'argent pour acheter **${item.buy_amount} x ${
          item.item_name
        }**. Il te manque encore ${priceAfterDiscount - money} ${blockEmoji} !`
      )
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    connection.end();
    return;
  }

  // Demande de confirmation
  const promptEmbed = new Discord.RichEmbed()
    .setTitle("Confirmation d'achat")
    .setDescription(
      `${message.member}, acheter **${item.buy_amount} x ${item.item_name}** pour **${priceAfterDiscount}** ${blockEmoji} ?`
    )
    .setColor(colors.SHOP)
    .setFooter('Envoie "Oui" ou "Non"');
  message.delete();

  await message.channel.send(promptEmbed);

  const filter = responseMessage =>
    message.author.id === responseMessage.author.id;
  const messages = await message.channel
    .awaitMessages(filter, {
      time: 10000,
      maxMatches: 1,
      errors: ['time']
    })
    .catch(() => {
      const timeoutEmbed = new Discord.RichEmbed()
        .setTitle('Achat annulé')
        .setDescription('La transaction a été annulée.')
        .setColor(colors.ALERT);
      message.channel.send(timeoutEmbed);
      connection.end();
      return;
    });

  if (messages) {
    if (messages && messages.first().content.toLowerCase() !== 'oui') {
      const cancelEmbed = new Discord.RichEmbed()
        .setTitle('Achat annulé')
        .setDescription('La transaction a été annulée.')
        .setColor(colors.ALERT);
      message.channel.send(cancelEmbed);
      messages.first().delete();
      connection.end();
      return;
    }
    // Prélèvement de l'argent sur le compte de l'utilisateur
    await connection.query(
      `UPDATE users SET money = ${money -
        priceAfterDiscount} WHERE user_id = "${message.member.id}"`
    );

    const items = await connection.query(
      `SELECT * FROM has_items WHERE user_id = "${message.member.id}" AND item_id = ${item.item_id}`
    );

    const sql = items[0]
      ? `UPDATE has_items SET amount = amount + ${item.buy_amount} WHERE user_id = "${message.member.id}" AND item_id = ${item.item_id}`
      : `INSERT INTO has_items (user_id, item_id, amount) VALUES ("${message.member.id}", ${item.item_id}, ${item.buy_amount})`;
    await connection.query(sql);

    const successEmbed = new Discord.RichEmbed()
      .setTitle('Achat réussi')
      .setDescription(
        `Tu as acheté **${item.buy_amount} x ${item.item_name}** pour **${priceAfterDiscount}** ${blockEmoji} !`
      )
      .setColor(colors.VALID)
      .setFooter('Tape "Strad rank" pour accéder à ton inventaire');
    messages.first().delete();
    commandChannel.send(successEmbed);

    sendLog(
      'Strad buy',
      `${message.author} a acheté **${item.buy_amount} x ${item.item_name}** pour **${priceAfterDiscount}** ${blockEmoji}.`,
      colors.NEUTRAL_BLUE
    );

    if (item.quantity !== -1) {
      await connection.query(
        `UPDATE items SET quantity = quantity - ${item.buy_amount} WHERE item_id = ${item.item_id}`
      );
    }

    connection.end();
  }
};

export { buy };

