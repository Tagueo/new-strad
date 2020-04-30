import { keyExists } from './keyExists';
import { randomChar } from './randomChar';

const createKey = async () => {
    const key = [...Array(4)]
        .map(() => [...Array(4)].map(() => randomChar()))
        .join('-');
    return keyExists(key) ? createKey() : key;
};

export { createKey };
