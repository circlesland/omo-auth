import crypto from "crypto";

export class ValueGenerator
{
    static generateRandomBase32String(length:number)
    {
        return crypto.randomBytes(length).toString('base64').substr(0, length);
    }
}
