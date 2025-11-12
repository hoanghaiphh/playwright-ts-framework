import { Browser, BrowserContext, Page, TestInfo } from '@playwright/test';
import { BasePage } from '@BasePage';
import sqlServiceInstance from '@services/sql-server.service';
import logger, { initializeRunLogger, cleanupRunLogger, setCurrentTestTitle } from '@utils/logger';
import { apiLogin } from '@utils/apis/nopcommerce.api';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
export { Severity };

const pomCache = new Map<(new (page: Page) => BasePage), BasePage>();
let pageInstance: Page | undefined = undefined;

export function getPage<T extends BasePage>(PageClass: new (page: Page) => T): T {
    if (!pageInstance) {
        throw new Error('Fatal Error: Base context is uninitialized.');
    }

    if (pomCache.has(PageClass)) {
        return pomCache.get(PageClass) as T;
    } else {
        const instance = new PageClass(pageInstance);
        pomCache.set(PageClass, instance);
        return instance;
    }
}

async function createBrowserContext(browser: Browser, baseURL: string,
    credentials?: { email: string, password: string }): Promise<BrowserContext> {

    if (credentials) {
        logger.info(`Login required. Attempting API login...`);

        try {
            const storageState = await apiLogin(credentials.email, credentials.password);
            const context = await browser.newContext({ storageState: storageState, baseURL: baseURL });
            logger.info(`Context created with authenticated state.`);
            return context;
        } catch (error) {
            logger.error(error);
            throw error;
        }
    } else {
        return browser.newContext({ baseURL: baseURL });
    }
}

export async function setupSuite({ browser, baseURL }: { browser: Browser, baseURL: string | undefined },
    testInfo: TestInfo, credentials?: { email: string, password: string }): Promise<void> {

    if (!baseURL) throw new Error("Fatal Error: 'baseURL' is undefined.");

    const startLog =
        `Starting Test Suite: ${testInfo.titlePath[1].toUpperCase()} | Browser: ${testInfo.project.name.toUpperCase()}`;
    const startLogBorder = '='.repeat(startLog.length);

    initializeRunLogger(testInfo);
    logger.info(startLogBorder);
    logger.info(startLog);
    logger.info(startLogBorder + `\n`);
    setCurrentTestTitle('setup');

    const context = await createBrowserContext(browser, baseURL, credentials);
    const page = await context.newPage();
    await page.goto('/');
    pageInstance = page;
    pomCache.clear();
}

export async function teardownSuite(): Promise<void> {

    setCurrentTestTitle('teardown');
    logger.info('***');

    if (pageInstance) {
        const context = pageInstance.context();
        await pageInstance.close();
        await context.close();
        pageInstance = undefined;
        pomCache.clear();
    }

    await sqlServiceInstance.disconnect();

    logger.info(`Test execution completed successfully.\n`);
    cleanupRunLogger();
}

export function initializeTest(testInfo: TestInfo, severity: Severity = Severity.NORMAL, description?: string): void {

    const fullPath = testInfo.file;
    const pathParts = fullPath.split(/[\/\\]/);
    const folderName = pathParts[pathParts.length - 2];
    const fileNameWithExtension = pathParts[pathParts.length - 1];
    const fileName = fileNameWithExtension.replace('.spec.ts', '');

    allure.feature(folderName.toUpperCase().replace(/-/g, ' ')); // upper
    allure.story(fileName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')); // pascal
    allure.severity(severity);
    if (description) allure.description(description);

    setCurrentTestTitle(testInfo.title);
    logger.info('***');
}