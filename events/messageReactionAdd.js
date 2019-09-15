const Discord = require("discord.js");
const moment = require("moment");
const db = require("../scripts/db");
const logger = require("../scripts/logger.js");
const isFeedbackable = require("../scripts/isFeedbackable.js");
const sendMP = require("../scripts/sendMP");

module.exports = async (client, messageReaction, user) => {
    const uvEmoji = client.assets.emojiIds.UPVOTE,
        dvEmoji = client.assets.emojiIds.DOWNVOTE,
        enableVotesEmoji = client.assets.emojiIds.ENABLE_VOTES;
    const reactedRecently = new Set();

    if (messageReaction.message.channel.type !== "text") return;

    if (client.config.mtnMode === "true") {
        return;
    }

    if (messageReaction.message.member.guild.id !== "412369732679893004" || user.id === "412910522833436672") { // Si la réaction ne provient pas d'un salon du serveur Stradivarius ou s'il vient de Strad, alors le script s'arrête.
        return;
    }

    if (messageReaction.message.id === "570618282177069076") { // Distributeur de rôles
        let emojiName = messageReaction.emoji.name;
        let stradivarius = client.guilds.find(g => g.id === "412369732679893004");
        let member = stradivarius.members.find(m => m.id === user.id);

        switch (emojiName) {
            case "📝":
                member.addRole(stradivarius.roles.find(r => r.name === "Graphiste"));
                break;
            case "🎞":
                member.addRole(stradivarius.roles.find(r => r.name === "Vidéaste"));
                break;
            case "🎨":
                member.addRole(stradivarius.roles.find(r => r.name === "Dessinateur/trice"));
                break;
            case "📸":
                member.addRole(stradivarius.roles.find(r => r.name === "Photographe"));
                break;
            case "💻":
                member.addRole(stradivarius.roles.find(r => r.name === "Développeur/peuse"));
                break;
            case "🎹":
                member.addRole(stradivarius.roles.find(r => r.name === "Audiophile"));
                break;
            default:
                messageReaction.remove(user);
                return;
        }
    }

    if (messageReaction.message.id === "601739344163897344") { // Distributeur de rôles
        function addSeparator(member) {
            if (member.roles.find(r => r.name === rolePrefix + "News")
                || member.roles.find(r => r.name === rolePrefix + "Events")
                || member.roles.find(r => r.name === rolePrefix + "Streams")) {
                member.addRole(stradivarius.roles.find(r => r.name === "------------ Notifications ------------"));
            }
        }
        let emojiName = messageReaction.emoji.name;
        let stradivarius = client.guilds.find(g => g.id === "412369732679893004");
        let member = stradivarius.members.find(m => m.id === user.id);
        let rolePrefix = "Notif's - ";

        switch (emojiName) {
            case "🔔":
                member.addRole(stradivarius.roles.find(r => r.name === rolePrefix + "News"))
                    .then(m => {
                        addSeparator(m);
                    });
                break;
            case "🎉":
                member.addRole(stradivarius.roles.find(r => r.name === rolePrefix + "Events"))
                    .then(m => {
                        addSeparator(m);
                    });
                break;
            case "📡":
                member.addRole(stradivarius.roles.find(r => r.name === rolePrefix + "Streams"))
                    .then(m => {
                        addSeparator(m);
                    });
                addSeparator(member);
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
        if (!isFeedbackable.check(messageReaction.message) && messageReaction.emoji.id === enableVotesEmoji) {
            messageReaction.remove(user);
            return;
        } else if ((messageReaction.emoji.id === uvEmoji) || (messageReaction.emoji.id === dvEmoji)) {

            if ((messageReaction.message.author.id === user.id) || !isFeedbackable.checkFeedActivation(client, messageReaction.message)) {
                messageReaction.remove(user);
                return;
            }

            let vote_type = messageReaction.emoji.id === uvEmoji ? "UV" : "DV",
                con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");

            let res1 = await con.query(`SELECT * FROM rewards WHERE rewarder_id = "${user.id}" AND message_id = "${messageReaction.message.id}"`);
            if (res1[0])
                return;

            await con.query(`INSERT INTO rewards (message_id, rewarded_id, rewarder_id, type, submit_date)
                            VALUES ("${messageReaction.message.id}", "${messageReaction.message.author.id}",
                                    "${user.id}", "${vote_type}", "${moment().format('DD/MM/YY')}")`);

            con.end();

        } else if (messageReaction.emoji.name === enableVotesEmoji) {
            if (user.id === messageReaction.message.author.id && !isFeedbackable.checkFeedActivation(client, messageReaction.message)) {
                await messageReaction.remove(client.user);
                await messageReaction.message.react(client.emojis.get(client.assets.emojiIds.UPVOTE));
                await messageReaction.message.react(client.emojis.get(client.assets.emojiIds.DOWNVOTE));
            }
            messageReaction.remove(user);
        }
    }

    // Rôles
    let membre = messageReaction.message.guild.roles.find(r => r.id === "443748696170168321"),
        apprenti = messageReaction.message.guild.roles.find(r => r.id === "412587462892716032"),
        enattente = messageReaction.message.guild.roles.find(r => r.id === "444134229710864385");

    if (messageReaction.message.channel.id === "412557168529899541") {

        if (messageReaction.emoji.id === client.assets.emojiIds.CHECK_TRUE) {

            // Le membre est un apprenti/en attente : on lui ajoute le rôle membre
            messageReaction.message.member.addRole(membre);
            messageReaction.message.member.removeRole(apprenti);
            messageReaction.message.member.removeRole(enattente);

        }

    }

    // Si la réaction correspond à la réaction de report, ce bloc s'exécute.
    if (messageReaction.emoji.id === client.assets.emojiIds.REPORT) {

        if (messageReaction.message.member.user.bot) {
            messageReaction.remove(user);
            sendMP.run(client, `Tu ne peux pas signaler mes messages. C'est vraiment l'hôpital qui se fout de la charité !`, user);
            return;
            // Si la réaction se trouve sur un message de Strad, alors le script s'arrête.
        }
        if (user.id === messageReaction.message.author.id) {
            messageReaction.remove(user);
            sendMP.run(client, `Tu ne peux pas signaler ton propre message.`, user);
            return;
            // Si la réaction se trouve sur un message de la personne qui réagit, alors le script s'arrête.
        }
        if (messageReaction.message.member.roles.find(r => r.name === client.config.modRole) || messageReaction.message.member.roles.find(r => r.name === "Assistant")) {
            messageReaction.remove(user);
            sendMP.run(client, `Tu ne peux pas signaler le message d'un membre du staff.`, user);
            return;
            // Si la réaction se trouve sur un message d'un membre du Staff, alors le script s'arrête.
        }
        if (messageReaction.message.reactions.find(r => r.emoji.id === client.assets.emojiIds.REPORT).users.array().length > 1) {
            sendMP.run(client, `Ce message a déjà été signalé, merci pour ta contribution !`, user);
            return;
            // Si le message a déjà été reporté, alors le script s'arrête MAIS ON NE RETIRE PAS LA RÉACTION DE L'UTILISATEUR.
        }
        if (reactedRecently.has(user.id)) {
            messageReaction.remove(user);
            sendMP.run(client, `Tu ne peux signaler un message que toutes les 30 secondes !`, user);
            return;
            // Si l'utilisateur a déjà signalé un message il y a moins de 30 secondes, alors le script s'arrête.
        } else {
            // Adds the user to the set so that they can't talk for a minute
            reactedRecently.add(user.id);
            setTimeout(() => {
                // Removes the user from the set after a minute
                reactedRecently.delete(user.id);
            }, 30000);
        }

        console.log("Report !");
        let reportedMessage = messageReaction.message.cleanContent;
        logger.run(`${user.tag} a reporté un message dans le salon #${messageReaction.message.channel.name} du serveur ${messageReaction.message.guild.name}.`);
        let reportEmbed = new Discord.RichEmbed()
            .setColor(0xffac00)
            .setAuthor(`Message signalé`)
            .setDescription(`Un nouveau message a été signalé par ${user}.`)
            .addField(`Contenu`, `"${reportedMessage}"`, true)
            .addField(`Localisation`, messageReaction.message.channel, true)
            .addField(`Lien direct`, messageReaction.message.url, true);

        messageReaction.message.member.guild.channels.find(c => c.id === client.config.logsChannel).send(reportEmbed);
    }
};
