import logger from '@utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export function loadJsonObject<T>(relativePath: string): T | undefined {
    const filePath = path.resolve(relativePath);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContents) as T;

    } catch (error) {
        logger.error(`ERROR: Failed to load data from ${filePath}`, error);
        return undefined;
    }
}

export function loadJsonArray<T>(relativePath: string): T[] {
    const filePath = path.resolve(relativePath);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContents) as T[];

    } catch (error) {
        logger.error(`ERROR: Failed to load data from ${filePath}`, error);
        return [];
    }
}