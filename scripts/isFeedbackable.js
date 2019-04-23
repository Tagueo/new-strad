exports.check = function (message) { // Vérifie si le message est éligible aux feedbacks

    let mContent = message.content.toUpperCase();
    let bl = (message.attachments.size !== 0 || mContent.includes("HTTP")) && !mContent.includes("[PARTAGE]") && !mContent.includes("GIPHY.COM") && !mContent.includes("TENOR.COM");
    return bl;

};

exports.checkFeedActivation = function (message) { // Vérifie si l'éligibilité aux feedbacks a été activée
    let messageReactions = message.reactions;
    let bl = false;
    messageReactions.forEach((r) => {
        if (r.emoji.name == "like") {
            if (r.find("name", "like").users.exists("id", "412910522833436672")) {
                bl = true;
            }
        }
    });
    return bl;
};