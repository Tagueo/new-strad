const mLog = require("../scripts/mLog");

module.exports = async (client, member) => {
    const welcomeCategId = "443782424653070346";

    if (member.guild.id = '412369732679893004') {
        member.guild.channels.find(c => c.id === welcomeCategId).setName("STRADIVARIUS | " + member.guild.memberCount + " MEMBRES");
        mLog.run(client, "Ancien membre", `**${member.user.tag}** vient de quitter le serveur.`, mLog.colors.ALERT);
    }
};