import * as dotenv from "dotenv";

dotenv.config();

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT,
};

export default config;
