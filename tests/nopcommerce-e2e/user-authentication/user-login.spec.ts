import { test } from '@test-helpers/nopcommerce-pages.fixture';
import { setupSuite, teardownSuite, initializeTest, Severity } from '@base-test';
import { expectFalse, expectToContain, expectTrue } from '@custom-expect';

test.describe('User Login', () => {
    test.describe.configure({ mode: 'serial' });
    test.beforeAll(async ({ browser, baseURL }, testInfo) => { await setupSuite({ browser, baseURL }, testInfo) })
    test.afterAll(async () => { await teardownSuite() })

    test('VALID_INFORMATION', async ({ header, loginPage }, testInfo) => {
        initializeTest(testInfo, Severity.CRITICAL, 'Test login with valid information');

        await header.clickOnLoginLink();

        await loginPage.loginToSystem(
            `playwright.${testInfo.project.name}@nopcommerce.com`,
            `Abcd@1234`
        );

        expectTrue(await header.isMyAccountLinkDisplayed());
        await header.clickOnLogoutLink();
    })

    test('INVALID_PASSWORD', async ({ header, loginPage }, testInfo) => {
        initializeTest(testInfo, Severity.CRITICAL, 'Test login with invalid password');

        await header.clickOnLoginLink();

        await loginPage.loginToSystem(
            `playwright.${testInfo.project.name}@nopcommerce.com`,
            `Abcd@12345678`
        );
        expectToContain(await loginPage.getErrorMessageDetail(), 'The credentials provided are incorrect')

        expectFalse(await header.isMyAccountLinkDisplayed());
    })

})