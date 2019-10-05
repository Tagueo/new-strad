import chalk from 'chalk';
import moment from 'moment';
import { client } from '../globals';

const ready = async () => {
  console.log(
    `[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(
      client.user.tag
    )}] Prêt à servir dans ${chalk.cyan(
      client.channels.size
    )} channels sur ${chalk.cyan(
      client.guilds.size
    )} serveurs, pour un total de ${chalk.cyan(
      client.users.size
    )} utilisateurs.`
  );
  await client.user
    .setActivity(`Strad help`, {
      type: 'STREAMING',
      url: 'https://www.twitch.tv/delphistudio'
    })
    .catch(console.error);
  console.log(
    `[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(
      client.user.tag
    )}] Prêt à fonctionner !`
  );
};

export { ready };

