export class Client
{
    private readonly _authUrl:string;

    constructor(authUrl:string)
    {
        this._authUrl = authUrl;
    }

    public async validateJwt(jwt:string)
    {
        // 1. Decode the jwt and get the "kid" field

        // 2. Get the key from the 'kid' fields from the specified uri

        // 3. Validate the token with the key

        // 4. Return the "sub" field value
    }
}
