import { Page, Locator, test } from '@playwright/test';
import logger from '@utils/logger';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async waitForVisible(locator: Locator, timeout: number = 15000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: timeout });
    }

    protected async runStep<T>(stepTitle: string, actionCallback: () => Promise<T>): Promise<T> {
        return await test.step(stepTitle, async () => {
            try {
                const result = await actionCallback();
                logger.info(stepTitle);
                return result;
            } catch (error) {
                logger.error(`${stepTitle} - FAILED: ${error}`);
                throw error;
            }
        });
    }

    async gotoPage(url: string, options?: { timeout?: number }): Promise<void> {
        const stepTitle = `Navigate to URL: ${url}`;
        await this.runStep(stepTitle, async () => {
            await this.page.goto(url, { timeout: options?.timeout });
            await this.page.waitForLoadState('networkidle');
        });
    }

    protected async waitForHidden(locator: Locator, timeout: number = 15000): Promise<void> {
        const stepTitle = `Wait for ${locator} become hidden within ${timeout}ms`;
        await this.runStep(stepTitle, async () => {
            await locator.waitFor({ state: 'hidden', timeout: timeout });
        });
    }

    protected async fillText(locator: Locator, text: string): Promise<void> {
        const stepTitle = `Fill text '${text}' into ${locator}`;
        await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            await locator.fill(text);
        });
    }

    protected async clickElement(locator: Locator): Promise<void> {
        const stepTitle = `Click on ${locator}`;
        await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            await locator.click();
        });
    }

    protected async selectOption(locator: Locator, value: string): Promise<void> {
        const stepTitle = `Select option '${value}' from ${locator}`;
        await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            await locator.selectOption(value);
        });
    }

    protected async checkRadioButton(locator: Locator): Promise<void> {
        const stepTitle = `Check radio button ${locator}`;
        await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            await locator.check();
        });
    }

    protected async setCheckboxState(locator: Locator, shouldBeChecked: boolean): Promise<void> {
        const action = shouldBeChecked ? 'check' : 'uncheck';
        const stepTitle = `Set state to '${action}' on checkbox ${locator}`;
        await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            if (shouldBeChecked) {
                await locator.check();
            } else {
                await locator.uncheck();
            }
        });
    }

    protected async getCleanText(locator: Locator): Promise<string> {
        const stepTitle = `Get text content from ${locator}`;
        return await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            return (await locator.textContent() || '').trim();
        });
    }

    protected async getInputValue(locator: Locator): Promise<string> {
        const stepTitle = `Get input value from ${locator}`;
        return await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            return await locator.inputValue();
        });
    }

    protected async isVisible(locator: Locator): Promise<boolean> {
        const stepTitle = `Get 'visible' state of ${locator}`;
        return await this.runStep(stepTitle, async () => {
            return await locator.isVisible();
        });
    }

    protected async isChecked(locator: Locator): Promise<boolean> {
        const stepTitle = `Get 'checked' state of ${locator}`;
        return await this.runStep(stepTitle, async () => {
            await this.waitForVisible(locator);
            return await locator.isChecked();
        });
    }

}