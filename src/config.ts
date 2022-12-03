import "dotenv/config";

export const {
  PORT,
  DB_URI,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_STORAGE_BUCKET_NAME,
  AWS_BUCKET_REGION,
} = process.env;
