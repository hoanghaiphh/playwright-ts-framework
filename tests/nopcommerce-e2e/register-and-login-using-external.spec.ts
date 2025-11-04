import { Page, test, expect } from '@playwright/test';
import { BasePage } from '@pages/core/BasePage';
import { UserInfoInterface } from '@models/user-info.interface';
import { UserFactory } from '@factories/user-factory';
import logger, { initializeRunLogger, cleanupRunLogger } from '@utils/logger';
import sqlServiceInstance from '@services/sql-server.service';
import { Header } from '@pages/nopcommerce-components/Header';
import { RegisterPage } from '@pages/nopcommerce-pages/RegisterPage';
import { LoginPage } from '@pages/nopcommerce-pages/LoginPage';
import { CustomerInfoPage } from '@pages/nopcommerce-pages/CustomerInfoPage';
import { feature, story, severity, description, Severity } from 'allure-js-commons';

test.describe.serial('Customer_Register_And_Login', () => {

    let userInfo: UserInfoInterface;
    let page: Page;
    let header: Header;
    let registerPage: RegisterPage;
    let loginPage: LoginPage;
    let customerInfoPage: CustomerInfoPage;

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        const browserName = testInfo.project.name.toUpperCase();
        initializeRunLogger(testInfo);
        logger.info(`========== Customer: Register and Login functions testing on ${browserName} start ==========\n`);

        await sqlServiceInstance.connect();

        userInfo = UserFactory.getAllUsersFromJson3(browserName)[testInfo.workerIndex];
        page = await browser.newPage();

        header = new Header(page);
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        customerInfoPage = new CustomerInfoPage(page);

        await new BasePage(page).gotoPage(baseURL!);
    });

    test.afterAll(async () => {
        await page.close();
        await sqlServiceInstance.disconnect();
        logger.info(`========== Customer: Register and Login functions testing done ==========\n`);
        cleanupRunLogger();
    });

    test.beforeEach(async () => {
        feature('User Management');
    });

    test('User_01_Register', async () => {
        story('1 - Register');
        description('Test registration with valid data');
        severity(Severity.NORMAL);
        logger.info(`----- User_01_Register:`);

        await header.clickOnRegisterLink();

        await registerPage.addUserInfo(
            userInfo.firstName, userInfo.lastName, userInfo.company, userInfo.email, userInfo.password);
        await registerPage.clickOnRegisterButton();
        expect(await registerPage.getRegisterSuccessMessage()).toContain('Your registration completed');
    });

    test('User_02_Login', async () => {
        story('2 - Login');
        description('Test login with existing user');
        severity(Severity.CRITICAL);
        logger.info(`----- User_02_Login:`);

        await header.clickOnLogoutLink();
        await header.clickOnLoginLink();

        await loginPage.loginToSystem(userInfo.email, userInfo.password);
        expect(await header.isMyAccountLinkDisplayed()).toBeTruthy();
    });

    test('User_03_MyAccount', async () => {
        story('3 - My Account');
        description('Verify registered user information');
        severity(Severity.MINOR);
        logger.info(`----- User_03_MyAccount:`);

        await header.clickOnMyAccountLink();

        expect(await customerInfoPage.isGenderMaleSelected()).toBeTruthy();
        expect(await customerInfoPage.getValueInFirstnameTextbox()).toBe(userInfo.firstName);
        expect(await customerInfoPage.getValueInLastnameTextbox()).toBe(userInfo.lastName);
        expect(await customerInfoPage.getValueInCompanyTextbox()).toBe(userInfo.company);
    });

    test('User_04_Database_Verification', async () => {
        story('4 - Database Verification');
        description('Verify registered user exists in database with correct information');
        severity(Severity.NORMAL);
        logger.info(`----- User_04_Database_Verification:`);

        const selectQuery = `SELECT [Email],[FirstName],[LastName],[Company] FROM [nopcommerce].[dbo].[Customer] WHERE [Email] = '${userInfo.email}'`;
        const result = await sqlServiceInstance.executeQuery<{
            Email: string,
            FirstName: string,
            LastName: string,
            Company: string
        }>(selectQuery);

        expect(result.recordset.length).toEqual(1);
        const dbRecord = result.recordset[0];
        expect(dbRecord.FirstName).toBe(userInfo.firstName);
        expect(dbRecord.LastName).toBe(userInfo.lastName);
        expect(dbRecord.Company).toBe(userInfo.company);
        expect(dbRecord.Email).toBe(userInfo.email);

        const deleteQuery = `DELETE FROM [nopcommerce].[dbo].[Customer] WHERE [Email] IS NULL AND [FirstName] IS NULL AND [LastName] IS NULL`;
        await sqlServiceInstance.executeQuery(deleteQuery);
    });

});