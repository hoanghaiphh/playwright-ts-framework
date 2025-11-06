import { Page, Locator } from '@playwright/test'
import { BasePage } from '@pages/base/BasePage';

export class RegisterPage extends BasePage {

    readonly genderMaleRadio: Locator;
    readonly firstNameTextbox: Locator;
    readonly lastNameTextbox: Locator;
    readonly emailTextbox: Locator;
    readonly companyTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly confirmPasswordTextbox: Locator;
    readonly registerButton: Locator;
    readonly successMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.genderMaleRadio = page.locator('input#gender-male');
        this.firstNameTextbox = page.locator('input#FirstName');
        this.lastNameTextbox = page.locator('input#LastName');
        this.emailTextbox = page.locator('input#Email');
        this.companyTextbox = page.locator('input#Company');
        this.passwordTextbox = page.locator('input#Password');
        this.confirmPasswordTextbox = page.locator('input#ConfirmPassword');
        this.registerButton = page.locator('#register-button');
        this.successMessage = page.locator('.result');
    }

    async addUserInfo(firstName: string, lastName: string, company: string, email: string, password: string)
        : Promise<void> {

        await this.checkRadioButton(this.genderMaleRadio);
        await this.fillText(this.firstNameTextbox, firstName);
        await this.fillText(this.lastNameTextbox, lastName);
        await this.fillText(this.companyTextbox, company);
        await this.fillText(this.emailTextbox, email);
        await this.fillText(this.passwordTextbox, password);
        await this.fillText(this.confirmPasswordTextbox, password);
    }

    async clickOnRegisterButton(): Promise<void> {
        await this.clickElement(this.registerButton);
    }

    async getRegisterSuccessMessage(): Promise<string> {
        return await this.getCleanText(this.successMessage);
    }

}