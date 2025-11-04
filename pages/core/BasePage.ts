import { Page, Locator } from '@playwright/test';
import logger from '@utils/logger';

export class BasePage {
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async gotoPage(url: string, options?: { timeout?: number }): Promise<void> {
        try {
            await this.page.goto(url, { timeout: options?.timeout });
            await this.waitForPageLoad();
            logger.info(`Successfully navigated to URL: ${url}`);
        } catch (error) {
            logger.error(`Failed to navigate to URL: ${url}. Error: ${error}`);
            throw error;
        }
    }

    protected async waitForPageLoad(): Promise<void> {
        try {
            await this.page.waitForLoadState('networkidle');
        } catch (error) {
            logger.error(`Failed waiting for page load state. Error: ${error}`);
            throw error;
        }
    }

    protected async waitForVisible(locator: Locator, timeout: number = 15000): Promise<void> {
        try {
            await locator.waitFor({ state: 'visible', timeout: timeout });
        } catch (error) {
            logger.error(`Locator did not become visible within ${timeout}ms: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async waitForHidden(locator: Locator, timeout: number = 15000): Promise<void> {
        try {
            await locator.waitFor({ state: 'hidden', timeout: timeout });
        } catch (error) {
            logger.error(`Locator did not become hidden within ${timeout}ms: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async fillText(locator: Locator, text: string): Promise<void> {
        try {
            await this.waitForVisible(locator);
            await locator.fill(text);
            logger.info(`Successfully filled text: '${text}' into locator: ${locator}`);
        } catch (error) {
            logger.error(`Failed to fill text into locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async clickElement(locator: Locator): Promise<void> {
        try {
            await this.waitForVisible(locator);
            await locator.click();
            logger.info(`Successfully clicked on locator: ${locator}`);
        } catch (error) {
            logger.error(`Failed to click on locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async selectOption(locator: Locator, value: string): Promise<void> {
        try {
            await this.waitForVisible(locator);
            await locator.selectOption(value);
            logger.info(`Successfully selected option: '${value}' from locator: ${locator}`);
        } catch (error) {
            logger.error(`Failed to select option '${value}' from locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async checkRadioButton(locator: Locator): Promise<void> {
        try {
            await this.waitForVisible(locator);
            await locator.check();
            logger.info(`Successfully checked radio button: ${locator}`);
        } catch (error) {
            logger.error(`Failed to check radio button: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async setCheckboxState(locator: Locator, shouldBeChecked: boolean): Promise<void> {
        const action = shouldBeChecked ? 'check' : 'uncheck';

        try {
            await this.waitForVisible(locator);
            if (shouldBeChecked) {
                await locator.check();
            } else {
                await locator.uncheck();
            }
            logger.info(`Successfully performed action: '${action}' on checkbox: ${locator}`);
        } catch (error) {
            logger.error(`Failed to perform action: '${action}' on checkbox: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async getCleanText(locator: Locator): Promise<string> {
        try {
            await this.waitForVisible(locator);
            const textContent = (await locator.textContent() || '').trim();
            logger.info(`Successfully retrieved text: '${textContent}' from locator: ${locator}`);
            return textContent;
        } catch (error) {
            logger.error(`Failed to get text content from locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async getInputValue(locator: Locator): Promise<string> {
        try {
            await this.waitForVisible(locator);
            const value = await locator.inputValue();
            logger.info(`Successfully retrieved input value: '${value}' from locator: ${locator}`);
            return value;
        } catch (error) {
            logger.error(`Failed to get input value from locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async isVisible(locator: Locator): Promise<boolean> {
        try {
            const isElementVisible = await locator.isVisible();

            if (isElementVisible) {
                logger.info(`Locator is visible: ${locator}`);
            } else {
                logger.info(`Locator is not visible: ${locator}`);
            }
            return isElementVisible;
        } catch (error) {
            logger.error(`An unexpected error occurred while checking visibility for locator: ${locator}. Error: ${error}`);
            throw error;
        }
    }

    protected async isChecked(locator: Locator): Promise<boolean> {
        try {
            await this.waitForVisible(locator);

            const isElementChecked = await locator.isChecked();

            if (isElementChecked) {
                logger.info(`Locator is visible and checked: ${locator}`);
            } else {
                logger.info(`Locator is visible but not checked: ${locator}`);
            }
            return isElementChecked;
        } catch (error) {
            logger.error(`Failed to check 'checked' state for locator (maybe not visible): ${locator}. Error: ${error}`);
            throw error;
        }
    }

}