import { client } from '../../globals';
import { assets } from '../../static_data/assets';

/**
 * Vérifie si l'éligibilité aux feedbacks a été activée
 * @param  {Message} message
 */
const checkFeedbackActivation = message => {
    const messageReactions = message.reactions;
    const feedbackActivation =
        messageReactions.filter(
            reaction =>
                reaction.emoji.id === assets.emojiIds.UPVOTE &&
                reaction.users.exists('id', client.user.id)
        ).length > 0
            ? true
            : false;
    return feedbackActivation;
};

export { checkFeedbackActivation };
