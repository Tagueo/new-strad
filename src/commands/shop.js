import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { addItem } from '../functions/shop/addItem';
import { client, commandChannelID } from '../globals';

/**
 * @param  {Message} message
 */
const shop = async message => {
  const connection = connectDatabase();
  const commandChannel = client.channels.get(commandChannelID);

  const items = await connection.query(
    'SELECT item_id AS id, item_name AS name, item_emoji AS emoji, description, price, is_buyable AS buyable, is_saleable AS saleable, quantity, buy_amount, discount, script_name, type FROM items WHERE is_buyable = 1 ORDER BY id ASC'
  );
  const shopEmbed = new Discord.RichEmbed()
    .setAuthor('Boutique')
    .setThumbnail(
      'https://cdn.discordapp.com/attachments/543888518167003136/602227009468235791/SDVR_item.png'
    )
    .addField(
      'Aide',
      `Acheter un article : \`Strad buy <numéro de l'article>\`
      Exemple : \`Strad buy 1\` (pour acheter un changement de pseudonyme).`
    )
    .setFooter('Strad shop')
    .setColor(colors.SHOP);

  items.forEach(item => {
    if (item.buyable === 1) addItem(shopEmbed, item);
  });
  message.delete();
  commandChannel.send(shopEmbed);
  connection.end();
};

export { shop };
