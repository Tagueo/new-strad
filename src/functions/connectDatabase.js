import { Connection } from '../classes/connection';
import { client } from '../globals';

const connectDatabase = () => {
  return new Connection(
    'localhost',
    client.config.mysqlUser,
    client.config.mysqlPass,
    'strad'
  );
};

export { connectDatabase };

