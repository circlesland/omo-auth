import {
    LoginResponse,
    MutationResolvers, Profile,
    QueryResolvers, VerifyResponse
} from "../generated/graphql";
import {Challenge} from "@omo/auth-data/dist/challenge";
import {Mailer} from "@omo/auth-mailer/dist/mailer";
import {login} from "@omo/auth-mailer/dist/templates/login";

export class Resolvers
{
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
                    if (!verificationResult.success)
                    {
                        return <VerifyResponse>{
                            success: false,
                            errorMessage: "Your code is invalid or the challenge has already expired. Please try again."
                        }
                    }

                    const jwt = "YOUR-JWT-GOES-HERE";

                    return <VerifyResponse>{
                        success: true,
                        jwt: jwt
                    }
                }
                catch (e)
                {
                    return <VerifyResponse>{
                        success: false,
                        errorMessage: "Internal server error"
                    }
                }
            }
        };

        this.queryResolvers = {
            profile: async (parent, {jwt}, context) =>
            {
                try
                {
                    return <Profile>{
                        id: "YOUR-ID",
                        email: "YOUR-EMAIL",
                        schemaId: "SCHEMA-ID",
                        document: "PROFILE-DATA"
                    }
                }
                catch (e)
                {
                    throw new Error("Internal server error")
                }
            }
        }
    }
}
