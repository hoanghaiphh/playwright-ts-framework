import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class CustomerDetailsPage extends BasePage {

    readonly deleteButton: Locator;
    readonly modalDeleteButton: Locator;

    constructor(page: Page) {
        super(page);

        this.deleteButton = page.locator('span#customer-delete');
        this.modalDeleteButton = page.locator("//button[contains(text(),'Delete')]");
    }

    async deleteCustomer(): Promise<void> {
        await this.clickElement(this.deleteButton);
        await this.clickElement(this.modalDeleteButton);
    }

}