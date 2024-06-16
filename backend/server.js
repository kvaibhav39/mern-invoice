import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { morganMiddleware, systemLogs } from "./utils/logger.js";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import connectionToDB from "./config/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { apiLimiter } from "./middleware/apiLimiter.js";

await connectionToDB();
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(mongoSanitize());

app.use(morganMiddleware);
app.get("/api/v1/test", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", apiLimiter, userRoutes);

app.use(notFound);
app.use(errorHandler);
app.set("trust proxy", 1);

const PORT = process.env.PORT || 1997;

app.listen(PORT, () => {
  console.log(
    chalk.green.bold(
      `✅ Server running in ${chalk.yellow.bold(
        process.env.NODE_ENV
      )} mode on port on port ${chalk.blue.bold(PORT)}👍`
    )
  );

  systemLogs.info(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
