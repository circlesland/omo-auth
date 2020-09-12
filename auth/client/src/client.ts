import jsonwebtoken from 'jsonwebtoken';
const fetch = require('node-fetch');

export class Client
{
    private readonly _authUrl:string;

    private readonly _appId:string;

    constructor(appId:string, authUrl:string)
    {
        this._authUrl = authUrl;
        this._appId = appId;
    }

    /**
     * Verifies the received token and returns the "sub" claim if successful.
     * @param jwt
     */
    public async verify(jwt:string)
    {
        const tokenPayload:any = jsonwebtoken.decode(jwt);

        // Check who issued the token
        if (typeof tokenPayload !== "object")
            throw new Error("Couldn't decode the jwt");

        const iss = tokenPayload.iss;
        if (!iss)
            throw new Error("No issuer (iss) claim.");
        if (iss !== this._authUrl)
            throw new Error("The issuer must match the _authUrl (is: " + iss + "; should be:" + this._authUrl + ")");

        const kid = tokenPayload.kid;
        if (!kid)
            throw new Error("No key id (kid) claim.")

        const aud = tokenPayload.aud;
        if (typeof aud !== "object")
            throw new Error("The audience (aud) must be an array.");

        const audAppId = aud[0];
        if (audAppId != this._appId)
            throw new Error("The audience of the received jwt doesn't match the configured appId. (is: " + audAppId + "; should be: " + this._appId + ")");

        const sub = tokenPayload.sub;
        if (!sub)
            throw new Error("No subject (sub) claim.");

        const key = await fetch(kid).then((data:any)=> data.json());
        const pubKey = key.data.keys.publicKey;
        if (!pubKey)
            throw new Error("Couldn't fetch the public key to verify the jwt");

        //const pubKey = key.keys.publicKey.split("\n");

        const verifiedPayload = jsonwebtoken.verify(jwt, pubKey);
        if (!verifiedPayload)
            throw new Error("The received jwt couldn't be verified.")

        return sub;
    }
}
