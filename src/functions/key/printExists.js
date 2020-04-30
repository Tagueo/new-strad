import { connectDatabase } from '../connectDatabase';

/**
 * @param  {String} keyPrint
 */
const printExists = async keyPrint => {
    const connection = connectDatabase();
    const keys = await connection.query(`SELECT * FROM blocks_keys`);
    return keys.filter(key => key.key_print === keyPrint).length > 0;
};

export { printExists };
