import { Page, Locator } from '@playwright/test';
import { UserInfoInterface } from '@utils/data-contracts/UserInfo.inteface';
import { UserInfoModel } from '@utils/data-contracts/UserInfo.model';

export class LoginPage {

    readonly emailTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.emailTextbox = page.locator('input#Email');
        this.passwordTextbox = page.locator('input#Password');
        this.loginButton = page.locator('button.button-1.login-button');
    }

    async fillInEmailTextbox(email: string): Promise<void> {
        await this.emailTextbox.fill(email);
    }

    async fillInPasswordTextbox(password: string): Promise<void> {
        await this.passwordTextbox.fill(password);
    }

    async clickOnLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async loginToSystemWithUserInfoModel(userInfo: UserInfoModel): Promise<void> {
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.clickOnLoginButton();
    }

    async loginToSystemWithUserInfoInterface(userInfo: UserInfoInterface): Promise<void> {
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.clickOnLoginButton();
    }

}