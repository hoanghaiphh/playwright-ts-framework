import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class HomePage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

}