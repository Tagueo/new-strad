import Canvas from 'canvas';
import Discord from 'discord.js';
import { roundRect } from './canvas/roundRect';

/**
 * @param  {GuildMember} member
 */
const welcome = async member => {
  const globalChannel = member.guild.channels.find(
    channel => channel.id === '412369732679893008'
  );

  Canvas.registerFont('assets/welcome/welcome_font.ttf', {
    family: 'Red Hat Display'
  });

  const canvas = Canvas.createCanvas(600, 270);
  const context = canvas.getContext('2d');
  context.save();

  const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
  const asset1 = await Canvas.loadImage('assets/welcome/asset1.png');
  const asset2 = await Canvas.loadImage('assets/welcome/asset2.png');

  context.drawImage(asset1, 42, 47, 516, 215);
  roundRect(context, 232, 13, 136, 136, 10, '#ffffff', false);
  context.clip();
  context.drawImage(avatar, 232, 13, 136, 136);
  context.restore();
  context.font = '22px Red Hat Display';
  context.fillStyle = '#36393f';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('BIENVENUE SUR STRADIVARIUS', canvas.width / 2, 182);
  context.font = '35px Red Hat Display';
  context.fillText(`${member.user.tag}`, canvas.width / 2, 215);
  context.drawImage(asset2, 82, 125, 436, 145);

  const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome.png');
  globalChannel.send('', attachment);
};

export { welcome };
