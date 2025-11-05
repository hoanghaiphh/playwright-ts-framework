import * as fs from 'fs';
import * as path from 'path';

const data: string[] = [
    `Platform=${process.platform || 'N/A'}`,
    `NodeJS.Version=${process.version || 'N/A'}`,
];

const content: string = data.join('\n');

const allureResultsPath: string = path.join(process.cwd(), 'allure-results');
const envFilePath: string = path.join(allureResultsPath, 'environment.properties');

try {
    if (!fs.existsSync(allureResultsPath)) {
        fs.mkdirSync(allureResultsPath, { recursive: true });
    }

    fs.writeFileSync(envFilePath, content);
    console.log('Environment data written to allure-results/environment.properties');

} catch (err) {
    console.error('Failed to write environment file:', err);
    process.exit(1);
}