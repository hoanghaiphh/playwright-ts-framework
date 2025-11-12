import { test } from '@test-helpers/nopcommerce-pages.fixture';
import { setupSuite, teardownSuite, initializeTest } from '@base-test';
import { expectTrue, expectToBe, expectToEqual } from '@custom-expect';
import { getUserFromDatabaseByEmail, mapUser } from '@utils/repositories/nopcommerce-user.repository';
import testUsers from '@test-data/nopcommerce-users.json';

test.describe('Customer Information', () => {

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await setupSuite({ browser, baseURL }, testInfo, {
            email: `playwright.${testInfo.project.name}@nopcommerce.com`,
            password: `Abcd@1234`,
        });
    })

    test.afterAll(async () => { await teardownSuite() })

    test('CUSTOMER_INFORMATION', async ({ header, customerInfoPage }, testInfo) => {
        initializeTest(testInfo);

        const userData = (testUsers as any)[testInfo.project.name];

        await header.clickOnMyAccountLink();

        expectTrue(await customerInfoPage.isGenderMaleSelected(), true);
        expectToBe(await customerInfoPage.getValueInFirstnameTextbox(), userData.firstName, true);
        expectToBe(await customerInfoPage.getValueInLastnameTextbox(), userData.lastName, true);
        expectToBe(await customerInfoPage.getValueInCompanyTextbox(), userData.company, true);

        expectToEqual(
            await getUserFromDatabaseByEmail(userData.email),
            mapUser(userData.email, userData.firstName, userData.lastName, userData.company),
            true
        );
    })

})