import {generateKeyPair} from "crypto";

export interface KeyPair
{
    privateKey: string,
    publicKey: string
}

export class KeyGenerator
{
    static async generateRsaKeyPair(keyLength: number = 2048)
    {
        return new Promise<KeyPair>((resolve, reject) =>
        {
            generateKeyPair('rsa',
                {
                    modulusLength: keyLength,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem',
                        //passphrase: 'top secret' // *optional*
                    }
                },
                (err, publicKey, privateKey) =>
                {
                    if (err)
                    {
                        reject(err);
                        return;
                    }
                    resolve({
                        privateKey,
                        publicKey
                    });
                });
        });
    }
}
