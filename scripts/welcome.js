const sendMP = require("../scripts/sendMP");
const Canvas = require("canvas");
const Discord = require("discord.js");

exports.run = async (client, member) => {

    let welcomeMessage = `Bienvenue, toi :wink: Tu penses qu'on pourra devenir amis ?\n`
        + `Au fait, je viens de t'ajouter le rôle d'**Apprenti**, le temps que tu te présentes dans le salon #présentation :smile:\n`
        + `On a tous envie de te connaître ! :violin:\n\n`
        + `> https://discord.gg/4MmJwgj`;
    sendMP.run(client, welcomeMessage, member);

    const globalChannel = member.guild.channels.find(c => c.id === "412369732679893008");

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

    Canvas.registerFont("assets/welcome/welcome_font.ttf", {
        family: "Red Hat Display"
    });

    const canvas = Canvas.createCanvas(600, 270);
    const ctx = canvas.getContext("2d");

    ctx.save();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
    const asset1 = await Canvas.loadImage("assets/welcome/asset1.png");
    const asset2 = await Canvas.loadImage("assets/welcome/asset2.png");

    ctx.drawImage(asset1, 42, 47, 516, 215);

    roundRect(ctx, 232, 13, 136, 136, 10, "#ffffff", false);

    ctx.clip();

    ctx.drawImage(avatar, 232, 13, 136, 136);

    ctx.restore();

    ctx.font = "22px Red Hat Display";
    ctx.fillStyle = "#36393f";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("BIENVENUE SUR STRADIVARIUS", canvas.width/2, 182);

    ctx.font = "35px Red Hat Display";
    ctx.fillText(`${member.user.tag}`, canvas.width/2, 215);

    ctx.drawImage(asset2, 82, 125, 436, 145);

    const attachment = new Discord.Attachment(canvas.toBuffer(), `welcome.png`);

    globalChannel.send("", attachment);

};