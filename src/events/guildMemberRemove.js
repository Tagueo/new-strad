import { colors } from '../colors';
import { sendLog } from '../functions/sendMessage/sendLog';
import { stradivariusID, welcomeCategoryId } from '../globals';

const guildMemberRemove = async member => {
  if (member.guild.id !== stradivariusID) return;
  member.guild.channels
    .find(channel => channel.id === welcomeCategoryId)
    .setName(`STRADIVARIUS | ${member.guild.memberCount} MEMBRES`);
  sendLog(
    'Ancien membre',
    `**${member.user.tag}** vient de quitter le serveur.`,
    colors.ALERT
  );
};

export { guildMemberRemove };

