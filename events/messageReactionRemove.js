module.exports = (client, messageReaction, user) => {

    if (client.config.mtnMode == "true") {
        return;
    }

    if (messageReaction.message.id === "570618282177069076") { // Distributeur de rôles
        var emojiName = messageReaction.emoji.name;
        var stradivarius = client.guilds.find("id", "412369732679893004");
        var member = stradivarius.members.find("id", user.id);

        switch (emojiName) {
            case "📝":
                member.removeRole(stradivarius.roles.find("name", "Graphiste"));
                break;
            case "🎞":
                member.removeRole(stradivarius.roles.find("name", "Vidéaste"));
                break;
            case "🎨":
                member.removeRole(stradivarius.roles.find("name", "Dessinateur/trice"));
                break;
            case "📸":
                member.removeRole(stradivarius.roles.find("name", "Photographe"));
                break;
            case "💻":
                member.removeRole(stradivarius.roles.find("name", "Développeur/peuse"));
                break;
            case "🎹":
                member.removeRole(stradivarius.roles.find("name", "Audiophile"));
                break;
            default:
                messageReaction.remove(user);
                return;
        }
    }

};