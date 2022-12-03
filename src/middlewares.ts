import { Request, Response, NextFunction } from "express";
import { ValidationChain, validationResult } from "express-validator";
import multer from 'multer';
import {S3Client} from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import {  AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY,
    AWS_STORAGE_BUCKET_NAME,
    AWS_BUCKET_REGION,} from './config';

const bucket = <string>AWS_STORAGE_BUCKET_NAME
const region = <string>AWS_BUCKET_REGION
const accessKeyId = <string>AWS_S3_ACCESS_KEY_ID
const secretAccessKey = <string>AWS_S3_SECRET_ACCESS_KEY
class HttpResponse extends Error {
  statusCode: number;

  data: object | null;

  constructor(message: string, statusCode?: number, data?: object) {
    super(message);
    this.statusCode = statusCode === undefined ? 500 : statusCode;
    this.data = data === undefined ? null : data;
  }
}

const s3 = new S3Client({
  credentials: {
      secretAccessKey,
      accessKeyId,
  },
  region

})
export default {
  errorHandler: (
    err: HttpResponse | Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const error = { ...err };

    error.message = err.message;

    let statusCode: number;
    if ("statusCode" in error) {
      statusCode = error.statusCode;
    } else {
      statusCode = 500;
    }

    res.status(statusCode).json({
      sucess: false,
      message: error.message || "Server Error",
      error,
    });
  },
  error404: (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: "Route not Found",
    });
  },
  validator: (dtos: ValidationChain[]) => [
    ...dtos,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const error = errors.array();
        throw new HttpResponse("user input validation error", 400, error);
      }

      next();
    },
  ],
  thumbnail: multer({
    storage: multerS3({
      s3, 
      bucket,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      metadata: function (req: Express.Request, file: Express.Multer.File, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString());
      },
    }),
  }).single('thumbnail'),
};
