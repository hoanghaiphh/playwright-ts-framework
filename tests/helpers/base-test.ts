import { test as base, Browser, Page, TestInfo } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { Header } from '@pages/nopcommerce-user/components/Header';
import sqlServiceInstance from '@services/sql-server.service';
import logger, { initializeRunLogger, cleanupRunLogger, setCurrentTestTitle } from '@utils/logger';
import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
export { Severity };

const pomCache = new Map<new (page: Page) => BasePage, BasePage>();

let pageInstance: Page | undefined = undefined;

type PageClassArray = Array<new (page: Page) => BasePage>;

type CommonFixtures = {
    header: Header;
}

export const test = base.extend<CommonFixtures>({
    header: async ({ browserName }, use) => {
        const headerInstance = getPage(Header);
        await use(headerInstance);
    },
})

export async function setupSuite({ browser, baseURL }: { browser: Browser, baseURL: string | undefined },
    testInfo: TestInfo, componentsToInitialize: PageClassArray = []): Promise<void> {

    if (!baseURL) {
        throw new Error("Fatal Error: 'baseURL' is undefined.");
    }

    const startLog =
        `Starting Test Suite: ${testInfo.titlePath[1].toUpperCase()} | Browser: ${testInfo.project.name.toUpperCase()}`;
    const startLogBorder = '='.repeat(startLog.length);
    initializeRunLogger(testInfo);
    logger.info(startLogBorder);
    logger.info(startLog);
    logger.info(startLogBorder + `\n`);

    const page = await browser.newPage();
    await page.goto(baseURL);
    pageInstance = page;
    pomCache.clear();

    for (const ComponentClass of componentsToInitialize) {
        getPage(ComponentClass);
    }
}

export async function teardownSuite(): Promise<void> {
    setCurrentTestTitle('');
    logger.info('-'.repeat(50));

    if (pageInstance) {
        await pageInstance.close();
        pageInstance = undefined;
        pomCache.clear();
    }

    await sqlServiceInstance.disconnect();

    logger.info(`Test execution completed successfully.\n`);
    cleanupRunLogger();
}

export function initializeTest(
    feature: string, story: string, severity: Severity = Severity.NORMAL, description?: string): void {

    allure.feature(feature);
    allure.story(story);
    allure.severity(severity);
    if (description) allure.description(description);

    setCurrentTestTitle(story);
    logger.info('');
}

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