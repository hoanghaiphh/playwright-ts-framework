import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base/BasePage';

export class AddCustomerPage extends BasePage {

    readonly emailTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly genderFemaleRadio: Locator;
    readonly companyTextbox: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        super(page);

        this.emailTextbox = page.locator('input#Email');
        this.passwordTextbox = page.locator('input#Password');
        this.firstNameTextbox = page.locator('input#FirstName');
        this.lastNameTextbox = page.locator('input#LastName');
        this.genderFemaleRadio = page.locator('input#Gender_Female');
        this.companyTextbox = page.locator('input#Company');
        this.saveButton = page.locator("button[name='save']");
    }

    async addUserInfo(firstName: string, lastName: string, company: string, email: string, password: string)
        : Promise<void> {

        await this.fillText(this.emailTextbox, email);
        await this.fillText(this.passwordTextbox, password);
        await this.fillText(this.firstNameTextbox, firstName);
        await this.fillText(this.lastNameTextbox, lastName);
        await this.checkRadioButton(this.genderFemaleRadio);
        await this.fillText(this.companyTextbox, company);
    }

    async clickOnSaveButton(): Promise<void> {
        await this.clickElement(this.saveButton);
    }

}