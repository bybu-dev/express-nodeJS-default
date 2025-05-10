import morgan from "morgan";
import winston, { createLogger, format, transports, config } from "winston";

const { combine, timestamp, json } = format;

const hostname = process.env.ENV;
const service = process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.REGION;
const API_KEY = process.env.DATADOG_CLOUD_API_KEY;

const useFormat = combine(json(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }));

const httpTransportOptions = {
  host: "http-intake.logs.datadoghq.eu",
  path: `/api/v2/logs?dd-api-key=${API_KEY}&ddsource=nodejs&service=${service}&host=${hostname}`,
  ssl: true,
};

export const logger = createLogger({
  levels: config.syslog.levels,
  format: useFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
    new transports.Http(httpTransportOptions),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: "combined.log" }),
  ],
});

export const userLogger = console;
// createLogger({
//   levels: config.syslog.levels,
//   defaultMeta: { component: "user-service" },
//   format: useFormat,
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: "combined.log" }),
//     new transports.Http(httpTransportOptions),
//   ],
//   exceptionHandlers: [
//     new transports.Console(),
//     new transports.File({ filename: "combined.log" }),
//   ],
// });

export const paymentLogger = console;
// createLogger({
//   levels: config.syslog.levels,
//   defaultMeta: { component: "payment-service" },
//   format: useFormat,
//   transports: [
//     new transports.Console(),
//     new transports.File({ filename: "combined.log" }),
//     new transports.Http(httpTransportOptions),
//   ],
//   exceptionHandlers: [
//     new transports.Console(),
//     new transports.File({ filename: "combined.log" }),
//   ],
// });

export const getApiRequests = () => {
  let toggleColor = (message: string) => {
      if (message.search(' 200') > 0) {
          return '✅';
      }
      if (message.search(' 500') > 0) {
          return '❗';
      }
      if (message.search(' 201') > 0) {
          return '✅';
      }
      return '🔔';
  }
  
  return morgan(
      'tiny',
      {
          stream: {
              write: (message) => winston.createLogger({
                  format: winston.format.combine(
                      winston.format.colorize(),
                      winston.format.label({label: `${toggleColor(message.trim())}`, message: true}),
                      winston.format.timestamp(),
                      winston.format.printf((info) => {
                          return `[${info.level}] ${(new Date()).toUTCString()} ${info.message}`;
                      })
                  ),
                  transports: [new winston.transports.Console({level: 'http'})],}).http(message.trim()),
          },
      }
  );
}