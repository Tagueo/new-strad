/**
 * Permet d'écrire dans les logs.
 */

const chalk = require('chalk');
const moment = require('moment');

let appRoot = process.cwd();

exports.run = (message) => {

    let fs = require("fs"); // Module nécessaire pour écrire dans les logs.
    let isMessageType = typeof(message) !== "string" ? true : false; // Détecte un message (objet) ou une string en argument.
    let logMoment = moment(Date.now()).format("MM-DD-YY_h-mm-ss");
    let logName = moment(Date.now()).format("MM-DD-YY");
    let filter = /[\s]{2,}/gi;

    let logMessage;

    if (isMessageType) { // Traite la requête en fonction de son type.
        try {
            logMessage = "[" + logMoment + "][" + message.guild.name + "|" + message.guild.id + "][#" + message.channel.name + "] ";
            logMessage += message.author.tag + " : " + message.cleanContent.replace(filter, " ") + "\r\n";
        } catch (e) {
            console.log("(Message privé envoyé)");
        }
    } else {
        logMessage = "[" + logMoment + "] * " + message + "\r\n";
        console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] ` + message);
    }

    try { // Essaie d'écrire dans les logs.
        fs.appendFile(appRoot + `/logs/${logName}.txt`, logMessage, (err) => {})
    } catch (error) {
        fs.writeFile(appRoot + `/logs/${logName}.txt`, logMessage);
    }

};