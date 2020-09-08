import {prisma} from "./prisma";
import {KeyGenerator} from "@omo/auth-util/dist/keyGenerator";

export class KeyPair
{
    public static async findValidKey()
    {
        const now = new Date();

        const validKeyPairs = await prisma.keyPairs.findMany({
            where: {
                validFrom: {
                    lte: now
                },
                OR:[{
                    validTo: null
                },{
                    validTo: {
                        gt: now
                    }
                }]
            }
        });

        if (validKeyPairs.length > 1)
        {
            throw new Error("There exists more than one valid key pair.");
        }
        if (validKeyPairs.length == 0)
        {
            return null;
        }
        return validKeyPairs[0];
    }

    public static async createKeyPair()
    {
        if (!process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS)
            throw new Error("process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS is not set!");

        const newKeyPair = await KeyGenerator.generateRsaKeyPair();
        const now = new Date();
        const newKeyPairEntry = await prisma.keyPairs.create({
            data: {
                privateKey: newKeyPair.privateKey,
                publicKey: newKeyPair.publicKey,
                validFrom: now,
                validTo: new Date(now.getTime() + (parseInt(process.env.AUTH_SERVICE_ROTATE_EVERY_N_SECONDS) * 1000))
            }
        });

        return newKeyPairEntry;
    }
}
