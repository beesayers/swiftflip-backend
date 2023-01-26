import { NextFunction, Request, Response } from "express";
declare const errorHandler: (err: Error, req: Request, res: Response, next: NextFunction) => void;
export default errorHandler;
