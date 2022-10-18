import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface ICatchAsync {
  (
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction,
  ): Promise<void>;
  (
    arg0: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    arg1: Response<any, Record<string, any>>,
    arg2: NextFunction
  ): Promise<any>;
}
