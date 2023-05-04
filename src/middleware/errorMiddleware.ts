import { NextFunction, Request, Response } from "express";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.log("!!!! Using errorHandler middleware");

  res.status(statusCode);

  res.json({
    message: err.message,
    // stack: process.env.NODE_ENV === "development" ? err.stack : null,
    stack: err.stack,
  });
};

export default errorHandler;
