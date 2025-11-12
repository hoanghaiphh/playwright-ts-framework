import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = format;
const DailyRotateFile = (transports as any).DailyRotateFile;

let currentRunID: string = '';
let currentLogContext: string = '';

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
    const contextPart = meta.context ? ` [${meta.context}]` : '';
    return `${timestamp}${contextPart} ${level}: ${message}`;
});

const combinedRotateTransport = new DailyRotateFile({
    filename: 'logs/combined/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'info'
});

const errorRotateTransport = new DailyRotateFile({
    filename: 'logs/error/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '30d',
    level: 'error'
});

const logger: Logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new transports.Console({ format: combine(colorize(), logFormat) }),
        combinedRotateTransport,
        errorRotateTransport,
    ],
});

export function initializeRunLogger(testInfo: any): void {
    const now = new Date();
    const timeStamp = now.toLocaleString('sv-SE').replace(/-/g, '').replace(/:/g, '').replace(/\s/g, '-');

    const browserName = testInfo.project.name.toLowerCase().replace(/\s/g, '-');
    const specName = testInfo.file.split(/[\\/]/).pop()!.replace('.spec.ts', '').replace(/\s/g, '-');

    const runID = `${specName}_${timeStamp}_${browserName}`;

    if (!require('fs').existsSync('logs/runs')) {
        require('fs').mkdirSync('logs/runs', { recursive: true });
    }

    currentLogContext = testInfo.titlePath[1].toUpperCase();
    logger.defaultMeta = { context: currentLogContext };

    const runLogTransport = new transports.File({
        filename: `logs/runs/${runID}.log`,
        level: 'debug',
    });

    logger.add(runLogTransport);
    currentRunID = runID;
}

export function cleanupRunLogger(): void {
    if (currentRunID) {
        const transportToRemove = logger.transports.find(t =>
            (t as any).filename && (t as any).filename.includes(currentRunID));

        if (transportToRemove) {
            logger.remove(transportToRemove);
            currentRunID = '';
        }

        logger.defaultMeta = {};
    }
}

export function setCurrentTestTitle(title: string): void {
    logger.defaultMeta = {
        context: title
    };
}

export default logger;