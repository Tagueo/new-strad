import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { client, commandChannelID } from '../globals';

const top = async message => {
  const quantity = 10; // Quantité de membres affichés dans le top 10
  const connection = connectDatabase;

  const usersRanking = await connection.query(
    `SELECT * FROM users ORDER BY creas_amount DESC LIMIT ${quantity}`
  );
  const creaEmoji = client.assets.emojis.CREA;
  const topEmbed = new Discord.RichEmbed()
    .setTitle('Stradivarius - Classement (Créas)')
    .setFooter('Strad top')
    .setColor(colors.SDVR);
  usersRanking
    .slice(0, 2)
    .forEach((user, index) =>
      topEmbed.addField(
        `${index + 1}. ${user.usertag}`,
        `**${user.creas_amount}** ${creaEmoji}`,
        true
      )
    );
  // Reste du classement
  const otherLeaders = usersRanking
    .slice(2, quantity)
    .map(
      (user, index) =>
        `\`${index + 1}. ${user.creas_amount}\` - ${user.usertag}`
    )
    .join('\n');
  topEmbed.addField(`Top ${quantity}`, otherLeaders, false);
  client.channels.get(commandChannelID).send(topEmbed);
  message.delete();
  connection.end();
};

export { top };

