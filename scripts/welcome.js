const sendMP = require("../scripts/sendMP");

exports.run = (client, member) => {

    let welcomeMessage = `Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?\n`
        + `Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:\n`
        + `On a tous envie de te connaître ! :violin:\n\n`
        + `> https://discord.gg/4MmJwgj`;
    sendMP.run(client, welcomeMessage, member);

};