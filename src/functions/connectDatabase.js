import { Connection } from '../classes/Connection';

const connectDatabase = () => {
    return Connection.getInstance();
};

export { connectDatabase };
