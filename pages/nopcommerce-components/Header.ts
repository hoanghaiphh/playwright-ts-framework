import { Page, Locator } from '@playwright/test';

export class Header {

    readonly registerLink: Locator;
    readonly loginLink: Locator;
    readonly logoutLink: Locator;
    readonly myAccountLink: Locator;

    constructor(page: Page) {
        this.registerLink = page.locator('.ico-register');
        this.loginLink = page.locator('.ico-login');
        this.logoutLink = page.locator('.ico-logout');
        this.myAccountLink = page.locator("//a[@class='ico-account' and text()='My account']");
    }

    async clickOnRegisterLink(): Promise<void> {
        await this.registerLink.click();
    }

    async clickOnLoginLink(): Promise<void> {
        await this.loginLink.click();
    }

    async clickOnLogoutLink(): Promise<void> {
        await this.logoutLink.click();
    }

    async clickOnMyAccountLink(): Promise<void> {
        await this.myAccountLink.click();
    }

    async isMyAccountLinkDisplayed(): Promise<boolean> {
        return await this.myAccountLink.isVisible();
    }

}