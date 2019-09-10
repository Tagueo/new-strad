const sendMP = require("../scripts/sendMP");
const Canvas = require("canvas");
const Discord = require("discord.js");

exports.run = (client, member) => {

    let welcomeMessage = `Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?\n`
        + `Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:\n`
        + `On a tous envie de te connaître ! :violin:\n\n`
        + `> https://discord.gg/4MmJwgj`;
    sendMP.run(client, welcomeMessage, member);

    // TODO Tests

    const tempChannel = member.guild.channels.find(c => c.id === "413678978990080010");

    const canvas = Canvas.createCanvas(600, 270);
    const ctx = canvas.getContext("2d");

    // // Fill background
    // ctx.fillStyle = "#35393e";
    // ctx.fillRect(0, 0, 600, 270);

    const attachment = new Discord.Attachment(canvas.toBuffer(), `welcome.png`);

    tempChannel.send("", attachment);

};