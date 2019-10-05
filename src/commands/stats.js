import cpuStat from 'cpu-stat';
import Discord from 'discord.js';
import moment from 'moment';
import os from 'os';
import { colors } from '../colors';
import { client, commandChannelID } from '../globals';

const stats = message => {
  cpuStat.usagePercent((error, percent) => {
    if (error) {
      console.log(error);
      return;
    }
    const duration = moment
      .duration(client.uptime)
      .format(' D [days], H [hrs], m [mins], s [secs]');
    const embedStats = new Discord.RichEmbed()
      .setAuthor('Stats', client.user.avatarURL)
      .setColor(colors.NEUTRAL_BLUE)
      .addField('Temps de disponibilité', duration, true)
      .addField('Version de Discord.js', Discord.version, true)
      .addField('Version de NodeJS', process.version, true)
      .addField('Utilisation du CPU', percent.toFixed(2), true)
      .addField(
        'Utilisation de la RAM',
        `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/${(
          os.totalmem() /
          1024 /
          1024
        ).toFixed(2)} MB\``,
        true
      )
      .addField('Latence', `\`${Math.round(client.ping)} ms\``, true)
      .setTimestamp();
    client.channels.get(commandChannelID).send(embedStats);
    message.delete();
  });
};

export { stats };

