const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = async (client, message, args) => {
    let mutedMember,
        muteDuration,
        reason,
        muteRole = message.guild.roles.find(r => r.name === "Réduit au silence");

    if (!message.member.roles.find(r => r.name === "Modérateur")) {
        message.delete();
        return;
    }
    if (args.length < 2) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Le nombre d'arguments est insuffisant. Utilisation : ``Strad mute <membre> <durée en minutes> <raison>``.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                message.delete(3500);
            });
        return;
    }
    try {
        mutedMember = message.mentions.members.first();
        args = args.slice(1);
    } catch (e) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Échec de la commande")
        .setDescription("Le membre concerné est introuvable. Utilisation : ``Strad mute <membre> <durée en minutes> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                message.delete(3500);
            });
        return;
    }
    try {
        muteDuration = parseInt(args[0]);
        args = args.slice(1);
    } catch (e) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Commande erronée")
        .setDescription("La durée spécifiée en argument est invalide. Utilisation : ``Strad mute <membre> <durée en minutes> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                message.delete(3500);
            });
        return;
    }
    if ((muteDuration < 1) || (muteDuration > 180)) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Durée non conforme")
        .setDescription("La durée doit être comprise entre 1 et 180 minutes (3 heures). Utilisation : ``Strad mute <membre> <durée en minutes> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                message.delete(3500);
            });
        return;
    }
    reason = args.join(" ");
    if (reason.length < 10) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Raison insuffisante")
        .setDescription("La raison doit contenir au moins 5 caractères. Utilisation : ``Strad mute <membre> <durée en minutes> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                message.delete(3500);
            });
        return;
    }
    await mutedMember.addRole(muteRole, reason + " •" + muteDuration + " minute(s)");
    mLog.run(client, "Réduction au silence", mutedMember + " a été réduit au silence pour une durée de " + muteDuration + " minute(s).\n Raison : \"" + reason + "\"", mLog.colors.ALERT);

    setTimeout(() => {
        mutedMember.removeRole(muteRole, "Fin de la réduction au silence de " + mutedMember + ".");
    }, muteDuration * 60000);

    let successEmbed = new Discord.RichEmbed()
    .setAuthor("Réduction au silence")
    .setDescription(mutedMember + " est réduit au silence pour une durée de " + muteDuration + " minute(s).\n Raison : \"" + reason + "\"")
    .setColor(mLog.colors.ALERT);
    message.channel.send(successEmbed)
        .then(m => {
            message.delete(3500);
        });
    message.delete();
};