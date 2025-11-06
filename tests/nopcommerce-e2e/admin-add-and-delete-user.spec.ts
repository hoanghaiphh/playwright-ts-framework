import { test } from '@playwright/test';
import { Header } from '@pages/nopcommerce-user/components/Header';
import { LoginPage } from '@pages/nopcommerce-user/pages/LoginPage';
import { HomePage } from '@pages/nopcommerce-user/pages/HomePage';
import { Ajax } from '@pages/nopcommerce-admin/components/Ajax';
import { AddCustomerPage } from '@pages/nopcommerce-admin/pages/AddCustomerPage';
import { CustomersListPage } from '@pages/nopcommerce-admin/pages/CustomersListPage';
import { CustomerDetailsPage } from '@pages/nopcommerce-admin/pages/CustomerDetailsPage';
import { baseBeforeAll, baseAfterAll, baseBeforeTest, Severity, getPage } from '@tests/helpers/base-test';
import { expectToBe, expectToContain, expectTrue } from '@tests/helpers/custom-expect';
import { UserInterface } from '@factories/user.interface';
import { getAllUsersFromJson3 } from '@factories/user.factory';
import { currentConfig } from '@configs/env.config';

test.describe.serial('Admin_Add_And_Delete_User', () => {
    const feature: string = 'Admin Management';

    let header: Header;
    let loginPage: LoginPage;
    let homePage: HomePage;
    let ajax: Ajax;
    let addCustomerPage: AddCustomerPage;
    let customersListPage: CustomersListPage;
    let customerDetailsPage: CustomerDetailsPage
    let user: UserInterface;

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await baseBeforeAll({ browser, baseURL }, testInfo);
        user = getAllUsersFromJson3(testInfo.project.name)[testInfo.workerIndex];
        header = getPage(Header);
        ajax = getPage(Ajax);
    })

    test.afterAll(async () => { await baseAfterAll() })

    test('ADMIN 01 - LOGIN', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title, Severity.CRITICAL);

        await header.clickOnLoginLink();

        loginPage = getPage(LoginPage);
        await loginPage.loginToSystem(currentConfig.appUsername, currentConfig.appPassword);

        expectTrue(await header.isMyAccountLinkDisplayed());
    })

    test('ADMIN 02 - ADD NEW USER', async ({ baseURL }, testInfo) => {
        baseBeforeTest(feature, testInfo.title);

        homePage = getPage(HomePage);
        await homePage.gotoPage(`${baseURL}/Admin/Customer/Create`);

        addCustomerPage = getPage(AddCustomerPage);
        await ajax.waitForLoading();

        await addCustomerPage.addUserInfo(user.firstName, user.lastName, user.company, user.email, user.password);
        await addCustomerPage.clickOnSaveButton();

        customersListPage = getPage(CustomersListPage);
        await ajax.waitForLoading();
        expectToContain(await customersListPage.getSuccessMessage(), 'The new customer has been added successfully.');
    })

    test('ADMIN 03 - DELETE USER', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title);

        await customersListPage.searchCustomerByEmail(user.email);
        await ajax.waitForLoading();
        expectToBe(await customersListPage.getGridInfo(), '1-1 of 1 items');

        await customersListPage.clickOnEditButton();

        customerDetailsPage = getPage(CustomerDetailsPage);
        await ajax.waitForLoading();
        customerDetailsPage.deleteCustomer();

        customersListPage = getPage(CustomersListPage);
        await ajax.waitForLoading();
        expectToContain(await customersListPage.getSuccessMessage(), 'The customer has been deleted successfully.');

        await customersListPage.searchCustomerByEmail(user.email);
        await ajax.waitForLoading();
        expectToBe(await customersListPage.getGridInfo(), 'No records');
    })

})