import bcrypt from 'bcrypt';

const SALT_LENGTH = 16;

export const generateSalt = async (): Promise<string> => {

    const salt = await bcrypt.genSalt(SALT_LENGTH);
    return salt
}