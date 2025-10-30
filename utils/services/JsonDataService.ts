import * as fs from 'fs';
import * as path from 'path';

export class JsonDataService {

    public static loadJsonObject<T>(relativePath: string): T | undefined {
        const filePath = path.join(process.cwd(), relativePath);

        try {
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContents) as T;

        } catch (error) {
            console.error(`ERROR: Failed to load data from ${filePath}`, error);
            return undefined;
        }
    }

    public static loadJsonArray<T>(relativePath: string): T[] {
        const filePath = path.join(process.cwd(), relativePath);

        try {
            const fileContents = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(fileContents) as T[];

        } catch (error) {
            console.error(`ERROR: Failed to load data from ${filePath}`, error);
            return [];
        }
    }

}
