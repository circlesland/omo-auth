import {
    LoginResponse,
    MutationResolvers,
    QueryResolvers, VerifyResponse, Version
} from "../generated/graphql";
import {Challenge} from "@omo/auth-data/dist/challenge";
import {Mailer} from "@omo/auth-mailer/dist/mailer";
import {login} from "@omo/auth-mailer/dist/templates/login";
import jsonwebtoken from 'jsonwebtoken';
import {ValueGenerator} from "@omo/auth-util/dist/valueGenerator";
import {KeyPair} from "@omo/auth-data/dist/keyPair";

export class Resolvers
{
    // TODO: Add rate limiting (e.g. with https://www.npmjs.com/package/graphql-rate-limit-directive)

    readonly queryResolvers: QueryResolvers;
    readonly mutationResolvers: MutationResolvers;

    constructor()
    {
        this.mutationResolvers = {
            login: async (parent, {emailAddress}, context) =>
            {
                try
                {
                    const challenge = await Challenge.requestChallenge(emailAddress, 8, 120);
                    if (!challenge.success)
                    {
                        return <LoginResponse>{
                            success: false,
                            errorMessage: challenge.errorMessage
                        }
                    }

                    await Mailer.send(login, {
                        challenge: challenge.challenge
                    }, emailAddress);

                    return <LoginResponse>{
                        success: true
                    }
                }
                catch (e)
                {
                    console.error(e);

                    return <LoginResponse>{
                        success: false,
                        errorMessage: "Internal server error"
                    }
                }
            },
            verify: async (parent, {oneTimeToken}, context) =>
            {
                try
                {
                    const verificationResult = await Challenge.verifyChallenge(oneTimeToken);
                    if (!verificationResult.success || !verificationResult.email)
                    {
                        return <VerifyResponse>{
                            success: false,
                            errorMessage: "Your code is invalid or has already expired."
                        }
                    }

                    const jwt = await Resolvers._generateJwt(verificationResult.email);

                    return <VerifyResponse>{
                        success: true,
                        jwt: jwt
                    }
                }
                catch (e)
                {
                    console.error(e);

                    return <VerifyResponse>{
                        success: false,
                        errorMessage: "Internal server error"
                    }
                }
            }
        };

        this.queryResolvers = {
            version: async (parent, {}, context) =>
            {
                return <Version>{
                    major: 1,
                    minor: 0,
                    revision: 0
                }
            }
        }
    }

    private static async _generateJwt(forEmail:string)
    {
        if (!process.env.AUTH_SERVICE_JWT_EXP_IN_SEC)
        {
            throw new Error("The AUTH_SERVICE_JWT_EXP_IN_SEC environment variable must contain a numeric " +
                "value that specifies the token expiration duration in minutes.")
        }
        if (!process.env.AUTH_SERVICE_JWT_ISSUER)
        {
            throw new Error("The AUTH_SERVICE_JWT_ISSUER environment variable must contain a value.")
        }

        // RFC 7519: 4.1.1.  "iss" (Issuer) Claim
        const iss = process.env.AUTH_SERVICE_JWT_ISSUER;

        // RFC 7519: 4.1.2.  "sub" (Subject) Claim
        const sub = forEmail;

        // RFC 7519: 4.1.3.  "aud" (Audience) Claim
        const aud = [""];

        // RFC 7519: 4.1.4.  "exp" (Expiration Time) Claim
        const expiresInMinutes = parseInt(process.env.AUTH_SERVICE_JWT_EXP_IN_SEC);
        const exp = Math.floor(Date.now() / 1000) + (expiresInMinutes * 60)

        // RFC 7519: 4.1.5.  "nbf" (Not Before) Claim
        // TODO: Sync with key rotation
        // const nbf =

        // RFC 7519: 4.1.6.  "iat" (Issued At) Claim
        const iat = Date.now() / 1000

        // RFC 7519: 4.1.7.  "jti" (JWT ID) Claim
        const jti = ValueGenerator.generateRandomUrlSafeString(24);

        const tokenData = {
            iss, sub, aud, exp, iat, jti
        };

        const keypair = await KeyPair.findValidKey();
        if (!keypair)
            throw new Error("No valid key available to sign the jwt.")

        return jsonwebtoken.sign(tokenData, keypair.privateKey, {
            algorithm: "RS256"
        });
    }
}
