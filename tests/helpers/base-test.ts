import { test as base, Browser, Page, TestInfo } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { Header } from '@pages/nopcommerce-user/components/Header';
import sqlServiceInstance from '@services/sql-server.service';
import logger, { initializeRunLogger, cleanupRunLogger } from '@utils/logger';
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

    const suiteName = testInfo.titlePath[1].toUpperCase();
    const browserName = testInfo.project.name.toUpperCase();
    initializeRunLogger(testInfo);

    logger.info(`=========================================================================`);
    logger.info(`Starting Test Suite: ${suiteName} | Browser: ${browserName}`);
    logger.info(`=========================================================================\n`);

    const page = await browser.newPage();
    await page.goto(baseURL);
    pageInstance = page;
    pomCache.clear();

    for (const ComponentClass of componentsToInitialize) {
        getPage(ComponentClass);
    }
}

export async function teardownSuite(): Promise<void> {
    if (pageInstance) {
        await pageInstance.close();
        pageInstance = undefined;
        pomCache.clear();
    }

    await sqlServiceInstance.disconnect();

    logger.info(`=====================================`);
    logger.info(`Test Execution Completed Successfully`);
    logger.info(`=====================================\n`);
    cleanupRunLogger();
}

export function initializeTest(
    feature: string, story: string, severity: Severity = Severity.NORMAL, description?: string): void {

    allure.feature(feature);
    allure.story(story);
    allure.severity(severity);
    if (description) allure.description(description);
    logger.info(story);
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