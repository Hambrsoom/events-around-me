  
import { createLogger, format, transports, config } from "winston";
const { timestamp, combine, printf, errors } = format;

function buildDevLogger() {
  const logFormat = printf(({ level, message, stack, timestamp }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  });

  return createLogger({
    format: combine(
    //   format.colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      format.json(),
      logFormat,
    ),
    levels: config.syslog.levels,
    transports: [
        new transports.Console(),
        new transports.File({ filename: "error.log", level: "error" }),
        new transports.File({ filename: "combined.log" }),
    ],
  });
}

export default buildDevLogger;
