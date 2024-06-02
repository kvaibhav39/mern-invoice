import chalk from "chalk";
import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const { combine, timestamp, prettyPrint } = format;

const fileRotateTransport = new transports.DailyRotateFile({
  filename: "logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  // zippedArchive: true,
  // maxSize: "20m",
  maxFiles: "14d",
});

export const systemLogs = createLogger({
  level: "http",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss.SSS A",
    }),
    prettyPrint()
  ),
  transports: [
    fileRotateTransport,
    new transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "logs/exceptions.log",
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: "logs/rejections.log",
    }),
  ],
});

const customFormat = format.printf(({ level, message }) => {
  if (level === "info") {
    return `${level}: ${chalk.green(message)}`;
  } else if (level === "error") {
    return `${level}: ${chalk.red(message)}`;
  } else if (level === "warn") {
    return `${level}: ${chalk.yellow(message)}`;
  } else if (level === "debug") {
    return `${level}: ${chalk.gray(message)}`;
  } else {
    return `${level}: ${chalk.blue(message)}`;
  }
});

if (process.env.NODE_ENV !== "production") {
  systemLogs.add(
    new transports.Console({
      format: customFormat,
    })
  );
}

export const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      contentLength: tokens.res(req, res, "content-length"),
      responseTime: Number.parseFloat(tokens["response-time"](req, res)),
    });
  },
  {
    stream: {
      write: (message) => {
        const data = JSON.parse(message);
        systemLogs.http(`incoming-request`, data);
      },
    },
  }
);
