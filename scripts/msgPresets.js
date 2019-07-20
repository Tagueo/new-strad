exports.sendWIP = (channel) => {
    let imgURL = "https://cdn.discordapp.com/attachments/543888518167003136/602155105021591552/Travaux_en_cours.png";
    channel.send({
        files: [imgURL]
    })
};