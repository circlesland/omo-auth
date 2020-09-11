import {Template} from "../template";

export const login:Template = {
    subject: "Your OMO.earth login magic-link",
    bodyPlain: `Please click the link below to sign-in:
https://auth.omo.earth/static/login?code={{challenge}}`,
    bodyHtml: `Please click the link below to sign-in:<br/>
<a href="https://auth.omo.earth/static/login?code={{challenge}}">Sign-in</a>`
}
