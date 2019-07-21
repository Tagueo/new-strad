const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = (client, message) => {
    var embed = new Discord.RichEmbed()
        .setAuthor('Help', client.user.avatarURL)
        .setColor(mLog.colors.NEUTRAL_BLUE)
        .setDescription("Pour m'appeler, utilise le prefix **Strad** (c'est mon nom !)."
            + "\nExemple : ``Strad help`` pour afficher cet encart ^^")
        .addField("Général", "``help`` • Affiche cet encart."
            + "\n``rank`` • Affiche ton profil."
            + "\n``top`` • Affiche le classement du serveur.\n``daily`` • Permet de récupérer ta récompense journalière !")
        .addField("Divers", "``repo`` • Affiche le lien vers mon dépôt GitHub.\n``stats`` • Affiche des informations me concernant.")
        .setFooter("Strad help");

    client.channels.get('415633143861739541').send(embed);
    message.delete();
};