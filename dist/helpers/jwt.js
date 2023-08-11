"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_jwt_1 = require("express-jwt");
const secretKey = "Rihard";
const api = "localhost/apiv1";
const authJwt = (0, express_jwt_1.expressjwt)({
    secret: secretKey,
    algorithms: ["ES256"]
}).unless({
    path: [
        { url: /\/api\/v1\/product(.*)/, methods: ["GET", "OPTIONS"] },
        `${api}/user/login`,
        `${api}/user/register`
    ]
});
