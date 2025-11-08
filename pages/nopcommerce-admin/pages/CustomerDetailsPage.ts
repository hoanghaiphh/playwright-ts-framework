import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';
import { Ajax } from '../components/Ajax';
import { getPage } from '@tests/helpers/base-test';

export class CustomerDetailsPage extends BasePage {

    readonly ajax: Ajax;

    readonly deleteButton: Locator;
    readonly modalDeleteButton: Locator;

    constructor(page: Page) {
        super(page);

        this.ajax = getPage(Ajax);

        this.deleteButton = page.locator('span#customer-delete');
        this.modalDeleteButton = page.locator("//button[contains(text(),'Delete')]");
    }

    async deleteCustomer(): Promise<void> {
        await this.ajax.waitForLoading();
        await this.clickElement(this.deleteButton);
        await this.clickElement(this.modalDeleteButton);
    }

}