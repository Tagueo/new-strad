import chalk from 'chalk';
import moment from 'moment';

const formatLogMessage = message => {
  const isObject = typeof message === 'object' ? true : false; // Détecte un message (objet) ou une string en argument.
  const logMoment = moment(Date.now()).format('MM-DD-YY_h-mm-ss');

  // Traite la requête en fonction de son type.
  if (isObject) {
    try {
      return (
        `[${logMoment}][${message.guild.name}|${message.guild.id}][#${
          message.channel.name
        }] ${message.author.tag} : ${message.cleanContent.replace(
          /[\s]{2,}/gi,
          ' '
        )}` + '\r\n'
      );
    } catch (error) {
      console.log('(Message privé envoyé)');
      return null;
    }
  } else {
    console.log(
      `[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ` + message
    );
    return `[${logMoment}] * ${message}` + '\r\n';
  }
};

export { formatLogMessage };

