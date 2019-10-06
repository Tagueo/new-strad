import Discord from 'discord.js';

/**
 * @param  {TextChannel} channel
 */
const sendWIP = channel => {
  const attachment = new Discord.Attachment(
    'https://cdn.discordapp.com/attachments/543888518167003136/602155105021591552/Travaux_en_cours.png'
  );
  channel.send(attachment);
};

export { sendWIP };
