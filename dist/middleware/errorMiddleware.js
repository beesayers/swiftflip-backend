"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.log("!!!! Using errorHandler middleware");
    res.status(statusCode);
    res.json({
        message: err.message,
        // stack: process.env.NODE_ENV === "development" ? err.stack : null,
        stack: err.stack,
    });
};
exports.default = errorHandler;
//# sourceMappingURL=errorMiddleware.js.map