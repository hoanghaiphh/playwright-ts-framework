import { Page, Locator } from '@playwright/test';
import { UserInfoModel } from '@models/user-info.model';
import { UserInfoInterface } from '@models/user-info.interface';

export class LoginPage {

    readonly emailTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.emailTextbox = page.locator('input#Email');
        this.passwordTextbox = page.locator('input#Password');
        this.loginButton = page.locator('button.button-1.login-button');
    }

    async loginToSystem(email: string, password: string): Promise<void> {
        await this.emailTextbox.fill(email);
        await this.passwordTextbox.fill(password);
        await this.loginButton.click();
    }

    async loginToSystemWithUserInfoModel(userInfo: UserInfoModel): Promise<void> {
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.loginButton.click();
    }

    async loginToSystemWithUserInfoInterface(userInfo: UserInfoInterface): Promise<void> {
        await this.emailTextbox.fill(userInfo.email);
        await this.passwordTextbox.fill(userInfo.password);
        await this.loginButton.click();
    }

}