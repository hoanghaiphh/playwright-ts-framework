import { Page, Locator } from '@playwright/test'
import { UserInfoModel } from '@models/user-info.model';
import { UserInfoInterface } from '@models/user-info.interface';

export class RegisterPage {

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

    async addUserInfo(
        firstName: string, lastName: string, company: string, email: string, password: string): Promise<void> {
        await this.genderMaleRadio.check();
        await this.firstNameTextbox.fill(firstName);
        await this.lastNameTextbox.fill(lastName);
        await this.companyTextbox.fill(company);
        await this.emailTextbox.fill(email);
        await this.passwordTextbox.fill(password);
        await this.confirmPasswordTextbox.fill(password);
    }

    async addUserInfoUsingModel(userInfo: UserInfoModel): Promise<void> {
        await this.genderMaleRadio.check();
        await this.firstNameTextbox.fill(userInfo.firstName);
        await this.lastNameTextbox.fill(userInfo.lastName);
        await this.companyTextbox.fill(userInfo.company);
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.confirmPasswordTextbox.fill(userInfo.password);
    }

    async addUserInfoUsingInterface(userInfo: UserInfoInterface): Promise<void> {
        await this.genderMaleRadio.check();
        await this.firstNameTextbox.fill(userInfo.firstName);
        await this.lastNameTextbox.fill(userInfo.lastName);
        await this.companyTextbox.fill(userInfo.company);
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.confirmPasswordTextbox.fill(userInfo.password);
    }

    async clickOnRegisterButton(): Promise<void> {
        await this.registerButton.click();
    }

    async getRegisterSuccessMessage(): Promise<string> {
        return (await this.successMessage.textContent()) ?? '';
    }

}