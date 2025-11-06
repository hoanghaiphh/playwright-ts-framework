import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class CustomersListPage extends BasePage {

    readonly searchEmailTextbox: Locator;
    readonly searchButton: Locator;
    readonly editButton: Locator;
    readonly successMessage: Locator;
    readonly gridInfo: Locator;
    readonly addNewButton: Locator;

    constructor(page: Page) {
        super(page);

        this.searchEmailTextbox = page.locator('input#SearchEmail');
        this.searchButton = page.locator('button#search-customers');
        this.editButton = page.locator('table#customers-grid td.button-column>a');
        this.successMessage = page.locator('div.alert-success');
        this.gridInfo = page.locator('div#customers-grid_info');
        this.addNewButton = page.locator("//a[contains(string(), 'Add new')]");
    }

    async searchCustomerByEmail(email: string): Promise<void> {
        await this.fillText(this.searchEmailTextbox, email);
        await this.clickElement(this.searchButton);
    }

    async clickOnEditButton(): Promise<void> {
        await this.clickElement(this.editButton);
    }

    async getSuccessMessage(): Promise<string> {
        return await this.getCleanText(this.successMessage);
    }

    async getGridInfo(): Promise<string> {
        return await this.getCleanText(this.gridInfo);
    }

    async clickOnAddNewButton(): Promise<void> {
        await this.clickElement(this.addNewButton);
    }

}