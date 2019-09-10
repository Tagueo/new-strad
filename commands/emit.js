exports.run = async (client, message) => {
    if (message.author.id !== "315816143137013761") {
        return;
    }

    client.emit("guildMemberAdd", message.member);
};