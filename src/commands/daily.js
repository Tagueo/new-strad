const Discord = require("discord.js");
let moment = require("moment");
const mLog = require("../scripts/mLog");
const db = require("../scripts/db");

exports.run = async (client, message) => {

    moment.locale("fr");

    const creaEmoji = client.assets.emojis.CREA,
        blockEmoji = client.assets.emojis.BLOCK,
        uvEmoji = client.assets.emojis.UPVOTE,
        dvEmoji = client.assets.emojis.DOWNVOTE,
        downloadEmoji = client.assets.emojis.DOWNLOAD;

    let con = new db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");
    let user = (await con.query(`SELECT * FROM users WHERE user_id = "${message.author.id}"`))[0];

    if (user.lastdaily !== moment().format("DD/MM/YY")) { // Si l'utilisateur n'a pas encore demandé son daily aujourd'hui, alors...
        let upvotes = await con.query(`SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "UV") AND (daily_date IS NULL)`),
            downvotes = await con.query(`SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "DV") AND (daily_date IS NULL)`),
            downloads = await con.query(`SELECT * FROM rewards WHERE (rewarded_id = "${message.author.id}") AND (type = "DL") AND (daily_date IS NULL)`),
            finalBlockReward = 50,
            finalCreaReward = 0,
            finalDLReward = 0;

        upvotes = upvotes ? upvotes.length : 0;
        downvotes = downvotes ? downvotes.length : 0;
        downloads = downloads ? downloads.length : 0;

        finalCreaReward += upvotes - downvotes;
        finalDLReward += downloads * 2;

        finalBlockReward += (upvotes * 5) + finalDLReward;

        if (finalCreaReward < 0) finalCreaReward = 0;

        await con.query(`UPDATE rewards SET daily_date = "${moment().format('DD/MM/YY')}" WHERE (daily_date IS NULL) AND (rewarded_id = "${message.author.id}")`); // Suppression des votes
        await con.query(`UPDATE users SET money = money + ${finalBlockReward}, creas_amount = creas_amount
                + ${finalCreaReward}, usertag = "${message.member.displayName}"
                WHERE user_id = "${message.author.id}"`); // Ajout des Blocs et des Créas
        await con.query(`UPDATE users SET lastdaily = "${moment().format('DD/MM/YY')}"
                WHERE user_id = "${message.author.id}"`); // Mise à jour de la date du dernier daily

        let successEmbed = new Discord.RichEmbed()
            .setAuthor("Récompense quotidienne (" + message.member.displayName + ")", message.author.avatarURL)
            .setColor(mLog.colors.VALID)
            .addField(`Blocs`, `+ **${finalBlockReward}** ${blockEmoji}`, true)
            .addField(`Créas`, `+ **${finalCreaReward}** ${creaEmoji}`, true)
            .setDescription(`Voici ta récompense journalière ! Pour accéder à ton compte,`
                + `fais \"Strad rank\".\n**${upvotes}** ${uvEmoji} • **${downvotes}** ${dvEmoji} • **${downloads}** ${downloadEmoji}`)
            .setFooter("Strad daily");

        client.channels.get('415633143861739541').send(successEmbed);
        message.delete();

        con.end();
    } else {
        let errorEmbed = new Discord.RichEmbed()
            .setAuthor("Récompense quotidienne (" + message.member.displayName + ")", message.author.avatarURL)
            .setColor(mLog.colors.ALERT)
            .setDescription(`Tu as déjà obtenu ta récompense aujourd'hui.\nRécupère-la ${moment().endOf("day").fromNow()} !`)
            .setFooter("Strad daily");

        client.channels.get('415633143861739541').send(errorEmbed);
        message.delete();

        con.end();
    }

};