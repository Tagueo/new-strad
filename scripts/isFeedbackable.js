exports.check = function(message) { // Vérifie si le message est éligible aux feedbacks

    let mContent = message.content.toUpperCase();
    let bl = (message.attachments.size !== 0 || mContent.includes("HTTP")) && !mContent.includes("[PARTAGE]");
    return bl;

};

exports.checkFeedActivation = function (message) { // Vérifie si l'éligibilité aux feedbacks a été activée
    let messageReactions = message.reactions;
    let bl = false;
    if (messageReactions.exists("name", "✨")) {
        if (messageReactions.find("name", "✨").users.exists("id", message.author.id)) bl = true;
    }
    return bl;
}