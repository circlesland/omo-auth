import {Template} from "../template";

export const login:Template = {
    subject: "Your OMO.earth login magic-link",
    bodyPlain: `Please click the link below to sign-in:
https://omo.earth/login?code={{challenge}}`,
    bodyHtml: `Please click the link below to sign-in:<br/>
<a href="https://omo.earth/login?code={{challenge}}">Sign-in</a>`
}
