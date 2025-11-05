import { Page, test } from '@playwright/test';
import { UserInterface } from '@factories/user.interface';
import { getAllUsersFromJson3 } from '@factories/user.factory';
import logger, { initializeRunLogger, cleanupRunLogger } from '@utils/logger';
import sqlServiceInstance from '@services/sql-server.service';
import { Header } from '@pages/nopcommerce-components/Header';
import { RegisterPage } from '@pages/nopcommerce-pages/RegisterPage';
import { LoginPage } from '@pages/nopcommerce-pages/LoginPage';
import { CustomerInfoPage } from '@pages/nopcommerce-pages/CustomerInfoPage';
import { Severity } from 'allure-js-commons';
import * as allure from 'allure-js-commons';
import { expectToContain, expectTrue, expectToBe, expectToEqual } from '@utils/custom-expect';

test.describe.serial('Customer_Register_And_Login', () => {

    let userInfo: UserInterface;
    let page: Page;
    let header: Header;
    let registerPage: RegisterPage;
    let loginPage: LoginPage;
    let customerInfoPage: CustomerInfoPage;

    test.beforeAll(async ({ browser }, testInfo) => {
        const browserName = testInfo.project.name.toUpperCase();
        initializeRunLogger(testInfo);
        logger.info(`========== Customer: Register and Login functions testing on ${browserName} start ==========\n`);

        await sqlServiceInstance.connect();

        userInfo = getAllUsersFromJson3(browserName)[testInfo.workerIndex];

        page = await browser.newPage();
        header = new Header(page);
        registerPage = new RegisterPage(page);
        loginPage = new LoginPage(page);
        customerInfoPage = new CustomerInfoPage(page);

        await page.goto('/');
    });

    test.afterAll(async () => {
        await page.close();

        await sqlServiceInstance.disconnect();

        logger.info(`========== Customer: Register and Login functions testing done ==========\n`);
        cleanupRunLogger();
    });

    test.beforeEach(async () => {
        allure.feature('User Management');
    });

    test('User_01_Register', async () => {
        allure.story('USER 01 REGISTER');
        allure.description('Test registration with valid data');
        allure.severity(Severity.NORMAL);
        logger.info(`USER 01 REGISTER:`);

        await header.clickOnRegisterLink();

        await registerPage.addUserInfo(
            userInfo.firstName, userInfo.lastName, userInfo.company, userInfo.email, userInfo.password);
        await registerPage.clickOnRegisterButton();

        expectToContain(await registerPage.getRegisterSuccessMessage(), 'Your registration completed');
    });

    test('User_02_Login', async () => {
        allure.story('USER 02 LOGIN');
        allure.description('Test login with existing user');
        allure.severity(Severity.CRITICAL);
        logger.info(`USER 02 LOGIN:`);

        await header.clickOnLogoutLink();
        await header.clickOnLoginLink();

        await loginPage.loginToSystem(userInfo.email, userInfo.password);

        expectTrue(await header.isMyAccountLinkDisplayed());
    });

    test('User_03_MyAccount', async () => {
        allure.story('USER 03 MY ACCOUNT');
        allure.description('Verify registered user information');
        allure.severity(Severity.MINOR);
        logger.info(`USER 03 MY ACCOUNT:`);

        await header.clickOnMyAccountLink();

        expectTrue(await customerInfoPage.isGenderMaleSelected());
        expectToBe(await customerInfoPage.getValueInFirstnameTextbox(), userInfo.firstName);
        expectToBe(await customerInfoPage.getValueInLastnameTextbox(), userInfo.lastName);
        expectToBe(await customerInfoPage.getValueInCompanyTextbox(), userInfo.company);
    });

    test('User_04_Database_Verification', async () => {
        allure.story('USER 04 DATABASE VERIFICATION');
        allure.description('Verify registered user exists in database with correct information');
        allure.severity(Severity.NORMAL);
        logger.info(`USER 04 DATABASE VERIFICATION:`);

        const selectQuery = `SELECT [Email],[FirstName],[LastName],[Company] FROM [nopcommerce].[dbo].[Customer] WHERE [Email] = '${userInfo.email}'`;
        let result;
        await test.step(`Excute query: ${selectQuery}`, async () => {
            result = await sqlServiceInstance.executeQuery<{
                Email: string,
                FirstName: string,
                LastName: string,
                Company: string
            }>(selectQuery);
        });

        await test.step('Verify record count and data integrity', async () => {
            expectToEqual(result!.recordset.length, 1);
            const dbRecord = result!.recordset[0];
            expectToBe(dbRecord.FirstName, userInfo.firstName);
            expectToBe(dbRecord.LastName, userInfo.lastName);
            expectToBe(dbRecord.Company, userInfo.company);
            expectToBe(dbRecord.Email, userInfo.email);
        });

        // const deleteQuery = `DELETE FROM [nopcommerce].[dbo].[Customer] WHERE [Email] IS NULL AND [FirstName] IS NULL AND [LastName] IS NULL`;
        // await sqlServiceInstance.executeQuery(deleteQuery);
    });

});