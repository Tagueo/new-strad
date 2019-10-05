import Discord from 'discord.js';
import { colors } from '../colors';
import { connectDatabase } from '../functions/connectDatabase';
import { sendMP } from '../functions/sendMessage/sendMP';
import { client, stradivariusID } from '../globals';

const guildMemberAdd = async member => {
  // Récupération du salon de modération
  const logsChannel = client.channels.get(client.config.logsChannel);

  // Récupération de la catégorie de bienvenue
  const welcomeCategoryId = '443782424653070346';

  // On vérifie si l'évènement a lieu sur Stradivarius
  if (member.guild.id === stradivariusID) {
    const apprenti = member.guild.roles.find(
      role => role.name === 'Apprenti(e)'
    );
    member.addRole(apprenti).catch(console.error);
    const embed = new Discord.RichEmbed()
      .setTitle('Nouveau Membre')
      .setDescription(
        `**<@${member.user.id}>** vient de rejoindre le serveur !`
      )
      .setColor(colors.NEUTRAL_BLUE);
    const connection = connectDatabase();
    const user = (await connection.query(
      `SELECT * FROM users WHERE user_id = "${member.user.id}"`
    ))[0];

    if (!user)
      await connection.query(
        `INSERT INTO users (user_id, usertag) VALUES ("${member.user.id}", "${member.user.tag}")`
      );

    const welcomeMessage = `Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?
      Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:
      On a tous envie de te connaître ! :violin:
      
      > https://discord.gg/4MmJwgj`;
    sendMP(welcomeMessage, member);

    member.guild.channels
      .find(channel => channel.id === welcomeCategoryId)
      .setName(`STRADIVARIUS | ${member.guild.memberCount} MEMBRES`);
    logsChannel.send(embed);
    console.log(`${member.user.username} a rejoint le serveur !`);
    connection.end();
  }
};

export { guildMemberAdd };

