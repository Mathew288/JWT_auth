"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandle = void 0;
const errorHandle = (err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.status(401).json({ message: "The user is unauthorized" });
    }
    if (err.name === "ValidationError") {
        return res.status(401).json({ message: err });
    }
    next();
    return res.status(500).json(err);
};
exports.errorHandle = errorHandle;
