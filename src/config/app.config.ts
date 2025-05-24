import dotenv from "dotenv";
dotenv.config();

interface Config {
  port: string;
  mongodbUrl: string;
  jwtSecret: string;
  jwtSecretExpires: string;
  nodeEnv: string;
}

export const config: Config = {
  port: process.env.PORT || "4000",
  mongodbUrl: process.env.MONGODB_URI as string,
  jwtSecret: process.env.JWT_SECRET || "fallback_secret_key",
  jwtSecretExpires: process.env.JWT_EXPIRE || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
};
