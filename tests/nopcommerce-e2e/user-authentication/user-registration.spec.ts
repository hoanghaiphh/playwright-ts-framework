import { test } from '@test-helpers/nopcommerce-pages.fixture';
import { setupSuite, teardownSuite, initializeTest, Severity } from '@base-test';
import { expectToContain } from '@custom-expect';
import { generateUser } from '@factories/user.generator';

test.describe('User Registration', () => {

    test.beforeAll(async ({ browser, baseURL }, testInfo) => { await setupSuite({ browser, baseURL }, testInfo) })
    test.afterAll(async () => { await teardownSuite() })

    test('VALID_DATA', async ({ header, registerPage }, testInfo) => {
        initializeTest(testInfo, Severity.NORMAL, 'Test registration with valid data');

        const user = generateUser(testInfo.project.name);

        await header.clickOnRegisterLink();

        await registerPage.addUserInfo(user.firstName, user.lastName, user.company, user.email, user.password);
        await registerPage.clickOnRegisterButton();
        expectToContain(await registerPage.getRegisterSuccessMessage(), registerPage.registerSuccessMsg);

        await header.clickOnLogoutLink();
    })

})