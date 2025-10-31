import { createLogger, format, transports, Logger } from 'winston';
import 'winston-daily-rotate-file'; // register 'DailyRotateFile' to transports

const { combine, timestamp, label, printf, colorize } = format;
const DailyRotateFile = (transports as any).DailyRotateFile;

let currentRunID: string = '';

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
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
        label({ label: 'TEST' }),
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
    const timeStamp = now.toLocaleString('sv-SE').replace(/ /g, '_').replace(/:/g, '').replace(/-/g, '');
    const suiteName = testInfo.titlePath[1].toLowerCase().replace(/\s/g, '_');
    const browserName = testInfo.project.name.toLowerCase().replace(/\s/g, '_');

    const runID = `${timeStamp}_${suiteName}_${browserName}`;

    if (!require('fs').existsSync('logs/runs')) {
        require('fs').mkdirSync('logs/runs', { recursive: true });
    }

    const runLogTransport = new transports.File({
        filename: `logs/runs/${runID}.log`,
        level: 'debug',
        format: combine(
            label({ label: browserName.toUpperCase() }),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            logFormat
        ),
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
    }
}

export default logger;
