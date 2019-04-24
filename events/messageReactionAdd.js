const Discord = require('discord.js');
const moment = require('moment');

const reactedRecently = new Set();

var appRoot = process.cwd();

const logger = require(appRoot + '/scripts/logger.js');
const isFeedbackable = require(appRoot + '/scripts/isFeedbackable.js');

const up_emote = "like:568493894270976012";
const down_emote = "dislike:568493872968368149";

module.exports = (client, messageReaction, user) => {
    if (messageReaction.message.member.guild.id !== "412369732679893004" || user.id === "412910522833436672") { // Si la réaction ne provient pas d'un salon du serveur Stradivarius ou s'il vient de Strad, alors le script s'arrête.
        return;
    }

    let msg = messageReaction.message.content.toUpperCase(); // Récupération du contenu du message (en majuscules)

    if (messageReaction.message.id === "570618282177069076") { // Distributeur de rôles
        var emojiName = messageReaction.emoji.name;
        var member = messageReaction.users.find("id", user.id);
        var stradivarius = client.guilds.find("id", "412369732679893004");

        switch (emojiName) {
            case "📝":
                member.addRole(stradivarius.roles.find("name", "Graphiste"));
                break;
            case "🎞":
                member.addRole(stradivarius.roles.find("name", "Vidéaste"));
                break;
            case "🎨":
                member.addRole(stradivarius.roles.find("name", "Dessinateur/trice"));
                break;
            case "📸":
                member.addRole(stradivarius.roles.find("name", "Photographe"));
                break;
            case "💻":
                member.addRole(stradivarius.roles.find("name", "Développeur/peuse"));
                break;
            case "🎹":
                member.addRole(stradivarius.roles.find("name", "Audiophile"));
                break;
            default:
                messageReaction.remove(user);
                return;
        }
    }

    if (messageReaction.message.channel.id === "412622887317405707" || messageReaction.message.channel.id === "412622912043089920"
        || messageReaction.message.channel.id === "412622999267704834" || messageReaction.message.channel.id === "416227695429550100"
        || messageReaction.message.channel.id === "425739003623374848" || messageReaction.message.channel.id === "438794104621629441"
        || messageReaction.message.channel.id === "442374005177974825") { // Si la réaction provient d'un salon "créatif"...
        if (!isFeedbackable.check(messageReaction.message) && messageReaction.emoji.name === "✨") {
            messageReaction.remove(user);
            return;
        } else if (messageReaction.emoji.identifier === up_emote || messageReaction.emoji.identifier === down_emote) {

            if (messageReaction.message.author.id === user.id || !isFeedbackable.checkFeedActivation(messageReaction.message)) {
                messageReaction.remove(user);
                return;
            }

            var vote_type = messageReaction.emoji.identifier == up_emote ? "UV" : "DV";
            var gb = {
                results: undefined
            };
            var mysql = require("mysql");

            var con = mysql.createConnection({
                host: "localhost",
                user: client.config.mysqlUser,
                password: client.config.mysqlPass,
                database: "strad"
            });

            con.connect((err) => {
                if (err) console.log(err);
            });

            con.query(`SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${messageReaction.message.id}"`, function (err, rows, fields) {

                if (err) {
                    console.log(err);
                }

                if (rows.length > 0) {
                    return;
                }

            });

            con.query(`INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date) VALUES ("${messageReaction.message.id}", "${messageReaction.message.author.id}", "${user.id}", "${vote_type}", "${moment().format('DD/MM/YY')}")`, function (err, rows, fields) {

                if (err) {
                    console.log(err);
                }

            });

            con.end();

        } else if (messageReaction.emoji.name === "✨") {
            if (user.id === messageReaction.message.author.id && !isFeedbackable.checkFeedActivation(messageReaction.message)) {
                messageReaction.message.react(client.emojis.get("568493894270976012"));
                messageReaction.message.react(client.emojis.get("568493872968368149"));
                messageReaction.remove(client.user);
            }
            messageReaction.remove(user);
        }
    }

    // Rôles
    var membre = messageReaction.message.guild.roles.find("id", "443748696170168321");
    var apprenti = messageReaction.message.guild.roles.find("id", "412587462892716032");
    var enattente = messageReaction.message.guild.roles.find("id", "444134229710864385");

    if (messageReaction.message.channel.id === "412557168529899541") {

        if (messageReaction.emoji.name === "true") {

            // Le membre est un apprenti/en attente : on lui ajoute le rôle membre
            messageReaction.message.member.addRole(membre);
            messageReaction.message.member.removeRole(apprenti);
            messageReaction.message.member.removeRole(enattente);

        }

    }

    // Si la réaction correspond à la réaction de report, ce bloc s'exécute.
    if (messageReaction.emoji.identifier === "report:418441210475053056") {

        if (messageReaction.message.member.user.bot) {
            messageReaction.remove(user);
            user.send(`Tu ne peux pas signaler mes messages. C'est vraiment l'hôpital qui se fout de la charité !`);
            return;
            // Si la réaction se trouve sur un message de Strad, alors le script s'arrête.
        }
        if (user.id === messageReaction.message.author.id) {
            messageReaction.remove(user);
            user.send(`Tu ne peux pas signaler ton propre message.`);
            return;
            // Si la réaction se trouve sur un message de la personne qui réagit, alors le script s'arrête.
        }
        if (messageReaction.message.member.roles.find("name", client.config.modRole) || messageReaction.message.member.roles.find("name", "Assistant")) {
            messageReaction.remove(user);
            user.send(`Tu ne peux pas signaler le message d'un membre du staff.`);
            return;
            // Si la réaction se trouve sur un message d'un membre du Staff, alors le script s'arrête.
        }
        if (messageReaction.message.reactions.find(r => r.emoji.name === "report").users.array().length > 1) {
            user.send(`Ce message a déjà été signalé, merci pour ta contribution !`);
            return;
            // Si le message a déjà été reporté, alors le script s'arrête MAIS ON NE RETIRE PAS LA RÉACTION DE L'UTILISATEUR.
        }
        if (reactedRecently.has(user.id)) {
            messageReaction.remove(user);
            user.send(`Tu ne peux signaler un message que toutes les 30 secondes !`);
            return;
            //Si l'utilisateur a déjà signalé un message il y a moins de 30 secondes, alors le script s'arrête.
        } else {
            // Adds the user to the set so that they can't talk for a minute
            reactedRecently.add(user.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                reactedRecently.delete(user.id);
            }, 30000);
        }

        console.log("Report !");
        var reportedMessage = messageReaction.message.cleanContent;
        logger.run(`${user.tag} a reporté un message dans le salon #${messageReaction.message.channel.name} du serveur ${messageReaction.message.guild.name}.`);
        var reportEmbed = new Discord.RichEmbed()
            .setColor(0xffac00)
            .setAuthor(`Message signalé`)
            .setDescription(`Un nouveau message a été signalé par ${user}.`)
            .addField(`Contenu`, `"${reportedMessage}"`, true)
            .addField(`Localisation`, messageReaction.message.channel, true)
            .addField(`Lien direct`, messageReaction.message.url, true)

        messageReaction.message.member.guild.channels.find("id", client.config.logsChannel).send(reportEmbed);
    }
};