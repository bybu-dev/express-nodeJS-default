//@ts-check
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { constants, createCipheriv, createDecipheriv, generateKeyPairSync, publicEncrypt, randomBytes, scryptSync } from 'crypto';
import { IResponse, ResponseProps } from '@/utils/types/types';

export class Token {
    static get accessToken() { return process.env.ACCESS_TOKEN_SECRET! as TokenType }
    static get refreshToken() { return process.env.REFRESH_TOKEN_SECRET! as TokenType }

    static get adminAccessToken() { return process.env.ADMIN_ACCESS_TOKEN_SECRET! as TokenType }

    static get webToken() { return  process.env.WEB_TOKEN_SECRET! as TokenType }
    static get apiAccessToken() { return  process.env.API_ACCESS_TOKEN! as TokenType }
}

type TokenType = 'Special Token';

class EncryptionRepository {
    createToken = () => {
        return uuid()
    }

    encryptToken = (data: any, token: TokenType, expiresIn = 60 * 60 * 24 * 5) => {
        return jwt.sign(data, token, { expiresIn });
    }

    decryptToken = (data: any, token: TokenType) => {
        return jwt.verify(data, token);
    }

    createSpecialKey = ({prefix='', suffix='', removeDashes=false}) => {
        const secretKey = uuid().split('_').join('');
        if (removeDashes ) {
            const secretKeyWithDashes = secretKey.split('_').join('');
            return `${prefix}${secretKeyWithDashes}${suffix}`;
        }
        return `${prefix}${secretKey}${suffix}`;
    }

    verifyBearerToken = (data: string, tokenType: TokenType) => {
        try {
            if (data === null || data === undefined) {
                return { status: false, error: 'Authentication failed', };
            }

            const token = data.split(" ",2)[1];
            const decoded = jwt.verify(token, tokenType);
            return { status: true, data: decoded as any };
        }
        catch (error) {
            return { status: false, error: 'Authentication expired' };
        }
    }

    encryptPassword = (password:any) => {
        return bcrypt.hashSync(password, 10);
    }

    comparePassword = ( password: string, userPassword :string ) => {
        return bcrypt.compareSync(password, userPassword)
    }

    generateVerificationCode = (length: number) => {
        const characters = '0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters[randomIndex];
        }
      
        return {
            code: randomString,
            timeout: Date.parse((new Date()).toISOString()) + (1000 * 60 * 60)
        };
    }

    generateRandomStringCode = (length: number) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomString += characters[randomIndex];
        }
      
        return randomString;
    }

    generateKeyPairs = () => {
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                cipher: 'aes-256-cbc', // Optional encryption
                passphrase: process.env.ADMIN_ACCESS_TOKEN_SECRET,
            }
        });
        return { publicKey, privateKey };
    }
    
    encryptId = (id: string, tokenType: TokenType): ResponseProps<string> => {
        try {
            const iv = randomBytes(16);
            const key = scryptSync(tokenType, 'salt', 32);
            const cipher = createCipheriv('aes-256-ctr', key, iv);
            const encrypted = Buffer.concat([cipher.update(id), cipher.final()]);
            return { status: true, data: Buffer.concat([iv, encrypted]).toString('base64url') };
        } catch (err) {
            return { status: false, message: `Error: ${err}`}
        }
    };

    encryptWithPublicKey = (data: any, publicKey: string): ResponseProps<string> => {
        try {
            const encrypted = publicEncrypt({
                key: publicKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            }, Buffer.from(data));

            return { status: true, data: encrypted.toString('base64') };
        } catch (err) {
            return { status: false, message: `Error: ${err}`}
        }
    };

    // Decrypt function
    decryptId = (encryptedString: string, tokenType: TokenType): ResponseProps<string> => {
        try {
            const data = Buffer.from(encryptedString, 'base64url');
            const iv = data.subarray(0, 16);
            const encrypted = data.subarray(16);
            const key = scryptSync(tokenType, 'salt', 32);
            const decipher = createDecipheriv('aes-256-ctr', key, iv);
            return {
                status: true,
                data: Buffer.concat([decipher.update(encrypted), decipher.final()]).toString()
            }
        } catch (err) {
            return { status: false, message: `Error: ${err}`}
        }
    };
}

export default EncryptionRepository;