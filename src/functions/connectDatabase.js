import { DBConnection } from '../classes/DBConnection';

const connectDatabase = async () => {
    return await DBConnection.getInstance();
};

export { connectDatabase };
