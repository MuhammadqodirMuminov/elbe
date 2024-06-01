import { compare, genSalt, hash } from 'bcryptjs';

export const hashPassword = async (password: string) => {
    const gen = await genSalt(12);
    return await hash(password, gen);
};

export const comparePassword = async (
    hashedPassword: string,
    password: string,
) => {
    return await compare(password, hashedPassword);
};
