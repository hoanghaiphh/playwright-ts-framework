import { test } from '@test-helpers/nopcommerce-pages.fixture';
import { setupSuite, teardownSuite, initializeTest } from '@base-test';
import { expectToContain } from '@custom-expect';
import { getAllUsersFromJson3 } from '@factories/user.factory';
import { currentConfig } from '@env';

test.describe('Add New User', () => {

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await setupSuite({ browser, baseURL }, testInfo, {
            email: currentConfig.appUsername,
            password: currentConfig.appPassword
        });
    })

    test.afterAll(async () => { await teardownSuite() })

    test('VALID_DATA', async ({ baseURL, homePage, addCustomerPage, customersListPage }, testInfo) => {
        initializeTest(testInfo);

        const user = getAllUsersFromJson3(testInfo.project.name)[testInfo.workerIndex];

        await homePage.gotoPage(`${baseURL}/Admin/Customer/Create`);

        await addCustomerPage.addNewUser(user.firstName, user.lastName, user.company, user.email, user.password);

        expectToContain(await customersListPage.getSuccessMessage(), customersListPage.addSuccessMsg);
    })

})