import { Page, Locator } from '@playwright/test';
import { BasePage } from '@BasePage';

export class LoginPage extends BasePage {

    readonly emailTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;
    readonly errorMsgDetail: Locator;

    constructor(page: Page) {
        super(page);

        this.emailTextbox = page.locator('input#Email');
        this.passwordTextbox = page.locator('input#Password');
        this.loginButton = page.locator('button.button-1.login-button');
        this.errorMsgDetail = page.locator('div.message-error li');
    }

    async loginToSystem(email: string, password: string): Promise<void> {
        await this.fillText(this.emailTextbox, email);
        await this.fillText(this.passwordTextbox, password);
        await this.clickElement(this.loginButton);
    }

    async getErrorMessageDetail(): Promise<string> {
        return await this.getCleanText(this.errorMsgDetail);
    }

}