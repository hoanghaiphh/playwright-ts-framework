import { test, setupSuite, teardownSuite, initializeTest, Severity, getPage } from '@tests/helpers/base-test';
import { expectToContain, expectTrue, expectToBe, expectToEqual, expectFalse } from '@tests/helpers/custom-expect';

import { Header } from '@pages/nopcommerce-user/components/Header';
import { RegisterPage } from '@pages/nopcommerce-user/pages/RegisterPage';
import { LoginPage } from '@pages/nopcommerce-user/pages/LoginPage';
import { CustomerInfoPage } from '@pages/nopcommerce-user/pages/CustomerInfoPage';

import userRepository from '@data-access/nopcommerce/UserRepository';

import { UserModel } from '@factories/user.model';
import { generateUser } from '@factories/user.generator';


test.describe.serial('User_Register_And_Login', () => {
    const feature: string = 'User Management';

    let registerPage: RegisterPage;
    let loginPage: LoginPage;
    let customerInfoPage: CustomerInfoPage;
    let user: UserModel;

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await setupSuite({ browser, baseURL }, testInfo, [Header]);
    })

    test.afterAll(async () => {
        await teardownSuite();
    })


    test('USER 01 REGISTER', async ({ header }, testInfo) => {
        initializeTest(feature, testInfo.title, Severity.NORMAL, 'Test registration with valid data');

        await header.clickOnRegisterLink();

        registerPage = getPage(RegisterPage);
        user = generateUser(testInfo.project.name);
        await registerPage.addUserInfo(user.firstName, user.lastName, user.company, user.email, user.password);
        await registerPage.clickOnRegisterButton();

        expectToContain(await registerPage.getRegisterSuccessMessage(), registerPage.registerSuccessMsg);
    })

    test('USER 02 LOGIN', async ({ header }, testInfo) => {
        initializeTest(feature, testInfo.title, Severity.CRITICAL, 'Test login with existing user');

        await header.clickOnLogoutLink();
        await header.clickOnLoginLink();

        loginPage = getPage(LoginPage);
        await loginPage.loginToSystem(user.email, user.password);

        expectTrue(await header.isMyAccountLinkDisplayed());
    })

    test('USER 03 MY_ACCOUNT', async ({ header }, testInfo) => {
        initializeTest(feature, testInfo.title, Severity.MINOR, 'Verify registered user information');

        await header.clickOnMyAccountLink();

        customerInfoPage = getPage(CustomerInfoPage);
        expectFalse(await customerInfoPage.isGenderMaleSelected(), true); // fail
        expectToBe(await customerInfoPage.getValueInFirstnameTextbox(), user.firstName, true);
        expectToBe(await customerInfoPage.getValueInLastnameTextbox(), 'user.lastName', true); // fail
        expectToBe(await customerInfoPage.getValueInCompanyTextbox(), user.company, true);

        expectToEqual(await userRepository.getUserFromDatabaseByEmail(user.email),
            userRepository.mapUser(user.email, user.firstName, user.lastName, user.company), true);
    })

})