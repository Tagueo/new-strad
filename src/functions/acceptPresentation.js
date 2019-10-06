import { client } from '../globals';
import { welcome } from './welcome';

/**
 * @param  {MessageReaction} reaction
 */
const acceptPresentation = reaction => {
  // Rôles
  const roleMembre = reaction.message.guild.roles.find(
    role => role.id === '443748696170168321'
  );
  const roleApprenti = reaction.message.guild.roles.find(
    role => role.id === '412587462892716032'
  );
  const roleAttente = reaction.message.guild.roles.find(
    role => role.id === '444134229710864385'
  );
  if (
    reaction.emoji.id === client.assets.emojiIds.CHECK_TRUE &&
    reaction.message.member.roles.find(role => role.name === 'En attente...')
  ) {
    // Le membre est un apprenti/en attente : on lui ajoute le rôle membre
    reaction.message.member.addRole(roleMembre);
    reaction.message.member.removeRole(roleApprenti);
    reaction.message.member.removeRole(roleAttente);

    reaction.message.member.send(
      "Hey, ta présentation vient d'être acceptée ! Va voir sur Stradivarius :wink:"
    );
    reaction.message.clearReactions();
    welcome(reaction.message.member);
  }
};

export { acceptPresentation };
