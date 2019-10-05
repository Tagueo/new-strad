// TODO À continuer plus tard
import { connectDatabase } from '../functions/connectDatabase';

/**
 * @type {Inventory}
 * @param {GuildMember} ownerMember The owner of the inventory.
 */
class Inventory {
  constructor(/* ownerMember */) {
    const connection = connectDatabase();
    connection.query();
    this.content = [];
  }
}

export { Inventory };

