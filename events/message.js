const Discord = require('discord.js');

const chalk = require('chalk');
const moment = require('moment');
const fs = require('fs');

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger');
const isFeedbackable = require(appRoot + '/scripts/isFeedbackable');
const mLog = require('../scripts/mLog');
const sendMP = require('../scripts/sendMP');

module.exports = (client, message) => {

    if (message.channel.type !== "text") return;

    // Écriture dans les logs
    logger.run(message);

    // Gestion des ressources postées
    var msg = message.content.toUpperCase();

    // Suppression des messages envoyés par les sanctionnés
    if ((message.member.roles.find(r => r.name === "Sanctionné(e)"))) {
        message.delete(20000);
    }

    // Vérification du contenu du message
    if ((msg.includes("DISCORD.ME") || msg.includes("DISCORD.GG")) && !message.member.roles.find(r => r.name === "Mentor")) {

        message.delete()
            .then(m => {
                m.channel.send(message.author + ", la publicité pour les serveurs Discord est défendue sur Stradivarius.")
                    .then(m => {
                        m.delete(5000);
                        mLog.run(client, "Tentative de publicité", `${message.author} a tenté de faire sa publicité dans le salon ${message.channel}.\nContenu du message : *${message.cleanContent}*`, mLog.colors.WARNING);
                    });
            });
    }

    if (message.channel.id === "412622887317405707" || message.channel.id === "412622912043089920"
        || message.channel.id === "412622999267704834" || message.channel.id === "416227695429550100"
        || message.channel.id === "425739003623374848" || message.channel.id === "438794104621629441"
        || message.channel.id === "442374005177974825") {
        if (msg.includes("[RES]")) {
            message.pin();
        }
        if (message.type === "PINS_ADD") {
            message.delete();
        }
        // Conditions d'éligibilité au feedback : fichier joint (sans "[POST]" nécessaire) ou URL (mention "[POST]")
        if (isFeedbackable.check(message)) {
            message.react("✨");
            message.channel.send(`**Si tu souhaites activer les votes, clique sur ✨ ! :wink:\n(Attention : il doit s'agir d'une création qui t'appartient !)**`)
                .then((m) => {
                    m.delete(10000);
                });
        } else if (message.channel.id === "568677435793604649" && message.attachments.size === 0) {
            sendMP.run(client, "Hey, tu ne peux poster qu'un montage de tes créations, dans le salon #before-after ! :smile:"
                + "\nCrée une image avec quelques de tes premières créations avec, à côté, certaines de tes dernières !"
                + "\nOn pourra ainsi voir les progrès que tu as fait sur Stradivarius :wink:", message.member);
            message.delete();
        }
    }

    const ANSWERS = JSON.parse(fs.readFileSync(appRoot + "/static_data/answers.json", "utf8"));

    let botPrefix = client.config.prefix;

    // Ignores all bots
    if (message.author.bot) return;

    // Checks automatic answers
    if (ANSWERS[message.cleanContent.toLowerCase()]) {
        message.channel.send(ANSWERS[message.cleanContent.toLowerCase()]);
    }

    // Ignores messages not starting with the prefix
    if (!message.content.toLowerCase().startsWith(botPrefix.toLowerCase())) {
        return;
    }

    // Standard argument/command name definition.
    const args = message.content.slice(botPrefix.length).trim().split(/ +/g);
    var command = args.shift().toLowerCase();


    // Grabs the command data from the client.commands Enmap
    const cmd = client.commands.get(command);

    if (!cmd) {
        return;
    }

    // Run the command
    if (client.config.mtnMode != "true" || message.member.roles.find(r => r.name === "Mentor")) {
        cmd.run(client, message, args);
        console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(message.author.tag)}] used ${chalk.green(command)} ${chalk.cyan(args.join(" "))}`);
    } else {
        message.channel.send(message.author + " Une maintenance est en cours. Merci de bien vouloir patienter ! :sweat_smile:");
    }

};
