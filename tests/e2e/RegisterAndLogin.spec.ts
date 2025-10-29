import { test, expect, Page } from '@playwright/test';
import { Header } from '@pages/components/Header';
import { LoginPage } from '@pages/app-pages/LoginPage';
import { RegisterPage } from '@pages/app-pages/RegisterPage';
import { CustomerInfoPage } from '@pages/app-pages/CustomerInfoPage';
import { UserInfo } from '@utils/data-models/UserInfo.model';
import { UserGenerator } from '@utils/generators/UserGenerator';

test.describe.serial('Register_And_Login', () => {

    let page: Page;
    let header: Header;
    let loginPage: LoginPage;
    let registerPage: RegisterPage;
    let customerInfoPage: CustomerInfoPage;
    let userInfo: UserInfo;

    test.beforeAll(async ({ browser }, testInfo) => {
        page = await browser.newPage();
        
        header = new Header(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        customerInfoPage = new CustomerInfoPage(page);

        userInfo = UserGenerator.generate(testInfo.project.name)

        await page.goto('/'); // baseURL from playwright.config.ts
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('User_01_Register', async () => {
        await header.clickOnRegisterLink();

        await registerPage.addUserInfo(userInfo);
        await registerPage.clickOnRegisterButton();

        const msg = await registerPage.getRegisterSuccessMessage();
        expect(msg).toContain('Your registration completed');
    });

    test('User_02_Login', async () => {
        await header.clickOnLogoutLink();
        await header.clickOnLoginLink();

        await loginPage.loginToSystem(userInfo);

        const displayed = await header.isMyAccountLinkDisplayed();
        expect(displayed).toBeTruthy();
    });

    test('User_03_MyAccount', async () => {
        await header.clickOnMyAccountLink();

        expect(await customerInfoPage.isGenderMaleSelected()).toBeTruthy();
        expect(await customerInfoPage.getValueInFirstnameTextbox()).toBe(userInfo.firstName);
        expect(await customerInfoPage.getValueInLastnameTextbox()).toBe(userInfo.lastName);
        expect(await customerInfoPage.getValueInCompanyTextbox()).toBe(userInfo.company);
    });

})