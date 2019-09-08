const Discord = require("discord.js");
let moment = require("moment");
const mLog = require("../scripts/mLog");
const db = require("../scripts/db");

exports.run = async (client, message, args) => {

    moment.locale("fr");

    try {

        let con = db.Connection("localhost", client.config.mysqlUser, client.config.mysqlPass, "strad");
        let user = (await con.query(`SELECT * FROM users WHERE user_id = "${message.author.id}"`))[0];

        if (user.lastdaily !== moment().format("DD/MM/YY")) { // Si l'utilisateur n'a pas encore demandé son daily aujourd'hui, alors...
            let upvotes = await con.query(`SELECT * FROM rewards WHERE rewarded_id = "${message.author.id}" AND type = "UV"`),
                downvotes = await con.query(`SELECT * FROM rewards WHERE rewarded_id = "${message.author.id}" AND type = "DV"`),
                finalBlockReward = 50,
                finalCreaReward = 0;

            upvotes = upvotes ? upvotes.length : 0;
            downvotes = downvotes ? downvotes.length : 0;

            finalBlockReward += upvotes * 5;
            finalCreaReward += upvotes - downvotes;

            if (finalCreaReward < 0) finalCreaReward = 0;

            await con.query(`DELETE FROM rewards WHERE rewarded_id = "${message.author.id}"`); // Suppression des votes
            await con.query(`UPDATE users SET money = money + ${finalBlockReward}, creas_amount = creas_amount
                + ${finalCreaReward}, usertag = "${message.member.displayName}"
                WHERE user_id = "${message.author.id}"`); // Ajout des Blocs et des Créas
            await con.query(`UPDATE users SET lastdaily = "${moment().format('DD/MM/YY')}"
                WHERE user_id = "${message.author.id}"`); // Mise à jour de la date du dernier daily

            let successEmbed = new Discord.RichEmbed()
                .setAuthor("Récompense quotidienne (" + message.member.displayName + ")", message.author.avatarURL)
                .setColor(mLog.colors.VALID)
                .addField(`Blocs`, `+ **${finalBlockReward}** <:block:547449530610745364>`, true)
                .addField(`Créas`, `+ **${finalCreaReward}** <:crea:547482886824001539>`, true)
                .setDescription(`Voici ta récompense journalière ! Pour accéder à ton compte, fais \`\`Strad rank\`\`.\n**${upvotes} <:like:568493894270976012> / ${downvotes} <:dislike:568493872968368149>**`)
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

    } catch (err) {
        console.log(err);
    }

};