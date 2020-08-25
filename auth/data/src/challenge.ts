import {prisma} from "./prisma";
import * as crypto from "crypto";

export interface RequestChallengeResponse
{
    success: boolean,
    errorMessage?: string,
    challenge?: string
    validTo?: Date
}

export interface VerifyChallengeResponse
{
    success: boolean
}

export class Challenge
{
    public static async requestChallenge(forEmail:string, length:number, validForNSeconds:number) : Promise<RequestChallengeResponse>
    {
        const now = new Date();

        const pendingChallenges = await prisma.challenges.findMany({
            where: {
                email: forEmail,
                done: false,
                validTo: {
                    gt: now
                }
            }
        });

        if (pendingChallenges.length > 0) {
            return {
                success: false,
                errorMessage: "There is a pending challenge for this email address. Please solve it first or let it time-out before requesting a new one."
            }
        }

        const newChallenge = await prisma.challenges.create({
            data: {
                email: forEmail,
                validTo: new Date(new Date().getTime() + (validForNSeconds * 1000)),
                challenge: Challenge.generateChallenge(length),
                done: false
            }
        });

        return {
            success: true,
            challenge: newChallenge.challenge,
            validTo: newChallenge.validTo
        };
    }

    public static async verifyChallenge(challengeResponse:string) : Promise<VerifyChallengeResponse>
    {
        const now =  new Date();
        const challenge = await prisma.challenges.findMany({
            where: {
                challenge: challengeResponse,
                done: false,
                validTo: {
                    gte: now
                }
            }
        });

        if (challenge.length != 1) {
            return {
                success: false
            }
        }

        await prisma.challenges.update({
            where: {
                id: challenge[0].id
            },
            data: {
                done: true
            }
        });

        return {
            success: true
        }
    }

    private static generateChallenge(length:number)
    {
        const randomIntegers = new Int8Array(length);
        crypto.randomFillSync(randomIntegers, 0, length);
        let challenge = "";
        for (let i of randomIntegers) {
            challenge += i.toString(32);
        }
        return challenge;
    }
}
