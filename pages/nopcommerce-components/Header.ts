import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/core/BasePage';

export class Header extends BasePage {

    readonly registerLink: Locator;
    readonly loginLink: Locator;
    readonly logoutLink: Locator;
    readonly myAccountLink: Locator;

    constructor(page: Page) {
        super(page);
        this.registerLink = page.locator('.ico-register');
        this.loginLink = page.locator('.ico-login');
        this.logoutLink = page.locator('.ico-logout');
        this.myAccountLink = page.locator("//a[@class='ico-account' and text()='My account']");
    }

    async clickOnRegisterLink(): Promise<void> {
        await this.clickElement(this.registerLink);
    }

    async clickOnLoginLink(): Promise<void> {
        await this.clickElement(this.loginLink);
    }

    async clickOnLogoutLink(): Promise<void> {
        await this.clickElement(this.logoutLink);
    }

    async clickOnMyAccountLink(): Promise<void> {
        await this.clickElement(this.myAccountLink);
    }

    async isMyAccountLinkDisplayed(): Promise<boolean> {
        return await this.isVisible(this.myAccountLink);
    }

}