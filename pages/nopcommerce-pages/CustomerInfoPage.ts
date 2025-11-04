import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/core/BasePage';

export class CustomerInfoPage extends BasePage {

    readonly genderMaleRadio: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly companyTextbox: Locator;

    constructor(page: Page) {
        super(page);
        this.genderMaleRadio = page.locator('input#gender-male');
        this.firstNameTextbox = page.locator('input#FirstName');
        this.lastNameTextbox = page.locator('input#LastName');
        this.companyTextbox = page.locator('input#Company');
    }

    async isGenderMaleSelected(): Promise<boolean> {
        return await this.isChecked(this.genderMaleRadio);
    }

    async getValueInFirstnameTextbox(): Promise<string> {
        return await this.getInputValue(this.firstNameTextbox);
    }

    async getValueInLastnameTextbox(): Promise<string> {
        return await this.getInputValue(this.lastNameTextbox);
    }

    async getValueInCompanyTextbox(): Promise<string> {
        return await this.getInputValue(this.companyTextbox);
    }

}