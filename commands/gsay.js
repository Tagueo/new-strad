const sendMP = require("../scripts/sendMP");

exports.run = async (client, message, args) => {

    const trueEmoji = client.assets.emojis.CHECK_TRUE;

  if (message.member.roles.find(x => x.name === "Mentor")) {

    if (!args[0]) {
        const channel = message.guild.channels.get(message.channel.id);
    } else {
        const channel = message.guild.channels.get(args[0]) || message.guild.channels.find("name", args[0]);
        if (!channel) {
            let tempChannel = args[0];
            tempChannel = tempChannel.slice(2, -1);
            const channel = message.guild.channels.get(tempChannel);
        }
        if (!channel) {
            message.channel.send('Channel invalide\nUsage : gsay <channel> <message>');
        }
    }

    if (channel && args[1]) {
        args.splice(0, 1);
        channel.send(args.join(" "));
        sendMP.run(client, `${trueEmoji} Envoyé !`, message.member);
    }

  } else {
      message.channel.send('Tu n\'as pas le droit de faire cette commande <:facepalm:428261651947716609>');
  }
};
