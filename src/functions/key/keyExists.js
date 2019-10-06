import { connectDatabase } from '../connectDatabase';

/**
 * @param  {String} keyFace
 */
const keyExists = async keyFace => {
  const connection = connectDatabase();
  const keys = await connection.query(`SELECT * FROM blocks_keys`);
  return keys.filter(key => key.key_face === keyFace).length > 0;
};

export { keyExists };
