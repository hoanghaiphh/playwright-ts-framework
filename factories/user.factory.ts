import { Json1, Json2, Json3 } from '@factories/user-json.schema';
import { UserInterface } from '@factories/user.interface';
import { loadJsonObject, loadJsonArray } from '@services/json.service';
import { readExcelFile, DataRow } from '@services/excel.service';
import { createUniqueEmail } from '@utils/common';
import logger from '@utils/logger';

export function getUserFromJson1(): UserInterface {
    const relativePath = 'test-data/user-info/user-info-1.json';
    const rawUserObject = loadJsonObject<Json1>(relativePath);

    if (rawUserObject === undefined) throw new Error("JSON data null");

    return {
        firstName: rawUserObject.name.firstName,
        lastName: rawUserObject.name.lastName,
        email: rawUserObject.login.email,
        password: rawUserObject.login.password,
        company: rawUserObject.company,
    };
}

export function getAllUsersFromJson2(browserName: string): UserInterface[] {
    const relativePath = 'test-data/user-info/user-info-2.json';
    const rawDataObject = loadJsonObject<Json2>(relativePath);

    if (rawDataObject === undefined) throw new Error("JSON data null");

    const rawUsersArray: Json3[] = rawDataObject.users;

    return rawUsersArray.map(rawUser => ({
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        company: rawUser.company,
        email: createUniqueEmail(`${rawUser.firstName}.${rawUser.lastName}`, browserName),
        password: 'defaultPassword',
    }));
}

export function getAllUsersFromJson3(browserName: string): UserInterface[] {
    const relativePath = 'test-data/user-info/user-info-3.json';
    const rawUsersArray = loadJsonArray<Json3>(relativePath);

    return rawUsersArray.map(rawUser => ({
        firstName: rawUser.firstName,
        lastName: rawUser.lastName,
        company: rawUser.company,
        email: createUniqueEmail(`${rawUser.firstName}.${rawUser.lastName}`, browserName),
        password: 'defaultPassword',
    }));
}

export async function getAllUsersFromExcel(sheetName?: string): Promise<UserInterface[]> {
    const relativePath = 'test-data/user-info/user-info.xlsx';
    const rawUsersArray: DataRow[] = await readExcelFile(relativePath, sheetName);

    if (rawUsersArray.length === 0) {
        logger.warn(`WARNING: Excel file at ${relativePath} is empty or sheet "${sheetName}" not found.`);
        return [];
    }

    return rawUsersArray.map(rawUser => ({
        firstName: (rawUser.firstname ?? '').toString(),
        lastName: (rawUser.lastname ?? '').toString(),
        company: (rawUser.company ?? '').toString(),
        email: (rawUser.email ?? '').toString(),
        password: (rawUser.password ?? '').toString(),
    }));

}