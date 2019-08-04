exports.run = (client, messageContent, member) => {
    try {
        member.send(messageContent);
    } catch (e) {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Envoi de message privé impossible")
            .setDescription(`Merci de signaler à ${member.username} que nous ne pouvons pas poursuivre la procédure en cours qu'il a lancée car il m'a bloqué !`)
            .setColor(mLog.colors.ALERT);
        client.channels.get('415633143861739541').send(errorEmbed);
    }
};