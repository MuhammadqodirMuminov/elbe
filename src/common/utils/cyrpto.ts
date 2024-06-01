import { createHash, randomBytes } from 'crypto';

export const createHashString = async () => {
    const token = randomBytes(20).toString('hex');
    const hashedToken = createHash('sha256').update(token).digest('hex');
    const expirationTime = Date.now() + 60 * 60 * 1000;

    return { token, expirationTime, hashedToken };
};

export const compareHashString = async (
    submittedToken: string,
    storedHashedToken: string,
) => {
    const hashedSubmittedToken = createHash('sha256')
        .update(submittedToken)
        .digest('hex');

    return hashedSubmittedToken === storedHashedToken;
};
