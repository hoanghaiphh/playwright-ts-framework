import { Page, Locator } from '@playwright/test';

export class CustomerInfoPage {

    readonly genderMaleRadio: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly companyTextbox: Locator;

    constructor(page: Page) {
        this.genderMaleRadio = page.locator('input#gender-male');
        this.firstNameTextbox = page.locator('input#FirstName');
        this.lastNameTextbox = page.locator('input#LastName');
        this.companyTextbox = page.locator('input#Company');
    }

    async isGenderMaleSelected(): Promise<boolean> {
        return await this.genderMaleRadio.isChecked();
    }

    async getValueInFirstnameTextbox(): Promise<string> {
        return await this.firstNameTextbox.inputValue();
    }

    async getValueInLastnameTextbox(): Promise<string> {
        return await this.lastNameTextbox.inputValue();
    }

    async getValueInCompanyTextbox(): Promise<string> {
        return await this.companyTextbox.inputValue();
    }

}