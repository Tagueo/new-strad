const Discord = require("discord.js");
const mLog = require("./mLog");

exports.run = (client, messageContent, user) => {
    user.send(messageContent)
        .catch((e) => {
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor("Envoi de message privé impossible")
                .setDescription(`Merci de signaler à ${user} que je ne peux pas lui envoyer de message privé car il m'a bloqué.`)
                .setColor(mLog.colors.ALERT);
            client.channels.get('415633143861739541').send(errorEmbed);
        });
};