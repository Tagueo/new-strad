import fs from 'fs'; // Module nécessaire pour écrire dans les logs.
import moment from 'moment';
import { formatLogMessage } from './formatLogMessage';

// Permet d'écrire dans les logs.
const logger = message => {
  const appRoot = process.cwd();
  const logName = moment(Date.now()).format('MM-DD-YY');
  const logMessage = formatLogMessage(message);
  if (logMessage === null) return;
  try {
    // Essaie d'écrire dans les logs.
    fs.appendFile(appRoot + `/logs/${logName}.txt`, logMessage, () => {});
  } catch (error) {
    fs.writeFile(appRoot + `/logs/${logName}.txt`, logMessage);
  }
};

export { logger };

