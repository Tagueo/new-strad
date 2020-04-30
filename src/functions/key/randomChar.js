const randomChar = () => {
    const possibleChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    const randomNumber = Math.floor(Math.random() * possibleChars.length);
    return possibleChars[randomNumber];
};

export { randomChar };
