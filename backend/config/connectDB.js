// import chalk from "chalk";
import mongoose from "mongoose";
import { systemLogs } from "../utils/logger.js";

const connectionToDB = async () => {
  try {
    const connectionParams = {
      dbName: process.env.DB_NAME,
    };
    const connect = await mongoose.connect(
      process.env.MONGO_URI,
      connectionParams
    );
    systemLogs.info(`✅ MongoDB Connected: ${connect.connection.host}👍`);
  } catch (error) {
    systemLogs.error(`❌ Failed to connect to MongoDB`, error?.message);
    process.exit(1);
  }
};

export default connectionToDB;
