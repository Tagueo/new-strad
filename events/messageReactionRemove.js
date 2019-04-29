module.exports = (client, messageReaction, user) => {

    if (messageReaction.message.channel.type !== "text") return;

    if (client.config.mtnMode == "true") {
        return;
    }

    if (messageReaction.message.id === "570618282177069076") { // Distributeur de rôles
        var emojiName = messageReaction.emoji.name;
        var stradivarius = client.guilds.find(g => g.id === "412369732679893004");
        var member = stradivarius.members.find(m => m.id === user.id);

        switch (emojiName) {
            case "📝":
                member.removeRole(stradivarius.roles.find(r => r.name === "Graphiste"));
                break;
            case "🎞":
                member.removeRole(stradivarius.roles.find(r => r.name === "Vidéaste"));
                break;
            case "🎨":
                member.removeRole(stradivarius.roles.find(r => r.name === "Dessinateur/trice"));
                break;
            case "📸":
                member.removeRole(stradivarius.roles.find(r => r.name === "Photographe"));
                break;
            case "💻":
                member.removeRole(stradivarius.roles.find(r => r.name === "Développeur/peuse"));
                break;
            case "🎹":
                member.removeRole(stradivarius.roles.find(r => r.name === "Audiophile"));
                break;
            default:
                messageReaction.remove(user);
                return;
        }
    }

};