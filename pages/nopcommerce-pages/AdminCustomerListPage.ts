import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/core/BasePage';
import { currentConfig } from '@configs/env.config';

export class AdminCustomerListPage extends BasePage {

    readonly adminCustomerListUrl: string;
    readonly searchEmailTextbox: Locator;
    readonly searchButton: Locator;
    readonly ajaxLoadingSpinner: Locator;
    readonly editButtonList: Locator;
    readonly deleteButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);
        this.adminCustomerListUrl = `${currentConfig.appUrl}/Admin/Customer/List`;
        this.searchEmailTextbox = page.locator('input#SearchEmail');
        this.searchButton = page.locator('button#search-customers');
        this.ajaxLoadingSpinner = page.locator('div#ajaxBusy');
        this.editButtonList = page.locator('table#customers-grid td.button-column>a');
        this.deleteButton = page.locator('span#customer-delete');
        this.confirmDeleteButton = page.locator("//button[contains(text(),'Delete')]");
        this.successMessage = page.locator('div.alert-success');
    }

    async searchCustomersByEmail(email: string): Promise<void> {
        await this.fillText(this.searchEmailTextbox, email);
        await this.clickElement(this.searchButton);
        await this.waitForHidden(this.ajaxLoadingSpinner);
    }

    async deleteFirstCustomer(): Promise<void> {
        const firstEditButton = this.editButtonList.first();
        await this.clickElement(firstEditButton);
        await this.clickElement(this.deleteButton);
        await this.clickElement(this.confirmDeleteButton);
    }

    async getDeleteSuccessMessage(): Promise<string> {
        return await this.getCleanText(this.successMessage);
    }

}