import dotenv from "dotenv";

if (process.env.NODE_ENV) {
  dotenv.config({
    path: `./.env.${process.env.NODE_ENV}`,
  });
} else {
  throw new Error("NODE_ENV must be defined");
}

module.exports.APP_NAME = process.env.APP_NAME;
