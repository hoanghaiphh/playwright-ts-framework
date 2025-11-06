import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class Ajax extends BasePage {

    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        super(page);
        this.loadingSpinner = page.locator('div#ajaxBusy');
    }

    async waitForLoading() {
        await this.waitForHidden(this.loadingSpinner);
    }

}