import { test } from '@playwright/test';
import { getUserFromJson1, getAllUsersFromJson2, getAllUsersFromJson3, getAllUsersFromExcel } from '@factories/user.factory';
import { UserInterface } from '@factories/user.interface';

test.describe('External_Data_Reader', () => {

    let userInfo: UserInterface;
    let userInfoList: UserInterface[];
    let browserName: string;

    test.beforeAll(async ({ }, testInfo) => {
        browserName = testInfo.project.name;
    });

    test('Json_1', async () => {
        userInfo = getUserFromJson1();

        console.log(`First Name: ${userInfo.firstName}`);
        console.log(`Last Name: ${userInfo.lastName}`);
        console.log(`Email: ${userInfo.email}`);
        console.log(`Password: ${userInfo.password}`);
        console.log(`Company: ${userInfo.company}`);
    });

    test('Json_2', async () => {
        userInfoList = getAllUsersFromJson2(browserName);

        userInfoList.forEach(user => {
            console.log(`First Name: ${user.firstName}`)
            console.log(`Last Name: ${user.lastName}`)
            console.log(`Email: ${user.email}`)
            console.log(`Password: ${user.password}`)
            console.log(`Company: ${user.company}\n`)
        });
    });

    test('Json_3', async () => {
        userInfoList = getAllUsersFromJson3(browserName);

        userInfoList.forEach(user => {
            console.log(`First Name: ${user.firstName}`)
            console.log(`Last Name: ${user.lastName}`)
            console.log(`Email: ${user.email}`)
            console.log(`Password: ${user.password}`)
            console.log(`Company: ${user.company}\n`)
        });
    });

    test('Excel', async () => {
        userInfoList = await getAllUsersFromExcel();

        userInfoList.forEach(user => {
            console.log(`First Name: ${user.firstName}`)
            console.log(`Last Name: ${user.lastName}`)
            console.log(`Email: ${user.email}`)
            console.log(`Password: ${user.password}`)
            console.log(`Company: ${user.company}\n`)
        });
    });

});