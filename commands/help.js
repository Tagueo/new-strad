const Discord = require("discord.js");
const mLog = require("../scripts/mLog");

exports.run = (client, message) => {
    var embed = new Discord.RichEmbed()
        .setAuthor('Help', client.user.avatarURL)
        .setColor(mLog.colors.NEUTRAL_BLUE)
        .setDescription("Pour m'appeler, utilise le préfixe **Strad** (c'est mon nom !)."
            + "\nExemple : ``Strad help`` pour afficher cet encart ^^")
        .addField("Général", "``help`` • Affiche cet encart."
            + "\n``rank`` • Affiche ton profil."
            + "\n``top`` • Affiche le classement du serveur.\n``daily`` • Permet de récupérer ta récompense journalière !"
            + "\n``ckey <valeur>`` • Crée une clé ayant la valeur en Blocs définie en argument.**[SOON]**"
            + "\n``redeem <clé>`` • Utilise la clé spécifiée en argument afin de recevoir sa valeur en Blocs. **[SOON]**")
        .addField("Premium", "``nick <pseudonyme>`` • Change de pseudonyme, et ce, seulement sur Stradivarius !"
            + "\n``say <message>`` • Fais parler Strad avec le message de ton choix !")
        .addField("Boutique", "``shop`` • Ouvre la boutique du serveur.\n``buy <numéro de l'article>`` "
            + "• Permet d'acheter l'article de boutique dont le numéro est spécifié en argument.")
        .addField("Divers", "``repo`` • Affiche le lien vers mon dépôt GitHub.\n``stats`` • Affiche des informations me concernant.")
        .setFooter("Strad help");

    client.channels.get('415633143861739541').send(embed);
    message.delete();
};