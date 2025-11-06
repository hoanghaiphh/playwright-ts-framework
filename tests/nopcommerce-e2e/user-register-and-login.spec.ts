import { test } from '@playwright/test';
import { Header } from '@pages/nopcommerce-user/components/Header';
import { RegisterPage } from '@pages/nopcommerce-user/pages/RegisterPage';
import { LoginPage } from '@pages/nopcommerce-user/pages/LoginPage';
import { CustomerInfoPage } from '@pages/nopcommerce-user/pages/CustomerInfoPage';
import { baseBeforeAll, baseAfterAll, baseBeforeTest, Severity, getPage } from '@tests/helpers/base-test';
import { expectToContain, expectTrue, expectToBe, expectToEqual } from '@tests/helpers/custom-expect';
import { UserModel } from '@factories/user.model';
import { generateUser } from '@factories/user.generator';
import userRepository from '@data-access/nopcommerce/UserRepository';

test.describe.serial('User_Register_And_Login', () => {
    const feature: string = 'User Management';

    let header: Header;
    let registerPage: RegisterPage;
    let loginPage: LoginPage;
    let customerInfoPage: CustomerInfoPage;
    let user: UserModel;

    test.beforeAll(async ({ browser, baseURL }, testInfo) => {
        await baseBeforeAll({ browser, baseURL }, testInfo);
        user = generateUser(testInfo.project.name);
        header = getPage(Header);
    })

    test.afterAll(async () => { await baseAfterAll() })

    test('USER 01 - REGISTER', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title, Severity.NORMAL, 'Test registration with valid data');

        await header.clickOnRegisterLink();

        registerPage = getPage(RegisterPage);
        await registerPage.addUserInfo(user.firstName, user.lastName, user.company, user.email, user.password);
        await registerPage.clickOnRegisterButton();

        expectToContain(await registerPage.getRegisterSuccessMessage(), 'Your registration completed');
    })

    test('USER 02 - LOGIN', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title, Severity.CRITICAL, 'Test login with existing user');

        await header.clickOnLogoutLink();
        await header.clickOnLoginLink();

        loginPage = getPage(LoginPage);
        await loginPage.loginToSystem(user.email, user.password);

        expectTrue(await header.isMyAccountLinkDisplayed());
    })

    test('USER 03 - MY ACCOUNT', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title, Severity.MINOR, 'Verify registered user information');

        await header.clickOnMyAccountLink();

        customerInfoPage = getPage(CustomerInfoPage);
        expectTrue(await customerInfoPage.isGenderMaleSelected());
        expectToBe(await customerInfoPage.getValueInFirstnameTextbox(), user.firstName);
        expectToBe(await customerInfoPage.getValueInLastnameTextbox(), user.lastName);
        expectToBe(await customerInfoPage.getValueInCompanyTextbox(), user.company);
    })

    test('USER 04 - DATABASE VERIFICATION', async ({ }, testInfo) => {
        baseBeforeTest(feature, testInfo.title, Severity.NORMAL,
            'Verify registered user exists in database with correct information');

        await test.step(`Get user from database by email ${user.email} and verify information`, async () => {
            const actual = await userRepository.getUserFromDatabaseByEmail(user.email);
            const expected = userRepository.mapToUserRecord(user.email, user.firstName, user.lastName, user.company);
            expectToEqual(actual, expected);
        })
    })

})