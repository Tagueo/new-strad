/**
 * Permet d'écrire dans les logs.
 */

const moment = require('moment');
var appRoot = process.cwd();

exports.run = (message) => {

    var fs = require("fs"); // Module nécessaire pour écrire dans les logs.
    let isMessageType = typeof(message) != "string" ? true : false; // Détecte un message (objet) ou une string en argument.
    var logMoment = moment(Date().now()).format("L - h:mm:ss");
    var filter = /[\s]{2,}/gi;

    var logMessage;

    if (isMessageType) { // Traite la requête en fonction de son type.
        logMessage = "[" + logMoment + "][" + message.guild.name + "|" + message.guild.id + "] ";
        logMessage += message.author.tag + " : " + message.cleanContent.replace(filter, " ") + "\r\n";
    } else {
        logMessage = "[" + logMoment + "] * " + message + "\r\n";
    }

    try { // Essaie d'écrire dans les logs.
        fs.appendFile(appRoot + `/logs/${logMoment}.txt`, logMessage, (err) => {})
        var logFile = fs.readFileSync(appRoot + `/logs/${logMoment}.txt`);

        console.log(logMessage);

        logFile += logMessage;

        fs.writeFile(appRoot + `/logs/${logMoment}.txt`, logFile);
    } catch (error) {
        
    }

}