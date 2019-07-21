const Discord = require("discord.js")

exports.run = (client, message) => {
    var embed = new Discord.RichEmbed()
        .setAuthor('Help', client.user.avatarURL)
        .setColor("#21b1ff")
        .setDescription("Pour m'appeler, utilise le prefix **Strad** (c'est mon nom !)."
            + "\nExemple : ``Strad help`` pour afficher cet encart ^^")
        .addField("Commandes", "``help`` • Affiche cet encart.\n``stats`` • Affiche des informations "
            + "me concernant.\n``repo`` • Affiche le lien vers mon dépôt GitHub.\n``rank`` • Affiche ton profil."
            + "\n``top`` • Affiche le classement du serveur.\n``daily`` • Permet de récupérer ta récompense journalière !");

    client.channels.get('415633143861739541').send(embed);
    message.delete();
};