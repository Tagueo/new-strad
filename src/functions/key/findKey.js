/**
 * @param  {Object[]} keys
 * @param  {String} keyPrint
 */
const findKey = (keys, keyPrint) => {
    const key = keys.filter(key => key.key_print === keyPrint)[0] || null;
    return key;
};

export { findKey };
