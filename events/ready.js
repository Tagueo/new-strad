const chalk = require('chalk');
const Discord = require('discord.js');
var moment = require('moment');

const fetcher = require('../scripts/fetcher');

module.exports = async (client) => {
    var stradivarius = client.guilds.find(g => g.id === "412369732679893004");

    console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Pret à servir dans ${chalk.cyan(client.channels.size)} channels sur ${chalk.cyan(client.guilds.size)} serveurs, pour un total de ${chalk.cyan(client.users.size)} utilisateurs.`);
    client.user.setActivity(`Strad help`, {
        type: 'WATCHING'
    })
        .then(presence => console.log(`[${chalk.cyan(moment(Date.now()).format('h:mm:ss'))}] [${chalk.yellow(client.user.tag)}] Activity set`))
        .catch(console.error);

    // Mise en cache des 50 derniers messages de chaque salon créatif...
    await fetcher.run(stradivarius);
    console.log("Messages mis en cache !");

    // Distributeur de rôles
    var roleMsgId = "570618282177069076", notifMsgId = "601739344163897344";
    stradivarius.channels.find(c => c.id === "570605835172970496").fetchMessage(roleMsgId);
    stradivarius.channels.find(c => c.id === "570605835172970496").fetchMessage(notifMsgId);

    // var roleDistrib = new Discord.RichEmbed()
    //     .setTitle("Késako ?")
    //     .setDescription("Choisis les rôles qui correspondent aux activités qui t'intéressent le plus sur Stradivarius !"
    //         + "Par exemple, tu n'as pas besoin d'être un véritable graphiste pour avoir le rôle **Graphiste** :smile:\n\n"
    //         + "Attention : les rôles suivants sont mentionnables, ce qui implique que tu peux recevoir une mention venant d'un rôle spécifique, "
    //         + "suite à une demande d'aide, par exemple.")
    //     .setAuthor("Distributeur de rôles")
    //     .addField("Liste des rôles",
    //         ":pencil: • **Graphiste** - Dessine-moi un logo !\n"
    //         + ":film_frames: • **Vidéaste** - Eeeeet... Action !\n"
    //         + ":art: • **Dessinateur** - Dessine-moi un mouton !\n"
    //         + ":camera_with_flash: • **Photographe** - Clic !\n"
    //         + ":computer: • **Développeur/peuse** - \"Hello World!\"\n"
    //         + ":musical_keyboard: • **Audiophile** - Pas d'autotune, svp !")
    //     .setFooter("Clique sur la/les réaction(s) qui te font envie !")
    //     .setColor("#ff6b3e");
    // client.guilds.find("id", "412369732679893004").channels.find("id", "570605835172970496").send(roleDistrib)
    //     .then(m => {
    //         m.react("📝");
    //         m.react("🎞");
    //         m.react("🎨");
    //         m.react("📸");
    //         m.react("💻");
    //         m.react("🎹");
    //     });

    // var notifDistrib = new Discord.RichEmbed()
    //     .setAuthor("Notifications")
    //     .setDescription("Clique sur les types de notifications que tu souhaites recevoir sur le serveur !")
    //     .addField("Liste des notif's",
    //         ":bell: • **Annonces générales** - Soyez au courant des annonces et nouveautés importantes de Stradivarius !\n"
    //         + ":tada: • **Concours & Évènements** - Ne loupez aucun concours créatif ni aucun autre type d'évènements sur le serveur !\n"
    //         + ":satellite: • **Streams** - Ne ratez aucune de mes diffusions sur Twitch !")
    //     .setFooter("Clique sur la/les réaction(s) qui te font envie !")
    //     .setColor("#ff9800");
    // client.guilds.find("id", "412369732679893004").channels.find("id", "570605835172970496").send(notifDistrib)
    //     .then(m => {
    //         m.react("🔔");
    //         m.react("🎉");
    //         m.react("📡");
    //     });
};