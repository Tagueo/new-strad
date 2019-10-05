import Discord from 'discord.js';
import config from '../config.json';
import { answers } from './static_data/answers';
import { assets } from './static_data/assets';

export const prefix = 'Strad';
const client = new Discord.Client();
client.config = config;
client.assets = assets;
client.answers = answers;
export { client };
export const welcomeCategoryId = '443782424653070346';
export const creationChannels = [
  '412622887317405707',
  '412622912043089920',
  '412622999267704834',
  '416227695429550100',
  '425739003623374848',
  '438794104621629441',
  '442374005177974825'
];
export const stradivariusID = stradivariusID;
export const commandChannelID = commandChannelID;
