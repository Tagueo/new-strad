import { printExists } from './printExists';
import { randomChar } from './randomChar';

const createFingerPrint = () => {
  const fingerPrint = [...Array(2)]
    .map(() => [...Array(4)].map(() => randomChar()))
    .join('-');
  return printExists(fingerPrint) ? createFingerPrint() : fingerPrint;
};

export { createFingerPrint };
