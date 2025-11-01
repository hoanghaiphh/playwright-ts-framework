import { Page, Locator } from '@playwright/test'
import { UserInfoModel } from '@utils/data-contracts/UserInfo.model';
import { UserInfoInterface } from '@utils/data-contracts/UserInfo.inteface';

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

    async checkGenderMaleRadio(): Promise<void> {
        await this.genderMaleRadio.check();
    }

    async fillInFirstnameTextbox(firstName: string): Promise<void> {
        await this.firstNameTextbox.fill(firstName);
    }

    async fillInLastnameTextbox(lastName: string): Promise<void> {
        await this.lastNameTextbox.fill(lastName);
    }

    async fillInEmailTextbox(email: string): Promise<void> {
        await this.emailTextbox.fill(email);
    }

    async fillInCompanyTextbox(company: string): Promise<void> {
        await this.companyTextbox.fill(company);
    }

    async fillInPasswordTextbox(password: string): Promise<void> {
        await this.passwordTextbox.fill(password);
        await this.confirmPasswordTextbox.fill(password);
    }

    async clickOnRegisterButton(): Promise<void> {
        await this.registerButton.click();
    }

    async getRegisterSuccessMessage(): Promise<string> {
        return (await this.successMessage.textContent()) ?? '';
    }

    async addUserInfoUsingModel(userInfo: UserInfoModel): Promise<void> {
        await this.checkGenderMaleRadio();
        await this.fillInFirstnameTextbox(userInfo.firstName);
        await this.fillInLastnameTextbox(userInfo.lastName);
        await this.fillInEmailTextbox(userInfo.email);
        await this.fillInCompanyTextbox(userInfo.company);
        await this.fillInPasswordTextbox(userInfo.password);
    }

    async addUserInfoUsingInterface(userInfo: UserInfoInterface): Promise<void> {
        await this.checkGenderMaleRadio();
        await this.fillInFirstnameTextbox(userInfo.firstName);
        await this.fillInLastnameTextbox(userInfo.lastName);
        await this.fillInEmailTextbox(userInfo.email);
        await this.fillInCompanyTextbox(userInfo.company);
        await this.fillInPasswordTextbox(userInfo.password);
    }

}