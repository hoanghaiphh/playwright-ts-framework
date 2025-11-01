import { Page, Locator } from '@playwright/test';

export class AdminCustomerListPage {

    readonly searchEmailTextbox: Locator;
    readonly searchButton: Locator;
    readonly ajaxLoadingSpinner: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        this.searchEmailTextbox = page.locator('input#SearchEmail');
        this.searchButton = page.locator('button#search-customers');
        this.ajaxLoadingSpinner = page.locator('div#ajaxBusy');
        this.editButton = page.locator('i.fas.fa-pencil');
        this.deleteButton = page.locator('span#customer-delete');
        this.confirmDeleteButton = page.locator("//button[contains(text(),'Delete')]");
        this.successMessage = page.locator('div.alert-success');
    }

    async searchUserByEmail(email: string): Promise<void> {
        await this.searchEmailTextbox.fill(email);
        await this.searchButton.click();
        await this.ajaxLoadingSpinner.waitFor({ state: 'hidden', timeout: 5000 })
    }

    async deleteSingleUser(): Promise<void> {
        await this.editButton.click();
        await this.deleteButton.click();
        await this.confirmDeleteButton.click();
    }

    async getDeleteSuccessMessage(): Promise<string> {
        return (await this.successMessage.textContent()) ?? '';
    }

}