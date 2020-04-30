/**
 * Vérifie si le message est éligible aux feedbacks
 * @param  {Message} message
 */
const checkFeedbackable = message => {
    const mContent = message.content.toUpperCase();
    const isFeedbackable =
        (message.attachments.size !== 0 || mContent.includes('HTTP')) &&
        !mContent.includes('[PARTAGE]') &&
        !mContent.includes('[RES]') &&
        !mContent.includes('GIPHY.COM') &&
        !mContent.includes('TENOR.COM');
    return isFeedbackable;
};

export { checkFeedbackable };
