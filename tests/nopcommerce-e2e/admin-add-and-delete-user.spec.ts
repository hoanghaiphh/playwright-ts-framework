import { test, setupSuite, teardownSuite, initializeTest, Severity, getPage } from '@tests/helpers/base-test';
import { expectToBe, expectToContain, expectTrue } from '@tests/helpers/custom-expect';

import { Header } from '@pages/nopcommerce-user/components/Header';
import { Ajax } from '@pages/nopcommerce-admin/components/Ajax';
import { LoginPage } from '@pages/nopcommerce-user/pages/LoginPage';
import { HomePage } from '@pages/nopcommerce-user/pages/HomePage';
import { AddCustomerPage } from '@pages/nopcommerce-admin/pages/AddCustomerPage';
import { CustomersListPage } from '@pages/nopcommerce-admin/pages/CustomersListPage';
import { CustomerDetailsPage } from '@pages/nopcommerce-admin/pages/CustomerDetailsPage';

import { UserInterface } from '@factories/user.interface';
import { getAllUsersFromJson3 } from '@factories/user.factory';
import { currentConfig } from '@configs/env.config';


test.describe.serial('Admin_Add_And_Delete_User', () => {
    const feature: string = 'Admin Management';

    let loginPage: LoginPage;
    let homePage: HomePage;
    let addCustomerPage: AddCustomerPage;
    let customersListPage: CustomersListPage;
    let customerDetailsPage: CustomerDetailsPage
    let user: UserInterface;

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await setupSuite({ browser, baseURL }, testInfo, [Header, Ajax]);
    })

    test.afterAll(async () => {
        await teardownSuite();
    })


    test('ADMIN 01 - ADMIN LOGIN', async ({ header }, testInfo) => {
        initializeTest(feature, testInfo.title, Severity.CRITICAL);

        await header.clickOnLoginLink();

        loginPage = getPage(LoginPage);
        await loginPage.loginToSystem(currentConfig.appUsername, currentConfig.appPassword);

        expectTrue(await header.isMyAccountLinkDisplayed());
    })

    test('ADMIN 02 - ADD NEW USER', async ({ ajax, baseURL }, testInfo) => {
        initializeTest(feature, testInfo.title);

        homePage = getPage(HomePage);
        await homePage.gotoPage(`${baseURL}/Admin/Customer/Create`);

        addCustomerPage = getPage(AddCustomerPage);
        await ajax.waitForLoading();

        user = getAllUsersFromJson3(testInfo.project.name)[testInfo.workerIndex];
        await addCustomerPage.addUserInfo(user.firstName, user.lastName, user.company, user.email, user.password);
        await addCustomerPage.clickOnSaveButton();

        customersListPage = getPage(CustomersListPage);
        await ajax.waitForLoading();
        expectToContain(await customersListPage.getSuccessMessage(), customersListPage.addSuccessMsg);
    })

    test('ADMIN 03 - DELETE USER', async ({ ajax }, testInfo) => {
        initializeTest(feature, testInfo.title);

        await customersListPage.searchCustomerByEmail(user.email);
        await ajax.waitForLoading();
        expectToBe(await customersListPage.getGridInfo(), customersListPage.gridInfo1Result);

        await customersListPage.clickOnEditButton();

        customerDetailsPage = getPage(CustomerDetailsPage);
        await ajax.waitForLoading();
        customerDetailsPage.deleteCustomer();

        customersListPage = getPage(CustomersListPage);
        await ajax.waitForLoading();
        expectToContain(await customersListPage.getSuccessMessage(), customersListPage.deleteSuccessMsg);

        await customersListPage.searchCustomerByEmail(user.email);
        await ajax.waitForLoading();
        expectToBe(await customersListPage.getGridInfo(), customersListPage.gridInfo0Result);
    })

})