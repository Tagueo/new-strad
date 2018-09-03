const chalk = require('chalk');
var moment = require('moment');

module.exports = (client) => {
  console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Pret à servir dans ${chalk.cyan(client.channels.size)} channels sur ${chalk.cyan(client.guilds.size)} serveurs, pour un total de ${chalk.cyan(client.users.size)} utilisateurs.`);
  client.user.setActivity(`Strad help`, {
      type: 'WATCHING'
    })
    .then(presence => console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Activity set`))
    .catch(console.error);
}
