const sendMP = require("../scripts/sendMP");
const Canvas = require("canvas");
const Discord = require("discord.js");

exports.run = async (client, member) => {

    let welcomeMessage = `Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?\n`
        + `Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:\n`
        + `On a tous envie de te connaître ! :violin:\n\n`
        + `> https://discord.gg/4MmJwgj`;
    sendMP.run(client, welcomeMessage, member);

    // TODO Tests

    const tempChannel = member.guild.channels.find(c => c.id === "413678978990080010");

    function roundRect(ctx, x, y, width, height, radius=5, fill, stroke=true) {
        if (typeof radius === 'number') {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } else {
            let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (let side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }

    }

    const canvas = Canvas.createCanvas(600, 270);
    const ctx = canvas.getContext("2d");

    // // Fill background
    // ctx.fillStyle = "#35393e";
    // ctx.fillRect(0, 0, 600, 270);

    const asset1 = await Canvas.loadImage("assets/welcome/asset1.png");
    ctx.drawImage(asset1, 42, 133, 516, 129);

    roundRect(ctx, 232, 13, 136, 136, 10, "#ffffff", false);

    ctx.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    ctx.drawImage(avatar, 232, 13, 136, 136);

    const attachment = new Discord.Attachment(canvas.toBuffer(), `welcome.png`);

    tempChannel.send("", attachment);

};