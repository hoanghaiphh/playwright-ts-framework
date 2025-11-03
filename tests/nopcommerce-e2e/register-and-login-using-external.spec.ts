import { test, expect, Page, Browser } from '@playwright/test';
import { Header } from '@pages/nopcommerce-components/HeaderComponent';
import { LoginPage } from '@pages/nopcommerce-pages/LoginPage';
import { RegisterPage } from '@pages/nopcommerce-pages/RegisterPage';
import { CustomerInfoPage } from '@pages/nopcommerce-pages/CustomerInfoPage';
import { UserInfoInterface } from '@models/user-info.interface';
import { UserFactory } from '@factories/user-factory';
import logger, { initializeRunLogger, cleanupRunLogger } from '@utils/logger';
import sqlServiceInstance from '@services/sql-server.service';

test.describe.serial('Register_And_Login', () => {

    let page: Page;
    let header: Header;
    let loginPage: LoginPage;
    let registerPage: RegisterPage;
    let customerInfoPage: CustomerInfoPage;
    let userInfo: UserInfoInterface;

    test.beforeAll(async ({ browser }, testInfo) => {
        const browserName = testInfo.project.name.toUpperCase();

        initializeRunLogger(testInfo);
        logger.info(`---------- Start testing Register and Login funtions on ${browserName} ----------\n`);

        await sqlServiceInstance.connect();

        page = await browser.newPage();

        header = new Header(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);
        customerInfoPage = new CustomerInfoPage(page);

        userInfo = UserFactory.getAllUsersFromJson3(browserName)[testInfo.workerIndex];

        await page.goto('/');
    });

    test.afterAll(async () => {
        await sqlServiceInstance.disconnect();

        logger.info(`---------- End testing Register and Login functions and close page ----------\n`);
        cleanupRunLogger();

        await page.close();
    });

    test('User_01_Register', async () => {
        logger.info(`User_01_Register: Click on Register link at Header`);
        await header.clickOnRegisterLink();

        logger.info(`User_01_Register: Fill out customer information with data:
            - First Name: ${userInfo.firstName}
            - Last Name: ${userInfo.lastName}
            - Company: ${userInfo.company}
            - Email: ${userInfo.email}
            - Password: ${userInfo.password}`);
        await registerPage.addUserInfoUsingInterface(userInfo);

        logger.info(`User_01_Register: Click on Register button`);
        await registerPage.clickOnRegisterButton();

        const expectMsg = 'Your registration completed';
        logger.info(`User_01_Register: Verify that success message is displayed:
            ${expectMsg}\n`);
        const actualMsg = await registerPage.getRegisterSuccessMessage();
        expect(actualMsg).toContain('Your registration completed');
    });

    test('User_02_Login', async () => {
        logger.info(`User_02_Login: Click on Logout link at Header`);
        await header.clickOnLogoutLink();

        logger.info(`User_02_Login: Click on Login link at Header`);
        await header.clickOnLoginLink();

        logger.info(`User_02_Login: Login to system with:
            - Email: ${userInfo.email} 
            - Password: ${userInfo.password}`);
        await loginPage.loginToSystemWithUserInfoInterface(userInfo);

        logger.info(`User_02_Login: Verify that My Account link appeared at Header\n`);
        const displayed = await header.isMyAccountLinkDisplayed();
        expect(displayed).toBeTruthy();
    });

    test('User_03_MyAccount', async () => {
        logger.info(`User_03_MyAccount: Click on My Account link at Header`);
        await header.clickOnMyAccountLink();

        logger.info(`User_03_MyAccount: Verity that customer information is correctly displayed:
            - Gender: Male
            - First Name: ${userInfo.firstName}
            - Last Name: ${userInfo.lastName}
            - Company: ${userInfo.company}\n`);
        expect(await customerInfoPage.isGenderMaleSelected()).toBeTruthy();
        expect(await customerInfoPage.getValueInFirstnameTextbox()).toBe(userInfo.firstName);
        expect(await customerInfoPage.getValueInLastnameTextbox()).toBe(userInfo.lastName);
        expect(await customerInfoPage.getValueInCompanyTextbox()).toBe(userInfo.company);
    });

    test('User_04_Database_Verification', async () => {
        logger.info(`User_04_Database_Verification: Verify that customer exists in database`);

        const selectQuery = `
        SELECT [Email],[FirstName],[LastName],[Company] 
        FROM [nopcommerce].[dbo].[Customer] 
        WHERE [Email] = '${userInfo.email}'`;
        const result = await sqlServiceInstance.executeQuery<{
            Email: string,
            FirstName: string,
            LastName: string,
            Company: string
        }>(selectQuery);

        expect(result.recordset.length).toEqual(1);

        logger.info(`User_04_Database_Verification: Verity that customer information in database is correct:
            - First Name: ${userInfo.firstName}
            - Last Name: ${userInfo.lastName}
            - Company: ${userInfo.company}
            - Email: ${userInfo.email}`);

        const dbRecord = result.recordset[0];
        expect(dbRecord.FirstName).toBe(userInfo.firstName);
        expect(dbRecord.LastName).toBe(userInfo.lastName);
        expect(dbRecord.Company).toBe(userInfo.company);
        expect(dbRecord.Email).toBe(userInfo.email);

        logger.info(`User_04_Database_Verification: Delete blank records in database\n`);

        const deleteQuery = `
        DELETE FROM [nopcommerce].[dbo].[Customer] 
        WHERE [Email] IS NULL AND [FirstName] IS NULL AND [LastName] IS NULL`;

        await sqlServiceInstance.executeQuery(deleteQuery);
    });

})