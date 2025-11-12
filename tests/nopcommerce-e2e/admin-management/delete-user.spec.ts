import { test } from '@test-helpers/nopcommerce-pages.fixture';
import { setupSuite, teardownSuite, initializeTest } from '@base-test';
import { expectToBe, expectToContain } from '@custom-expect';
import { getAllUsersFromJson3 } from '@factories/user.factory';
import { currentConfig } from '@env';
import { apiRegister } from '@apis/nopcommerce.api';

test.describe('Delete User', () => {

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await setupSuite({ browser, baseURL }, testInfo, {
            email: currentConfig.appUsername,
            password: currentConfig.appPassword
        });
    })

    test.afterAll(async () => { await teardownSuite() })

    test('DELETE_USER', async ({ baseURL, homePage, customersListPage, customerDetailsPage }, testInfo) => {
        initializeTest(testInfo);

        const user = getAllUsersFromJson3(testInfo.project.name)[testInfo.workerIndex];
        await apiRegister('M', user.firstName, user.lastName, user.company, user.email, user.password);

        await homePage.gotoPage(`${baseURL}/Admin/Customer/List`);

        await customersListPage.searchCustomerByEmail(user.email);
        expectToBe(await customersListPage.getGridInfo(), customersListPage.gridInfo1Result);
        await customersListPage.clickOnEditButton();

        await customerDetailsPage.deleteCustomer();

        expectToContain(await customersListPage.getSuccessMessage(), customersListPage.deleteSuccessMsg);
        await customersListPage.searchCustomerByEmail(user.email);
        expectToBe(await customersListPage.getGridInfo(), customersListPage.gridInfo0Result);
    })

})