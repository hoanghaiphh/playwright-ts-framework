import { test, Page } from '@playwright/test';
import { UserInfo } from '@utils/models/UserInfo.model';
import { UserFactory } from '@utils/generators/UserFactory';

test.describe.serial('JSON_Reader_Testing', () => {

    let page: Page;
    let userInfo: UserInfo;
    let userInfoList: UserInfo[];
    let browserName: string;

    test.beforeAll(async ({ browser }, testInfo) => {
        page = await browser.newPage();
        browserName = testInfo.project.name;
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('Json_1', async () => {
        userInfo = UserFactory.getUserFromJson1();

        console.log(`First Name: ${userInfo.firstName}`);
        console.log(`Last Name: ${userInfo.lastName}`);
        console.log(`Email: ${userInfo.email}`);
        console.log(`Password: ${userInfo.password}`);
        console.log(`Company: ${userInfo.company}`);
    });

    test('Json_2', async () => {
        userInfoList = UserFactory.getAllUsersFromJson2(browserName);

        userInfoList.forEach(user => {
            console.log(`First Name: ${user.firstName}`)
            console.log(`Last Name: ${user.lastName}`)
            console.log(`Email: ${user.email}`)
            console.log(`Password: ${user.password}`)
            console.log(`Company: ${user.company}\n`)
        });
    });

    test('Json_3', async () => {
        userInfoList = UserFactory.getAllUsersFromJson3(browserName);

        userInfoList.forEach(user => {
            console.log(`First Name: ${user.firstName}`)
            console.log(`Last Name: ${user.lastName}`)
            console.log(`Email: ${user.email}`)
            console.log(`Password: ${user.password}`)
            console.log(`Company: ${user.company}\n`)
        });
    });

})