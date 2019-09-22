const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = async (client, message, args) => {
    let kickedMember,
        reason;

    if (!message.member.roles.find(r => r.name === "Modérateur")) {
        message.delete();
        return;
    }
    if (args.length < 1) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Commande erronée")
            .setDescription("Le nombre d'arguments est insuffisant. Utilisation : ``Strad kick <@membre> <raison>``.")
            .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                m.delete(5000);
            });
        return;
    }
    kickedMember = message.mentions.members.first();
    args = args.slice(1);

    if (!kickedMember) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Échec de la commande")
        .setDescription("Le membre concerné est introuvable. Utilisation : ``Strad kick <@membre> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                m.delete(5000);
            });
        return;
    }
    reason = args.join(" ");
    if (reason.length < 10) {
        let errorEmbed = new Discord.RichEmbed()
        .setAuthor("Raison insuffisante")
        .setDescription("La raison doit contenir au moins 5 caractères. Utilisation : ``Strad kick <@membre> <raison>``.")
        .setColor(mLog.colors.ALERT);
        message.delete();
        message.channel.send(errorEmbed)
            .then(m => {
                m.delete(5000);
            });
        return;
    }
    try {
        await kickedMember.kick(reason);
        mLog.run(client, "Expulsion", kickedMember + " a été expulsé de Stradivarius.\n Raison : \"" + reason + "\"", mLog.colors.ALERT);

        let successEmbed = new Discord.RichEmbed()
            .setAuthor("Expulsion")
            .setDescription(kickedMember + " a été expulsé de Stradivarius.\n Raison : \"" + reason + "\"")
            .setColor(mLog.colors.ALERT);
        message.channel.send(successEmbed)
            .then(m => {
                m.delete(5000);
            });
        message.delete();
    } catch (e) {
        message.delete();
        console.log(e);
    }
};