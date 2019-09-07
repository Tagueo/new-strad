const Discord = require("discord.js")

exports.run = async (client, message) => {
    var embed = new Discord.RichEmbed()
        .setAuthor('Dépôt de Strad', client.user.avatarURL)
        .setColor("#21b1ff")
        .setDescription(`Tu veux participer à mon développement ? Tu peux contribuer dès maintenant sur mon dépôt GitHub :smile:\nN'oublie pas de mettre une petite étoile si tu me trouves cool :blue_heart:`)
        .addField(`Lien`, `https://github.com/Tagueo/new-strad`)
        .setURL('https://github.com/Tagueo/new-strad');

    client.channels.get('415633143861739541').send(embed);
    message.delete();
};