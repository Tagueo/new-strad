import { connectDatabase } from '../connectDatabase';

const printExists = async keyPrint => {
  const connection = connectDatabase();
  const keys = await connection.query(`SELECT * FROM blocks_keys`);
  return keys.filter(key => key.key_print === keyPrint).length > 0;
};

export { printExists };

