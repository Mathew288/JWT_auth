import {expressjwt} from 'express-jwt';
import * as dotenv from 'dotenv';

const secretKey = "Rihard";
const api = "localhost/apiv1"
const authJwt = expressjwt({
    secret:secretKey!,
    algorithms:["ES256"]
}).unless({
    path:[
        {url: /\/api\/v1\/product(.*)/, methods:["GET","OPTIONS"]},
        `${api}/user/login`,
        `${api}/user/register`
    ]
});