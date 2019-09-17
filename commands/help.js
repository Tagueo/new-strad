const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = async (client, message) => {
    let embed = new Discord.RichEmbed()
        .setAuthor("Help", client.user.avatarURL)
        .setColor(mLog.colors.NEUTRAL_BLUE)
        .setDescription("Pour m'appeler, utilise le préfixe **Strad** (c'est mon nom !)."
            + "\nExemple : ``Strad help`` pour afficher cet encart ^^")
        .addField("Général", "``help`` • Affiche cet encart."
            + "\n``rank`` • Affiche ton profil."
            + "\n``top`` • Affiche le classement du serveur.\n``daily`` • Permet de récupérer ta récompense journalière !"
            + "\n``key <valeur>`` • Crée une clé ayant la valeur en Blocs définie en argument."
            + "\n``redeem <clé>`` • Utilise la clé spécifiée en argument afin que tu puisses sa valeur en Blocs."
            + "\n``check <empreinte>`` • Permet de vérifier l'existence, la validité, la propriété, la valeur et l'apparence d'une clé en spécifiant"
            + "son empreinte en argument.")
        .addField("Premium", "``nick <pseudonyme>`` • Change de pseudonyme, et ce, seulement sur Stradivarius !"
            + "\n``say <message>`` • Fais parler Strad avec le message de ton choix !")
        .addField("Boutique", "``shop`` • Ouvre la boutique du serveur.\n``buy <numéro de l'article>`` "
            + "• Permet d'acheter l'article de boutique dont le numéro est spécifié en argument.")
        .addField("Divers", "``repo`` • Affiche le lien vers mon dépôt GitHub.\n``stats`` • Affiche des informations me concernant.")
        .setFooter("Strad help", client.user.avatarURL)
        .setColor(mLog.colors.NEUTRAL_BLUE)

    if (message.member.roles.find(r => r.name === "Modérateur")) {
        let privateEmbed = new Discord.RichEmbed()
            .setAuthor("Help (suite)")
            .setColor(mLog.colors.MODERATOR)
            .setDescription("Les commandes affichées ci-dessous sont réservées aux Modérateurs (et au-dessus).")
            .addField("Commandes"
                , "``mute <@membre> <durée> <raison>`` • Réduit au silence le membre mentionné et ce, pour la durée spécifiée en argument (en minutes). Nécessite de spécifier une raison."
                + "\n``kick <@membre> <raison>`` • Expulse le membre mentionné. Nécessite de spécifier une raison."
                + "\n``ban <@membre> <raison>`` • Bannit de manière permanente le membre mentionné. Nécessite de spécifier une raison.");
        message.author.send(privateEmbed);
    }

    client.channels.get('415633143861739541').send(embed);
    message.delete();
};