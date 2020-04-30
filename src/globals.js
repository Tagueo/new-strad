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
export const welcomeCategoryId = '704668463322366014';
export const creationChannels = [
    '704668463473492000',
    '704668463473492001',
    '704668463473492002',
    '704668463473492003',
    '704668463473492004',
    '704668463473492005',
    '704668463473492006'
];
export const stradivariusID = '704668462852735006';
export const commandChannelID = '704668463322366020';