import Discord from 'discord.js';
import moment from 'moment';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { createFingerPrint } from '../functions/key/createFingerPrint';
import { createKey } from '../functions/key/createKey';
import { sendLog } from '../functions/sendMessage/sendLog';
import { sendMP } from '../functions/sendMessage/sendMP';
import { client, commandChannelID } from '../globals';

const key = async (message, args) => {
  const blockEmoji = client.assets.emojis.BLOCK;
  const commandChannel = client.channels.get(commandChannelID);
  const minAllowedValue = 50;
  const maxAllowedValue = 15000;

  if (!args[0] || isNaN(args[0])) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Commande erronée')
      .setDescription(
        'Merci de saisir une valeur en Blocs valide. Utilisation : `Strad key <valeur>`.'
      )
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
return;
  }
  const chosenValue = parseInt(args[0], 10);

  if (chosenValue < minAllowedValue || chosenValue > maxAllowedValue) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Création de clé impossible')
      .setDescription(
        'Tu dois saisir une valeur en Blocs comprise entre 50 et 15000.'
      )
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
return;
  }

  const keyFace = createKey();
  const keyPrint = createFingerPrint();
  const todayDate = moment().format('DD/MM/YY');
  const connection = connectDatabase();

  const { money } = (await connection.query(
    `SELECT money FROM users WHERE user_id = "${message.author.id}"`
  ))[0];

  if (chosenValue > money) {
    const errorEmbed = new Discord.RichEmbed()
      .setTitle('Création de clé impossible')
      .setDescription(
        `Tu n'as pas assez de Blocs pour créer cette clé. Il te manque **${chosenValue -
          money}** ${blockEmoji} !`
      )
      .setColor(colors.ALERT);
    message.delete();
    commandChannel.send(errorEmbed);
    connection.end();
return;
  }

  await connection.query(
    `UPDATE users SET money = money - ${chosenValue} WHERE user_id = "${message.author.id}"`
  );
  await connection.query(`INSERT INTO blocks_keys (key_face, key_print, key_value, creator_id, creation_date)
        VALUES ("${keyFace}", "${keyPrint}", ${chosenValue}, "${message.author.id}", "${todayDate}")`);

  const publicSuccessEmbed = new Discord.RichEmbed()
    .setTitle('Création effectuée')
    .setDescription(
      'Ta clé a correctement été débloquée. Tu viens de la recevoir en message privé !'
    )
    .setColor(colors.VALID)
    .setFooter('Strad key <valeur>');
  message.delete();
  commandChannel.send(publicSuccessEmbed);

  const privateSuccessEmbed = new Discord.RichEmbed()
    .setTitle('Création de clé')
    .setDescription(
      `Voici ta clé d'une valeur de **${chosenValue}** ${blockEmoji} (clique pour l'afficher) :
      ||\`\`\`${keyFace}\`\`\`||
      Fais bien attention de ne pas la partager à n'importe qui !
      Afin de l'utiliser, le bénéficiaire de la clé devra taper la commande : \`Strad redeem <clé>\`.
      Il recevra ainsi la valeur en Blocs de la clé !`
    )
    .setColor(colors.NEUTRAL_BLUE)
    .addField(
      'Empreinte de la clé',
      `\`\`\`${keyPrint}\`\`\`
      Note : L'empreinte n'est pas secrète, elle est directement liée à ta clé.
      Tu peux partager l'empreinte au destinataire de celle-ci afin d'attester qu'elle t'appartient, qu'elle est valide et qu'elle a bien la valeur en Blocs annoncée.
      Cela peut se révéler bien utile dans le cas d'un échange !`
    );
  sendMP(privateSuccessEmbed, message.member);
  sendLog(
    'Création de clé',
    `${message.author} a créé une clé d'empreinte \`${keyPrint}\` et d'une valeur de **${chosenValue}** ${blockEmoji}.`,
    colors.NEUTRAL_BLUE
  );

  connection.end();
};

export { key };

