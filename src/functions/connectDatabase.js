import { DBConnection } from '../classes/DBConnection';

const connectDatabase = () => {
    return DBConnection.getInstance();
};

export { connectDatabase };
